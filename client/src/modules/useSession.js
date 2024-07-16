import { useEffect } from "react";

const useSessionManagement = (navigate, route, secondRoute) => {
  useEffect(() => {
    const sessionManagement = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/check-session", {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        if (result.authenticated) {
          navigate(route);
        }
        if (!result.authenticated) {
          navigate(secondRoute)
        }
        console.log(result);
      } catch (error) {
        console.error("Fetch Error", error);
      }
    };
    sessionManagement();
  }, []);
};

export default useSessionManagement;
