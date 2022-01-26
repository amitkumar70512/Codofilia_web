var admin = require("firebase-admin");
const functions = require('firebase-functions');
var serviceAccount = require("./serviceAccountKey.json");
require("dotenv").config();
 ////

const express = require('express');  
const port = process.env.PORT || 4000;
const path=require('path');
const bodyParser= require('body-parser');
const {check, validationResult}=require('express-validator');
const { Console } = require('console');
const ejs = require('ejs');


// for encryption
const bcrypt = require('bcrypt');
const { firestore } = require("firebase-admin");
const saltRounds = 10;

var app = express();  

    


app.use(bodyParser.urlencoded({
	extended:true
}));

app.use(express.static('public'));
app.set('view engine', 'ejs');




// To Run the server with Port Number  
app.listen(port,()=> console.log(`Express server is running at port no :${port}`));  
  

app.get('/', function (req, res) {
    res.render('pages/index');
});
 
app.get("/:id", function(req,res){
    res.render(`pages/${req.params.id}`)
});

// for foooter newsletter
app.post('/subscribe',[
    check('email','please enter email properly')
       .exists()
       .isEmail()
       .normalizeEmail()
        .isLength({min: 3})

] ,function(req, res, next) {
    const errors=validationResult(req)
    var email=String(req.body.email);

    console.log(req.body.email);
    if(!errors.isEmpty()){
        //return res.status(422).jsonp(errors.array())
        const alert=errors.array();
        res.render('index',{
            alert
        })

    }
    
});


app.post('/submit',[
    check('name', 'Please enter valid username without space..')
        .exists()
        .isLength({ min: 3 })
        .isAlpha(),
    check('email', 'Please provide valid email')
        .isEmail()
        
        .normalizeEmail(),
           
    check(
            "passkey",
            " password must have  at least one  number and minumum length 5. ",
          )
      .isLength({ min: 5 })
      .matches(
        
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,20}$/,
              ),
 check('confirmpasskey', 'Passwords do not match').custom((value, {req}) => (value === req.body.passkey)),
            

],async(req,res)=>{
name=req.body.name;
email=req.body.email;

pass1=req.body.passkey;
pass2=req.body.confirmpasskey;
console.log(name+email+""+pass1+pass2)
const encryptkey = await bcrypt.hash(req.body.passkey, saltRounds)
const writeResult = await admin.firestore().collection('user').doc(email).set({
    name: name,
    password: encryptkey
    })
    .then(function() {console.log("Document successfully written!");
    var alert={msg:`Hurray!! '${name}' registered successfully`};
    res.render('pages/register',{
        alert:alert.msg
    })
    })
    .catch(function(error) {console.error("Error writing document: ", error);});



})







///////


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  
});

var db = admin.firestore();

async function getFirestore(){
    const firestore_con  = await admin.firestore();
    const writeResult = firestore_con.collection('sample').doc('sample_doc').get().then(doc => {
    if (!doc.exists) { console.log('No such document!'); }
    else {return doc.data();}})
    .catch(err => { console.log('Error getting document', err);});
    return writeResult
    }




 

    app.get('/index2',async (request,response) =>{
        console.log("inside async firestore")
        var db_result = await getFirestore();
        console.log(db_result)
        response.render('pages/index',{db_result});
        });


        async function insertFormData(request){
            const writeResult = await admin.firestore().collection('sample').add({
            name: request.body.email,
            password: request.body.passkey
            })
            .then(function() {console.log("Document successfully written!");})
            .catch(function(error) {console.error("Error writing document: ", error);});
            }


        app.post('/login',async (request,response) =>{
            var insert = await insertFormData(request);
            var alert = await getFirestore();
            console.log(alert)
            //response.render('pages/login',{alert});
            response.sendStatus(200);
            });