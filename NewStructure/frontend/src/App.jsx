import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import Home from './pages/homePage.jsx'
import Login from './pages/loginPage.jsx'
import Signup from "./pages/signupPage.jsx";
import {useState,useEffect} from "react";
import Publications from './pages/publicationsPage.jsx'
import Events from './pages/eventsPage.jsx'

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
            <div className="app-container">
                <Header role={role} setRole={setRole} name={name} setName={setName}/>
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Login" element={<Login role={role} setRole={setRole} name={name} setName={setName} email={email} setEmail={setEmail} />} />
                        <Route path="/Signup" element={<Signup role={role} setRole={setRole} name={name} setName={setName} email={email} setEmail={setEmail} />} />
                        <Route path="/Publications" element={<Publications role={role} setRole={setRole} name={name} setName={setName} email={email} setEmail={setEmail} />} />
                        <Route path="/Events" element={<Events role={role} setRole={setRole} name={name} setName={setName} email={email} setEmail={setEmail} />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
