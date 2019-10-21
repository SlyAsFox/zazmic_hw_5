const { Router } = require('express');
const router = new Router();
const asyncHandler = require('express-async-handler');
const { Users, Articles } = require('../../../../models');
const sequelize = require('../../../../sequelize');

const mongoose = require('mongoose');
const Database = require('../../../../database/database');
const ArticleViews = require('../../../../models_mongo/articlesViews');

router.get('/', asyncHandler(async (req, res) => {
    const users = await sequelize.query(
        `SELECT users.*, COUNT(articles.id) AS articles FROM users LEFT JOIN articles ON articles.author_id=users.id GROUP BY users.id`
    );

    let data = [];

    for (let user of users[0]){
        let obj = {};

        obj.id = user.id;
        obj.lastName = user.last_name;
        obj.firstName = user.first_name;
        obj.email = user.email;
        obj.password = user.password;
        obj.articles = user.articles;
        obj.articlesViews = 0;
        obj.createdAt = user.created_at;
        obj.updatedAt = user.updated_at;

        const findViews = async () => {
            await Database.connect();
            const session = await mongoose.startSession();
            session.startTransaction({});
            try {

                const articleViews = await ArticleViews.aggregate([
                    {
                        $match: {
                            authorId: user.id
                        }
                    }
                ], null);

                articleViews.forEach(( articleView ) => {
                    obj.articlesViews =  obj.articlesViews + articleView.views;
                });

                data.push(obj);

                await session.commitTransaction();
                session.endSession();
                return articleViews;
            }catch (error) {
                await session.abortTransaction();
                session.endSession();
                throw error;
            }
        };

        await findViews().catch((e) => {
            console.log(e);
            process.exit(1);
        });
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
    }else{
        res.status(404);
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