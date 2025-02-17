import {Fragment, useState} from 'react'
import './App.css'
//import {BrowserRouter as Router} from "react-router-dom";
import Header from './components/header.jsx' // import the header
import Footer from './components/footer.jsx' // import the footer
//import About from './pages/aboutPage.jsx'
//import Publication from './pages/publicationsPage.jsx'
//import Login from './pages/loginPage.jsx'

function App() {

  return (
    <>
        <Header /> {/* Render the Header  */}
        <Footer /> {/* Render footer */}
    </>
  );
}

export default App;
