const { Deta } = require('deta');
const deta = Deta()
const usuarios = deta.Base('usuarios');
// const usersDB = {conectar a DB aqui}
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
	const { newUserName, password } = req.body; // vem do body da requisição
	// console.log(req.body)
	// console.log('user' + user)
	// console.log('newUserName' + newUserName)
	// console.log('pwd' + pwd)
	// console.log('newUserName' + password)
	if (!newUserName || !password) return res.status(400).json({ "message":"Username e password são obrigatórios"});
	//check for duplicates (busco na DB um usuário com username = ao que o estão tentando cadastrar)
	const duplicate = await usuarios.fetch({"username":newUserName}); 
    // console.log(duplicate) retorna um objeto com uma chave count que mostra quantos dados deram match com a query
	if (duplicate.count > 0) return res.sendStatus(409); //conflict
	try {
		//encrypt de password
		const hashedPwd = await bcrypt.hash(password, 10);
		//store the new user
		const newUser = { 
			"username":newUserName, 
			"roles": { "User": "2001"},
			"senha": hashedPwd
		}
		//enviar o usuário para a DB
		await usuarios.put(newUser);
		res.status(201).json({ "success":`Usuário ${newUserName} criado com sucesso` }) 
	} catch (err) {
		res.status(500).json({ "message": err.message });
	}
}

module.exports = { handleNewUser }