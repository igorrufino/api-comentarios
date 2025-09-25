# Usar imagem oficial do Nginx
FROM nginx:stable-alpine

# Remover config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copiar arquivos do front
COPY . /usr/share/nginx/html/

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta HTTP
EXPOSE 80
