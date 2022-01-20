var firebase = require("firebase-admin");
const functions = require('firebase-functions');
var serviceAccount = require("./serviceAccountKey.json");
 
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
  
// CRUD Methods  

  

//      for registration table

app.get('/', function (req, res) {
    res.render('pages/index');
});
 

app.get("/index", function(req,res){
    res.render('pages/index')
});

app.get("/register", function(req,res){
    res.render('pages/register')
});
app.get("/about", function(req,res){
    res.render('pages/about')
});
app.get("/services", function(req,res){
    res.render('pages/services')
});
app.get("/login", function(req,res){
    res.render('pages/login')
});
app.get("/team",function(req,res){
    res.render('pages/team')
})
app.get("/ebook",function(req,res){
    res.render('pages/ebook')
})
app.get("/programs",function(req,res){
    res.render('pages/programs')
})
app.get("/program",function(req,res){
    res.render('pages/programs')
})
app.get("/program1",function(req,res){
    res.render('pages/program1')
})
app.get("/program2",function(req,res){
    res.render('pages/program2')
})
app.get("/program3",function(req,res){
    res.render('pages/program3')
})
app.get("/program4",function(req,res){
    res.render('pages/program4')
})
app.get("/program5",function(req,res){
    res.render('pages/program5')
})

app.get("/program6",function(req,res){
    res.render('pages/program6')
})
app.get("/program7",function(req,res){
    res.render('pages/program7')
})
app.get("/program8",function(req,res){
    res.render('pages/program8')
})
app.get("/program9",function(req,res){
    res.render('pages/program9')
})
app.get("/program10",function(req,res){
    res.render('pages/program10')
})
app.get("/program11",function(req,res){
    res.render('pages/program11')
})
app.get("/program12",function(req,res){
    res.render('pages/program12')
})
app.get("/program13",function(req,res){
    res.render('pages/program13')
})
app.get("/install1",function(req,res){
    res.render('pages/install1')
})
app.get("/install2",function(req,res){
    res.render('pages/install2')
})

app.get("/contact",function(req,res){
    res.render('pages/contact')
})
app.get("/8051material1",function(req,res){
    res.render('pages/8051material1')
})
app.get("/8051material2",function(req,res){
    res.render('pages/8051material2')
})
app.get("/8051material3",function(req,res){
    res.render('pages/8051material3')
})
app.get("/8051material4",function(req,res){
    res.render('pages/8051material4')
})
app.get("/8051material5",function(req,res){
    res.render('pages/8051material5')
})

app.get("/firstpage",function(req,res){
    res.render('pages/firstpage')
})

// app.get("/program/:id",function(){
//     var path=pages/program
//     res.render('pages/program'+req.params.id)
// })

app.get("/compiler",function(req,res)
{
    res.render('pages/compiler')
})








// working fine



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








///////


firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
  
});

var db = firebase.firestore();

async function getFirestore(){
    const firestore_con  = await firebase.firestore();
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
            const writeResult = await firebase.firestore().collection('sample').add({
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