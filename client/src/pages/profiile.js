    import Formbody from "../components/Formbody";
    import { useState,useEffect } from "react";
     
     function Profile() {

        const items=[["FirstName","text"],["LastName","text"],["DOB","date"], ["Gender","text"],["Address","text"],["Phone","text"], ["Email","email"]];
        const[Loading,setLoading]=useState(true);
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
    
    useEffect(()=>{
        const fetchData=async ()=>{
            try { 
                const response = await fetch("http://localhost:3001/api/profile-fetch-data", {
                method: "GET",
                credentials: "include",
              });
              const result = await response.json();
              SetformData(result);
              setLoading(false);
            }
            catch(error){
                console.error(error);
            }
        }
        fetchData();
    },[]);

        return(
          Loading? <h1>Loading...</h1> : <div>
                <div class="dashboard-logo">
                    <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTOIsLtdQPu_wKkuK2cptqnjlgvV1kKeWLF7Ki6HKvqTpZVglh-" alt="" />
                </div>
                <div className="dashboard-inp">
                    {items.map((item,index)=>{
                    var member=(item[0].toLowerCase());      
                            return(                          
                                <div>
                                <Formbody key={index} field={item[0]} name={member} type={item[1]} value={formData[member]}/>
                                </div>
                                    );
                                })}
                </div>
            </div>
        );
      }

      export default Profile;