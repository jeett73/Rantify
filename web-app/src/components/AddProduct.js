import React, { useState } from 'react';
import "../CustomCss.css"
import config from '../Config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductServices from '../services/products';
const ProductServicesObj = new ProductServices();

function AddProduct({ onAddProduct }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        rent: '',
        time: 'hour'
    });

    const [errors, setErrors] = useState({
        rent: ''
    });

    const [customCss, setCustomCss] = useState({
        rent: ''
    });

    const handleChange = (e) => {

        const newCustomCss = { ...customCss };
        const newErrors = { ...errors };

        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === "rent") {
            if (!value.trim()) {
                newErrors.rent = 'Rent is required';
                newCustomCss.rent = "rent";
            } else if (!/^[0-9]+$/.test(value)) {
                newErrors.rent = 'Please enter valid Amount.';
                newCustomCss.rent = "rent";
            } else {
                newErrors.rent = '';
                newCustomCss.rent = "";
            }
        }

        setErrors(newErrors);
        setCustomCss(newCustomCss);
    };

    const validateForm = () => {
        let valid = true;

        const newCustomCss = { ...customCss };
        const newErrors = { ...errors };

        console.log("Form data");
        console.log(formData);


        if (!formData.rent.trim()) {
            newErrors.rent = 'Rent is required';
            newCustomCss.rent = "rent";
            valid = false;
        } else if (!/^[0-9]+$/.test(formData.rent)) {
            newErrors.rent = 'Please enter valid Amount.';
            newCustomCss.rent = "rent";
            valid = false;
        } else {
            newErrors.rent = '';
            newCustomCss.rent = "";
        }

        setErrors(newErrors);
        setCustomCss(newCustomCss);
        return valid;
    };

    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
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
            const formDataFinal = new FormData();
            formDataFinal.append('attachments', selectedFile);
            formDataFinal.append('rent', formData.rent);
            formDataFinal.append('description', formData.description);
            formDataFinal.append('time', formData.time);
            let loggedUserId = localStorage.getItem("user");
            loggedUserId = JSON.parse(loggedUserId);
            const response = await ProductServicesObj.addProduct(formDataFinal);
            console.log(response.data.data,"response");
            onAddProduct(response.data.data);            
            // axios.post(`${config.base_url}/products/${loggedUserId.user._id}/save`, formDataFinal, {
            //     headers: {
            //         'authorization': localStorage.getItem("token"),
            //     }
            // }).then(response => {
            //     console.log(response);
            // }).catch(error => {
            //     console.log(error);
            //     // if (error.response.data.status == 401) {
            //     //     // navigate('/');
            //     // }
            // });
        } catch (error) {
            console.log("ERROR");
            console.log(error);
        }
    }

    return (
        <>
            <div class="modal modal-blur fade" id="modal-report" tabindex="-1" role="dialog" aria-hidden="true">
                <form onSubmit={handleSubmit} autocomplete="off" novalidate="">
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Add Product</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <div class="form-label">Upload product</div>
                                    <input type="file" class="form-control" accept="image/*" onChange={handleFileChange} />
                                </div>
                                <div class="row">
                                    <div class="col-lg-8">
                                        <div class="mb-3">
                                            <label class="form-label">Rent</label>
                                            <div class="input-group input-group-flat">
                                                <span class="input-group-text">
                                                </span>
                                                <input type="text" class={`form-control ps-0 ${customCss.rent}`} name="rent" value={formData.rent} autocomplete="off" onChange={handleChange} />
                                            </div>
                                            {errors.rent && <span style={{ "color": "red" }}>{errors.rent}</span>}
                                        </div>
                                    </div>
                                    <div class="col-lg-4">
                                        <div class="mb-3">
                                            <label class="form-label">Time</label>
                                            <select class="form-select" name="time" value={formData.time} onChange={handleChange}>
                                                <option value="hour">Hr</option>
                                                <option value="day">Day</option>
                                                <option value="week">Week</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div>
                                            <label class="form-label">Description</label>
                                            <textarea class="form-control" rows="3" name="description" value={formData.description} onChange={handleChange} ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <a href="#" class="btn btn-link link-secondary" data-bs-dismiss="modal">
                                    Cancel
                                </a>
                                {/* <a href="#" class="btn btn-primary ms-auto" data-bs-dismiss="modal">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg>
                                    Add Product
                                </a> */}

                                <div data-bs-dismiss="modal">
                                    <button type="submit" className="btn btn-primary w-100">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddProduct;