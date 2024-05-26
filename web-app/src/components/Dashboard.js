import React, { useState, useEffect, useRef } from 'react';
import AddProduct from "./AddProduct";
import Product from "./Product";
import ProductServices from '../services/products';
const ProductServicesObj = new ProductServices();

function Dashboard() {
    let loggedUserId = localStorage.getItem("user");
    loggedUserId = JSON.parse(loggedUserId);

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const initialLoadDone = useRef(false); // Ref to track initial API call

    useEffect(() => {
        const handleScroll = () => {
            if (!loading && hasMore && window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                listAllProduct();
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading, hasMore]);

    const listAllProduct = async () => {
        setLoading(true);
        try {
            // Simulate fetching data
            const listAllProduct = await ProductServicesObj.getProductList(page);
            setProducts(prevItems => [...prevItems, ...listAllProduct])

            // If no more data available, set hasMore to false
            if (listAllProduct.length === 0) {
                setHasMore(false);
            }
            setPage(prevPage => prevPage + 6);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!initialLoadDone.current) {
            listAllProduct();
            initialLoadDone.current = true;
        }
    }, []);

    // const handleAddProduct = (newProduct) => {
    //     setProducts([...products, newProduct]);
    // };

    return (
        <div>
            <AddProduct onAddProduct={listAllProduct} />
            <Product products={products} loading={loading} hasMore={hasMore} />
        </div>
    )

}
export default Dashboard;