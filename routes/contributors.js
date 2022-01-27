const express = require('express');
const Contributor = require('../models/contributor');
const router = express.Router()

// @router GET /contributors
// @desc View all contributors
router.get('/', async (req, res)=>{
    try{
        const contributor = await Contributor.find()
        res.render('../views/contributors/index.ejs', {contributor: contributor})
    }
    catch{
        res.redirect('/')
    }
});

/* router.get('/', (req, res)=>{
    Contributor.find()
        .then((result)=>{
            res.render('../views/contributors/index.ejs', {contributor:result})
        })
        .catch((err)=>{
            console.log(err);
            res.redirect('/');
        });
}); */

// @router GET /new
// @desc add contributor form
router.get('/new', (req, res)=>{
    res.render('../views/contributors/new.ejs', {contributor: new Contributor()})
});

// @router POST /contributors
// @desc create contributors and push to DB
router.post('/', async (req, res)=>{
    const contributor = new Contributor({
        name: req.body.name
    })
    try{
        const newContributor = await contributor.save();
        res.redirect('contributors');
    }
    catch{
        res.render('/new', {errorMessage: 'Error Adding Contributor'})
    }
});

module.exports = router;