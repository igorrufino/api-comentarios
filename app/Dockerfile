# Usando a imagem base oficial do Python 3.7
FROM python:3.7-slim

# Definindo o diretório de trabalho no container
WORKDIR /api

# Copiando os arquivos da aplicação para o container
COPY . /api

# Instalação dos requirements!
RUN pip install -r requirements.txt

# Iniciando a aplicação com o Gunicorn!
CMD ["gunicorn", "-b", "0.0.0.0:8000", "api:app"]
