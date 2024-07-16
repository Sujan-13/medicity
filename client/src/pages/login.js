import  Formbody  from "../components/Formbody";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import  "../styles/form.css";
import Nav from "../components/Nav";


function Login(){
    const navigate=useNavigate();
    const [formData,SetformData]=useState({
        email:"",
        password:""
    });

    const [validation,setvalidation]=useState("");

    function handleChange(e) {
        SetformData({
            ...formData,
            [e.target.name]:e.target.value
    })
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response= await fetch("http://localhost:3001/api/login",{
                method:"POST",
                credentials: 'include',
                headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(formData)
            });
            const result=await response.json();
            if (!result.authenticated) {
                setvalidation("Incorrect email or password!")
            }
            if (result.authenticated) {
                navigate("/dashboard");
            }            
        } catch (error) {
            console.error(error);
        }
    }



    const items=[["Email","email"], ["Password","password"]];

    return(
        <div>
        <Nav />    
        <main>
        <div class="logo">
            <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTOIsLtdQPu_wKkuK2cptqnjlgvV1kKeWLF7Ki6HKvqTpZVglh-" alt="" />
        </div>
        <h2>Welcome Back!</h2>
        <form class="main" onSubmit={handleSubmit}>
            {items.map((item,index)=>{
                const member=item[0].toLowerCase();
                return(
                <div>
                <Formbody key={index} field={item[0]} type={item[1]} value={formData[member]} name={member} handleChange={handleChange} />
                </div>
            );})}
            <p className="warning">{validation}</p>
            <input type="submit" value="Login" class="login"/>
        </form>
        <p>Don't have an account? <Link to="/signup">Register</Link></p>
        {/* <p>Forgot your password? <a href="/forgot-password">Reset</a></p> */}
    </main>
    </div>
    );
};

export default Login;