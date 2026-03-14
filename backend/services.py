import requests
import pandas as pd
import matplotlib
matplotlib.use('Agg') # Use non-interactive backend for server-side PDF generation
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import tempfile
import datetime
import os

def fetch_crypto_data():
    """Fetches last 7 days of Bitcoin data from CoinGecko."""
    url = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart"
    params = {
        "vs_currency": "inr",
        "days": "7",
        "interval": "daily"
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()
    
    # Process prices
    prices = data.get("prices", [])
    df = pd.DataFrame(prices, columns=["timestamp", "price"])
    df["date"] = pd.to_datetime(df["timestamp"], unit="ms").dt.date
    
    # Process market cap
    market_caps = data.get("market_caps", [])
    df_mc = pd.DataFrame(market_caps, columns=["timestamp", "market_cap"])
    df["market_cap"] = df_mc["market_cap"]
    
    return df

def fetch_top_coins_data():
    """Fetches current data for top 5 cryptocurrencies by market cap."""
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        "vs_currency": "inr",
        "order": "market_cap_desc",
        "per_page": "5",
        "page": "1",
        "sparkline": "false"
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()
    
    # We want coin name and its market cap
    market_data = [{"name": coin["name"], "market_cap": coin["market_cap"]} for coin in data]
    return pd.DataFrame(market_data)


def generate_report() -> str:
    """Generates a PDF report containing data charts and returns its filepath."""
    df = fetch_crypto_data()
    
    # Create a temporary file to hold the PDF
    temp_dir = tempfile.gettempdir()
    pdf_filename = os.path.join(temp_dir, f"report_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.pdf")
    
    # Setup stylish dark theme for charts if we want, or keep it clean white
    plt.style.use("dark_background")
    
    with PdfPages(pdf_filename) as pdf:
        # --- Page 1: Title and Price Line Chart ---
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.plot(df['date'], df['price'], marker='o', color='#0ea5e9', linewidth=3, markersize=8)
        ax.set_title('Asset Price - Last 7 Days (INR)', fontsize=16, color='white', pad=20)
        ax.set_xlabel('Date', fontsize=12)
        ax.set_ylabel('Price', fontsize=12)
        ax.grid(True, linestyle='--', alpha=0.3)
        fig.autofmt_xdate()
        plt.tight_layout()
        pdf.savefig(fig)
        plt.close(fig)
        
        # --- Page 2: Market Cap Bar Chart ---
        fig, ax = plt.subplots(figsize=(10, 6))
        df['market_cap_t'] = df['market_cap'] / 1e12
        
        bars = ax.bar(df['date'], df['market_cap_t'], color='#7000ff', alpha=0.9)
        ax.set_title('Asset Market Valuation - Last 7 Days (Trillions INR)', fontsize=16, color='white', pad=20)
        ax.set_ylabel('Market Cap (Trillions)', fontsize=12)
        ax.bar_label(bars, fmt='%.0f', color='white', fontsize=10)
        fig.autofmt_xdate()
        plt.tight_layout()
        pdf.savefig(fig)
        plt.close(fig)
        
        # --- Page 3: Market Dominance Pie Chart ---
        top_coins_df = fetch_top_coins_data()
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Styling the pie chart
        colors = ['#0ea5e9', '#7000ff', '#39ff14', '#ff6700', '#00f2fe']
        explode = (0.1, 0, 0, 0, 0)  # Explode the 1st slice (Bitcoin)
        
        ax.pie(
            top_coins_df['market_cap'], 
            labels=top_coins_df['name'], 
            autopct='%1.1f%%', 
            colors=colors,
            explode=explode,
            startangle=140,
            textprops={'color': "w", 'fontsize': 10}
        )
        ax.set_title('Top 5 Market Assets by Dominance', fontsize=16, color='white', pad=20)
        plt.tight_layout()
        pdf.savefig(fig)
        plt.close(fig)
    print(f"Report generated successfully at: {pdf_filename}")
        
    return pdf_filename
