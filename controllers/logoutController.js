const { Deta } = require('deta');
const deta = Deta()
const usuarios = deta.Base('usuarios');

// usar token de autorização
const jwt = require('jsonwebtoken');
// usar chaves que estão nas ENVIRONMENT VARIABLES
require('dotenv').config(); 

const handleLogout = async (req, res) => {
	// !!!!! On client, the frontend also needs to delete de AT, não é o back que faz isso SOZINHO !!!!!
	// res.sendStatus(404)
	console.log('vai a merda')
	const cookies = req.cookies
	if (!cookies?.jwt) return res.sendStatus(204); // Cookie não existe, OK pois queremos apagar mesmo
	const refreshToken = cookies.jwt;
	console.log(refreshToken)
	// Is RT in db?? 
	const foundUser = await usuarios.fetch({"refreshToken":refreshToken})
	console.log('merda do logout '+JSON.stringify(foundUser))
	// res.sendStatus(404)
	if (foundUser.count = 0) { //nao tem RT na db mas tem cookie no client já que ele enviou uma request com cookie
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // passar tambem o sameSite: 'None' e o secure: true
		res.sendStatus(204); // No content, OK pois queremos apagar mesmo
	} else {
	
	// // Delete RT in db (usando API da DB)
	await usuarios.update({"refreshToken":""}, foundUser.items[0].key);
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); //em produção, colocar tambem 'secure: true' - only serves on httpS
	res.sendStatus(204);

	}
}

module.exports = { handleLogout }