const { Router } = require('express');
const router = new Router();
const asyncHandler = require('express-async-handler');
const { Users, Articles } = require('../../../../models');

router.get('/', asyncHandler(async (req, res) => {
    const users = await Users.findAll();

    res.send({
        data: users
    });
}));


router.get('/:id/blog', asyncHandler(async (req, res) => {
    const articles = await Articles.findAll({
        where: {
            authorId: req.params.id
        }
    });

    res.send({
        data: articles
    });
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    });

    if(user) {
        res.send({
            data: user
        });
    }
}));

router.post('/', asyncHandler(async (req, res) => {
    const user = await Users.create({
       ...req.body,
       createdAt: new Date(),
       updatedAt: new Date()
   });

   res.send( user );
}));

router.put('/:id', asyncHandler(async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    });

    await user.update( {
        ...req.body,
        updatedAt: new Date()
    });

    res.send({
        data: user
    })
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    });

    await Users.destroy({
        where: {
            id: req.params.id
        }
    });

    res.send({
        data: user
    })
}));

module.exports = router;