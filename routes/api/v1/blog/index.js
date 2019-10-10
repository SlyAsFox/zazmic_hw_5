const { Router } = require('express');
const router = new Router();
const asyncHandler = require('express-async-handler');
const { Articles, Users } = require('../../../../models');

router.get('/', asyncHandler(async (req, res) => {
    const articles = await Articles.findAll({
        include: {
            model: Users,
            as: 'author'
        },
        order: [
            ['publishedAt', 'DESC']
        ]
    });

    res.send({
        data: articles
    });
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const article = await Articles.findOne({
        where: {
            id: req.params.id
        },
        include: {
            model: Users,
            as: 'author'
        }
    });

    if(article){
        res.send({
            data: article
        });
    }
}));

router.post('/', asyncHandler(async (req, res) => {
    console.log(req.body);
    const article = await Articles.create({
        ...req.body,
        authorId: +req.body.authorId,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    res.send({
        data: article
    });
}));

router.put('/:id', asyncHandler(async (req, res) => {
    const article = await Articles.findOne({
        where: {
            id: req.params.id
        }
    });

    await article.update({
        ...req.body,
        updatedAt: new Date
    });

    res.send({
        data: article
    });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    const article = await Articles.findOne({
        where: {
            id: req.params.id
        }
    });

    await Articles.destroy({
        where: {
            id: req.params.id
        }
    });

    res.send({
        data: article
    });
}));

module.exports = router;
