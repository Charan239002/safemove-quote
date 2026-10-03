from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# let my React page talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# starting price for each home size
prices = {
    "studio": 400,
    "1-bedroom": 700,
    "2-bedroom": 1100,
    "3-bedroom": 1600,
}


# the details a customer sends
class Move(BaseModel):
    home_size: str
    miles: float
    packing: bool = False


# quick check that the API is running
@app.get("/")
def home():
    return {"message": "API is running"}


# calculate the moving price
@app.post("/quote")
def get_quote(move: Move):
    # check the input first
    if move.home_size not in prices:
        raise HTTPException(status_code=400, detail="Unknown home size")
    if move.miles <= 0:
        raise HTTPException(status_code=400, detail="Miles must be more than 0")

    # base price + $1.50 per mile
    price = prices[move.home_size] + move.miles * 1.5

    # packing adds 30%
    if move.packing:
        price = price * 1.3

    return {
        "home_size": move.home_size,
        "miles": move.miles,
        "packing": move.packing,
        "estimate": round(price, 2),
    }