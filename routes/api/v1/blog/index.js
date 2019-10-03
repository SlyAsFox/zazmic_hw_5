const { Router } = require('express');
const router = new Router();

const blogNodes = [
    {
        id: '1',
        title: 'title to first node',
        content: 'content to node 1',
        author: 'author1',
        publishedAt: 'today'
    },
    {
        id: '2',
        title: 'title to second node',
        content: 'content to node 2',
        author: 'author2',
        publishedAt: 'today'
    }
];

router.get('/', (req, res) => {
    res.send({
        "blogNodes": [ ...blogNodes ]
    })
});

router.get('/:id', (req, res) => {
    let resultNode = null;
    blogNodes.forEach((node) => {
        if(node.id === req.params.id){
            resultNode = node;
        }
    });
    if(resultNode){
        res.send(resultNode);
    }else{
        res.status(400);
        res.send(`don't exist node with id "${req.params.id}"`);
    }

});


router.post('/', (req, res) => {
    let isExist = false;
    blogNodes.forEach((node) => {
        if(node.id === req.body.id){
            isExist = true;
        }
    });
    if(!isExist){
        blogNodes.push(req.body);
        res.send( req.body );
    }else{
        res.status(400);
        res.send(`node with id "${req.params.id}" already exists`);
    }
});

router.put('/:id', (req, res) => {
    let isExist = false;
    blogNodes.forEach((node) => {
        if(node.id === req.params.id){
            isExist = true;
            node = req.body;
            res.send( node );
        }
    });
    if(!isExist){
        res.status(400);
        res.send(`don't exist node with id "${req.params.id}"`);
    }
});

router.delete('/:id', (req, res) => {
    let deletedNode = null;
    for(let i = 0; i < blogNodes.length; i++){
        if(blogNodes[i].id === req.params.id){
            deletedNode = blogNodes[i];
            blogNodes.splice(i, 1);
        }
    }
    if(deletedNode){
        res.send(deletedNode);
    }else{
        res.status(400);
        res.send(`don't exist node with id "${req.params.id}"`);
    }
});

module.exports = router;