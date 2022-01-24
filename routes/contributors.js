const express = require('express');
const router = express.Router()

// View all contributors
router.get('/', (req, res)=>{
    res.render('../views/contributors/index.ejs', {title: 'We thank all contributors for their input'})
});

// New contributors
router.get('/new', (req, res)=>{
    res.render('../views/contributors/new.ejs', {title: 'Become a contributor for ACP Archive'})
});

// Create contributors
router.post('/', (req, res)=>{
    res.send('create contributors');
});

module.exports = router;