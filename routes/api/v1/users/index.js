const { Router } = require('express');
const router = new Router();
const asyncHandler = require('express-async-handler');
const { Users, Articles } = require('../../../../models');
const sequelize = require('../../../../sequelize');

router.get('/', asyncHandler(async (req, res) => {
    const users = await sequelize.query(
        `SELECT users.*, COUNT(articles.id) AS articles FROM users LEFT JOIN articles ON articles.author_id=users.id GROUP BY users.id`
    );

    let data = [];

    for (let i of users[0]){
        let obj = {};

        obj.id = i.id;
        obj.email = i.email;
        obj.password = i.password;
        obj.articles = i.articles;
        obj.firstName = i.first_name;
        obj.lastName = i.last_name;
        obj.createdAt = i.created_at;
        obj.updatedAt = i.updated_at;

        data.push(obj);
    }

    res.send({
        data: data
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