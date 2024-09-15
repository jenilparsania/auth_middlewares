const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "randomharikirat";
const app = express();

// for POST requests
app.use(express.json());

let users = []

app.post("/signup",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username:username,
        password:password
    });

    res.json({
        message:"You are signed up"
    });

    console.log(users);
    
});


app.post("/signin",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    for(let i = 0;i < users.length;i++){
        if(users[i].username==username && users[i].password==password){
            foundUser = users[i];
        };
    };

    if (foundUser){
        // const token = jwt.sign({
        //     username:username
        //     // password:password,
        //     // firstname,
        //     // lastname,
        //     // courses : []
        // },JWT_SECRET);

        const token = jwt.sign({
            username:username
        },JWT_SECRET);

        res.json({
            token:token
        });


    }else{
        res.status(400).send({
            message:"Invalid username or password"
        });
    }

    console.log(users);
    

});

app.get("/me",function(req,res){
    const token = req.headers.token // jwt
    // const token = req.header.token // jwt
    // header was only the issue here  
    
        
    const decodedInformation = jwt.verify(token,JWT_SECRET);
    

    const unAuthDecodedInfo = jwt.decode(token);

    // const username = decodedInformation.username;


    if(!token){
        res.status(400).send({
            message:"No token provided"
        })
    }

    if(decodedInformation.username){

        let foundUser = null;
    
        for(let i = 0; i < users.length;i++){
            if(users[i].username==username){
                foundUser = users[i]
            }
        }
    
        if (foundUser){
            res.json({
                username:foundUser.username,
                password : foundUser.password
            });
        }else{
            res.json({
                message:"token invalid"
            });
        };
    }
});

app.listen(3000)