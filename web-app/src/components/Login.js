import { React, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../Config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const Login = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${config.base_url}/index/login`, {
            email: inputs.email,
            password: inputs.password
        }).then(response => {
            console.log(response);
            if (response.data.status == 200) {
                toast(response.data.message)
                Cookies.set("token", response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data));
                navigate('/dashboard');
            }
        }).catch(error => {
            toast(error.response.data.message)
        });
        // console.log(inputs);
    }

    return (
        <>
            <div>
                <ToastContainer />
            </div>
            <div class="page page-center">
                <div class="container container-tight py-4">
                    <form class="card card-md" onSubmit={handleSubmit} autocomplete="off" novalidate="">
                        <div class="card-body">
                            <h2 class="card-title text-center mb-4">Login</h2>
                            <div class="mb-3">
                                <label class="form-label">Email address</label>
                                <input type="email" class="form-control" name="email" value={inputs.email || ""} onChange={handleChange} placeholder="Enter email" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <div class="input-group input-group-flat">
                                    <input type="password" class="form-control" name="password" value={inputs.password || ""} onChange={handleChange} placeholder="Password" autocomplete="off" />
                                    <span class="input-group-text">
                                        <a href="#" class="link-secondary" data-bs-toggle="tooltip" aria-label="Show password" data-bs-original-title="Show password">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path></svg>
                                        </a>
                                    </span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-check">
                                    <input type="checkbox" class="form-check-input" />
                                    <span class="form-check-label">Agree the <a href="./terms-of-service.html" tabindex="-1">terms and policy</a>.</span>
                                </label>
                            </div>
                            <div class="form-footer">
                                <button type="submit" class="btn btn-primary w-100">Login</button>
                            </div>
                        </div>
                    </form>
                    <div class="text-center text-secondary mt-3">
                        Don't have account yet? <a href="/register" tabindex="-1">Sign up</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;