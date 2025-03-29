import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from './components/header.jsx' // import the header
import Footer from './components/footer.jsx'
import Home from './pages/homePage.jsx'
import Login from './pages/loginPage.jsx'
import Signup from "./pages/signupPage.jsx";
import {useState,useEffect} from "react";
//import Account from "./pages/accountPage.jsx";
import Publications from './pages/publicationsPage.jsx'

function App() {
    const [role, setRole] = useState("guest");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Check for active session when app loads so the user doesn't need to logged in again if they already logged in
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8081/check-session", {
                    credentials: 'include' // Important: needed for cookies/session
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
          <Header role={role} setRole={setRole} name={name} setName={setName}/> {/* always visible header, takes in role data */}

          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<Login role={role} setRole={setRole} name={name} setName={setName} email={email} setEmail={setEmail} />} />
              <Route path="/Signup" element={<Signup role={role} setRole={setRole} name={name} setName={setName} email={email} setEmail={setEmail} />} />
              <Route path="/Publications" element={<Publications role={role} setRole={setRole} name={name} setName={setName} email={email} setEmail={setEmail} />} />
          </Routes>

          <Footer /> {/* Render the Footer, always visible */}
      </Router>
  );
}

export default App;
