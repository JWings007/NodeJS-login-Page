const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')

const app = express();
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/registerDB", {useNewUrlParser: true});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let fName = "";
let lName = "";
let e_mail = "";
let pass = "";
let eMail = "";
let Pass = "";
let storedPass = "";
let passSign = null;
let userName = "";
let passChangeEmail = "";
let changedPass = "";

const registerSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required:true
    }
})

const Register = mongoose.model("Register", registerSchema);

app.get("/", function(req, res) {
    res.render("home");
})

app.get("/register", function(req, res) {
    res.render("register")
})

app.get("/signin", function(req, res) {
    if(passSign === 0) {
        res.render("signin", {passUpdate: "No account found"})
    }

    else if(passSign === false) {
            res.render("signin", {passUpdate: "Incorrect password"})
        }
    else if(passSign === true) {
        Register.findOne({email: eMail}, function(err, result) {
            userName = result._id;
            res.redirect("/users/" + userName);
        })

    }
    else {
            res.render("signin", {passUpdate: ""});
    }
    passSign = null;
})

app.get("/forgot-password", function(req, res) {
    res.render("forgotPass");
})

app.get("/users/:user", function(req, res) {
    Register.findOne({email: eMail}, function(err, result) {
        if(req.params.user != result._id) {
            res.send("404 Not found!")
        }else {
            res.render("userWelcome", {userName: result.first_name});
        }
    }) 
})

app.post("/register", function(req, res) {
    fName = req.body.firstName;
    lName = req.body.lastName;
    e_mail = req.body.emailId;
    pass = req.body.password;

    Register.findOne({email: e_mail}, function(err, results) {
        if(!err){
            if(results === null){
                Register.insertMany({first_name: fName, last_name: lName, email: e_mail, password: pass}, function(err) {
                if(err)
                    console.log(err);
                else
                    console.log("Inserted..");
            });
            res.redirect("/register")
            }
            else {
                console.log("Account already exists!");
                res.render("accExist");
            }
        }

    })

    
})

app.post("/signin", function(req, res) {
    eMail = req.body.emailId;
    Pass = req.body.password;

    Register.findOne({email: eMail}, function(err, results) {
        if(err) {
            console.log(err);

        }
        else {
            if(results === null) {
                passSign = 0;
                res.redirect("/signin")
               }
               else {
                storedPass = results.password;
                if(Pass === storedPass) {
                    passSign = true;
                    res.redirect("/signin")
                }
                else {
                    passSign = false;
                    res.redirect("/signin")
                }
               }            
        }
    })
})

app.post("/forgot-password", function(req, res) {
    passChangeEmail = req.body.emailIdFP;
    changedPass = req.body.changedPassword;
    Register.findOne({email: passChangeEmail}, function(err, results) {
        if(!err){
            Register.updateOne({email: results.email}, { password: changedPass}, function(err) {
                if(err)
                    console.log(err);
                else
                    res.render("passwordChanged");
            });
        }
    })
})

app.listen(3000, function() {
    console.log("Server started at port 3000");
})