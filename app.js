var admin = require("firebase-admin");
const functions = require('firebase-functions');
var serviceAccount = require("./serviceAccountKey.json");
//////////////////////////////////////////
const express = require('express');  
const port = process.env.PORT || 4000;
const path=require('path');
const bodyParser= require('body-parser');
const {check, validationResult}=require('express-validator');
const { Console } = require('console');
const ejs = require('ejs');


// for encryption
const bcrypt = require('bcrypt');
const jwt= require("jsonwebtoken");

const { verify } = require("crypto");
const saltRounds = 10;

var app = express();  
const dotenv = require('dotenv');
// get config vars
dotenv.config();
process.env.TOKEN_SECRET;


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
app.get('/register', function (req, res) {
    res.render('pages/register');
});
app.get('/login', function (req, res) {
    res.render('pages/login');
});
app.get("/:id",authenticateToken, function(req,res){
   
   res.render(`pages/${req.params.id}`)
    
});
//
function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }

  function authenticateToken(req, res, next) {
      
    const authHeader = req.headers.cookie;
    const token = authHeader && authHeader.split(' ')[1]
    const finaltoken=token && token.split('=')[1]
    if (token == null) {
        res.render('pages/login',{
            alert:'Unauthorized access, Log in First'
        })
        
        }
        else{
            jwt.verify(finaltoken, process.env.TOKEN_SECRET, (err, user) => {
           
        
            if (err) return res.sendStatus(403)
        
            // req.user = user
        
            next()
            })
        }
  }

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

var name=''

app.post('/registration',[
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
app.post('/logging', function(req,res,next){
    const email=String(req.body.email)
    const password=String(req.body.passkey)
    const firestore_con  =  admin.firestore();
    const writeResult = firestore_con.collection('user').doc(req.body.email).get()
    .then(doc => {
        if (!doc.exists) // entered email user doesnt registered
        { 
            console.log('No such document!');
           
            res.render('pages/login', {
                alert:' Invalid Crudentials..'
            })

        }
        else { // block for password matching and others
             
              db_pass=doc.data().password;
              
             bcrypt.compare(password, db_pass, function(err, result) {
                if (!result) 
                {// password mismatch

                    console.log('password not matched')
                    res.render('pages/login', {
                          alert:'crudentials not matched..'
                      })
   
                } // end of password mismatch
                else
                { // password matched 
                   
                    console.log("password matched");
                    const user={
                        id:'amit',
                        username:name,
                        email:email
                    }
                     const token = generateAccessToken(user);
                     console.log("token is created")
                     res.cookie("jwt_authentication",token,{
                         expires: new Date(Date.now() + 10000),
                         httpOnly:true
                     }); 
                    
                    res.render('pages/login',{
                        alert:`${name} logged in succesfully!!`
                    })
                    
                           ////////////////////////     
                }// end of password matched

            });

        }// end of else block for password matching 
        
    }) // end of then

    .catch(err => {
         console.log('Error getting document', err);
         const errors=[
            {msg:'Failed! '+err}
        ]
        const alert = errors
        res.render('pages/login', {
               alert
           })
     }); // end of catch
    
});





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


        app.post('/',async (request,response) =>{
            var insert = await insertFormData(request);
            var alert = await getFirestore();
            console.log(alert)
            //response.render('pages/login',{alert});
            response.sendStatus(200);
            });