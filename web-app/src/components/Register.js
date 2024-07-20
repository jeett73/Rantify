import React, { useState } from 'react';
import "../CustomCss.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../Config';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        mobile: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        email: '',
        mobile: ''
    });

    const [customCss, setCustomCss] = useState({
        firstName: '',
        email: '',
        mobile: ''
    });

    const newErrors = { ...errors };
    const validateForm = () => {
        let valid = true;
        const newCustomCss = { ...customCss }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'FirstName is required';
            newCustomCss.firstName = "firstName"
            valid = false;
        } else {
            newErrors.firstName = '';
            newCustomCss.firstName = ""
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            newCustomCss.email = "email"
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        } else {
            newCustomCss.email = ""
            newErrors.email = '';
        }

        if (/\D/g.test(formData.mobile) || (formData.mobile.length != 10)) {
            console.log("====2111");
            newErrors.mobile = 'Mobile is invalid';
            newCustomCss.mobile = "mobile"
            valid = false;
        } else {
            newErrors.mobile = '';
            newCustomCss.mobile = ""
        }

        setErrors(newErrors);
        setCustomCss(newCustomCss);
        return valid;
    };

    const handleChange = (e) => {
        // validateForm();
        const newCustomCss = { ...customCss };
        const newErrors = { ...errors };

        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'firstName') {
            if (!value.trim()) {
                newErrors.firstName = 'FirstName is required';
                newCustomCss.firstName = "firstName";
            } else {
                newErrors.firstName = '';
                newCustomCss.firstName = "";
            }
        } else if (name === 'email') {
            if (!value.trim()) {
                newErrors.email = 'Email is required';
                newCustomCss.email = "email";
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                newErrors.email = 'Email is invalid';
                newCustomCss.email = "email";
            } else {
                newErrors.email = '';
                newCustomCss.email = "";
            }
        } else if (name === 'mobile') {
            if (/\D/g.test(value) || (value.length !== 10)) {
                newErrors.mobile = 'Mobile is invalid';
                newCustomCss.mobile = "mobile";
            } else {
                newErrors.mobile = '';
                newCustomCss.mobile = "";
            }
        }

        setErrors(newErrors);
        setCustomCss(newCustomCss);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            submitForm(formData);
            console.log('Form is valid. Submitting...');
        } else {
            console.log('Form is invalid. Please correct errors.');
        }
    };

    const submitForm = async (formData) => {
        try {
            axios.post(`${config.base_url}/index/user/save`, {
                address: {
                    line1: formData.line1 || "",
                    line2: formData.line2 || "",
                    city: formData.city || "",
                    state: formData.state || "",
                    pinCode: formData.pinCode || "",
                    country: formData.country || ""
                },
                ...formData
            }, {
                // headers: {
                //     'authorization': Cookies.get('token'),
                // }
            }).then(response => {
                navigate('/login');
                console.log(response);
            }).catch(error => {
                console.log(error);
                // if (error.response.data.status == 401) {
                //     // navigate('/');
                // }
            });
        } catch (error) {
            console.log("ERROR");
            console.log(error);
        }
    }

    return (
        <>
            <div className="page page-center">
                <div className="container container-tight py-4">
                    <form className="card card-md" onSubmit={handleSubmit} autocomplete="off" novalidate="">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Create new account</h2>
                            <div className="mb-3">
                                <label className="form-label">First Name</label>
                                <input type="text" className={`form-control ${customCss.firstName}`} placeholder="Enter first name" name="firstName" value={formData.firstName} onChange={handleChange} />
                                {errors.firstName && <span style={{ "color": "red" }}>{errors.firstName}</span>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Last Name</label>
                                <input type="text" className="form-control" placeholder="Enter last name" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input type="email" className={`form-control ${customCss.email}`} placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
                                {errors.email && <span style={{ "color": "red" }}>{errors.email}</span>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone No</label>
                                <input type="text" className={`form-control ${customCss.mobile}`} placeholder="Enter phone number" name="mobile" value={formData.mobile} onChange={handleChange} />
                                {errors.mobile && <span style={{ "color": "red" }}>{errors.mobile}</span>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <div className="input-group input-group-flat">
                                    <input type="password" className="form-control" placeholder="Password" autocomplete="off" name="password" value={formData.password} onChange={handleChange} />
                                    <span className="input-group-text">
                                        <a href="#" className="link-secondary" data-bs-toggle="tooltip" aria-label="Show password" data-bs-original-title="Show password">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path></svg>
                                        </a>
                                    </span>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Line 1</label>
                                <input type="text" className="form-control" placeholder="line 1" name="line1" value={formData.line1} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Line 2</label>
                                <input type="text" className="form-control" placeholder="line 2" name="line2" value={formData.line2} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">City</label>
                                <input type="text" className="form-control" placeholder="Enter city name" name="city" value={formData.city} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">State</label>
                                <input type="text" className="form-control" placeholder="Enter state name" name="state" value={formData.state} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Country</label>
                                <input type="text" className="form-control" placeholder="Enter country name" name="country" value={formData.country} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-check">
                                    <input type="checkbox" className="form-check-input" />
                                    <span className="form-check-label">Agree the <a href="./terms-of-service.html" tabindex="-1">terms and policy</a>.</span>
                                </label>
                            </div>
                            <div className="form-footer">
                                <button type="submit" className="btn btn-primary w-100">Create new account</button>
                            </div>
                        </div>
                    </form>
                    <div className="text-center text-secondary mt-3">
                        Already have account? <a href="/login" tabindex="-1">Sign in</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;