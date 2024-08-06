import { useEffect, useState } from "react"

const useFetchData=(apiEndpoint)=>{
    const [data,setData]=useState(null);
    const [error,setError]=useState(null);
    useEffect(()=>{
        const fetchData=async ()=>{
                const route="http://localhost:3001/api/"+apiEndpoint;
                
            try { 
                    const response = await fetch(route , {
                    method: "GET",
                    credentials: "include",
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

export default useFetchData;
