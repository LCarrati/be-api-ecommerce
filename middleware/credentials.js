const whiteList = require('../config/whiteList')

const credentials = (req, res, next) => {
	const origin = req.headers.origin;
	// console.log('origin ' + JSON.stringify(req.headers))
	if (whiteList.includes(origin)) {
		res.header('Access-Control-Allow-Credentials', true);
	}
	next();
}
module.exports = credentials


// Por motivos de privacidade, o CORS é normalmente usado para "solicitações anônimas" - aquelas em que a solicitação não identifica o solicitante. Se quiser enviar cookies ao usar CORS (que podem identificar o remetente), você precisa adicionar cabeçalhos adicionais à solicitação e resposta.

// Um campo adicional importante é setar o 'Access-Control-Allow-Credentials' para 'TRUE' no cabeçalho de resposta. É o que estamos fazendo nesse middleware. 

// Poderia colocar isso junto no corsOptions.js 'eu acho'