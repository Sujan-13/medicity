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
    INSERT INTO users(email,password,usertype) VALUES
    ($1::text,$2::text,$3::text);
    `;

    const patientInsertQuery=`
    INSERT INTO Patient(FirstName,LastName,DOB,gender,address,phone,email) VALUES
    ($1,$2,$3,$4,$5,$6,$7);
    `;

    try {
      const client=await pool.connect();
      console.log("Connection Success");
        try {
          await client.query('BEGIN');
          const query=await client.query(userinsertQuery,[email,password,"patient"]);
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
  res.send({"authenticated":true,"usertype":req.body.usertype});           

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

app.get("/api/check-usertype",async (req,res)=>{
  const user=req.user;
  try {
    const client=await pool.connect();
    console.log("Connection Success");
      try {
        const response=await client.query(`
        SELECT usertype FROM Users
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

app.get("/api/doctorprofile-fetch-data",async (req,res)=>{
  const user=req.user;
  try {
    const client=await pool.connect();
    console.log("Connection Success");
      try {
        const response=await client.query(`
        SELECT firstname,lastname,specialization,phone,email FROM Doctor
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

app.get("/api/alldoctor-fetch-data",async (req,res)=>{
  try {
    const client=await pool.connect();
    console.log("Connection Success alldopc fetch");
      try {
        const response=await client.query(`
        SELECT doctorid,firstname,lastname,specialization,phone,email,salary FROM Doctor
        `);
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

app.get("/api/allpatient-fetch-data",async (req,res)=>{
  try {
    const client=await pool.connect();
    console.log("Connection Success allpatient-fetch");
      try {
        const response=await client.query(`
        SELECT patientid,firstname,lastname,TO_CHAR(dob, 'YYYY-MM-DD') AS dob,phone,email,address FROM Patient
        `);
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

app.get("/api/doctorappointment-fetch-data",async (req,res)=>{
  const user=req.user;
  try {
    const client=await pool.connect();
    console.log("Connection Success");
      try {
        const response=await client.query(`
        SELECT firstname,lastname,TO_CHAR(appointmentdate, 'YYYY-MM-DD') AS appointmentdate, Appointment.AppointmentID FROM appointment
        INNER JOIN patient
        ON Appointment.patientid=Patient.patientid
        INNER JOIN Billing
        ON Billing.AppointmentID=Appointment.AppointmentID
        WHERE doctorid=(
          SELECT doctorid FROM doctor
          WHERE email=$1) AND BillingStatus=$2
          ;
        `,[(user.username)||(user.id),'true']);
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

app.get("/api/bill-fetch-data",async (req,res)=>{
  const user=req.user;
  try {
    const client=await pool.connect();
    console.log("Connection Success");
      try {
        const response=await client.query(`
        SELECT firstname,lastname,TO_CHAR(appointmentdate, 'YYYY-MM-DD') AS appointmentdate,specialization,amount,billingstatus,billingid FROM appointment
        INNER JOIN Doctor
        ON Appointment.doctorid=Doctor.doctorid
        INNER JOIN Billing
        ON Appointment.AppointmentID=Billing.AppointmentID
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

app.post("/api/bill-update",async (req,res)=>{
  const id=req.body;
  console.log(id.billingid);
  try {
    const client=await pool.connect();
    console.log("Connection Success");
      try {
        const response=await client.query(`
        UPDATE Billing
        SET billingstatus='true'
        WHERE billingid=$1
        ;
        `,[(id.billingid)]);
        res.send({done:true});
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

app.post("/api/update-doctor",async (req,res)=>{
  const usrInp=req.body;
  const {doctorid,email,phone,salary}=usrInp;
  try {
    const client=await pool.connect();
    console.log("Connection Success update-dioctor");
      try {
        await client.query('BEGIN');
       
        const nextRespnse= await client.query(`
        UPDATE users
        SET email=$1
        WHERE email=(SELECT email FROM doctor
          WHERE doctorid=$2
        );
        `,[email,doctorid]);
        const response=await client.query(`
        UPDATE Doctor
        SET salary=$1,email=$2,phone=$3
        WHERE doctorid=$4
        ;
        `,[salary,email,phone,doctorid]);
        await client.query('COMMIT');
        console.log("Transaction committed successfully!");
        res.send({done:true});
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
})

app.post("/api/update-patient",async (req,res)=>{
  const usrInp=req.body;
  const {patientid,email,phone,address}=usrInp;
  try {
    const client=await pool.connect();
    console.log("Connection Success uopd pat");
      try {
        await client.query('BEGIN');
       
        const nextRespnse= await client.query(`
        UPDATE users
        SET email=$1
        WHERE email=(SELECT email FROM Patient
          WHERE patientid=$2
        );
        `,[email,patientid]);
        const response=await client.query(`
        UPDATE Patient
        SET address=$1,email=$2,phone=$3
        WHERE patientid=$4
        ;
        `,[address,email,phone,patientid]);
        await client.query('COMMIT');
        console.log("Transaction committed successfully!");
        res.send({done:true});
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
})


app.post("/api/delete-doctor",async (req,res)=>{
  const usrInp=req.body;
  const delDoctorid=usrInp.doctorid;
  console.log(usrInp);
  console.log("here");
  try {
    const client=await pool.connect();
    console.log("Connection Success del doc");
      try {
        await client.query('BEGIN');
       
        const nextRespnse= await client.query(`
        DELETE FROM users
        WHERE email=(SELECT email FROM doctor
          WHERE doctorid=$1
        );
        `,[delDoctorid]);
        console.log(nextRespnse);
        const response=await client.query(`
        DELETE FROM Doctor
        WHERE doctorid=$1
        ;
        `,[delDoctorid]);
        console.log(response);
        await client.query('COMMIT');
        console.log("Transaction committed successfully!");
        res.send({done:true});
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
})


app.post("/api/delete-patient",async (req,res)=>{
  const usrInp=req.body;
  const delPatientid=usrInp.patientid;
  console.log(usrInp.patientid);
  console.log("here");
  try {
    const client=await pool.connect();
    console.log("Connection Success delpat");
      try {
        await client.query('BEGIN');
       
        const nextRespnse= await client.query(`
        DELETE FROM users
        WHERE email=(SELECT email FROM Patient
          WHERE patientid=$1
        );
        `,[delPatientid]);
        console.log(nextRespnse);
        const response=await client.query(`
        DELETE FROM Patient
        WHERE patientid=$1
        ;
        `,[delPatientid]);
        console.log(response);
        await client.query('COMMIT');
        console.log("Transaction committed successfully!");
        res.send({done:true});
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
})

app.post("/api/appointment-delete",async (req,res)=>{
  const id=req.body;
  console.log(id.appointmentid);
  try {
    const client=await pool.connect();
    console.log("Connection Success");
      try {
        const response=await client.query(`
        DELETE FROM Appointment
        WHERE appointmentid=$1
        ;
        `,[(id.appointmentid)]);
        res.send({done:true});
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

app.get("/api/book-fetch-specialization",async (req,res)=>{
  const user=req.user;
  try {
    const client=await pool.connect();
    console.log("Connection Success");
      try {
        const response=await client.query(`
        SELECT DISTINCT specialization FROM Doctor
        `);
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

app.post("/api/book-fetch-doctor",async (req,res)=>{
  const user=req.user;
  console.log(req.body);
  console.log(req.body.specialization);
  console.log("HERE");
  try {
    const client=await pool.connect();
    console.log("Connection Success");
      try {
        const response=await client.query(`
        SELECT doctorID,firstname,lastname,specialization FROM Doctor
        WHERE specialization=$1
        `,[req.body.specialization]);
        const result=response.rows;
        console.log(result);
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

app.post("/api/post-appointment",async (req,res)=>{
    usrInp=req.body;
    getuser=req.user;
    console.log(usrInp);
    const {doctorid,appointmentdate}=usrInp;
    const user=(getuser.username)||(getuser.id);
    const getpatientid=`
    SELECT patientid FROM patient
    WHERE email=$1;
    `;

    const insertappointmentquery=`
    INSERT INTO Appointment(doctorid,patientid,appointmentdate) VALUES
    ($1,$2,$3);
    `

    try {
      const client=await pool.connect();
      console.log("Connection Success");
        try {
          await client.query('BEGIN');
          const response=await client.query(getpatientid,[user]);
          console.log(response.rows[0]);
          const patientid=response.rows[0].patientid;
          const secondquery=await client.query(insertappointmentquery,[doctorid,patientid,appointmentdate]);
          console.log("Query Success");
          await client.query('COMMIT');
          console.log("Transaction committed successfully!");
              res.status(200).send({"done":true});           
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