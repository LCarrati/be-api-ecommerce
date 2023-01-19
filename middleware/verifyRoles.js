const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.roles);
        const result = req.roles.map(role => rolesArray.includes(role)).find(value => value === true); //compara os arrays e retorna um array de trues e falses. Depois faz o find pra verificar se tem algum true.
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;