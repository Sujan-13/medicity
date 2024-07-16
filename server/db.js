const {Pool}=require("pg");
require("dotenv").config();


const pool = new Pool({
    host: "aws-0-ap-south-1.pooler.supabase.com",
    user:"postgres.fthuzrqtfxwlmvlyqopb",
    password: "hpSzorq7dzH6GRUc",
    database: "postgres",
    port:6543
  });

  // const pool = new Pool({
  //   host: "localhost",
  //   user:"postgres",
  //   password: 9900,
  //   database: "medicity",
  //   port:5432
  // });
  

async function initialDb(){

    try {
        const client = await pool.connect();
        console.log("Connection Success!");
        try {
          await client.query('BEGIN');
          await client.query(`
          DROP TABLE Doctor,Appointment,Billing;
          `)
          
          await client.query(`
          CREATE TABLE IF NOT EXISTS Doctor(
            DoctorID SERIAL PRIMARY KEY UNIQUE,
            FirstName VARCHAR(255),
            LastName VARCHAR(255),
            Specialization VARCHAR(255),
            Email VARCHAR(255),
            Salary INT,
            Phone TEXT
        );        
          `);
    
          await client.query(`
          CREATE TABLE IF NOT EXISTS Patient(
            PatientID SERIAL PRIMARY KEY,
            FirstName VARCHAR(255),
            LastName VARCHAR(255),
            DOB DATE,
            Gender VARCHAR(255),
            Address VARCHAR(255),
            Phone TEXT,
            Email VARCHAR(255)
        );        
          `);
    
          await client.query(`
          CREATE TABLE IF NOT EXISTS Appointment(
            AppointmentID SERIAL PRIMARY KEY,
            AppointmentDate DATE,
            AppointmentTime TIME,
            Reason TEXT,
            DoctorID INT,
            PatientID INT,
            FOREIGN KEY(DoctorID) REFERENCES Doctor(DoctorID) ON DELETE CASCADE,
            FOREIGN KEY(PatientID) REFERENCES Patient(PatientID) ON DELETE CASCADE
        );        
          `);
    
          await client.query(`
          CREATE TABLE IF NOT EXISTS Billing(
            BillingID SERIAL PRIMARY KEY,
            Amount INT,
            BillingStatus VARCHAR(255),
            PaymentMethod VARCHAR(255),
            Comment TEXT,
            AppointmentID INT,
            FOREIGN KEY(AppointmentID) REFERENCES Appointment(AppointmentID) ON DELETE CASCADE
        );
          `);
    
          await client.query(`
          INSERT INTO Doctor(DoctorID,FirstName,LastName,Specialization,Email,Phone)
          VALUES(301,'Umesh','Jha','Neurology','jhaumesh@gmail.com','9864380976'),
          (302,'Rakshya','Manandhar','Paediatrics','rakumanandhar@yahoo.com','9807853651'),
          (303,'Samarpan','Subedi','Cardiology','samar678@gmail.com','9876532109'),
          (304,'Randip','Shrestha','Nephrology','shresthrandip@gmail.com','9765937641'),
          (305,'Ishita','Adhikari','Dermatology','ishaadh@gmail.com','9653289647'),
          (306,'Ishan','Thapa','Gastroenterology','thapaishan@gmail.com','9875498764');
          `);

          await client.query(`
          CREATE TABLE IF NOT EXISTS users(
            email TEXT PRIMARY KEY,
            password TEXT
          );
          `)
                      // table_id INT DEFAULT 0 CHECK(table_id<2 AND table_id >=0) 


          await client.query('COMMIT');
          console.log("Transaction committed successfully!");
        } catch (error) {
          await client.query('ROLLBACK');
          console.log("Transaction not committed due to errors: " + error);
        } finally {
          client.release();
        }
      } catch (error) {
        console.error("Connection error: " + error);
      }
}

module.exports={pool,initialDb};