import tkinter as tk
from tkinter import filedialog, scrolledtext, ttk, messagebox
import os
import concurrent.futures
# from hwp_utils import extract_text_from_hwp # Imported inside wrapper

class HWPConverterApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("HWP to Markdown Converter")
        self.geometry("700x550")
        
        # Style Configuration
        self.style = ttk.Style(self)
        self.style.configure("TButton", font=("Helvetica", 12), padding=10)
        self.style.configure("TLabel", font=("Helvetica", 11))
        self.style.configure("Header.TLabel", font=("Helvetica", 18, "bold"))
        
        # Main Container with Padding
        main_frame = ttk.Frame(self, padding="20 20 20 20")
        main_frame.pack(fill='both', expand=True)

        # Header
        header_frame = ttk.Frame(main_frame)
        header_frame.pack(fill='x', pady=(0, 20))
        ttk.Label(header_frame, text="HWP Batch Converter", style="Header.TLabel").pack(anchor='center')
        ttk.Label(header_frame, text="Convert HWP files to Markdown (Clean Text)", foreground="#555").pack(anchor='center')

        # Folder Selection Visuals
        file_frame = ttk.LabelFrame(main_frame, text=" Target Folder ", padding="20")
        file_frame.pack(fill='x', pady=(0, 20))
        
        self.info_var = tk.StringVar()
        self.info_var.set("Click 'Browse Folder' to select your files.")
        
        self.info_label = tk.Label(file_frame, textvariable=self.info_var, 
                                   bg="#f0f0f0", fg="#333", 
                                   font=("Helvetica", 13), 
                                   relief="flat", 
                                   height=3, width=40)
        self.info_label.pack(fill='x', pady=(0, 15))
        
        ttk.Button(file_frame, text="📁 Browse Folder...", command=self.select_folder).pack(anchor='center')

        # Action Area
        action_frame = ttk.Frame(main_frame)
        action_frame.pack(fill='x', pady=(0, 10))
        
        self.btn_start = ttk.Button(action_frame, text="▶ Start Conversion", command=self.start_conversion, state='disabled')
        self.btn_start.pack(fill='x')
        
        # Progress
        self.progress = ttk.Progressbar(main_frame, orient="horizontal", mode="determinate")
        self.progress.pack(fill='x', pady=(0, 10))
        
        # Logs
        log_frame = ttk.LabelFrame(main_frame, text=" Activity Log ", padding="10")
        log_frame.pack(fill='both', expand=True)
        
        self.log_text = scrolledtext.ScrolledText(log_frame, height=8, font=("Menlo", 11), state='disabled', bg="#fafafa")
        self.log_text.pack(fill='both', expand=True)

        # State
        self.selected_folder = None
        self.executor = None
        self.futures = []

    def select_folder(self):
        folder = filedialog.askdirectory()
        if folder:
            self.set_folder(folder)

    def set_folder(self, path):
        self.selected_folder = path
        display_name = os.path.basename(path)
        if not display_name: display_name = path
        
        self.info_var.set(f"Selected: {display_name}")
        self.info_label.config(bg="#e1f5fe", fg="#0277bd", font=("Helvetica", 13, "bold"))
        self.btn_start.config(state='normal')
        self.log_message(f"Folder selected: {path}")

    def log_message(self, msg):
        self.log_text.config(state='normal')
        self.log_text.insert(tk.END, "• " + msg + "\n")
        self.log_text.see(tk.END)
        self.log_text.config(state='disabled')

    def start_conversion(self):
        if not self.selected_folder:
            return

        self.btn_start.config(state='disabled')
        files = self.find_hwp_files(self.selected_folder)
        
        if not files:
            self.log_message("No HWP files found in this folder.")
            self.btn_start.config(state='normal')
            return
            
        total = len(files)
        self.progress['maximum'] = total
        self.progress['value'] = 0
        self.log_message(f"Found {total} files. Starting parallel conversion...")
        
        # Using ProcessPoolExecutor for CPU-bound work
        self.executor = concurrent.futures.ProcessPoolExecutor()
        self.futures = []
        self.completed_count = 0
        
        for p in files:
            self.futures.append(self.executor.submit(convert_wrapper, p))
            
        self.after(100, self.check_progress)

    def check_progress(self):
        active = []
        new_done = 0
        
        for future in self.futures:
            if future.done():
                new_done += 1
                try:
                    res = future.result()
                    self.log_message(res)
                except Exception as e:
                    self.log_message(f"Error: {e}")
            else:
                active.append(future)
        
        self.completed_count += new_done
        self.progress['value'] = self.completed_count
        self.futures = active
        
        if active:
            self.after(100, self.check_progress)
        else:
            self.finish()

    def finish(self):
        if self.executor:
            self.executor.shutdown()
        self.log_message("All tasks completed!")
        self.btn_start.config(state='normal')
        messagebox.showinfo("Done", "Conversion process finished successfully.")

    def find_hwp_files(self, folder):
        res = []
        for root, _, files in os.walk(folder):
            for f in files:
                if f.lower().endswith('.hwp'):
                    res.append(os.path.join(root, f))
        return res

def convert_wrapper(path):
    # Standalone function for pickling
    try:
        from hwp_utils import extract_text_from_hwp
        text = extract_text_from_hwp(path)
        
        out_path = os.path.splitext(path)[0] + ".md"
        
        if not text:
            # Check if md file already exists? No, we overwrite or skip.
            return f"[SKIP] Empty or No Text: {os.path.basename(path)}"
            
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(text)
        return f"[OK] Converted: {os.path.basename(path)}"
    except Exception as e:
        return f"[ERR] {os.path.basename(path)}: {e}"

if __name__ == "__main__":
    import multiprocessing
    multiprocessing.freeze_support()
    app = HWPConverterApp()
    app.mainloop()
