// install express with `npm install express` 
const express = require('express');
const { Deta } = require('deta');

const deta = Deta()
// const deta = Deta('e0pdjt1l_W3X87D6JKq9XkkXEoQcDJ9ELta7YNAj6')
const app = express()
// parse json data from request.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// instalar CORS com 'npm i cors' e importando
const cors = require('cors');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');
app.use(credentials)
app.use(cors(corsOptions));

app.get('/', (req, res) => res.send('Hello World!'))

// connect or create a database
const usuarios = deta.Base('usuarios');
const pedidos = deta.Base('pedidos');

// import routes from './routes/routes'
const routes = require('./routes/routes');
const registerRoute = require('./routes/register')
const loginRoute = require('./routes/login')
const errorHandler = require('./middleware/errorHandler');
const refreshTokenRoute = require('./routes/refreshToken')
const logoutRoute = require('./routes/logout')

const verifyJWT = require('./middleware/verifyJWT')

// trabalhar com cookies
const cookieParser = require('cookie-parser'); 
app.use(cookieParser());

app.use('/api', routes, registerRoute) //verificar se tenho que fazer separado, acredito que não precise
//Here, this app.use takes two things. One is the base endpoint, and the other is the contents of the routes. Now, all our endpoints will start from '/api'.

app.use('/api/registerNewUser', registerRoute);

app.use('/api/refresh', refreshTokenRoute) //antes do JWT
app.use('/api/logout', logoutRoute); //antes do JWT
app.use('/api/login', loginRoute);

// colocar isso acima das rotas que eu quiser que sejam protegidas. No caso não posso proteger registro, login nem logout, senão não vai funcionar. Proteger então as de buscar usuário, listar usuário, etc... É bom criar user roles também, pra proteger ainda mais as rotas.
app.use(verifyJWT); 


app.use(errorHandler)

// use it!
// usuarios.put({
//     key: '1',
//     nome: 'administrador',
//     sobrenome: 'admin1',
//     email: 'teste@email.com',
//     username: "admin",
//     senha: "123",
//     perfil: {
//       idade: 32,
//       ativo: false,
//       cidade: "rj" 
//     },
//     compras: 1,
//     pedidos: ['pedido1']
// })
// pedidos.put({
//     key: '1',
//     username: "admin",
//     produto: ['lolipop','candy'],
//     valor: [30,12],
//     quantidade: [2,3]    
// })



// export 'app'
// module.exports = app;
app.listen(8080, () => {
    console.log('App listening on port 8080')
  })