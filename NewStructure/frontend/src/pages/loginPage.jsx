import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './loginPage.css';
import './signupPage.jsx'
import {FaEye, FaEyeSlash} from "react-icons/fa";
import { SHA256, MD5 } from 'crypto-js';


function Login({ role, setRole, name, setName, email, setEmail }) {

    // Eye Icon Functions
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    const toggleVerifyPasswordVisibility = () => {
        setShowVerifyPassword(!showVerifyPassword);
    }

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "guest"
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    // maybe remove async?
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8081/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include', //It tells the browser to send cookies with the request & allows session cookie to be saved in the browser
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email.toLowerCase(),
                    password: formData.password,
                    role: formData.role
                }),
            });

            if (response.ok) {
                const data = await response.json();  // will expect a role and name from backend
                setRole(data.user.role);
                setName(data.user.name);
                setEmail(data.user.email);

                const secret = new Date().toLocaleString('sv-SE', {
                    timeZone: 'Europe/Kyiv',
                    hour12: false,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                });
                
                const connectionChoco = SHA256(data.user.email + MD5(formData.password).toString() + secret).toString();

      
                localStorage.setItem("CurrentAccount", connectionChoco);
    
                navigate("/");
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }

        } catch (error) {
            console.error("Error during login: ", error);
            alert(error.message);
        }
    };

    return (
        <div className="LoginPage ">
            <div className="LoginWrapper">
                <form onSubmit={handleSubmit}>
                    <div className="flex">
                        <span className="p-1"><h2>Login</h2></span>
                        <span className="flex items-center p-1"><img src="/tampa-spartans-logo.png" alt="Tampa img" className="w-8 h-auto" /></span>
                    </div>
                    <div className="input-field">
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="input-field">
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <span className="eye-icon" onClick={togglePasswordVisibility}>{showPassword ? <FaEye /> : <FaEyeSlash />}</span>
                    </div>

                    <label>
                        <input type= "checkbox"/> Remember me
                    </label>

                    <div className="submit-button">
                        <button type="submit">Login</button>
                    </div>

                    <div className='forgotPassword'>
                        <a href="#">Forgot password?</a>
                        {/*<Link to="/forgot-password">Forgot password?</Link>  ADD THIS WHEN FORGOTPASS PAGE IS MADE */}
                    </div>

                    <div className="CreateAccount">
                        <p>Don't have an account? <Link to={"/Signup"}>Create account</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login;
