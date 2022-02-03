const express = require('express');
const app = express()
const router = express.Router()
const Material = require('../models/material')

const flash = require('express-flash');
app.use(flash());

const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');


const gs = require('gridfs-stream');
const {GridFsStorage} = require('multer-gridfs-storage');
const { connect } = require('http2');
const { appendFile } = require('fs');
const material = require('../models/material');

let name = process.env.DB_NAME;
let pass = process.env.DB_PASS;
const dbURI = `mongodb+srv://Tijan:${pass}@getting-started-with-no.sdrkl.mongodb.net/${name}?retryWrites=true&w=majority`

// Create mongo connection
// @desc Needed for connecting gridstream
const conn = mongoose.createConnection(dbURI);

// init gfs
let gfs;
conn.once('open', ()=>{
    // init stream
    gfs = gs(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

// init storage engine
const storage = new GridFsStorage({
    url: dbURI,
    file: (req, file) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
        if (err) {
            return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
        };
        resolve(fileInfo);
        });
    });
    }
});
const upload = multer({ storage });


// @router GET /materials
//@desc display all materials
router.get('/', async(req, res)=>{
    try{
        const all_materials = await Material.find().sort('-createdAt')
        res.render('../views/materials/index.ejs', {material: all_materials, success: 'Uploaded... Thank you for your contribution'})
    }
    catch{
        res.redirect('new')
    }
})

// @router GET /new
// @desc upload new materials form
router.get('/new', (req, res)=>{
    res.render('../views/materials/new.ejs')
})

// @router POST /material
// @desc Upload file to DB
router.post('', upload.single('file'), async (req, res)=> {
    const material = new Material({
        title: req.body.title,
        course_code: req.body.coursecode,
        description: req.body.description,
    })

    try{
        const newmaterial = await material.save()

        res.redirect('/materials');
    }
    catch{
        res.render('../views/materials/new.ejs', {error: 'An error occured during your upload'})
    }
})


module.exports = router;