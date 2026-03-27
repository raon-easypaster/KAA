# HWP to Markdown Converter

This is a desktop application used to batch convert HWP files to Markdown format using parallel processing.

## Prerequisites
- Python 3.8 or higher
- `pip` (Python package manager)
- macOS (as requested) or Windows/Linux

## Installation

1. Open your terminal.
2. Navigate to the `hwp_converter` directory:
   ```bash
   cd /Users/galeb76/anti/hwp_converter
   ```
3. Install the required libraries:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Method 1: Easy Run (Recommended)
Simply run the shell script which handles installation and execution:
```bash
./run.sh
```

### Method 2: Manual Run
1. Run the application:
   ```bash
   python main.py
   ```
2. The GUI window will open.
3. Click **"Select Folder"** to choose the directory containing your HWP files. The converter will search recursively.
4. Click **"Start Conversion"**.
5. Watch the progress bar and log window.
6. Once finished, `.md` files will be created next to the original `.hwp` files.

## Troubleshooting
- **Missing Text**: The text extraction uses a heuristic approach compatible with HWP 5.0+. Heavily formatted documents or some specific encoded text might not extract perfectly.
- **Permission Errors**: Ensure you have read/write access to the selected folder.
