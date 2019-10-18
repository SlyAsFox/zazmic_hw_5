const { Router } = require('express');
const router = new Router();
const asyncHandler = require('express-async-handler');
const { Articles, Users } = require('../../../../models');

const mongoose = require('mongoose');
const Database = require('../../../../database/database');
const ArticleViews = require('../../../../models_mongo/articlesViews');

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
    }else{
        res.status(404);
    }
}));

router.post('/', asyncHandler(async (req, res) => {
    const article = await Articles.create({
        ...req.body,
        authorId: +req.body.authorId,
    });
    console.log(article);

    const create = async () => {
        await Database.connect();
        const session = await mongoose.startSession();
        session.startTransaction({});
        try {
            const opts = { session };

            const articleView = await ArticleViews.create([{
                articleId: +article.id,
                authorId: +article.authorId,
                views: 0
            }], opts);

            await session.commitTransaction();
            session.endSession();
            return articleView;
        }catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    };

    create().catch((e) => {
        console.log(e);
        process.exit(1);
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
        ...req.body
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
    await Articles.destroy(article);



    res.send({
        data: article
    });
}));

module.exports = router;
