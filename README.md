# Descrição do Backend

Vamos descrever aqui os endpoints feitos no backend. Vamos falar dos valores que devem ser enviados, dos valores que devem ser recebidos e ainda descrever os erros que podem aparecer pelo caminho.

O domínio para os pedidos à backend é **playin-backend.fly.dev**

## Notas

### Tipos De Social

Os valores possiveis em social são: "None", "Competitivo", "Casual". Em que "None" significa que não interessa ao utilizador o tipo.

### Tipos De Atividade

Os valores possiveis em atividade são: "None", "Futebol", "Futsal", "Voleibol", "Basquetebol", "Padel", "Tenis". Em que "None" significa que o utilizador está disposto a participar em todo o tipo de atividades.

### Default

Alguns parametros não precisam/devem ser mandados em pedidos. Para esses parametros existem valores predefinidos (default).

## Auth (/api/auth)

Aqui estão os endpoints que remetem para ações de autenticação. A autenticação funciona à base de JWT sendo que temos dois. Um é o AccessToken que expira em 10 minutos e permite ao utilizador fazer pedidos ao backend, e um RefreshToken que expira numa semana e permite ao utilizador adquirir mais AccessTokens sem ter de fazer login. Os tokens têm dentro deles o ID do user. Com este mecanismo, agora todos os pedidos estão sujeitos a validação de um AccessToken.

### Register (/register)

Para acrescentar uma conta de utilizador à base de dados.

```
POST:
  REQUEST:
    BODY:
      Email:      String   (Formato: email),
      Password:   String
      Name:       String,
      Admin:      Boolean  (Default: false)
      Social:     String   (Default: "Casual")
      Activities: String[] (Default: None)

  RESPONSE:
    StatusCode: 200
    Status:     String (a dizer que correu tudo bem)

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
      Email:    String (Formato: email),
      Password: String

  RESPONSE:
    StatusCode:  200
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
    Status:     String (a dizer que correu bem)

  ERROS:
    1. Devolve um erro de Unauthorized quando o AccessToken não é valido
    2. Devolve um erro se alguma coisa correr mal
```

### Refresh (/refresh)

Quando o AccessToken expira, esta rota permite receber um novo token sem dar login.

```
GET:
  RESPONSE:
    StatusCode:  200
    AccessToken: String

  COOKIES:
    RefreshToken: String

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal

```

## User (/api/user)

Aqui estão os endpoints que remetem para ações do utilizador. Para poder realizar estas ações o utilizador tem de estar logado.

### GET (/)

Quando quer obter algumas informações sobre o utilizador.

```
GET:
  RESPONSE:
    StatusCode:  200
    Email:       String   (Formato: email),
    Name:        String,
    Description: String

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal

```

### GET Details (/details)

Quando quer obter algumas informações sobre o utilizador.

```
GET:
  RESPONSE:
    StatusCode:  200
    Email:       String   (Formato: email),
    Name:        String,
    Description: String,
    Social:     String   (Default: "Casual"),
    Activities: String[] (Default: None),
    Admin:      Boolean  (Default: false)

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal

```

### Delete (/)

Quando quer remover o utilizador.

```
DELETE:
  RESPONSE:
    StatusCode:  200
    Email:       String   (Formato: email),
    Name:        String

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal

```

### Update (/)

Quando quer atualizar o utilizador.

```
PATCH:
  REQUEST:
      BODY:
        Email:      String   (Formato: email),
        Password:   String,
        Name:       String,
        Admin:      Boolean  (Default: false),
        Social:     String   (Default: "Casual"),
        Activities: String[] (Default: None)

  RESPONSE:
    StatusCode:  200
    Email:       String   (Formato: email),
    Name:        String,
    Description: String,
    Social:     String   (Default: "Casual"),
    Activities: String[] (Default: None)

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal

```

### Get Users Page (/userspage?Page=x)

Quando quer uma página com utilizadores, x é o numero da página a ser exibida.

