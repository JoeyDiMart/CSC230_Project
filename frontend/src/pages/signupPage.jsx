import react from 'react';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import './signupPage.css'

function Signup() {

    // update the text field when user puts in email and password
    const [formData, setFormData] =
        useState({name: "", primaryEmail: "", password: "" });

    // check and handle the changes in the input fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // allow for redirection after singup is complete
    const navigate = useNavigate();

    //  need to finish handleSubmit
    // add a try, catch to fetch the backend api and update it by creating a new user
    // IF signup succesful nviage to another page (logged in), or throw and error and retry signup
    //const handleSubmit = async (e) => {
    //    e.preventDefault();



    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" name="name" placeholder="Name" value={formData.username} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.primaryEmail} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
                <button type="submit">Sign Up</button>
            </div>
        </form>
    )
}
export default Signup;