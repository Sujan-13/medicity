import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Formbody from "../../components/Formbody";
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

    const items=[["FirstName","text"],["LastName","text"], ["Specialization","text"],["Address","text"],["Phone","text"], ["Email","email"],["Salary","text"]];

    const [insertFormData, SetInsertFormData]=useState({
        firstname:"",
        lastname:"",
        specialization:"",
        phone:"",
        email:"",
        salary:""
    });

    const [startEdit,setStartEdit]=useState({
        "edit":false,
        doctorid:"",
        phone:"",
        email:"",
        salary:""
    });

    const [isDel,setIsDel]=useState(false);
    const [addDoc,setAddDoc]=useState(false);

    useEffect(()=>{
        const fetchData=async ()=>{
            try { 
                const response = await fetch("/api/alldoctor-fetch-data", {
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
    },[navigate,startEdit,isDel,addDoc]);

    function handleChange(e){
        const {name,value}=e.target;
        
        setStartEdit({
            ...startEdit,
            [name]:value
        });

    }

    function handleInsertChange(e) {
        const {name,value}=e.target;

        SetInsertFormData({
            ...insertFormData,
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
            const response= await fetch("/api/update-doctor",{
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
            const response= await fetch("/api/delete-doctor",{
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


    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response= await fetch("/api/add-doctor",{
              method:"POST",
              credentials: 'include',
              headers:{
                "Content-type":"application/json"
              },
              body:JSON.stringify(insertFormData)
            });
              const result= await response.json();
              console.log(result);
              if (result.done) {
                navigate("/dashboard/doctor");
              }
          } catch (error) {
              console.error("Error",error);
          }
          finally{
            setAddDoc(!addDoc);
            SetInsertFormData({
                firstname:"",
                lastname:"",
                specialization:"",
                phone:"",
                email:"",
                salary:""
            });
          }
    };

    return(
        <div>
            <div>

            <button className="side-btn" style={{padding:"10px",margin:"auto",display:"block", marginBottom:"10px"}} onClick={()=>{setAddDoc(!addDoc)}} >{!addDoc?"Add Doctor":"Go back"}</button>
                {addDoc &&
                <main>
                <div class="logo">
                <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTOIsLtdQPu_wKkuK2cptqnjlgvV1kKeWLF7Ki6HKvqTpZVglh-" alt="" />
               </div>
                 <h2>Add Doctor:</h2>

                    <form class="main" onSubmit={handleSubmit}>
                      
                        {items.map((item,index)=>{
                            var member=(item[0].toLowerCase());      
                            return(                          
                             <div>
                            <Formbody key={index} field={item[0]} name={member} type={item[1]} value={insertFormData[member]} handleChange={handleInsertChange} />
                             </div>
                            );
                        })}
                        
                        <input type="submit" value="Add doctor" class="login"/>
                     </form>
                     </main>
                }
           {!formData?(<h2>No doctors...</h2>):!addDoc &&
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