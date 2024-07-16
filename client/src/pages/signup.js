import "../styles/form.css";
import { useState } from "react";
import Formbody from "../components/Formbody";
import { Link,useNavigate } from "react-router-dom";
import Nav from "../components/Nav";


function Signup() {
    const navigate=useNavigate();
    const items=[["FirstName","text"],["LastName","text"],["DOB","date"], ["Gender","text"],["Address","text"],["Phone","text"], ["Email","email"], ["Password","password"]];
    const [formData, SetformData]=useState({
        firstname:"",
        lastname:"",
        dob:"",
        gender:"",
        address:"",
        phone:"",
        email:"",
        password:""
    });

    const [validateEmail, setvalidateEmail]=useState(true);
    const [validatePassword,setvalidatePassword]=useState("");

    
    function handleChange(e) {
        SetformData({
            ...formData,
            [e.target.name]:e.target.value
        })
        if (e.target.name=="email") {
          setvalidateEmail(true);         
        }
        if(e.target.name=="password"){
          const checkPassword=e.target.value;
          setvalidatePassword("");
          if(checkPassword.length<8){
            setvalidatePassword("Password length must be at least 8 characters long!");
          }
          if(!/[A-Z]/.test(checkPassword)){
            setvalidatePassword("Password must contain at least one uppercase character");
          }
          if(!/[a-z]/.test(checkPassword)){
            setvalidatePassword("Password must contain at least one lowercase character");
          }
          if(!/[0-9]/.test(checkPassword)){
            setvalidatePassword("Password must contain at least one number");
          }
          if(!/[^A-Za-z0-9]/.test(checkPassword)){
            setvalidatePassword("Password must contain at least one special character");
          }
          if(checkPassword.length===0){
            setvalidatePassword("");
          }
        }
    }

    async function handleSubmit(e) {
      console.log(formData);
        e.preventDefault();
        if(validatePassword===''){
        try {
          const response= await fetch("http://localhost:3001/api/signup",{
            method:"POST",
            credentials: 'include',
            headers:{
              "Content-type":"application/json"
            },
            body:JSON.stringify(formData)
          });
            const result= await response.json();
            console.log(result);
            if (result.code==23505) {
              setvalidateEmail(false);
            }
            if (result.authenticated) {
              navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error",error);         
        }}
        };
 
            return(
              <div>
              <Nav />
                <main>
                
                <div class="logo">
                <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTOIsLtdQPu_wKkuK2cptqnjlgvV1kKeWLF7Ki6HKvqTpZVglh-" alt="" />
               </div>
                 <h2>Sign Up</h2>

                    <form class="main" onSubmit={handleSubmit}>
                      
                        {items.map((item,index)=>{
                            var member=(item[0].toLowerCase());      
                            return(                          
                             <div>
                            <Formbody key={index} field={item[0]} name={member} type={item[1]} value={formData[member]} handleChange={handleChange} />
                             {index==6 && !validateEmail && <p className="warning">Email already taken</p>}
                             {index==7 && <p className="warning">{validatePassword}</p>}
                             </div>
                            );
                        })}
                        
                        <input type="submit" value="Signup" class="login"/>
                     </form>
                     <p>Already have an account? <Link to="/login">Log In</Link></p>
                </main>
                </div>
            );
}

export default Signup;