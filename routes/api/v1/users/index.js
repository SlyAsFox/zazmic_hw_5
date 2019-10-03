const { Router } = require('express');
const router = new Router();

const userList = [
    {
        id: '1',
        email: 'qweqwe111@gmail.com',
        firstName: 'Name1',
        lastName: 'LastName1'
    },
    {
        id: '2',
        email: 'qweqwe222@gmail.com',
        firstName: 'Name2',
        lastName: 'LastName2'
    }
];

router.get('/', (req, res) => {
    res.send('all users')
});

router.get('/:id', (req, res) => {
    res.send(`user ${req.params.id}`)
});

router.post('/', (req, res) => {
    res.send('new user')
});

router.put('/:id', (req, res) => {
    res.send('reset user')
});

router.delete('/:id', (req, res) => {
    res.send('delete user')
});

module.exports = router;