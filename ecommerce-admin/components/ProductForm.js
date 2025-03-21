import {useState } from "react";
import { useRouter } from "next/router";

import axios from "axios";
export default function ProductForm({name:existingName,description:existingDescription,price:existingPrice}) {

    const [name, setName] = useState(existingName||'');
    const [description, setDescription] = useState(existingDescription||'');
    const [price, setPrice] = useState(existingPrice||'');
    const router = useRouter();

    async function createProduct(e){
        e.preventDefault();
        const product = {
            name,
            description,
            price
        };
       await axios.post('/api/products',product);
        router.push('/products');
    }
    
    return (
        
            <form onSubmit={createProduct}>

            <h1>New Product</h1>
            <label>Product name</label>
            <input 
                type="text" 
                placeholder="product name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
            />

            <label>Description</label>
            <textarea 
                placeholder="description" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
            />

            <label>Price (in USD)</label>
            <input 
                type="number" 
                placeholder="price" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
            />
            <button type="submit" className="btn-primary">Save</button>
            </form>
       
    )
}