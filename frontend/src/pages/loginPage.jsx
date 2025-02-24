import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './loginPage.css';
import './signupPage.jsx'

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    // maybe remove async?
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            if (response.ok) {
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
        <div className="Login">
            <div className="LoginWrapper">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>

                    <div className="input-field">
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="input-field">
                        <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} required/>
                    </div>

                    <div className='forgotPassword'>
                        <a href="#">Forgot password?</a>
                        {/*<Link to="/forgot-password">Forgot password?</Link>  ADD THIS WHEN FORGOTPASS PAGE IS MADE */}
                    </div>

                    <label>
                        <input type= "checkbox"/> Remember me
                    </label>

                    <div>
                        <button type="submit">Login</button>
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
