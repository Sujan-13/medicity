const {Pool}=require("pg");
require("dotenv").config();


const pool = new Pool({
    host: "aws-0-ap-south-1.pooler.supabase.com",
    user:"postgres.fthuzrqtfxwlmvlyqopb",
    password: "hpSzorq7dzH6GRUc",
    database: "postgres",
    port:6543
  });

  // postgresql://postgres.fthuzrqtfxwlmvlyqopb:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

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
      //     await client.query(`
      //   DROP TABLE IF EXISTS Billing CASCADE;
      //   DROP TABLE IF EXISTS Appointment CASCADE;
      //   DROP TABLE IF EXISTS Doctor CASCADE;
      //   DROP TABLE IF EXISTS Patient CASCADE;
      //   DROP TABLE IF EXISTS users CASCADE;

      // `);

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


          //  await client.query(`
          //  INSERT INTO Doctor (DoctorID, FirstName, LastName, Specialization, Email, Phone)
          //       VALUES
          //       -- Neurology
          //       (307, 'Rajesh', 'Kumar', 'Neurology', 'rajesh.kumar@example.com', '9865432101'),
          //       (308, 'Suman', 'Lama', 'Neurology', 'suman.lama@example.com', '9867543210'),
          //       (309, 'Amit', 'Poudel', 'Neurology', 'amit.poudel@example.com', '9876543210'),
          //       (310, 'Nisha', 'Yadav', 'Neurology', 'nisha.yadav@example.com', '9854321098'),
          //       (311, 'Sanjay', 'Bhatta', 'Neurology', 'sanjay.bhatta@example.com', '9843210987'),

          //       -- Paediatrics
          //       (312, 'Anita', 'Karki', 'Paediatrics', 'anita.karki@example.com', '9801234567'),
          //       (313, 'Ravi', 'Tamang', 'Paediatrics', 'ravi.tamang@example.com', '9802345678'),
          //       (314, 'Nita', 'Giri', 'Paediatrics', 'nita.giri@example.com', '9812345678'),
          //       (315, 'Deepak', 'Panta', 'Paediatrics', 'deepak.panta@example.com', '9813456789'),
          //       (316, 'Priti', 'Rai', 'Paediatrics', 'priti.rai@example.com', '9823456789'),

          //       -- Cardiology
          //       (317, 'Kiran', 'Dahal', 'Cardiology', 'kiran.dahal@example.com', '9871234567'),
          //       (318, 'Anil', 'Gautam', 'Cardiology', 'anil.gautam@example.com', '9872345678'),
          //       (319, 'Sheetal', 'Jha', 'Cardiology', 'sheetal.jha@example.com', '9881234567'),
          //       (320, 'Binod', 'Basnet', 'Cardiology', 'binod.basnet@example.com', '9882345678'),
          //       (321, 'Maya', 'Kandel', 'Cardiology', 'maya.kandel@example.com', '9891234567'),

          //       -- Nephrology
          //       (322, 'Manoj', 'Joshi', 'Nephrology', 'manoj.joshi@example.com', '9767890123'),
          //       (323, 'Kavita', 'Acharya', 'Nephrology', 'kavita.acharya@example.com', '9768901234'),
          //       (324, 'Gopal', 'Sharma', 'Nephrology', 'gopal.sharma@example.com', '9778901234'),
          //       (325, 'Sita', 'Thakur', 'Nephrology', 'sita.thakur@example.com', '9779012345'),
          //       (326, 'Ramesh', 'Chhetri', 'Nephrology', 'ramesh.chhetri@example.com', '9780123456'),

          //       -- Dermatology
          //       (327, 'Suman', 'Bhandari', 'Dermatology', 'suman.bhandari@example.com', '9659876543'),
          //       (328, 'Gita', 'Gautam', 'Dermatology', 'gita.gautam@example.com', '9658765432'),
          //       (329, 'Rohit', 'Maharjan', 'Dermatology', 'rohit.maharjan@example.com', '9669876543'),
          //       (330, 'Asha', 'Bhattarai', 'Dermatology', 'asha.bhattarai@example.com', '9668765432'),
          //       (331, 'Raj', 'Rai', 'Dermatology', 'raj.rai@example.com', '9679876543'),

          //       -- Gastroenterology
          //       (332, 'Sunil', 'Thapa', 'Gastroenterology', 'sunil.thapa@example.com', '9878901234'),
          //       (333, 'Dipti', 'Sapkota', 'Gastroenterology', 'dipti.sapkota@example.com', '9879012345'),
          //       (334, 'Krishna', 'Khadka', 'Gastroenterology', 'krishna.khadka@example.com', '9880123456'),
          //       (335, 'Poonam', 'Pandey', 'Gastroenterology', 'poonam.pandey@example.com', '9881234567'),
          //       (336, 'Rajendra', 'Malla', 'Gastroenterology', 'rajendra.malla@example.com', '9892345678');
          //       `);


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