import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import Home from './pages/homePage.jsx';
import Login from './pages/loginPage.jsx';
import Signup from "./pages/signupPage.jsx";
import Account from "./pages/accountPage.jsx";
import Dashboard from "./pages/dashboardPage.jsx";

// ✅ Wrapper component so we can use the useLocation() hook
function AppWrapper() {
  const location = useLocation();

  // Make the path lowercase so it's case-insensitive
  const path = location.pathname.toLowerCase();

  // Hide header/footer on /dashboard
  const hideHeaderFooter = path.startsWith("/dashboard");

  return (
    <>
      {!hideHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
