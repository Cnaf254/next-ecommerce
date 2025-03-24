import Layout from "@/components/Layout";
import {useState} from 'react';
import axios from 'axios';
 
export default function Categories() {
    const [name,setName] = useState('')

    async function saveCategory(e) {
        e.preventDefault();
        await axios.post('/api/categories',{name});
    }
  return (
    <Layout>
        <h1>New Categories</h1>
        <form onSubmit={saveCategory} className="">
            <label>Category name</label>
            <div className="flex gap-1">
            <input type="text" placeholder="categories" value={name} className="mb-0" onChange={ev=>setName(ev.target.value)} />
            <button type="submit" className="btn-primary p-1">Save</button>
            </div>

        </form>
    </Layout>
  );
}