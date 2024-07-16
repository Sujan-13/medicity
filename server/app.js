const express = require("express");
const bodyParser=require("body-parser");
const cors=require("cors")
const {Pool}=require("pg");                     
const passport=require("passport");
const LocalStrategy=require("passport-local");
const bcrypt=require("bcrypt");
const session=require("express-session");
const crypto=require("crypto");
const {pool ,initialDb}=require("./db")
require("dotenv").config();

const PORT=process.env.PORT || 3001;

const secretKey=crypto.randomBytes(64).toString("hex");

const app=express();

initialDb();

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));


app.use(bodyParser.json());


app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

passport.use(new LocalStrategy({
  usernameField:"email"
},async function verify(email,password,cb){
  console.log("Authenticating",email);
  const selectQuery=`SELECT Email,passwoRd FROM users WHERE email=$1`;
  try {
  const result=await pool.query(selectQuery,[email]);
  const user=result.rows[0];
  console.log(user);
  if(result.rows.length===0){
    console.log("No user found");
    return cb(null,false,{message:"Incorrect Username!"});}
    try {
          const match =await bcrypt.compare(password, user.password);
          if(!match){
          return cb(null,false,{message:"Incorrect Password"});}

        return cb(null,user);
      }
      catch (error) {
          console.error('Error',error);
          return cb(error);
        }
  } catch (error) {
    console.error('Error',error);
    return cb(error);
  }}
));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.email, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


  
app.post("/api/signup",async (req,res)=>{
    usrInp=req.body;
    let name=usrInp.username;
    let email=usrInp.email;
    let password=await bcrypt.hash(usrInp.password,10);
    const insertQuery=`
    INSERT INTO users VALUES
    ($1::text,$2::text,$3::text);
    `;

    try {
      const client=await pool.connect();
      console.log("Connection Success");
        try {
          const query=await client.query(insertQuery,[email,password,name]);
          console.log("Query Success",query);
          const user={
            id:usrInp.email,
            username:usrInp.email
          };
          console.log(user.id);
          req.logIn(user,(err)=>{
            if (err) {
            console.log(err);  
            res.status(500).send(err);           
            }
            else{
              res.status(200).send({"authenticated":true});           
            }
          })
          // res.json({message:"Query Success!"});
          client.release();
          // pool.end();

        } catch (error) {
          console.error("Query Error",error);
           res.send(error);
        }
    } catch (error) {
      console.error("Connection Error",error);
       res.send("Connection Error",error);
    }

   
});

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }
    if (!user) {
      console.error('Authentication failed:', info.message);
      return res.redirect('/failure');
    }
    req.logIn(user, (err) => {
      console.log(user);
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      return res.redirect('/success');
    });
  })(req, res, next);
});

app.get("/success",(req,res)=>{
  res.send({"authenticated":true});           

})

app.get("/failure",(req,res)=>{
  res.send({"authenticated":false});           
})

app.get("/api/check-session",(req,res)=>{
  console.log("checking");
  if (req.isAuthenticated()) {
    res.send({"authenticated":true});           
  }
  else{
    res.send({"authenticated":false});           
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err });
});

app.listen(PORT,()=>{
    console.log("Server started on "+PORT);
});