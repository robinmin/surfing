#!/usr/bin/env python3
"""
Convert a PDF file to DOCX using pdf2docx.
pip install pdf2docx

Usage:
    python pdf_to_docx.py input.pdf [output.docx]
"""

import sys
import os
from pdf2docx import Converter

def pdf_to_docx(input_pdf, output_docx=None):
    # Validate input file
    if not os.path.isfile(input_pdf):
        print(f"❌ Error: Input PDF file not found: {input_pdf}")
        sys.exit(1)

    # Default output filename if not provided
    if not output_docx or output_docx.strip() == "":
        base, _ = os.path.splitext(input_pdf)
        output_docx = f"{base}.docx"

    print(f"📄 Input PDF:  {input_pdf}")
    print(f"📝 Output DOCX: {output_docx}")
    print("⏳ Converting...")

    try:
        cv = Converter(input_pdf)
        cv.convert(output_docx, start=0, end=None)
        cv.close()
        print(f"✅ Conversion complete! Saved to: {output_docx}")
    except Exception as e:
        print(f"❌ Conversion failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pdf_to_docx.py input.pdf [output.docx]")
        sys.exit(1)

    input_pdf = sys.argv[1]
    output_docx = sys.argv[2] if len(sys.argv) >= 3 else None

    pdf_to_docx(input_pdf, output_docx)
