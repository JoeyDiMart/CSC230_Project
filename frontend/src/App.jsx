import {useState} from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from './components/header.jsx' // import the header
import Footer from './components/footer.jsx'
import Home from './pages/homePage.jsx'
import Login from './pages/loginPage.jsx'
import Signup from "./pages/signupPage.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';
//import About from './pages/aboutPage.jsx'
//import Publication from './pages/publicationsPage.jsx'

function App() {

  return (
      <Router>
          <Header/>{/* Render the Header, always visible */}
          <Routes>
              <Route path="/" element={<Home />} />,
              <Route path="/Login" element={<Login />} />
              <Route path="/Signup" element={<Signup />} />
          </Routes>

          <Footer /> {/* Render the Footer, always visible */}
      </Router>
  );
}

export default App;
