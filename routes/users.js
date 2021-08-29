var express = require('express');
var router = express.Router();
const conn = require('../connection')
const session = require('express-session')
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.get('/signup', function (req, res) {

    res.render('usersignup')
})
router.get('/login', function (req, res) {

    res.render('userlogin')
})

router.get('/userhome', function (req, res) {
    res.render('userhome', { userName: session.userName })
})

router.post('/signupaction', function (req, res) {

    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    let gender = req.body.gender;
    let address = req.body.address;
    let mobileno = req.body.mobileno;
    let photopath = '';
    if (req.files != null) {

    }

    let selectQuery = "select email from users where email='" + email + "'";
    conn.query(selectQuery, function (err, rows) {
        if (err) throw err;
        if (rows.length == 0) {
            let Query = "INSERT INTO `users`(`email`, `password`, `name`, `mobileno`, `gender`, `photo`, `address`, `status`) VALUES" +
                " ('" + email + "','" + password + "','" + name + "','" + mobileno + "','" + gender + "','" + photopath + "','" + address + "','active')"

            conn.query(Query, function (error) {
                if (error) throw error;
                res.send('success');
            })

        } else {
            res.send('duplicate');

        }
    })


})

router.post('/loginaction', function (req, res) {

    let email = req.body.email;
    let password = req.body.password;


    let selectQuery = "select email,password,name from users where email='" + email + "'";
    conn.query(selectQuery, function (err, rows) {
        if (err) throw err;
        if (rows.length == 0) {
            res.send('invalidemail');
        } else {

            if (rows[0].password == password) {

                session.userEmail = email;
                session.userName = rows[0].name;
                res.send('success');
            } else {
                res.send('invalidpassword');

            }

        }
    })
})


module.exports = router;
