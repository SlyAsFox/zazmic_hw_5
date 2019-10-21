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
        ],
        raw:true
    });

    const findViews = async () => {
        await Database.connect();
        const session = await mongoose.startSession();
        session.startTransaction({});
        try {
            const articlesViews = await ArticleViews.find({}, null);

            await session.commitTransaction();
            session.endSession();
            return articlesViews;
        }catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    };

    const articlesViews = await findViews().catch((e) => {
        console.log(e);
        process.exit(1);
    });

    const data = [];

    for( let article of articles){
        let obj = {};

        obj.id = article.id;
        obj.title = article.title;
        obj.content = article.content;
        obj.authorId = article.authorId;
        obj.createdAt = article.createdAt;
        obj.publishedAt = article.publishedAt;
        obj.updatedAt= article.updatedAt;
        obj.author = {
            id: article['author.id'],
            firstName: article['author.firstName'],
            lastName: article['author.lastName'],
            email: article['author.email'],
            createdAt: article['author.createdAt'],
            updatedAt: article['author.updatedAt']
        };

        for(let i = 0; i < articlesViews.length; i++){
            if(obj.id === articlesViews[i].articleId){
                obj.views = articlesViews[i].views;
            }
        }
        data.push(obj);
    }

    res.send({
        data: data
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
        const incrementView = async () => {
            await Database.connect();
            const session = await mongoose.startSession();
            session.startTransaction({});
            try {
                const articleView = await ArticleViews.findOne({
                    articleId: req.params.id
                });

                const updatedArticleView = await ArticleViews.updateOne({articleId: req.params.id}, { views: articleView.views + 1});

                await session.commitTransaction();
                session.endSession();
                return updatedArticleView;
            }catch (error) {
                await session.abortTransaction();
                session.endSession();
                throw error;
            }
        };

        await incrementView().catch((e) => {
            console.log(e);
            process.exit(1);
        });

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

    await create().catch((e) => {
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
    await article.destroy(article);

    const deleteViews = async () => {
        await Database.connect();
        const session = await mongoose.startSession();
        session.startTransaction({});
        try {
            const opts = { session };

            const deletedArticleView = await ArticleViews.deleteOne({
                articleId: req.params.id,
            }, opts);

            await session.commitTransaction();
            session.endSession();
            return deletedArticleView;
        }catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    };

    deleteViews().catch((e) => {
        console.log(e);
        process.exit(1);
    });

    res.send({
        data: article
    });
}));

module.exports = router;
