from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import time
import asyncio

app = FastAPI(title="EVStockMaster API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/alerts")
def get_alerts():
    return [
        {"id": "a1", "type": "delivery", "symbol": "TSLA", "title": "Delivery beat", "severity": "info", "ts": int(time.time())},
        {"id": "a2", "type": "policy", "region": "EU", "title": "Battery subsidy update", "severity": "medium", "ts": int(time.time())}
    ]

@app.get("/alerts/stream")
async def alerts_stream():
    from fastapi.responses import StreamingResponse
    async def event_generator():
        i = 0
        while True:
            i += 1
            payload = f"data: {{\"id\":\"tick-{i}\",\"type\":\"heartbeat\",\"ts\":{int(time.time())}}}\n\n"
            yield payload
            await asyncio.sleep(5)
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.get("/sentiment")
def sentiment(symbol: str = Query(..., min_length=1)):
    return {"symbol": symbol.upper(), "score": 0.12, "trend": "rising", "keywords": ["LFP", "NACS", "4680"]}

@app.post("/correlations")
def correlations(symbols: List[str]):
    n = len(symbols)
    mat = [[1.0 if i==j else 0.3 for j in range(n)] for i in range(n)]
    return {"symbols": symbols, "matrix": mat}