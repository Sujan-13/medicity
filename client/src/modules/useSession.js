import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useSessionManagement = (navigate, route, secondRoute, interval = 2000) => {
  const Location=useLocation();
  useEffect(() => {
    const sessionManagement = async () => {
      try {
        const response = await fetch("/api/check-session", {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        console.log(result);
        if (result.authenticated ) {
          if(Location.pathname==="/login" || Location.pathname==="/signup" ){
          navigate(route);
          }
        }
        if (!result.authenticated) {
          if(Location.pathname!=="/"){
          navigate(secondRoute);
          }
        }
        console.log(result);
      } catch (error) {
        console.error("Fetch Error", error);
      }
    };
    sessionManagement();
    const intervalId = setInterval(sessionManagement, interval);
    return () => clearInterval(intervalId);
  }, []);
};

export default useSessionManagement;
