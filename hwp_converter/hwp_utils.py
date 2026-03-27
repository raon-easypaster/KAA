import olefile
import zlib
import struct
import logging
import re

# Common Korean particles/markers to detect real language vs noise
KOREAN_MARKERS = re.compile(r'[이가은는을를에의로와과하도며면서고다요서게입니]')

def extract_text_from_hwp(file_path):
    """
    Extracts text from HWP (v5.0+).
    Optimized for retention: captures all legitimate paragraphs while filtering binary noise.
    """
    try:
        if not olefile.isOleFile(file_path):
            return ""

        f = olefile.OleFileIO(file_path)
        
        # 1. Collect and Sort BodyText Sections
        dirs = f.listdir()
        sections = []
        for entry in dirs:
            if len(entry) >= 2 and entry[0].lower() == 'bodytext' and entry[1].lower().startswith('section'):
                sections.append(entry)
        
        sections.sort(key=lambda x: int(x[1].lower().replace('section', '')))
        
        full_document_paragraphs = []
        
        for section in sections:
            try:
                stream = f.openstream(section)
                data = stream.read()
            except Exception as e:
                logging.warning(f"Error reading section {section}: {e}")
                continue
            
            # 2. Adaptive Decompression
            decompressed_result = None
            def try_decompress(raw_data):
                try: return zlib.decompress(raw_data)
                except: pass
                try: return zlib.decompress(raw_data, -15)
                except: pass
                return None

            # Check if it has a 4-byte size prefix (common in HWP)
            decompressed_result = try_decompress(data)
            if decompressed_result is None and len(data) > 4:
                decompressed_result = try_decompress(data[4:])
            
            if decompressed_result is None:
                decompressed_result = data # Fallback to raw if not compressed
                
            # 3. Parse Records for this section
            section_paras = parse_hwp_records(decompressed_result)
            
            if section_paras:
                full_document_paragraphs.extend(section_paras)
            elif len(data) > 100:
                # Heuristic fallback if strict parsing found nothing but section is large
                heuristic_text = extract_text_heuristic(decompressed_result)
                if heuristic_text:
                    full_document_paragraphs.append(heuristic_text)
            
        f.close()
        return "\n".join(full_document_paragraphs)
        
    except Exception as e:
        logging.error(f"HWP extraction failed for {file_path}: {e}")
        return ""

def parse_hwp_records(data):
    """Walks through records and extracts Tag 11 (ParaText)."""
    found_paras = []
    pos = 0
    size = len(data)
    
    while pos < size:
        if pos + 4 > size:
            break
            
        header = struct.unpack('<I', data[pos:pos+4])[0]
        pos += 4
        
        tag_id = header & 0x3FF
        rec_len = (header >> 20) & 0xFFF
        
        if rec_len == 0xFFF:
            if pos + 4 > size: break
            rec_len = struct.unpack('<I', data[pos:pos+4])[0]
            pos += 4
        
        if pos + rec_len > size:
            break
        
        if tag_id == 11: # HWPTAG_PARA_TEXT
            raw_chunk = data[pos:pos+rec_len]
            try:
                text = raw_chunk.decode('utf-16-le', errors='ignore')
                # Strict Cleanup: remove HWP-internal control codes (0x01-0x1F)
                clean_text = "".join([c for c in text if ord(c) >= 32 or c in '\n\r\t'])
                
                if is_likely_text(clean_text):
                    found_paras.append(clean_text.strip())
            except:
                pass
        
        pos += rec_len
        
    return found_paras

def is_likely_text(text):
    """
    Permissive filter:
    - Accepts almost all Hangul unless it's a long string without spaces/particles.
    - Accepts Alphanumeric strings (titles, dates).
    - Rejects pure symbol/control noise.
    """
    text = text.strip()
    if not text:
        return False
        
    # If it contains Hangul syllables
    if re.search(r'[가-힣]', text):
        # Only reject if it's very long AND has no spaces AND no particles
        # (Indicates binary noise misidentified as Hangul)
        if len(text) > 25 and ' ' not in text and not KOREAN_MARKERS.search(text):
            return False
        return True
        
    # If it contains English or Numbers (titles, verse numbers, etc.)
    if re.search(r'[a-zA-Z0-9]', text):
        # Reject very short symbol noise or binary residue
        if len(text) < 2 and not text.isalnum():
            return False
        return True
        
    return False

def extract_text_heuristic(data):
    """Regex-based safe extraction for non-standard formats."""
    try:
        text = data.decode('utf-16-le', errors='ignore')
        # Find candidate Korean/English sentences
        pattern = r"[가-힣 ]{2,}|[a-zA-Z0-9 ]{4,}"
        matches = re.findall(pattern, text)
        
        results = []
        for m in matches:
            m = m.strip()
            if is_likely_text(m):
                results.append(m)
        return "\n".join(results)
    except:
        return ""

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        print(extract_text_from_hwp(sys.argv[1]))
