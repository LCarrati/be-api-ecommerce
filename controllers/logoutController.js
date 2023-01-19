const { Deta } = require('deta');
const deta = Deta()
const usuarios = deta.Base('usuarios');

const handleLogout = async (req, res) => {
	// !!!!! On client, the frontend also needs to delete de AT, não é o back que faz isso SOZINHO !!!!!

	const cookies = req.cookies
	if (!cookies?.jwt) return res.status(204); // Cookie não existe, OK pois queremos apagar mesmo
	const refreshToken = cookies.jwt;

	// Is RT in db?? 
	const foundUser = await usuarios.fetch({"refreshToken":refreshToken})
	if (foundUser.count = 0) { //nao tem RT na db mas tem cookie no client já que ele enviou uma request com cookie
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // passar tambem o sameSite: 'None' e o secure: true
		return res.sendStatus(204); // No content, OK pois queremos apagar mesmo
	}
	
	// Delete RT in db (usando API da DB)
	await usuarios.update({"refreshToken":""}, foundUser.items[0].key);
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); //em produção, colocar tambem 'secure: true' - only serves on httpS
	res.sendStatus(204);
}

module.exports = { handleLogout }