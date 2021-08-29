var express = require('express');
var router = express.Router();
const conn = require('../connection')
const session = require('express-session')
/* GET home page. */
router.get('/', function (req, res, next) {

    res.render('index');
});

router.get('/signup', function (req, res, next) {
    res.render('usersignup');
});
router.get('/getProducts', function (req, res) {
    let Query = "SELECT * FROM `products` INNER JOIN subcategories on products.subcategoryid=subcategories.subcategoryid order by productid desc";
    conn.query(Query, function (err, rows) {

        if (err) throw err;
        res.send(rows);
    })
})
module.exports = router;
