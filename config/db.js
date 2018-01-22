var spicedPg = require('spiced-pg');
var db = spicedPg(`postgres:postgres:postgres:psql@localhost:5432/images`);
const config = require("./config.json");


// Get photo info from SQL
exports.getRecentImages = function() {
    return db.query(`SELECT * FROM images;`).then(function(results) {
        results.rows.forEach(function(row) {
            row.image = config.s3Url + row.image;
        });
        return results.rows;
    }).catch((err) => {
        console.log("err in getRecentImages ", err);
    });
};

// Put uploaded photos into sql
exports.uploadPhoto = function(title, username, filename, description) {
    const params = [title, username, filename, description];
    const q = ('INSERT INTO images (title, username, image, description) VALUES ($1, $2, $3, $4);');
    return db.query(q,params).catch((err) => {
        console.log("err in uploadPhoto", err);
    });
};


// Get singleimage info
exports.getSingleImage = function(id) {
    return db.query(
        `SELECT * FROM images WHERE id = $1`,
        [id]
    ).then((results) => {
        results.rows.forEach(elem => {
            elem.image = config.s3Url + elem.image;
        });
        return results.rows;
    }).catch((err) => {
        console.log("error in db.getSingleImage ", err);
    });
};


//ADD Comment
exports.addComment = function(imageId, username, comment) {
    return db.query(`INSERT INTO comments (imageId, username, comment) VALUES ($1, $2, $3) RETURNING *`, [imageId, username, comment])
        .then((results) => {
            return results.rows[0];
        }).catch((err) => {
            console.log("error in addComment db", err);
        });
};


//GET COMMENTS ON SINGLE IMAGE
exports.getComments = function(imageId) {
    return db.query(`SELECT * FROM comments WHERE imageId = $1`, [imageId]
    ).then((results) => {
        return results.rows;
    }).catch((err) => {
        console.log("error in getComments db", err);
    });
};
