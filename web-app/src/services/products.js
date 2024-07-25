import config from '../Config';
import axios from 'axios';

const products = class {
    // constructor
    constructor() { }

    getProductList(page) {
        return new Promise(async (resolve, reject) => {
            try {
                axios.post(`${config.base_url}/products/`, {
                    start: page,
                    length: 6
                }, {
                    headers: {
                        'authorization': localStorage.getItem("token"),
                    }
                }).then(response => {
                    console.log(response.data);
                    resolve(response.data.data);
                    // setProducts(response.data.data)
                }).catch(error => {
                    console.log(error);
                    reject(error)
                    // if (error.response.data.status == 401) {
                    //     // navigate('/');
                    // }
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    addProduct(formDataFinal) {
        return new Promise(async (resolve, reject) => {
            try {
                let loggedUserId = localStorage.getItem("user");
                loggedUserId = JSON.parse(loggedUserId);
                axios.post(`${config.base_url}/products/${loggedUserId.user._id}/save`, formDataFinal, {
                    headers: {
                        'authorization': localStorage.getItem("token"),
                    }
                }).then(response => {
                    console.log(response, "responseresponseresponse");
                    resolve(response);
                    // this.getProductList();
                }).catch(error => {
                    reject(error);
                    // if (error.response.data.status == 401) {
                    //     // navigate('/');
                    // }
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    setProductAvailability(status, productId) {
        return new Promise(async (resolve, reject) => {
            try {
                axios.put(`${config.base_url}/products/${productId}/change-status`, { status: status }, {
                    headers: {
                        'authorization': localStorage.getItem("token"),
                    }
                }).then(response => {
                    console.log(response, "responseresponseresponse");
                    resolve(response);
                    // this.getProductList();
                }).catch(error => {
                    reject(error);
                    // if (error.response.data.status == 401) {
                    //     // navigate('/');
                    // }
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    getUserChats(receivedBy, loggedUser) {
        return new Promise(async (resolve, reject) => {
            try {
                axios.get(`${config.base_url}/chats/${loggedUser}/${receivedBy}`, {
                    headers: {
                        'authorization': localStorage.getItem("token"),
                    }
                }).then(response => {
                    console.log(response.data.data, "responseresponseresponse");
                    resolve(response.data.data);
                    // this.getProductList();
                }).catch(error => {
                    console.log("11111111111111111111111111111111111111111111111111111");
                    reject(error);
                    // if (error.response.data.status == 401) {
                    //     // navigate('/');
                    // }
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    getChatPersonsList(id) {
        return new Promise(async (resolve, reject) => {
            try {
                axios.get(`${config.base_url}/chats/chat/persons/${id}`, {
                    headers: {
                        'authorization': localStorage.getItem("token"),
                    }
                }).then(response => {
                    console.log(response.data.data, "responseresponseresponse");
                    resolve(response.data.data);
                    // this.getProductList();
                }).catch(error => {
                    reject(error);
                    // if (error.response.data.status == 401) {
                    //     // navigate('/');
                    // }
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });

    }
};
export default products;
