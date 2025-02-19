import react from 'react';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import './signupPage.css'

function Signup() {

    // update the text field when user puts in email and password
    const [formData, setFormData] = useState({name: "", email: "", password: "" });
    const navigate = useNavigate();





    return (
        <div className="signupPage">
            <h2>Signup</h2>
            <form action="">
            </form>

        </div>
    )
}
export default Signup;