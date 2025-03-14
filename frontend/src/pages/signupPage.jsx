import {Fragment, useState} from "react";
import { useNavigate } from "react-router-dom";
import './signupPage.css'
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup({ role, setRole }) {

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
            alert("Passwords don't match");
            return;
        }

        if (!passwordRegex.test(formData.password)) {

            setErrorMessage(
                <>
                    Please satisfy password requirements:
                    <ul className={error-message}>
                        <li>At least 12 characters</li>
                        <li>At least one upper case letter</li>
                        <li>At least one lower case letter</li>
                        <li>At least one number</li>
                    </ul>
                </>
            );
            return;
        }

        try {
            setLoading(true);  // show a loading state

            // attempt to send to backend as body and wait for its response
            const response = await fetch ("http://localhost:8081/signup", {
                method: "POST",  // send post request and create a new user
                headers: { "Content-Type": "application/json" },  // the type of data is json since we use mongoDB
                body: JSON.stringify({
                    name: formData.name.toLowerCase(),
                    email: formData.email.toLowerCase(),
                    password: formData.password,
                    role: formData.role
                }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`The users role: ${data.role}`)
                //(data.Role);  // set users role based on what the backend gives
                navigate("/");
            } else {
                //alert(data.error || "Signup failed. Please try again.");  original alert can prob delete
                setErrorMessage(data.error || "Signup failed");
            }
        } catch (error) {
            console.error("error from signup: ", error)
            // prob should delete this alert(error);
            setErrorMessage("An error occurred");
        } finally {
            setLoading(false)
        }
    };


    return (
        <div className="signup-page">
            <div className="signup-container">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-container">
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <span className="eye-icon" onClick={togglePasswordVisibility}>{showPassword ? <FaEye /> : <FaEyeSlash />}</span>
                    </div>
                    <div className="input-container">
                        <input type={showVerifyPassword ? "text" : "password"} name="verifyPassword" placeholder="Verify Password" value={formData.verifyPassword} onChange={handleChange} required/>
                        <span className="eye-icon" onClick={toggleVerifyPasswordVisibility}>{showVerifyPassword ? <FaEye /> : <FaEyeSlash />}</span>
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    )
}
export default Signup;