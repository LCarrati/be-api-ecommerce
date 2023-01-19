const express = require('express');
const app = express() //teoricamente nao preciso disso
app.use(express.json()) //nao deveria precisar disso aqui tb
app.use(express.urlencoded()); //nao deveria precisar disso aqui tb

const usersController = require('../controllers/usersController')

const router = express.Router()

const { Deta } = require('deta');
const deta = Deta()
const usuarios = deta.Base('usuarios');

const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

// //Post Method
router.post('/post', usersController.createNewUser)


// //Get all Method
router.get('/getAll', usersController.getAllUsers)

// //Get by ID Method
router.get('/getOne/:username', usersController.getOneUser)

// //Update by ID Method
router.patch('/update/:username', usersController.changeUserData)

// //Delete by ID Method
router.delete('/delete/:username', usersController.deleteUser)
// router.delete(verifyRoles(ROLES_LIST.Admin), '/delete/:username', usersController.deleteUser)

module.exports = router;



// tem um jeito legal de fazer também:

// router.route('/api')
// 	.get((req, res) => {
// 		res.json(data.users);
// 	})
// 	.post((req, res) => {
// 		res.json({
// 			"firstname": req.body.firstname,
// 			"lastname": req.body.lastname
// 		});
// 	});
// ..etc,etc

//uma coisa importante, posso criar uma outra rota dessa para o caso de receber algum parâmetro pela URL
//exemplo:

// router.route('/api:id')
// 	.get((req, res) => {
// 		res.json({ "id": req.params.id });
// 	})