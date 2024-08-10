![Logo](https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTOIsLtdQPu_wKkuK2cptqnjlgvV1kKeWLF7Ki6HKvqTpZVglh-)


# Project Title

Medicity Hospital project represents a basic overview of a hospital management system.
## Acknowledgements

We would like to convey our sincere gratitude towards Department of Electronics and
Computer Engineering, Thapathali Campus for giving us this opportunity to learn and
carry our insight in the form of minor venture. We are additionaly grateful to our
Supervisor Er. Rajad Shakya for his encouragement and guidance for our project.

Dipesh Chaudhary (THA078BEI012)

Subrat Dhital (THA078BEI043)

Sujan Gupta (THA078BEI045)



## Features

- User authentication and authorization
- Management of billing and appointment records
- Management of Patient and Doctor Profiles




## Tech Stack

**Client:** React

**Server:** Node, Express

**Database**: Pg



## Demo

https://medicity.onrender.com/

NOTE: On render it may take upto 50s for site to load.


## Usage/Examples

```javascript
---Patient---
1.Sign up or log in to access the dashboard.

2.Use the navigation menu to access different 
sections like Appointments or Billings.


---Doctor---
1.Get any doctor's email through api. Usually doctor data is hardcoded by the hospital. 

2. You can insert new doctors via db.js. You can also add more via admin dashboard

3. Login via email with password "1@aA2345"

4. Check Up on your Appointments

5. Only Appointments which have been paid through billings show up.


---Admin---
1. login via admin@admin and password as "1@aA2345"

2. You can view all Doctors and Patients from admin dashboard

3. You can add new doctors as well as edit current doctors or even delete records



## API Reference

#### Get all items

```http
  GET /api/$(items)
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `items` | `string` |   options: alldoctor-fetch-data, allpatient fetch data |

#### alldoctor-fetch-data

```http
  GET /api/alldoctor-fetch-data
```

| Description                       |
|   :-------------------------------- |
| fetches a json of all doctors in the db |


#### allpatient-fetch-data

```http
  GET /api/allpatient-fetch-data
```

| Description                       |
|   :-------------------------------- |
| fetches a json of all patients in the db |



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PG_HOST`

`PG_DATABASE`

`PG_USER`

`PG_PASSWORD`




## Run Locally

Clone the project

```bash
  git clone https://github.com/Sujan-13/medicity/tree/master
```

Go to the client directory

```bash
  cd medicity/client
```

Install dependencies

```bash
  npm install
```

Go to the server directory

```bash
  cd ../server
```

Install dependencies

```bash
  npm install
```


Start the server

```bash
  npm run start
```



## Deployment

To deploy this project on render

```bash
Deploying to Render

1.Push the code to your GitHub repository.
2.Connect the repository to Render.
3.Set environment variables.
4.Deploy the application.
```




## Appendix

NOTE: On render it may take upto 50s for site to load.



## Contributions



**Frontend(html,css):** Dipesh Chaudhary 

**Database Queries:** Subrat Dhital

**React & Backend:** Sujan Gupta 



