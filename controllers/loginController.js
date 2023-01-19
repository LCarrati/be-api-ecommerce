const { Deta } = require('deta');
const deta = Deta()
const usuarios = deta.Base('usuarios');
// const usersDB = {conectar a DB aqui}
const bcrypt = require('bcrypt');

// usar token de autorização
const jwt = require('jsonwebtoken');
// usar chaves que estão nas ENVIRONMENT VARIABLES
require('dotenv').config(); 

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	console.log(req.body)
	console.log(user)
	if (!user || !pwd) return res.status(400).json({ "message":"Username e password são obrigatórios"});
	const foundUser = await usuarios.fetch({"username":user});
	console.log(foundUser)
	if (foundUser.count === 0) return res.sendStatus(401)
	// res.send('lalla')
	// evaluate password
	const match = await bcrypt.compare(pwd, foundUser.items[0].senha);
	if (match) {
		// se tiver ROLES, colocar aqui. Como no exemplo tem 3 roles, se um usuário tiver 1, ele vai receber 1 role 2 nulls. Pra evitar isso, podemos colocar um .filter(Boolean). Exemplo const roles = Object.values(foundUser.roles).filter(Boolean);
		const roles = Object.values(foundUser.items[0].roles).filter(Boolean)
		// create JWTs
		const accessToken = jwt.sign(
			{ 
				"UserInfo": {
					"username": foundUser.items[0].username,
					"roles": roles
				}
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' } //em producao botar 15min
		);
		const refreshToken = jwt.sign(
			{ "username" : foundUser.items[0].username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '180s' } //em producao botar 3d
		);
		// salvando RT na DB no usuário correspondente
		await usuarios.update({"refreshToken":refreshToken}, foundUser.items[0].key);
		// enviando cookie para o usuário
		res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000}); //1 dia
		// httpOnly é importante pra nao dar acesso ao JS, deixa mais seguro
		// em produção também é MUITO importante adicionar secure: true
		// caso o backend esteja em um domínio diferente do frontend (maioria dos casos) também devemos adicionar sameSite: 'None' para o cookie não ser bloqueado.
		// na hora de testar a API com o chrome, tem que ter o secure: true, senao bloqueia o cookie, mas pra testar pelo thunderclient tem que tirar o secure: true senão não funciona, ficar atento a isso
		res.status(200).json({ roles, accessToken, "message": `Usuário ${user} está logado!` }); // para o frontend ter acesso ao AT, se tiver as ROLES, passar aqui tambem
	} else {
		res.sendStatus(401);
	}
}

module.exports = { handleLogin };