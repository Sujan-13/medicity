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
    console.log(usrInp);
    const{firstname,lastname,dob,gender,address,phone,email}=usrInp;
    const password=await bcrypt.hash(usrInp.password,10);
    const userinsertQuery=`
    INSERT INTO users VALUES
    ($1::text,$2::text);
    `;

    const patientInsertQuery=`
    INSERT INTO Patient(FirstName,LastName,DOB,gender,address,phone,email) VALUES
    ($1,$2,$3,$4,$5,$6,$7);
    `

    try {
      const client=await pool.connect();
      console.log("Connection Success");
        try {
          await client.query('BEGIN');
          const query=await client.query(userinsertQuery,[email,password]);
          console.log("Query Success");
          const secondquery=await client.query(patientInsertQuery,[firstname,lastname,dob,gender,address,phone,email]);
          console.log("Query Success");
          await client.query('COMMIT');
          console.log("Transaction committed successfully!");
          const user={
            id:usrInp.email,
            username:usrInp.email
          };
          req.logIn(user,(err)=>{
            if (err) {
            console.log(err);  
            res.status(500).send(err);           
            }
            else{
              res.status(200).send({"authenticated":true});           
            }
          })
        } catch (error) {
          await client.query('ROLLBACK');
          console.log("Transaction not committed due to errors: " + error);
          res.send(error);
        } finally {
          client.release();
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

app.get("/api/profile-fetch-data",async (req,res)=>{
  const user=req.user;
  console.log(user);
  try {
    const client=await pool.connect();
    console.log("Connection Success");
      try {
        const response=await client.query(`
        SELECT firstname,lastname,TO_CHAR(dob, 'YYYY-MM-DD') AS dob,gender,address,phone,email FROM patient
        WHERE email=$1;
        `,[(user.username)||(user.id)]);
        const result=response.rows[0];
        res.send(result);
      } catch (error) {
        console.log("Transaction not committed due to errors: " + error);
      } finally {
        client.release();
      }
  } catch (error) {
    console.error("Connection Error",error);
     res.send("Connection Error",error);
  }
})

app.get("/api/appointment-fetch-data",async (req,res)=>{
  const user=req.user;
  try {
    const client=await pool.connect();
    console.log("Connection Success");
      try {
        const response=await client.query(`
        SELECT firstname,lastname,TO_CHAR(appointmentdate, 'YYYY-MM-DD') AS appointmentdate,specialization FROM appointment
        INNER JOIN Doctor
        ON Appointment.doctorid=Doctor.doctorid
        WHERE patientid=(
          SELECT patientid FROM Patient
          WHERE email=$1
        );
        `,[(user.username)||(user.id)]);
        const result=response.rows;
        res.send(result);
      } catch (error) {
        console.log("Transaction not committed due to errors: " + error);
      } finally {
        client.release();
      }
  } catch (error) {
    console.error("Connection Error",error);
     res.send("Connection Error",error);
  }
})

app.get("/api/logout",(req,res)=>{
    req.logOut((err)=>{
      if(err){
        res.json(err);
      }
      res.json({"done":true});
    });
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err });
});

app.listen(PORT,()=>{
    console.log("Server started on "+PORT);
});