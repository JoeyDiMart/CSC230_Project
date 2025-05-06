import {Fragment, useState} from "react";
import { useNavigate } from "react-router-dom";
import './signupPage.css'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SHA256, MD5 } from 'crypto-js';
import API_BASE_URL from "../config.js";

function Signup({ role, setRole, name, setName, email, setEmail }) {

    // update the text field when user puts in email and password
    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            password: "",
            verifyPassword: "",
            role: "guest"});

    // Eye Icon Functions
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");  // errors usually for passwords
    const [loading, setLoading] = useState(false);  // show a loading state
    const navigate = useNavigate();  // navigation hook for redirection
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;  // list of requirements for password

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    const toggleVerifyPasswordVisibility = () => {
        setShowVerifyPassword(!showVerifyPassword);
    }


    // check and handle the changes in the input fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");  // remove previous errors before sending new message

        if (!formData.name || !formData.email || !formData.password || !formData.verifyPassword) {
            alert("Please fill all fields.");
            return;
        }

        if (formData.password !== formData.verifyPassword) {
            setErrorMessage("Passwords don't match");
            return;
        }

        if (!passwordRegex.test(formData.password)) {
            setErrorMessage(
                    "Please satisfy password requirements:\n• At least 12 characters\n• At least one uppercase letter\n• At least one lowercase letter\n• At least one number"
                );
            return;
        }

        try {
            setLoading(true);  // show a loading state

            // attempt to send to backend as body and wait for its response
            const response = await fetch (`${API_BASE_URL}/signup`, {
                method: "POST",  // send post request and create a new user
                headers: { "Content-Type": "application/json" },  // the type of data is json since we use mongoDB
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email.toLowerCase(),
                    password: formData.password,
                    role: formData.role
                }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`The users role: ${JSON.stringify(data.user)}`)
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
                setErrorMessage(data.error || "Signup failed");
            }
        } catch (error) {
            console.error("error from signup: ", error)
            setErrorMessage("An error occurred");
        } finally {
            setLoading(false)
        }
    };


    return (
        <div className="Signup-Page">
            <div className="SignupWrapper">
                <form onSubmit={handleSubmit}>
                    <div className="flex">
                        <span className="p-1"><h2>Sign Up</h2></span>
                        <span className="flex items-center p-1"><img src="/tampa-spartans-logo.png" alt="Tampa img" className="w-8 h-auto" /></span>
                    </div>
                    <div className="input-field">
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-field">
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <span className="eye-icon" onClick={togglePasswordVisibility}>{showPassword ? <FaEye /> : <FaEyeSlash />}</span>
                    </div>
                    <div className="input-field">
                        <input type={showVerifyPassword ? "text" : "password"} name="verifyPassword" placeholder="Verify Password" value={formData.verifyPassword} onChange={handleChange} required/>
                        <span className="eye-icon" onClick={toggleVerifyPasswordVisibility}>{showVerifyPassword ? <FaEye /> : <FaEyeSlash />}</span>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="submit-button">
                        <button type="submit">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Signup;