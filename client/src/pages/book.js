import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useFetchData from "../modules/useFetchData";
import usePostData from "../modules/usePostData";
import Dropdown from "../components/Dropdown";
function Book() {
    const [loading,setLoading]=useState(false);
    const [specializationData,setSpecializationData]=useState([]);
    const [validate,setvalidate]=useState(true);
    const [selectSpecialization,setselectSpecialization]=useState({
        specialization:""
    });
    const [appointment,setAppointment]=useState({
        doctorid:"",
        appointmentdate:""
    });
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
    if(name==="specialization"){
    setLoading(false);
        setselectSpecialization({
           "specialization":value
        });
    }

    if (name==="doctorid"|| name==="appointmentdate") {
        console.log(name,value);
        console.log("HERE");
        setAppointment({
        ...appointment,
        [name]:value
        });
    }
    }

    async function handleSubmit(e) {
        e.preventDefault();
            try {
              const response= await fetch("http://localhost:3001/api/post-appointment",{
                method:"POST",
                credentials: 'include',
                headers:{
                  "Content-type":"application/json"
                },
                body:JSON.stringify(appointment)
              });
                const result= await response.json();
                console.log(result);
                if (result.code==23505) {
                    setvalidate(false);
                }
                if (result.done) {
                  navigate("/dashboard/appointment");
                }
            } catch (error) {
                setvalidate(false);
                console.error("Error",error);         
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
                <form onSubmit={handleSubmit}>
                <div className="form-group dashboard-form-text">
                <label for="doctors">Choose Doctor:</label>
                <select name="doctorid" id="doctors" onChange={handleChange}>
                <option>--Doctors--</option>
                    {
                        doctorData.map((item,index)=>{
                            console.log(item);
                            const field=item.firstname+" "+item.lastname+", "+item.specialization;
                            return(
                                <Dropdown field={field} value={item.doctorid} key={index} />
                            )
                        })
                    }
                </select> 
                </div>
                <div className="form-group dashboard-form-text">
                <label for="appointmentDate">Choose Appointment Date:</label>
                <input name="appointmentdate" type="date" min={new Date().toISOString().split('T')[0]} onChange={handleChange} />
                </div>

                <div className="form-group dashboard-form-text">
                <button type="submit" className="side-btn">Book</button>
                </div>

                {!validate && <h3 className="warning">Try again!!</h3> }

                </form>
                }
        </div>
    );
}

export default Book;