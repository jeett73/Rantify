import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddProduct from "./AddProduct";
import LogOut from './LogOut';
import config from '../Config';
import axios from 'axios';
import moment from 'moment';
import ProductServices from '../services/products';
const ProductServicesObj = new ProductServices();

function Product({ products, loading, hasMore }) {
    const [mainProducts, setMainProducts] = useState([]);
    useEffect(() => {
        setMainProducts(products);
    }, [products]);

    const handleAvailability = async (event, productId) => {
        setMainProducts((prevProducts) =>
            prevProducts.map((product) =>
                product._id === productId
                    ? { ...product, isavailable: !product.isavailable }
                    : product
            )
        );
        const isChecked = event.target.checked;
        await ProductServicesObj.setProductAvailability(isChecked, productId);
    };
    let loggedUserId = localStorage.getItem("user");
    loggedUserId = JSON.parse(loggedUserId)

    // const handleAvailability = async (event, productId) => {
    //     const isChecked = event.target.checked;
    //     await ProductServicesObj.setProductAvailability(isChecked, productId);
    // }
    // useEffect(() => {
    //     console.log("USEEFFECT CALL");
    //     listAllProduct()
    // }, [])

    // const listAllProduct = async () => {
    //     const listAllProduct = await ProductServicesObj.getProductList();
    //     console.log(listAllProduct,"listAllProduct");
    //     setProducts(listAllProduct)
    //     // axios.post(`${config.base_url}/products/`, {}, {
    //     //     headers: {
    //     //         'authorization': localStorage.getItem("token"),
    //     //     }
    //     // }).then(response => {
    //     //     console.log(response.data);
    //     // }).catch(error => {
    //     //     console.log(error);
    //     //     // if (error.response.data.status == 401) {
    //     //     //     // navigate('/');
    //     //     // }
    //     // });
    // }

    return (
        <>
            <AddProduct />
            <LogOut />
            <div className="page-wrapper">
                {/* <!-- Page header --> */}
                <div className="page-header d-print-none">
                    <div className="container-xl">
                        <div className="row g-2 align-items-center">
                            <div className="col">
                                <h2 className="page-title">
                                    Products
                                </h2>
                                <div className="text-secondary mt-1">1-12 of 241 Products</div>
                            </div>
                            {/* <!-- Page title actions --> */}
                            <div className="col-auto ms-auto d-print-none">
                                <div className="d-flex">
                                    <div className="me-3">
                                        <div className="input-icon">
                                            <input type="text" value="" className="form-control" placeholder="Search…" />
                                            <span className="input-icon-addon">
                                                {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
                                            </span>
                                        </div>
                                    </div>
                                    <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-report">
                                        Add Your's
                                    </a>
                                    <div style={{ "marginLeft": "10px" }}>
                                        <a href="#" class="demo-icons-list-item" data-bs-toggle="modal" data-bs-target="#modal-success" data-bs-placement="top" aria-label="brand-gravatar" data-bs-original-title="brand-gravatar">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5.64 5.632a9 9 0 1 0 6.36 -2.632v7.714"></path></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Page body --> */}
                <div className="page-body">
                    <div className="container-xl">
                        <div className="row row-cards">
                            {mainProducts.map((product) => {
                                return <div className="col-sm-6 col-lg-4" key={product._id}>
                                    <div className="card card-sm">
                                        <a href="#" className="d-block"><img src={`${config.base_url}/${product.attachments[0].path}`} className="card-img-top" style={{ height: "300px", width: "500px" }} /></a>
                                        {/* <div style={{ position: "absolute", top: "50%", right: 0, transform: `translateY(-50%)`, color: "white", fontSize: "24px" }}>{">"}</div> */}
                                        <div className="card-body" style={{ backgroundColor: product.isavailable ? 'rgb(128, 196, 128)' : 'rgb(255 112 112 / 77%)' }} >
                                            <div className="d-flex align-items-center">
                                                <label class="form-check form-switch">
                                                    {loggedUserId.user._id == product.uploadedBy && (
                                                        <input
                                                            class="form-check-input"
                                                            type="checkbox"
                                                            checked={product.isavailable}
                                                            // checked={product.isavailable ? true : false}
                                                            // onChange={(event) => handleAvailability(event, product._id)}
                                                            onChange={(event) => handleAvailability(event, product._id)}
                                                        />
                                                    )}
                                                    {/* <input class="form-check-input" type="checkbox" checked={product.isavailable ? true : false} onChange={(event) => handleAvailability(event, product._id)} /> */}
                                                    <span class="form-check-label"></span>
                                                </label>
                                                {/* <span className="avatar me-3 rounded" style={{ backgroundImage: `url(./static/avatars/000m.jpg)` }}></span> */}
                                                <div>
                                                    <div>{product?.userDetails?.firstName}</div>
                                                    <div className="text-secondary">{moment(product.createdOn).format("MMMM DD")}</div>
                                                </div>
                                                <div className="ms-auto">
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="subheader">Rent</div>
                                                        </div>
                                                        <div className="d-flex align-items-baseline">
                                                            <div className="h1 mb-0 me-2">{product.rent}<div className="subheader">/{product.time}</div></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {loggedUserId.user._id != product.uploadedBy && (
                                                    <Link to={`/chats/${product.uploadedBy}`} class="demo-icons-list-item" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="message-2-plus" data-bs-original-title="message-2-plus" style={{ "marginTop": "5px" }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8 9h8"></path><path d="M8 13h6"></path><path d="M12.5 20.5l-.5 .5l-3 -3h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5"></path><path d="M16 19h6"></path><path d="M19 16v6"></path></svg>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                            {loading && <p>Loading...</p>}
                            {!loading && !hasMore && <p>No more items to load</p>}
                        </div>
                        {/* <div className="d-flex">
                            <ul className="pagination ms-auto">
                                <li className="page-item disabled">
                                    <a className="page-link" href="#" tabindex="-1" aria-disabled="true">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 6l-6 6l6 6"></path></svg>
                                        prev
                                    </a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item active"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item"><a className="page-link" href="#">4</a></li>
                                <li className="page-item"><a className="page-link" href="#">5</a></li>
                                <li className="page-item">
                                    <a className="page-link" href="#">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 6l6 6l-6 6"></path></svg>
                                    </a>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </div>
                {/* <footer className="footer footer-transparent d-print-none">
                    <div className="container-xl">
                        <div className="row text-center align-items-center flex-row-reverse">
                            <div className="col-lg-auto ms-lg-auto">
                                <ul className="list-inline list-inline-dots mb-0">
                                    <li className="list-inline-item"><a href="https://tabler.io/docs" target="_blank" className="link-secondary" rel="noopener">Documentation</a></li>
                                    <li className="list-inline-item"><a href="./license.html" className="link-secondary">License</a></li>
                                    <li className="list-inline-item"><a href="https://github.com/tabler/tabler" target="_blank" className="link-secondary" rel="noopener">Source code</a></li>
                                    <li className="list-inline-item">
                                        <a href="https://github.com/sponsors/codecalm" target="_blank" className="link-secondary" rel="noopener">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-pink icon-filled icon-inline" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                                            Sponsor
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                                <ul className="list-inline list-inline-dots mb-0">
                                    <li className="list-inline-item">
                                        Copyright © 2023
                                        <a href="." className="link-secondary">Tabler</a>.
                                        All rights reserved.
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="./changelog.html" className="link-secondary" rel="noopener">
                                            v1.0.0-beta20
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer> */}
            </div >
        </>
    )
}

export default Product;