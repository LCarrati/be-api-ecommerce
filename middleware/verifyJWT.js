const jwt = require('jsonwebtoken');
require('dotenv').config(); //remover, nao precisa aqui, só na primeira linha do server/index.js, se tiver em outros arquivos, retirar (e testar)

const verifyJWT = (req, res, next) => {
    // o nome do campo onde vem o token, por padrão, é authorization ou Authorization
	const authHeader = req.headers.authorization || req.headers.Authorization; 
	console.log(authHeader); // vai vir como 'Bearer token'
	if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
	const token = authHeader.split(' ') // assim tiro 'Bearer ' e deixo só o token
	jwt.verify(
		token,
		process.env.ACESS_TOKEN_SECRET,
		(err, decoded) => {
			if (err) return res.sendStatus(403); //invalid token
            // se o token existir e for válido, passo o username que passou na validação para as demais funções como se fosse a requisição inicial (de fato o é, só que validei primeiro) req.user
			req.user = decoded.UserInfo.username; 
			req.roles = decoded.UserInfo.roles;
			next();
		}
	);
}

module.exports = verifyJWT