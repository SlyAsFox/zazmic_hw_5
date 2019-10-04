const { Router } = require('express');
const router = new Router();

const blogNodes = [
    {
        id: '11111',
        title: 'title to first node',
        content: 'content to node 1',
        author: 'author1',
        publishedAt: 'today'
    },
    {
        id: '22222',
        title: 'title to second node',
        content: 'content to node 2',
        author: 'author2',
        publishedAt: 'today'
    }
];

router.get('/', (req, res) => {
    res.send({
        data: [ ...blogNodes ]
    });
});

router.get('/:id', (req, res) => {
    let resultNode = null;
    blogNodes.forEach((node) => {
        if(node.id === req.params.id){
            resultNode = node;
        }
    });
    if(resultNode){
        res.send({
            data: resultNode
        });
    }else{
        throw new Error(`don't exist node with id [${req.params.id}]`);
    }
});


router.post('/', (req, res) => {
    let id;
    while(true){
        id = (Math.random() * 100000).toFixed();
        let unique = true;
        blogNodes.forEach((node) => {
            if(node.id === id){
                unique = false;
            }
        });
        if(unique) {
            break;
        }
    }
    let newNode = req.body;
    newNode.id = id;
    blogNodes.push(req.body);
    res.send({
        data: newNode
    });
});

router.put('/:id', (req, res) => {
    let isExist = false;
    blogNodes.forEach((node) => {
        if(node.id === req.params.id){
            isExist = true;
            node = req.body;
            res.send({
                data: node
            });
        }
    });
    if(!isExist){
        throw new Error(`don't exist node with id [${req.params.id}]`);
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
        res.send({
            data: deletedNode
        });
    }else{
        throw new Error(`don't exist node with id [${req.params.id}]`);
    }
});

module.exports = router;