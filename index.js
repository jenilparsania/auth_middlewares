const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ramdomharkiratilovekiara"
const app = express();
app.use(express.json());

const users = [];

app.post("/signup", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    })    

    res.json({
        message: "You are signed up"
    })

    console.log(users)
    
})

app.post("/signin", function(req, res) {
    
    const username = req.body.username;
    const password = req.body.password;

    // maps and filter
    let foundUser = null;

    for (let i = 0; i<users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
            foundUser = users[i]
        }
    }

    if (foundUser) {
        const token = jwt.sign({
            username: username,
            password: password,
            
        }, JWT_SECRET) ;

        // foundUser.token = token;
        res.json({
            token: token
        })
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
    console.log(users)
});



function logger(req,res,next){
    console.log(`${req.method} request came`);
    next();
    
}
function auth(req,res,next){
    const token = req.headers.token;

    const decodedData = jwt.verify(token,JWT_SECRET);

    if(!decodedData.username){
        req.username = decodedData.username;
        next();
    }else {
        res.json({
            message:"You are not logged in"
        });
    }

    //  also our auth middleware should pass the username to all next functions after auth middleware
}

app.get("/me",auth, function(req, res) {
  
    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == req.username)  {
            foundUser = users[i]
        }
    }

    if (foundUser) {
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    } else {
        res.json({
            message: "token invalid"
        })
    }


});

// whenever someone hits the endpoint localhost:3000, return the index.html file
app.get("/",function(req,res){
    res.sendFile(__dirname+"/public/index.html");
});


app.listen(3000);// that the http server is listening on port 3000
//  now the difference is between index.js and harkirat.js 
