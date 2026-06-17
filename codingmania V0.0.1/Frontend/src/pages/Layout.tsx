import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";


const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0B0B1F] to-[#1A1A3A]">
        <Outlet />
      </div>
      
    </>
  );
};

export default Layout;