```
DELETE:
  RESPONSE:
    StatusCode:  200
    ID:           String   (Formato: uuid),
    Name:         String,
    Description:  String

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal

```

## Event (/api/event)

Aqui estão os endpoints que remetem para ações de um evento. Para já, para poder realizar estas ações o utilizador tem de estar logado.

### Create Event (/)

Quando quer crear um evento.

```
POST:
  REQUEST:
      BODY: 
        Name: String,
        Description: String,
        Start: String format("date-time") 'ex: 2000-10-3 12:00:00' ,
        Finish: String format("date-time"),
        Public: Boolean,
        MaxUsers: Number,
        CurrentUsers:Number,
        Locale: String,
        Activity: String,
        Social: String,

  RESPONSE:
    StatusCode:  200
    Status:     String (a dizer que correu bem)

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal
    3. Devolve um erro se o evento não existir
    4. Devolve um erro se o user não existir

```

### GET (/:eventID)

Quando quer obter algumas informações sobre um evento.

```
GET:
  RESPONSE:
    StatusCode:  200
    ID: String,
    Name: String,
    Description: String,
    Start: String format("date-time"),
    Finish: String format("date-time"),
    Public: Boolean,
    MaxUsers: Number,
    CurrentUsers:Number,
    Locale: String,
    ActivityID: String,
    Social: String,

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal
    3. Devolve um erro se o evento não existir

```

### GET Details (/)

Quando quer obter algumas informações sobre todos os eventos.

```
GET:
  RESPONSE:
    StatusCode:  200
    Array: {
      ID: String,
      Name: String,
      Description: String,
      Start: String format("date-time"),
      Finish: String format("date-time"),
      Public: Boolean,
      MaxUsers: Number,
      CurrentUsers:Number,
      Locale: String,
      ActivityID: String,
      Social: String,
    }

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal
    3. Devolve um erro se o utilizador nao estiver associado ao evento

```

### Update (/:eventID)

Quando quer atualizar o utilizador.

```
PATCH:
  REQUEST:
      BODY: (Tudo campos optionais)
        Name: String,
        Description: String,
        Start: String format("date-time"),
        Finish: String format("date-time"),
        Public: Boolean,
        MaxUsers: Number,
        CurrentUsers:Number,
        Locale: String,
        Activity: String,
        Social: String,


  RESPONSE:
    StatusCode:  200
    ID: String,
    Name: String,
    Description: String,
    Start: String format("date-time"),
    Finish: String format("date-time"),
    Public: Boolean,
    MaxUsers: Number,
    CurrentUsers:Number,
    Locale: String,
    ActivityID: String,
    Social: String,

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal
    3. Devolve um erro se o evento não existir

```

### Delete (/:eventID)

Quando quer remover um evento.

```
DELETE:
  RESPONSE:
    StatusCode:  200
    Status:     String (a dizer que correu bem)

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal

```

### Get page (/eventspage)

Quando queremos uma pagina de eventos (30 eventos)

```
GET:
  QUERY:
    Page: Number
    
  RESPONSE:
    [
      ID: String,
      Name: String,
      Description: String,
      Start: String format("date-time"),
      Finish: String format("date-time"),
      Public: Boolean,
      MaxUsers: Number,
      CurrentUsers:Number,
      Locale: String,
      ActivityID: String,
      Social: String,
    ]
    StatusCode:  200
    Status:      String (a dizer que correu bem)

  ERROS:
    1. Devolve um erro de Unauthorized quando o RefreshToken não é valido
    2. Devolve um erro se alguma coisa correr mal

```
# A organizar por secções novas (Guest Participant e Permission)

### Remove a user from an event (/:eventID/:userID)

Quando quer remover um utilizador de um evento.

```
DELETE:
  RESPONSE:
    StatusCode:  200
    ID:           String   (Formato: uuid),
    Name:         String

```


### Remove an invite from an event (/event/invite/:eventID/:userID)

Remove o convite de participação no evento.

```
DELETE:
  RESPONSE:
    StatusCode:  200
    ID:     String   (Formato: uuid)
    NAME:   String

```


