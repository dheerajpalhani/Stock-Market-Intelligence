from services import generate_report
import os

try:
    print("Attempting to generate report...")
    pdf_path = generate_report()
    print(f"SUCCESS: Report saved to {pdf_path}")
    if os.path.exists(pdf_path):
        print(f"File size: {os.path.getsize(pdf_path)} bytes")
except Exception as e:
    print(f"FAILED: {str(e)}")
    import traceback
    traceback.print_exc()
