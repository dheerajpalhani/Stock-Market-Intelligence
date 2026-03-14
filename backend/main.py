import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from services import generate_report
import os

app = FastAPI(title="Stock Market Intelligence Backend")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Stock Market Intelligence API"}

@app.get("/api/download-report")
def download_report():
    """Generates a PDF report holding 7-day crypto data charts and returns it."""
    pdf_path = generate_report()
    
    # Return the file as a standard attachment with manual CORS headers as a fallback
    return FileResponse(
        path=os.path.abspath(pdf_path), 
        filename="Stock_Market_Intelligence_Report.pdf", 
        media_type="application/pdf"
    )

@app.get("/api/crypto-data")
def crypto_data():
    """Returns the raw 7-day cryptocurrency data and top 5 coins for frontend interactive charts."""
    from services import fetch_crypto_data, fetch_top_coins_data
    
    # 1. Fetch Timeline Data
    df_timeline = fetch_crypto_data()
    df_timeline['date'] = df_timeline['date'].astype(str)
    timeline_records = df_timeline.to_dict(orient="records")
    
    # 2. Fetch Top Coins Data
    df_top = fetch_top_coins_data()
    top_records = df_top.to_dict(orient="records")
    
    return {
        "timeline": timeline_records,
        "distribution": top_records
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
