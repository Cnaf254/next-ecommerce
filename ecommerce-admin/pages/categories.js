import Layout from "@/components/Layout";
import {useState,useEffect} from 'react';
import axios from 'axios';
 
export default function Categories() {
    const [name,setName] = useState([]);
    const [categories, setCategories]=useState('')
    const [parentCategory, setParentCategory]= useState('')

   function getCategories(){
     
      axios.get('/api/categories').then(result=>{
        setCategories(result.data)
      })
      console.log(parentCategory)
        
    }

    useEffect(()=>{
      getCategories();
       
    },[]);

    async function saveCategory(e) {
        e.preventDefault();
        await axios.post('/api/categories',{name, parentCategory});
        setName('');
        getCategories();
    }
  return (
    <Layout>
        
        <h1>Categories</h1>
        
            <label>New category name</label>
            <form onSubmit={saveCategory} className="flex gap-1">
            <input type="text" placeholder="category name" value={name} className="mb-0" onChange={ev=>setName(ev.target.value)} />

            <select className="mb-0" value={parentCategory} onChange={ev=> setParentCategory(ev.target.value)}>
              <option value="">No Parent Category</option>
              {categories.length > 0 && categories.map(category =>(
                  <option value={category.name}>
                    {category.name}
                  </option>
                ))}

            </select>
            <button type="submit" className="btn-primary p-1">Save</button>
            </form>

            <table className="basic mt-4">
              <thead>
                <tr>
                  <td>
                    Category name
                  </td>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 && categories.map(category =>(
                  <tr>
                    <td>{category.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>

        
    </Layout>
  );
}