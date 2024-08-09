import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useFetchData from "../../modules/useFetchData";
function AdminDoctor() {
    const navigate=useNavigate();
    const [formData, SetformData]=useState([{
        doctorid:"",
        firstname:"",
        lastname:"",
        specialization:"",
        phone:"",
        email:"",
        salary:""
    }]);

    const [startEdit,setStartEdit]=useState({
        "edit":false,
        doctorid:"",
        phone:"",
        email:"",
        salary:""
    });

    const [isDel,setIsDel]=useState(false);


    useEffect(()=>{
        const fetchData=async ()=>{
            try { 
                const response = await fetch("http://localhost:3001/api/alldoctor-fetch-data", {
                method: "GET",
                credentials: "include",
              });
              const result = await response.json();
              SetformData(result);
              console.log(result);
            }
            catch(error){
                console.error(error);
            }
        }
        fetchData();
    },[navigate,startEdit,isDel]);

    function handleChange(e){
        const {name,value}=e.target;
        setStartEdit({
            ...startEdit,
            [name]:value
        });
    }

    function handleEdit(e) {
            const {name,value}=e.currentTarget;
            console.log(value,name);
            setStartEdit({
                edit:true,
                [name]:value
            });
        }

    async function handleUpdate() {
        if(startEdit.edit){
        try {
            const response= await fetch("http://localhost:3001/api/update-doctor",{
              method:"POST",
              credentials: 'include',
              headers:{
                "Content-type":"application/json"
              },
              body:JSON.stringify(startEdit)
            });
              const result= await response.json();
              console.log(result);
              if (result.done) {
                setStartEdit({
                    edit:false,
                    doctorid:""
                })
                navigate("/dashboard/doctor");
              }
          } catch (error) {
              console.error("Error",error);         
          }}
    };

    async function handleDelete(e) {
        const {name,value}=e.target;
        const toDelete={
            "doctorid":value            
        };
        setIsDel(true);
        try {
            const response= await fetch("http://localhost:3001/api/delete-doctor",{
              method:"POST",
              credentials: 'include',
              headers:{
                "Content-type":"application/json"
              },
              body:JSON.stringify(toDelete)
            });
              const result= await response.json();
              console.log(result);
              if (result.done) {
                navigate("/dashboard/doctor");
              }
          } catch (error) {
              console.error("Error",error);
          }
          setIsDel(false);
    };

    return(
        <div>
            <div>
           {!formData?(<h2>No doctors...</h2>):
                 <table>
                <thead>
                    <tr>
                        <th>S.N.</th>
                        <th>Doctor Name.</th>
                        <th>specialization</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Salary</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        formData.map((item,index)=>{
                            const id=item.doctorid;
                            const editid=startEdit.doctorid;
                            return(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>Dr. {item.firstname} {item.lastname}</td>
                                <td>{item.specialization}</td>
                                {(id != editid) ?(<td>{item.email}</td>):(<td><input type="email" name="email" onChange={handleChange}  value={startEdit.email}></input></td>)}
                                {(id != editid) ?(<td>{item.phone}</td>):(<td><input type="text" name="phone" onChange={handleChange}  value={startEdit.phone}></input></td>)}
                                {(id != editid) ?(<td>{item.salary}</td>):(<td><input type="text" name="salary" onChange={handleChange}  value={startEdit.salary}></input></td>)}
                                {(id != editid) ?
                                (                                    
                                <td className="action-container"> 
                                 <div className="action-item">                               
                                 <button className="side-btn" name="doctorid" value={item.doctorid} onClick={handleEdit}>&#9881;</button>  
                                 </div>
                                 <div className="action-item">                               
                                 <button className="side-btn" name="doctorid" value={item.doctorid} onClick={handleDelete}>&#10060;</button>  
                                 </div>                                  
                                </td>):(
                                    <td><button className="side-btn" onClick={handleUpdate}>&#x2714;</button></td>
                                )
                                }
                            </tr>

                        )})
                    }
                </tbody>
                </table>}
            </div>
        </div>
    );
}

export default AdminDoctor;