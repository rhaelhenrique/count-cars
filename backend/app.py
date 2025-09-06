from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

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

# ===== Rotas da API =====
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


# ===== Frontend =====
frontend_dir = os.path.join(os.path.dirname(__file__), "../frontend")

# arquivos estáticos (CSS, JS, imagens)
app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

# rota principal -> index.html
@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(frontend_dir, "index.html"))
