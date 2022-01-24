const express = require('express');
const router = express.Router()

router.get('/', (req, res) =>{
    res.render('../views/index.ejs', {title: 'All things Computer Science can be found here'});
});



module.exports = router;