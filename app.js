
const dotenv=require('dotenv');
dotenv.config();
const express=require('express');
var users = require("./users.js"); 
const graphqlHTTP=require('express-graphql');
const schema=require('./schema/schema');
const app=express();
var jwt = require("jwt-simple");
var bodyParser = require("body-parser");  

require('./passport');
var UserModel=require('./Data Modal/User')
var auth = require("./auth.js")(); 
var cfg = require("./config.js"); 
app.use(bodyParser.json());
app.use(auth.initialize());

const interface={
    message:"",
    version:0.1
};
app.get("/user", auth.authenticate(), function(req, res) {  
    // res.json(users[req.user.id]);
    interface.message="you now in secure route"
    res.status(200).json(interface)
});

app.use('/graphql', auth.authenticate(),graphqlHTTP({
    schema,
    graphiql:true
}));

app.post("/token", function(req, res) {  
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        var obj;
        console.log( email)
    //   var user= UserModel.findOne({	"email" : "probodh@mail.com"}) .then((doc) => {
    //     if (doc) {
    //       console.log(doc);
    //     } else {
    //       console.log("no data exist for this email");
    //     }
    //  })
    // .catch((err) => {
    //   console.log(err);
    //  });
    //  UserModel.find({}).then((data)=>{
    //      console.log(data)
    //  })
    
     
    //   res.json(interface)

        // })
        var user = users.find(function(u) {
            return u.email === email && u.password === password;
        });
        if (user) {
            var payload = {
                id: user.id
            };
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.status(201).json({
                token: token
            });

       } else {
           interface.message="jwt token not given proerly"
            res.sendStatus(401).json(interface);
        }
    } 
    else {
        interface.message="email id and password not the the body"
        res.sendStatus(401).json;
    }
});

const PORT=process.env.PORT || 5000;

app.get('/',(req,res,next)=>{
    interface.message="welcome to express <<satej>>>"
    res.status(200).json(interface)
})

app.listen(PORT,(err)=>{
    if(err) console.log(err);
    else{
        console.log("server running on 5000")
    }
})