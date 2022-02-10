const express = require("express");
const app = express();
const router = express.Router();
const Material = require("../models/material");

const flash = require("express-flash");
app.use(flash());

const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const gs = require("gridfs-stream");
const { GridFsStorage } = require("multer-gridfs-storage");
const { connect } = require("http2");
const { appendFile } = require("fs");
const material = require("../models/material");

let name = process.env.DB_NAME;
let pass = process.env.DB_PASS;
const dbURI = `mongodb+srv://Tijan:${pass}@getting-started-with-no.sdrkl.mongodb.net/${name}?retryWrites=true&w=majority`;

// Create mongo connection
// @desc Needed for connecting gridstream
const conn = mongoose.createConnection(dbURI);

// init gfs
let gfs;
conn.once("open", () => {
  // init stream
  gfs = gs(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// init storage engine
const storage = new GridFsStorage({
  url: dbURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

// @router GET /materials
//@desc display all materials
router.get("/", async (req, res) => {
  try {
    const all_materials = await Material.find().sort("-createdAt");
    res.render("../views/materials/index.ejs", {
      material: all_materials,
      success: "Uploaded... Thank you for your contribution",
    });
  } catch {
    res.redirect("new");
  }
});

// @router GET /new
// @desc upload new materials form
router.get("/new", (req, res) => {
  res.render("../views/materials/new.ejs");
});

// @router POST /material
// @desc Upload file to DB
router.post("", upload.single("file"), async (req, res) => {
  const material = new Material({
    title: req.body.title,
    course_code: req.body.coursecode,
    description: req.body.description,
  });

  try {
    const newmaterial = await material.save();

    res.redirect("/materials");
  } catch {
    res.render("../views/materials/new.ejs", {
      error: "An error occured during your upload",
    });
  }
});

router.get("/file/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    mongoose.connection.db.collection("uploads.files", (err, uploadFiles) => {
      if (!err) {
        const file = uploadFiles
          .find({ filename: filename })
          .toArray((err, theFile) => {
            if (!err) {
              mongoose.connection.db.collection(
                "uploads.chunks",
                async (err, theFile) => {
                  await uploadChunks
                    .find({ files_id: theFile[0]._id })
                    .toArray((err, chunkArray) => {
                      if (!err) {
                        let fileData = [];
                        for (let i = 0; i < chunkArray.length; i++) {
                          fileData.push(chunkArray[i].data.toString("base64"));
                        }
                        let RetrievedFile =
                          "data: " +
                          theFile[0].contentType +
                          ";base64," +
                          fileData.join("");
                        console.log(RetrievedFile);
                        return {
                          file: "Pdf file from DB returned!",
                        };
                      } else {
                        throw new Error(err);
                      }
                    });
                }
              );
            } else {
              throw new Error(err);
            }
          });
      } else {
        throw new Error(err);
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to retrieve file from server!!!",
      error: err.message,
      data: err.stack,
    });
  }
});

// const getUploadFile = (filename) => {

//    mongoose.connection.db.collection("uploads.files", (err, uploadFiles) => {
//     if(!err) {
//         const file = uploadFiles.find({filename: "yourfile.pdf"}).toArray((err, theFile) => {
//             if(!err) {
//                 mongoose.connection.db.collection("uploads.chunks", async (err, uploadChunks) => {
//                     await uploadChunks.find({files_id: theFile[0]._id}).toArray((err, chunkArray) => {
//                         if(!err) {
//                             let fileData = [];
//                             for(let i = 0; i < chunkArray.length; i++) {
//                                 fileData.push(chunkArray[i].data.toString('base64'));
//                             }
//                             let RetrievedFile = 'data:' + theFile[0].contentType + ';base64,' + fileData.join('');
//                 console.log(RetrievedFile);
//                 return {
//                     'file': 'Pdf file from DB returned',
//                 }
//                         }
//                     })

//                 })
//         }

//     }
// })
//    }
// }

module.exports = router;
