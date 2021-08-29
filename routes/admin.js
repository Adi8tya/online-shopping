var express = require('express');
var router = express.Router();
const conn = require('../connection')
const session = require('express-session')

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/manageProducts', function (req, res) {


    // console.log(session.adminUsername)
    if (session.adminUsername != undefined) {
        res.render('manage_Products')
    } else {
        res.redirect('/admin/adminlogin')
    }

})

router.get('/getcategories', function (req, res) {

    let Query = "SELECT DISTINCT categoryname FROM `subcategories`";
    conn.query(Query, function (err, rows) {
        if (err) throw err;
        res.send(rows);
    })


})
router.get('/getSubcategories', function (req, res) {
    let categoryname = req.query.categoryname;
    let Query = "SELECT * FROM `subcategories` where categoryname='" + categoryname + "'";
    conn.query(Query, function (err, rows) {
        if (err) throw err;
        res.send(rows);
    })


})

router.get('/getProducts', function (req, res) {
    let Query = "SELECT * FROM `products` INNER JOIN subcategories on products.subcategoryid=subcategories.subcategoryid";
    conn.query(Query, function (err, rows) {

        if (err) throw err;
        res.send(rows);
    })
})

router.post('/saveproducts', function (req, res) {


    let subcategory = req.body.subcategory;
    let productname = req.body.productname;
    let price = req.body.price;
    let discount = req.body.discount;
    if (req.body.action == "add") {

        let photo = req.files.photo;
        let realPath = "public/productImages/" + photo.name;
        let filePath = "productImages/" + photo.name;
        photo.mv(realPath, function (err) {
            if (err) throw err;

        })

        let Query = "INSERT INTO `products`(`productid`, `productname`, `price`, `discount`, `subcategoryid`,`product_photo`) " +
            "VALUES (null,'" + productname + "'," + price + "," + discount + "," + subcategory + ",'" + filePath + "')"
        conn.query(Query, function (err, rows) {
            if (err) {
                res.send("error");
            } else {
                res.send("success");
            }
        })
    } else {
        let productid = req.body.productid;
        let Query = "update `products` Set `productname`='" + productname + "', " +
            "`price`=" + price + ", `discount`=" + discount + ", `subcategoryid`=" + subcategory + " where productid=" + productid;
        conn.query(Query, function (err, rows) {
            if (err) {
                res.send("error");
            } else {
                res.send("success");
            }
        })

    }


})
router.get('/deleteProduct', function (req, res) {
    let productid = req.query.productid;
    let Query = "delete from products where productid=" + productid;
    conn.query(Query, function (err) {
        if (err) {
            res.send(err)
        } else {
            res.send('success');
        }

    })
})

router.get('/adminlogin', function (req, res) {
    res.render("adminlogin")

})

router.post("/adminLoginaction", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let Query = "select * from admin where username='" + username + "' and password='" + password + "'"
    conn.query(Query, function (error, rows) {
        if (error) throw error;
        if (rows.length === 0) {
            res.send("failed");
        } else {

            session.adminUsername = username;
            res.send("success");
        }
    })

})
router.get('/adminHome', function (req, res) {
    if (session.adminUsername != undefined) {
        res.render("adminhome", { username: session.adminUsername })
    } else {
        res.redirect("/admin/adminlogin")
    }

})

router.get('/changePassword', function (req, res) {
    if (session.adminUsername != undefined) {
        res.render("changePassword", { username: session.adminUsername })
    } else {
        res.redirect("/admin/adminlogin")
    }

})

router.post('/adminchangepassword', function (req, res) {
    let username = session.adminUsername;
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    let Query = "select * from admin where username='" + username + "' and password='" + oldpassword + "'"
    conn.query(Query, function (error, rows) {
        if (error) throw error;
        if (rows.length === 0) {
            res.send("invalid");

        } else {

            let Query = "update admin  Set password='" + newpassword + "' where username='" + username + "' "
            conn.query(Query, function (error, rows) {
                if (error) throw error;

                res.send("success");

            })


        }
    }
    )

})
router.get('/logout', function (req, res) {
    session.adminUsername = undefined;
    res.redirect('/admin/adminlogin');
})


module.exports = router;
