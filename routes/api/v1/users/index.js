const { Router } = require('express');
const router = new Router();

const userList = [
    {
        "id": "1",
        "email": "qweqwe111@gmail.com",
        "firstName": "Name1",
        "lastName": "LastName1"
    },
    {
        "id": "2",
        "email": "qweqwe222@gmail.com",
        "firstName": "Name2",
        "lastName": "LastName2"
    }
];


router.get('/', (req, res) => {
    res.send({
        data: [ ...userList ]
    });
});

router.get('/:id', (req, res) => {
    let findUser = null;
    userList.forEach((user) => {
        if(user.id === req.params.id){
            findUser = user;
        }
    });
    if(findUser){
        res.send({
            data: findUser
        });
    }else{
        throw new Error(`don't exist user with id [${req.params.id}]`);
    }
});

router.post('/', (req, res) => {
    let isExist = false;
    userList.forEach((user) => {
        if(user.id === req.body.id){
            isExist = true;
        }
    });
    if(!isExist){
        userList.push( req.body );
        res.send({
            data: req.body
        });
    }else{
        throw new Error(`user with id [${ req.params.id }] already exists`);
    }
});

router.put('/:id', (req, res) => {
    let isExist = false;
    userList.forEach((user) => {
        if(user.id === req.params.id){
            isExist = true;
            user = req.body;
            res.send({
                data: user
            });
        }
    });
    if(!isExist) {
        throw new Error(`don't exist user with id [${req.params.id}]`);
    }
});

router.delete('/:id', (req, res) => {
    let deletedUser = null;
    for(let i = 0; i < userList.length; i++){
        if(userList[i].id === req.params.id){
            deletedUser = userList[i];
            userList.splice(i, 1);
        }
    }
    if(deletedUser){
        res.send({
            data: deletedUser
        });
    }else{
        throw new Error(`don't exist user with id [${req.params.id}]`);
    }
});

module.exports = router;