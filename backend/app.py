from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

app = FastAPI()

# ===== Configurar CORS =====
origins = [
    "http://localhost:5500",  # endereço do seu frontend
    "http://127.0.0.1:5500",
    "*",  # opcional para aceitar qualquer origem (testes locais)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # permite GET, POST, OPTIONS etc.
    allow_headers=["*"],
)

# ===== Modelos =====
class Player(BaseModel):
    name: str
    color: str
    count: int = 0

class PlayersData(BaseModel):
    players: List[Player]

class ResultsData(BaseModel):
    results: List[Player]

# ===== Armazenamento temporário =====
stored_players: List[Player] = []
stored_results: List[Player] = []

# ===== Rotas =====

@app.get("/")
def read_root():
    return {"msg": "API FastAPI rodando 🚀"}

@app.post("/players")
def save_players(data: PlayersData):
    global stored_players
    stored_players = data.players
    return {"status": "success", "players": stored_players}

@app.post("/results")
def save_results(data: ResultsData):
    global stored_results
    stored_results = data.results
    return {"status": "success", "results": stored_results}

@app.get("/players")
def get_players():
    return {"players": stored_players}

@app.get("/results")
def get_results():
    return {"results": stored_results}
