const { Deta } = require('deta');
const deta = Deta()
const usuarios = deta.Base('usuarios');
// const usersDB = {conectar a DB aqui}

// usar token de autorização
const jwt = require('jsonwebtoken');
// usar chaves que estão nas ENVIRONMENT VARIABLES
require('dotenv').config(); 


const handleRefreshToken = async (req, res) => {
    // verificar se o cliente está enviando um cookie na requisição
	const cookies = req.cookies 
	if (!cookies?.jwt) return res.sendStatus(401); //cookies?.jwt => verifica se existe um cookie com a propriedade jwt nele
	console.log(cookies.jwt);
	const refreshToken = cookies.jwt;

	const foundUser = await usuarios.fetch({"refreshToken":refreshToken})
	if (foundUser.count = 0) return res.sendStatus(403); //Forbidden
	
    // evaluate jwt
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		(err, decoded) => {
			if (err || foundUser.items[0].username !== decoded.username) return res.sendStatus(403);
            // atribuindo um novo AT
			const roles = Object.values(foundUser.items[0].roles)
			const accessToken = jwt.sign(
				{ 
					"UserInfo": {
						"username": decoded.username,
						"roles": roles
					}
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '30s' } //em produção colocar 1dia
			);
            // enviando AT e ROLES para o usuário
			res.json({ accessToken, roles });
		}
	)
}

module.exports = { handleRefreshToken }