import {Fragment, useState} from "react";
import {useNavigate} from "react-router-dom";
import './signupPage.css'

function Signup() {

    // update the text field when user puts in email and password
    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            password: "",
            verifyPassword: ""});

    // check and handle the changes in the input fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // allow for redirection after singup is complete
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);  // show a loading state

    //  need to finish handleSubmit
    // add a try, catch to fetch the backend api and update it by creating a new user
    // IF signup succesful nviage to another page (logged in), or throw and error and retry signup
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || !formData.verifyPassword) {
            alert("Please fill all fields.");
            return;
        }

        if (formData.password !== formData.verifyPassword) {
            alert("Passwords don't match");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;  // list of requirements for password
        if (!passwordRegex.test(formData.password)) {
            alert("Please satisfy password requirements:\n - Contains at least 12 characters\n - " +
                "Contains at least one upper case letter\n - " +
                "Contains at least one lowercase letter\n - " +
                "Contains at least one number");
            return;
        }

        try {
            setLoading(true);  // show a loading state

            // attempt to send to backend as body and wait for its response
            const response = await fetch ("http://localhost:8000/signup", {
                method: "POST",  // send post request and create a new user
                headers: { "Content-Type": "application/json" },  // the type of data is json since we use mongoDB
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (response.ok) {
                navigate("/");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("error from signup: ", error)
            alert(error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="password" name="verifyPassword" placeholder="Verify Password" value={formData.verifyPassword} onChange={handleChange} required />
            </>
            <div>
                <button type="submit">Sign Up</button>
            </div>
        </form>
    )
}
export default Signup;