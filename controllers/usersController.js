const { Deta } = require('deta');
const deta = Deta()
const usuarios = deta.Base('usuarios');

const getAllUsers = async (req, res) => {
    const resposta = await usuarios.fetch()
    res.status(201).json(resposta)
}

const createNewUser =  async (req, res) => {
    const { nome, sobrenome, email, username, senha } = req.body
    const newUser = {
        nome,
        sobrenome,
        email,
        username,
        senha
    }
    const addUser = await usuarios.put(newUser);
    res.json(addUser)
}

const getOneUser = async(req, res) => {
    const { username } = req.params;
    const user = await usuarios.fetch({"username":username});
    if (user) {
        res.status(201).json(user);
    } else {
        res.status(404).send({"message": "user not found"});
    }
}

const changeUserData = async(req, res) => {
    const { username } = req.params;
    const { nome, sobrenome, email, senha, roles } = req.body
    const novosDados = { nome, sobrenome, email, senha, roles}

    const findUser = await usuarios.fetch({"username":username});
    // console.log(findUser)
    // console.log(findUser.items[0].key)
    // console.log(novosDados)
    if (findUser) {
        const userId = findUser.items[0].key
        const user = await usuarios.update(novosDados,userId);
        res.status(201).send('usuário atualizado');
    } else (res.send('usuário não atualizado'))
}

const deleteUser = async (req, res) => {
    const { username } = req.params;
    const findUser = await usuarios.fetch({"username":username});
    if (findUser) {
        const deleteUser = await usuarios.delete(findUser.items[0].key)
        res.status(201).send('usuário deletado');
    } else {res.send('usuário não deletado')}
    
}

module.exports = { getAllUsers, createNewUser, getOneUser, changeUserData, deleteUser }