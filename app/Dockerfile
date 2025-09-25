# Usando imagem base oficial Python
FROM python:3.7-slim

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos da API
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY api.py .

# Expor a porta da API
EXPOSE 8000

# Subir com Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "api:app"]
