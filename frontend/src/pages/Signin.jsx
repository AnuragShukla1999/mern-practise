import React, { useState } from "react";
// import "./Signin.css";
import "./styles/Signin.css";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";

const Signin = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(formData);

            const res = await axios.post("http://10.94.229.198:3006/api/v1/auth/signin", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });


            if (res.data.success) {
                // localStorage.setItem("token", res.data.token);

                dispatch(login({
                    user: res.data.user,
                    token: res.data.token
                }))

                navigate('/chat')
            }

            console.log(res.data)

        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                {/* <h1>WhatsApp Clone</h1> */}
                <h3>Sign In</h3>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="identifier"
                        placeholder="Email or Mobile"
                        value={formData.identifier}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button type="submit">Login</button>
                </form>

                <p>
                    Don't have an account? <Link to="/signup">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Signin;