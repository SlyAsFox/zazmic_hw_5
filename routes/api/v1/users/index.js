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
    let id;
    while(true){
        id = (Math.random() * 100000).toFixed();
        let unique = true;
        userList.forEach((node) => {
            if(node.id === id){
                unique = false;
            }
        });
        if(unique) {
            break;
        }
    }
    let newUser = req.body;
    newUser.id = id;
    userList.push(newUser);
    res.send({
        data: newUser
    });
});

router.put('/:id', (req, res) => {
    let isExist = false;
    userList.find((user, index) => {
        if(user.id === req.params.id){
            isExist = true;
            userList[index] = req.body;
            res.send({
                data: userList[index]
            });
            return true;
        }
    });
    if(!isExist) {
        throw new Error(`don't exist user with id [${req.params.id}]`);
    }
});

router.delete('/:id', (req, res) => {
    let deletedUser = null;
    userList.forEach((user, index) => {
        if(user.id === req.params.id){
            deletedUser = userList[index];
            userList.splice(index, 1);
        }
    });
    if(deletedUser){
        res.send({
            data: deletedUser
        });
    }else{
        throw new Error(`don't exist user with id [${req.params.id}]`);
    }
});

module.exports = router;