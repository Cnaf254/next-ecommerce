import Layout from "@/components/Layout";
import {useState,useEffect} from 'react';
import axios from 'axios';
 
export default function Categories() {
  const [editedCategory,setEditedCategory]= useState(null);
    const [name,setName] = useState([]);
    const [categories, setCategories]=useState('')
    const [parentCategory, setParentCategory]= useState('')

   function getCategories(){
     
      axios.get('/api/categories').then(result=>{
        setCategories(result.data)
      })
      
        
    }

    useEffect(()=>{
      getCategories();
       
    },[]);

    async function saveCategory(e) {
        e.preventDefault();
        const data = {name, parentCategory};

        if(editedCategory){
          data._id = editedCategory._id;
        await axios.put('/api/categories', data)
        setEditedCategory(null)

        } else{
          await axios.post('/api/categories', data);
        }
        
        setName('');
        getCategories();
    }
    function editCategory(category){
      setEditedCategory(category);
      setName(category.name);
      setParentCategory(category.parent?._id);

    }
async function deleteCategory(category){
  const _id=category._id;
 
  await axios.delete('/api/categories?_id='+ _id);
}

  return (
    <Layout>
        
        <h1>Categories</h1>
        
            <label>{editedCategory ? `Edit category ${editedCategory.name}`: 'Create new category'} </label>
            <form onSubmit={saveCategory} className="flex gap-1">
            <input type="text" placeholder="category name" value={name} className="mb-0" onChange={ev=>setName(ev.target.value)} />

            <select className="mb-0" value={parentCategory} onChange={ev=> setParentCategory(ev.target.value)}>
              <option value="">No Parent Category</option>
              {categories.length > 0 && categories.map(category =>(
                  <option value={category._id}>
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
                  <td>
                    Parent name
                  </td>
                  <td>

                  </td>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 && categories.map(category =>(
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    
                    <td>{category?.parent?.name}</td>
                    <td>
                      <button className='btn-primary mr-1' onClick={()=>editCategory(category)}>Edit</button>

                      <button className='btn-primary' onClick={deleteCategory(category)}>Delete</button>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>

        
    </Layout>
  );
}