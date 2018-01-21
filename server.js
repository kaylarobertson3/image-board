// REQUIRE MODULES AND FILES ~~~~~~~~~~~~~~~~~~~~~~~~~~~
const express = require('express');
const app = express();
const db = require('./config/db.js');
const s3 = require('./config/s3.js');
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');
var bodyParser = require('body-parser');
const config = require("./config/config.json");

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// SET STATIC
app.use(express.static('./public'));
app.use(express.static('./uploads'));


// MULTER MIDDLEWARE SETTINGS
var diskStorage = multer.diskStorage({ //passing a big object into this diskStorage function. Has two properties (destinatino and filenames. Values of the props are functions)
    destination: function(req, file, callback) { // destination dictates where upload is saved
        callback(null, __dirname + '/uploads'); // passes null as first argument as the reserved spot for error?. __dirname isthe path. /uploads is the folder where they are saved
    },
    filename: function(req, file, callback) { // makes a filename for what we're uploading. Pass a function with
        uidSafe(24).then(function(uid) { // creates a 24char long filename. creates a promise. pass a function. that function is passed the uid that was just made. Then run the callback that aws passed above. null since there's no error.
            callback(null, uid + path.extname(file.originalname)); //path.extname adds .jpg/ect. to the end of the uid you made
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152 // file limit size prevents DOS attacks
    }
});


// ROUTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// GET RECENT IMAGES
app.get('/images', (req, res) => {
    db.getRecentImages().then(results => {
        res.json(results);
    });
});

// UPLOAD A PHOTO
app.post('/upload', uploader.single('file'), function(req, res) {
    if (req.file) {
        s3.uploadToS3(req.file).then(function() {
            db.uploadPhoto(req.body.title, req.body.username, req.file.filename, req.body.description)
                .then(results => {
                    console.log("uploadphoto to sql results: ", results);
                    res.json({
                        success: true,
                        url: config.s3url + req.file.filename,
                        msg: "Upload successful"
                    });
                });
        }).catch((err) => {
            console.log("error in upload to s3 ", err);
            res.json({
                success: false,
                msg: "error uploading to AWS S3",
            });
        });
    } else {
        console.log("no file attached");
        res.json({
            success: false,
            msg: "No file attached"
        });
    }
});

//GET SINGLE IMAGE info
app.get('/singleImage/:id', (req, res) => {
    console.log("in route single/image/id");
    db.getSingleImage(req.params.id)
        .then((results) => {
            res.json(results[0]);
        }).catch((err) => {
            console.log("error in get singleImage route ", err);
        });
});


//ADD COMMENTS FOR SINGLE IMAGE
app.post('/singleImage/:id/addComment', (req, res) => {
    console.log("********", req.params.id, req.body.user, req.body.comment);
    db.addComment(req.params.imageId, req.body.user, req.body.comment).then(() => {
        res.json({
            success: true
        });
    }).catch((err) => {
        ("error in add comment server post route", err);
    });
});


//GET COMMENTS ON SINGLE IMAGE
app.get('/singleImage/:id/addComment', (req,res) => {
    console.log("what we're passing to getComments: ", req.params.id);
    db.getComments(req.params.id)
        .then((results) => {
            res.json(results);
            console.log("inside getcomments get route", results);
        }).catch((err) => {
            console.log("error in get comments get route ", err);
        });
});



// SPA ROUTE
app.get('*', (req, res) => {
    res.sendFile(__dirname+'/public/index.html');
});




// START APP
app.listen(process.env.PORT || 8080, () => console.log(`imageboard listening at 8080`));
