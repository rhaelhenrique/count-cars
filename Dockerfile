# Imagem base com Python
FROM python:3.11-slim

# Criar diretório de trabalho
WORKDIR /app

# Copiar requisitos
COPY backend/requirements.txt .

# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copiar backend e frontend
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Expor a porta
EXPOSE 10000

# Rodar FastAPI via uvicorn
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "10000"]
