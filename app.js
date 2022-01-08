var firebase = require("firebase-admin");
const functions = require('firebase-functions');
var serviceAccount = require("./serviceAccountKey.json");
 
 ////
const mysql = require('mysql');  
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

// Connection String to Database  
var mysqlConnection = mysql.createConnection({  
    host: 'localhost',  
    user : 'root',  
    password : '7051251928',   
    database : 'appdev',  
    multipleStatements : true  
});  
  



// To check whether the connection is succeed for Failed while running the project in console.  
mysqlConnection.connect((err) => {  
    if(!err) {  
        console.log("Db Connection Succeed");  
    }  
    else{  
        console.log("Db connect Failed \n Error :" + JSON.stringify(err,undefined,2));  
    }  
});  
  

// To Run the server with Port Number  
app.listen(port,()=> console.log(`Express server is running at port no :${port}`));  
  
// CRUD Methods  

  

//      for registration table

app.get('/', function (req, res) {
    res.render('pages/index');
});
 // get registered details 
 app.get('/registration',(req,res)=>{
    mysqlConnection.query('select * from Registration',(err,rows,fields)=>{
        if(!err)
        res.send(rows);
        else 
        console.log(err);
    })
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



  // delete the registration data based on  email
// app.get('/:id',(req,res)=>{
//     // mysqlConnection.query('delete from Registration where email_id=?',[req.params.id],(err,rows,fields)=>{
//     //     if(!err)
//     //     res.send("deletion successful where email_id=?",[req.params.id]);
//     //     else
//     //     console.log(err);
//     // })
//     res.render('pages/req.params.id');
//    });  




app.post('/submit', [
    check('name', 'Please enter valid username without space..')
        .exists()
        .isLength({ min: 3 })
        .isAlpha(),
    check('email', 'Please provide valid email')
        .isEmail()
        .normalizeEmail(),
    check('contact','please provide valid contact')    
           .isNumeric()
           .isLength(10),
    check(
            "passkey",
            "Please enter a password at least 6 character and contain At least one uppercase.At least one lower case.At least one special character. ",
          )
      .isLength({ min: 6 })
      .matches(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
              ),
 check('confirmpasskey', 'Passwords do not match').custom((value, {req}) => (value === req.body.passkey)),
            

], async(req, res)=> {
   
    const errors = validationResult(req)
   
    if(!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('pages/register', {
            alert
        })
    }

    else{// if no errors
        var email=String(req.body.email);
        var fullname=String(req.body.name);
       
        var  mobile = String(req.body.contact);
        var passkey=String(req.body.passkey)
        var confirmpasskey = String(req.body.confirmpasskey);
    
        console.log(req.body.name);
        console.log(req.body.email);
       
    
        const encryptkey = await bcrypt.hash(passkey, saltRounds)
        
        mysqlConnection.query("SELECT COUNT(*) AS cnt FROM Registration WHERE email_id = ? " , email , function(err , data)
        {
            
                if(err){
                    console.log(err);
                       }   
             else{
                    if(data[0].cnt > 0)
                    {  
                        // Already exist 
                        console.log("user already exist")
                        const errors=[
                             {msg:'Request Denied !! User Account already exists..'}
                         ]
                         const alert = errors
                         res.render('pages/register', {
                                alert
                            })
                            
                    }
                    else{
                        var sql = "INSERT INTO `Registration`(`email_id`,`fullName`,`mobileNumber`,`password`) VALUES ('"+email+"','"+fullname+"','"+mobile+"','"+encryptkey+"')";
                       mysqlConnection.query(sql, function(err, result) 
                            {
                            if(err) throw err;
                            console.log("values inserted succesfully using node");
                            const errors=[
                                {msg:'Horray !  Logged in successfully...'}
                            ]
                            const success = errors
                            res.render('pages/register', {
                                  success
                               })
                            })
                        
                            
                        }
              }
        })
    

     }
     
})




app.post('/login',async function(req,res,next){
    var email=String(req.body.email)
    const password=String(req.body.passkey)

    console.log(email)
    console.log(password)
    
    const encryptkey = await bcrypt.hash(password, saltRounds)   

    mysqlConnection.query("select count(*) as cnt from Registration where email_id=?",email,function(err,data){
if(err){
    console.log(err);

}else{
    if(data[0].cnt>0)
    {
        mysqlConnection.query("select password  from Registration where email_id=?",email,async (err,results)=>
     {
         
        console.log("db encrypted password" +results[0].password)
        const comparison = await bcrypt.compare(password, results[0].password)       
        if(err){
            console.log(err);
            res.render('pages/login')
        }
        else{
            if(!comparison)
            {
                 
                 console.log('password not matched')
                 const errors=[
                    {msg:'Failed! Invalid crudentials..'}
                ]
                const alert = errors
                res.render('pages/login', {
                       alert
                   })
            }
            else{
                var sql = "INSERT INTO `Sign_in`(`username`,`passkey`) VALUES ('"+email+"','"+password+"')";
                mysqlConnection.query(sql, function(err, result) 
                     {
                     if(err) throw err;
                     console.log("values inserted in sign in succesfully using node");
                     const errors=[
                         {msg:'Horray !  Logged in successfully...'}
                     ]
                     const success = errors
                     res.render('pages/login', {
                           success
                        })

                        // hidding sigin button
                        document.getElementById("profile").innerHTML="hi all";
                     })
                 
               }
            
        }
     })
    }
    else {
        console.log('no such username');
      
        const errors=[
            {msg:'Sorry !  Invalid crudentials..'}
        ]
        const alert = errors
        res.render('pages/login', {
               alert
           })
        }


    }
    })

    

});


// working fine

app.post('/feedback',  [
    check('name', 'Please enter valid username without space..')
        .exists()
        .isLength({ min: 3 })
        .isAlpha(),
    check('email', 'Please provide valid email !!')
        .isEmail()
        .normalizeEmail(),
    check('subject',' invalid subject !!')    
           .exists()
           ,
    check(
            "message",
            "Invalid message body!!"  )
      
       .isLength({min:10})


]
    , function(req, res) {
        const errors = validationResult(req)
   
    if(!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('pages/contact', {
            alert
        })
    }
    else
    {
        var mail=String(req.body.email);
        var fullname=String(req.body.name);
        var subject=String(req.body.subject)
        
        var message=String(req.body.message)
   
      
        mysqlConnection.query("SELECT COUNT(*) AS cnt FROM Sign_in WHERE username = ? " , mail , function(err , data)
        {
        
                if(err){
                    console.log(err);
                    const errors=[
                        {msg:'Failed! Error ..'}
                    ]
                    const alert = errors
                    res.render('pages/contact', {
                        alert
                    }) 
                    
                    }   
            else{
                    if(data[0].cnt >0)
                    {  
    
    
                        var sql = "INSERT INTO `feedback`(`name`,`email_id`,`subject`,`message`) VALUES ('"+fullname+"','"+mail+"','"+subject+"','"+message+"')";
                    mysqlConnection.query(sql, function(err, result) 
                            {
                            if(err){
                            
                            const errors=[
                                {msg:'Failed! Error ..'}
                            ]
                            const alert = errors
                            res.render('pages/contact', {
                                alert
                            }) 
                            throw err;
                            
                            }
                            else{
                            console.log("feedback inserted succesfully using node");
                            const errors=[
                                {msg:'Thankss!! feedback submitted succesfully'}
                            ]
                            const message = errors
                            res.render('pages/contact', {
                                message
                            }) 
                            }

                            })
                        
                        
                        }
                }  
         })   
            
        
    }
})

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

    
    
    
    mysqlConnection.query("SELECT COUNT(*) AS cnt FROM Registration WHERE email_id = ? " , email , function(err , data)
    {
       
            if(err){
                console.log(err);
                const errors=[
                    {msg:'Failed! Error ..'}
                ]
                const alert = errors
                res.render('pages/index', {
                       alert
                   }) 
                
                   }   
         else{
                if(data[0].cnt <0)
                {  
                    //  username is not registered, so enter its email 
                    console.log("user doesnt  exist")
                    const errors=[
                        {msg:'Failed! Login first..'}
                    ]
                    const alert = errors
                    res.render('pages/index', {
                           alert
                       }) 
                    
                }
                else{
                        // checking for already subscribed users
                    mysqlConnection.query("SELECT COUNT(*) AS count FROM subscribe WHERE email = ? " , email , function(err , data)
                    {
                        if(err)
                        {
                            console.log(err);
                            const errors=[
                                {msg:'Failed! Error ..'}
                            ]
                            const alert = errors
                            res.render('pages/index', {
                                   alert
                               }) 
                            
                         }  
                        else{
                                if(data[0].count >0)
                                {  
                                    //  username is already subscribed, so dont enter its email 
                                    console.log("user already subscribed  ")
                                    const errors=[
                                        {msg:'Failed! already Subscribed..'}
                                    ]
                                    const alert = errors
                                    res.render('pages/index', {
                                           alert
                                       }) 
                                    
                                }
                                else{
                                    var sql = "INSERT INTO `subscribe`(`email`) VALUES ('"+email+"')";
                                    mysqlConnection.query(sql, function(err, result) 
                                         {
                                         if(err) throw err;
                                         else {
                                        const errors=[
                                            {msg:'Horray !  Subscribed successfully...'}
                                        ]
                                        const alert = errors
                                        res.render('pages/login', {
                                            alert
                                            })
                                         }
                                        
                                         })
                                   }
                             }

                    })
                    
                    
                    res.render('pages/index')
                }
            
          }
    })

    
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
            firstname: request.body.firstname,
            lastname: request.body.lastname
            })
            .then(function() {console.log("Document successfully written!");})
            .catch(function(error) {console.error("Error writing document: ", error);});
            }


        app.post('/insert_data',async (request,response) =>{
            var insert = await insertFormData(request);
            response.sendStatus(200);
            });