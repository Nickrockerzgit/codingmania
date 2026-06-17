import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HiddenAdminLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "A") {
        navigate("/admin-login");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return null;
};

export default HiddenAdminLogin;
