const {Pool}=require("pg");
require("dotenv").config();


const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password:process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port:6543
  });



async function initialDb(){

    try {
        const client = await pool.connect();
        console.log("Connection Success!");
        try {
          await client.query('BEGIN');

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
          CREATE TABLE IF NOT EXISTS users(
            email TEXT PRIMARY KEY,
            password TEXT,
            usertype TEXT
          );
          `)

          await client.query(`
          CREATE OR REPLACE FUNCTION insertbill()
          RETURNS TRIGGER AS $$
          BEGIN
          INSERT INTO Billing(Amount,BillingStatus,AppointmentID) VALUES
          (500,'false',NEW.AppointmentID);
          RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
          `)

          await client.query(`
          CREATE OR REPLACE TRIGGER insertBills
          AFTER INSERT ON Appointment
          FOR EACH ROW
          EXECUTE FUNCTION insertbill();
          `)

          await client.query(`
          CREATE OR REPLACE FUNCTION insertIntoUsers()
          RETURNS TRIGGER AS $$
          BEGIN
          INSERT INTO Users(email,password,usertype) VALUES
          (NEW.Email,'$2b$10$eAEDUkty6.J4N2ftbt07AuJ1SF2ecrGjY5XDv8yz49jLtBmtOdP3S','doctor');
          RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
          `)

          await client.query(`
          CREATE OR REPLACE TRIGGER insertUsers
          BEFORE INSERT ON Doctor
          FOR EACH ROW
          EXECUTE FUNCTION insertIntoUsers();
          `)

          await client.query(`
          CREATE TABLE IF NOT EXISTS session (
            sid VARCHAR PRIMARY KEY,
            sess JSON NOT NULL,
            expire TIMESTAMP NOT NULL
          );
          `);

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