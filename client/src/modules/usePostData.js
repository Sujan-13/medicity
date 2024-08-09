import { useEffect, useState } from "react"

const usePostData=(apiEndpoint,formData)=>{
    const [data,setData]=useState(null);
    const [error,setError]=useState(null);
    useEffect(()=>{
        const fetchData=async ()=>{
                const route="/api/"+apiEndpoint;
                console.log(route,formData);
                console.log("HERE");
            try { 
                    const response = await fetch(route , {
                        method:"POST",
                        credentials: 'include',
                        headers:{
                          "Content-type":"application/json"
                        },
                        body:JSON.stringify(formData)
                      });
                  const result = await response.json();
                  setData(result);
                  console.log(result);
                }
                catch(error){
                    setError(error);
                }
            };
            fetchData();
    },[]);

    return {data,error};
}

export default usePostData;

