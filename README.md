# Descrição do Backend

Vamos descrever aqui os endpoints feitos no backend. Vamos falar dos valores que devem ser enviados, dos valores que devem ser recebidos e ainda descrever os erros que podem aparecer pelo caminho.

O domínio para os pedidos à backend é **playin-backend.fly.dev**
A documentação do backend está disponivel em **playin-backend.fly.dev/documentation**

## Notas

### Tipos De Social

Os valores possiveis em social são: "None", "Competitivo", "Casual". Em que "None" significa que não interessa ao utilizador o tipo.

### Tipos De Atividade

Os valores possiveis em atividade são: "None", "Futebol", "Futsal", "Voleibol", "Basquetebol", "Padel", "Tenis". Em que "None" significa que o utilizador está disposto a participar em todo o tipo de atividades.

## Autenticação

A autenticação funciona à base de JWT sendo que temos dois. Um é o AccessToken que expira em 10 minutos e permite ao utilizador fazer pedidos ao backend, e um RefreshToken que expira numa semana e permite ao utilizador adquirir mais AccessTokens sem ter de fazer login. Os tokens têm dentro deles o ID do user. Com este mecanismo, agora todos os pedidos estão sujeitos a validação de um AccessToken.

## Pages

Todos os gets de mais que um objecto retornam uma page, sendo esta composta por 15 entidades.
