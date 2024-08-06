import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useFetchData from "../modules/useFetchData";
import usePostData from "../modules/usePostData";
import Dropdown from "../components/Dropdown";
function Book() {
    const [loading,setLoading]=useState(false);
    const [specializationData,setSpecializationData]=useState([]);
    const [selectSpecialization,setselectSpecialization]=useState({
        specialization:""
    });
    const [appointment,setAppointment]=useState([{
        firstname:"",
        lastname:"",
        specialization:"",
        appointmentdate:""
    }]);
    const [doctorData,setdoctorData]=useState([{
        doctorid:"",
        firstname:"",
        lastname:"",
        specialization:"",
    }]);



    const navigate=useNavigate();

    const {data,error}=useFetchData("book-fetch-specialization");


    useEffect(()=>{
        if(data){
            console.log(data);
            setSpecializationData(data);
        }

    },[data]);

    useEffect(()=>{
        const fetchData= async ()=>{
            try {
                const response= await fetch("http://localhost:3001/api/book-fetch-doctor",{
                  method:"POST",
                  credentials: 'include',
                  headers:{
                    "Content-type":"application/json"
                  },
                  body:JSON.stringify(selectSpecialization)
                });
                  const result= await response.json();
                  if(result){
                  setdoctorData(result);
                  }
              } catch (error) {
                  console.error("Error",error);         
              } finally{
                setLoading(true);
              }
        }
        if (selectSpecialization.specialization) {
            fetchData();
        }
    },[selectSpecialization])


  async function handleChange(e){
    let {name,value}=e.target;
    if(name="specialization"){
    setLoading(false);
        setselectSpecialization({
           "specialization":value
        });
    }
    
    if(name="doctors"){

    }
    

    }


    return(
        <div className="dashboard-inp">
        <div className="form-group dashboard-form-text">
         <label for="specialization">Choose specialization of Doctor:</label>
        <select name="specialization" id="specialization" onChange={handleChange}>
        <option>--Specializations--</option>
            {
                specializationData.map((item,index)=>{
                    return(
                        <Dropdown field={item.specialization} key={index} />
                    )
                })
            }
        </select> 
        </div>
                {loading && 
                <div>
                <div className="form-group dashboard-form-text">
                <label for="doctors">Choose Doctor:</label>
                <select name="doctors" id="doctors" onChange={handleChange}>
                <option>--Doctors--</option>
                    {
                        doctorData.map((item,index)=>{
                            const field=item.firstname+" "+item.lastname+", "+item.specialization;
                            console.log(field)
                            return(
                                <Dropdown field={field} key={index} />
                            )
                        })
                    }
                </select> 
                </div>
                <div className="form-group dashboard-form-text">
                <label for="appointmentDate">Choose Appointment Date:</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} />
                </div>

                </div>
                }
        </div>
    );
}

export default Book;