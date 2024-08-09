import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useFetchData from "../../modules/useFetchData";
function AdminPatient() {
    const navigate=useNavigate();
    const [formData, SetformData]=useState([{
        patientid:"",
        firstname:"",
        lastname:"",
        dob:"",
        address:"",
        phone:"",
        email:""

    }]);

    const [startEdit,setStartEdit]=useState({
        "edit":false,
        patientid:"",
        phone:"",
        email:"",
        address:""
    });

    const [isDel,setIsDel]=useState(false);

    useEffect(()=>{
        const fetchData=async ()=>{
            try { 
                const response = await fetch("http://localhost:3001/api/allpatient-fetch-data", {
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
            console.log(value);
            setStartEdit({
                edit:true,
                patientid:value
            });
        }

    async function handleUpdate() {
        if(startEdit.edit){
        try {
            const response= await fetch("http://localhost:3001/api/update-patient",{
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
                    patientid:""
                })
                navigate("/dashboard/patient");
              }
          } catch (error) {
              console.error("Error",error);         
          }}
    };

    async function handleDelete(e) {
        const {name,value}=e.target;
        const toDelete={
            "patientid":value            
        };
        setIsDel(true);
        try {
            const response= await fetch("http://localhost:3001/api/delete-patient",{
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
                navigate("/dashboard/patient");
              }
          } catch (error) {
              console.error("Error",error);
          }
          setIsDel(false);
    };

    return(
        <div>
            <div>
           {!formData?(<h2>No patient...</h2>):
                 <table>
                <thead>
                    <tr>
                        <th>S.N.</th>
                        <th>Patient Name.</th>
                        <th>Date of birth</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        formData.map((item,index)=>{
                            const id=item.patientid;
                            const editid=startEdit.patientid;
                            return(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.firstname} {item.lastname}</td>
                                <td>{item.dob}</td>
                                {(id != editid) ? console.log(id !== editid,"not in Edit Mode",id) : console.log(id !== editid,"......In Edit Mode",id)}
                                {(id != editid) ?
                                (<td>{item.email}</td>):(<td><input type="email" name="email" onChange={handleChange}  value={startEdit.email}></input></td>)}
                                {(id != editid) ?(<td>{item.phone}</td>):(<td><input type="text" name="phone" onChange={handleChange}  value={startEdit.phone}></input></td>)}
                                {(id != editid) ?(<td>{item.address}</td>):(<td><input type="text" name="address" onChange={handleChange}  value={startEdit.address}></input></td>)}

                                {(id != editid) ?
                                (                                    
                                <td className="action-container"> 
                                 <div className="action-item">                               
                                 <button className="side-btn"  value={item.patientid} onClick={handleEdit}>&#9881;</button>  
                                 </div>
                                 <div className="action-item">                               
                                 <button className="side-btn"  value={item.patientid} onClick={handleDelete}> &#10060;</button>  
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

export default AdminPatient;