Considerações Gerais
Você deverá usar este repositório como o repo principal do projeto, i.e., todos os seus commits devem estar registrados aqui, pois queremos ver como você trabalha.
A escolha de tecnologias é livre para a resolução do problema. Utilize os componentes e serviços que melhor domina pois a apresentação na entrega do desafio deverá ser como uma aula em que você explica em detalhes cada decisão que tomou.
Registre tudo: testes que foram executados, ideias que gostaria de implementar se tivesse tempo (explique como você as resolveria, se houvesse tempo), decisões que foram tomadas e seus porquês, arquiteturas que foram testadas e os motivos de terem sido modificadas ou abandonadas. Crie um arquivo COMMENTS.md ou HISTORY.md no repositório para registrar essas reflexões e decisões.

O Problema
O desafio que você deve resolver é a implantação da aplicação de Comentários em versão API (backend) usando ferramentas open source da sua preferência.
Você precisa criar o ambiente de execução desta API com o maior número de passos automatizados possível, inclusive a esteira de deploy.
A aplicação será uma API REST que está disponível neste repositório. Através dela os internautas enviam comentários em texto de uma máteria e acompanham o que outras pessoas estão falando sobre o assunto em destaque. O funcionamento básico da API consiste em uma rota para inserção dos comentários e uma rota para listagem.
Os comandos de interação com a API são os seguintes:


Criando e listando comentários por matéria


# ################### Network ####################################
# Network

docker network create comentarios-net
# ######################################################################

# ################### APP backend ####################################
# docker build
docker build -t api-comentarios .


# docker run
docker run -d -p 8000:8000 --name api-comentarios --network comentarios-net api-comentarios
# ######################################################################

# ################### APP Frontend ####################################
# docker build
docker build -t front-comentarios .

# docker run
docker run -d --name front --network comentarios-net -p 8080:80 comentarios-front

# ######################################################################