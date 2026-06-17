
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from "../src/componant/pages/AuthContext";

// import Home from './componant/pages/Home';
// import Login from './componant/pages/AuthPage';
// import AdminDashboard from "./componant/Admin/AdminDashboard";
// import CarouselManagement from "./componant/Admin/CarouselManagement";
// import EventManagement from "./componant/Admin/EventManagement";
// import SponsorsManagement from "./componant/Admin/SponsorsManagement";
// import TeamManagement from "./componant/Admin/TeamManagement";
// import VlogsManagement from "./componant/Admin/VlogsManagement";




// function App() {
//   return (
//     <AuthProvider>
//     <Router>
//       {/* 🔥 This must be outside Routes */}
//       <Toaster position="top-right" />
      
//       <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/admin/*" element={<AdminDashboard />}>
//           <Route path="carousel" element={<CarouselManagement />} />
//           <Route path="team" element={<TeamManagement />} />
//           <Route path="events" element={<EventManagement />} />
//           <Route path="vlogs" element={<VlogsManagement />} />
//           <Route path="sponsors" element={<SponsorsManagement />} />

//         </Route>
//       </Routes>
//     </Router>
//     </AuthProvider>
//   );
// }

// export default App;










//after remove glitch
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "../src/componant/pages/AuthContext";

import Home from './componant/pages/Home';
import Login from './componant/pages/AuthPage';
import AdminDashboard from "./componant/Admin/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
