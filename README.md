# Descrição do Backend 
Vamos descrever aqui os endpoints feitos no backend. Vamos falar dos valores que devem ser enviados, dos valores que devem ser recebidos e ainda descrever os erros que podem aparecer pelo caminho.

O domínio para os pedidos à backend é **playin-backend.fly.dev**

## Auth (/api/auth)
Aqui estão os endpoints que remetem para ações de autenticação. A autenticação funciona à base de JWT sendo que temos dois. Um é o AccessToken que expira em 10 minutos e permite ao utilizador fazer pedidos ao backend, e um RefreshToken que expira numa semana e permite ao utilizador adquirir mais AccessTokens sem ter de fazer login. Os tokens têm dentro deles o ID do user. Com este mecanismo, agora todos os pedidos estão sujeitos a validação de um AccessToken.

### Register (/register)
Para acrescentar uma conta de utilizador à base de dados. 
```
POST:
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

### Login (/login)
Para iniciar sessão com um utlizador.
```
POST:
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
    2. Devolve um erro quando a pass não está correta
    3. Devolve um erro se alguma coisa correr mal
```

### Logout (/logout)
Quando queremos dar logout, porque isto é jwt temos de eliminar o AccessToken no lado do client, no entanto como o RefreshToken está nas cookies que foram criadas do lado servidor, é este que tem de as apagar.
```
GET:
  RESPONSE:
    StatusCode: 200
    Status: String

  ERROS:
    1. Devolve um erro de Unauthorized quando o AccessToken não é valido
    2. Devolve um erro se alguma coisa correr mal
```

### Refresh (/refresh)
Quando o AccessToken expira, esta rota permite receber um novo token sem dar login.
```
GET:
  RESPONSE:
    StatusCode: 200
    AccessToken: String

  COOKIES:
    RefreshToken: String

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal
  
```
















