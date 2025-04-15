import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import Home from './pages/homePage.jsx';
import Login from './pages/loginPage.jsx';
import Signup from "./pages/signupPage.jsx";
import Account from "./pages/accountPage.jsx";
import Dashboard from "./pages/dashboard/dashboardPage.jsx"
import Publications from './pages/publicationsPage.jsx';
import Events from './pages/eventsPage.jsx'
import Users from './pages/dashboard/usersPage.jsx'
import ResearchAssociates from './pages/researchAssociates.jsx';
import PhotoGallery from './pages/dashboard/photoGallery.jsx'


// ✅ Wrapper to use useLocation and hide header/footer on certain routes
function AppWrapper({ role, setRole, name, setName, email, setEmail }) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const hideHeaderFooter = path.startsWith("/dashboard") || path.startsWith("/addusers") || path.startsWith("/photogallery");
 

  return (
    <>
      {!hideHeaderFooter && (
        <Header role={role} setRole={setRole} name={name} setName={setName} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login role={role} setRole={setRole} name={name} setName={setName} email={email} setEmail={setEmail} />}
        />
        <Route
          path="/signup"
          element={<Signup role={role} setRole={setRole} name={name} setName={setName} email={email} setEmail={setEmail} />}
        />
        <Route path="/account" element={<Account />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/users" element={<Users />} />
        <Route path="/photogallery" element={<PhotoGallery />} />
        <Route
          path="/publications"
          element={<Publications role={role} setRole={setRole} name={name} setName={setName} email={email} setEmail={setEmail} />}
        />
         <Route path="/Events" element={<Events role={role} setRole={setRole} name={name} setName={setName} email={email} 		setEmail={setEmail} />} />
        <Route path="/Research-Associates" element={<ResearchAssociates />} />

      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  const [role, setRole] = useState("guest");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8081/check-session", {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setRole(data.user.role);
            setName(data.user.name);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, []);

  return (
    <Router>
      <AppWrapper
        role={role}
        setRole={setRole}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
      />
    </Router>
  );
}

export default App;
