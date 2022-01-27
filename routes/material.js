const express = require('express');
const router = express.Router()

// @router GET /materials
//@desc display all materials
router.get('', (req, res)=>{

})

// @router GET /new
// @desc upload new materials form
router.get('/new', (req, res)=>{
    res.render('../views/materials/new.ejs')
})

// @router POST /material
// @desc Upload file to DB
router.post('', (req, res)=> {

})


module.exports = router;