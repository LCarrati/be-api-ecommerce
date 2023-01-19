const whiteList = require('./whiteList');

const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.includes(origin) || !origin) { // REMOVER '|| !origin' NO DEPLOY!!!!!!!!
            callback(null, true) // erro = null, libera acesso = true
        } else {
            callback(new Error('Bloqueado pelo CORS'))
        }
    } ,
    optionsSuccessStatus: 200    
}

module.exports = corsOptions;

// padrão de CORS options: (o código acima é só uma rebuscada, pra ficar mais completo com o ERRO e a WhiteList)
// const corsOptions = {
//     origin: 'http://example.com',
//     optionsSuccessStatus: 200 
// }