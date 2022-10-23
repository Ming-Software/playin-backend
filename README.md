# Descrição do Backend 
Vamos descrever aqui os endpoints feitos no backend. Vamos falar dos valores que devem ser enviados, dos valores que devem ser recebidos e ainda descrever os erros que podem aparecer pelo caminho.

O domínio para os pedidos à backend é **http://localhost:6532/**

## Auth (api/auth/)
Aqui estão os endpoints que remetem para ações de autenticação. A autenticação funciona à base de JWT sendo que temos dois. Um é o AccessToken que expira em 10 minutos e permite ao utilizador fazer pedidos ao backend, e um RefreshToken que expira numa semana e permite ao utilizador adquirir mais AccessTokens sem ter de fazer login. Os tokens têm dentro deles o ID do user.

### Register (register)
Para acrescentar uma conta de utilizador à base de dados.
```
REQUEST:
  BODY:
    Email: String (precisa de estar no formato email),
    Password: String
 
RESPONSE:
  StatusCode: 200
  ID: String (vai em formato uuid)
  
ERROS:
  1. Devolve um erro quando o email já existe na BD
  2. Devolve um erro se alguma coisa correr mal
```

### Login (login)
Para iniciar sessão com um utlizador. 
```
REQUEST:
  BODY:
    Email: String (precisa de estar no formato email),
    Password: String
 
RESPONSE:
  StatusCode: 200
  AccessToken: String

COOKIES:
  RefreshToken: String
  
ERROS:
  1. Devolve um erro quando o email não existe na BD
  1. Devolve um erro quando a pass não está correta
  2. Devolve um erro se alguma coisa correr mal
```

### Refresh (refresh)
Quando o AccessToken expira, esta rota permite receber um novo token sem dar login.
```
RESPONSE:
  StatusCode: 200
  AccessToken: String

COOKIES:
  RefreshToken: String
  
ERROS:
  1. Devolve um erro quando o RefreshToken não é valido
  2. Devolve um erro se alguma coisa correr mal
```
















