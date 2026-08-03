import pdfplumber

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts all text from a PDF file, page by page.
    """
    text_chunks = []

    with pdfplumber.open(file_path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            page_text = page.extract_text()
            if page_text:
                text_chunks.append(page_text)
            else:
                print(f"Warning: no extractable text found on page {page_number}")

    # Using join() is much faster and safer than using += in Python
    return "\n".join(text_chunks)
