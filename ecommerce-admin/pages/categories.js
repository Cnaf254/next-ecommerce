import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Categories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState(null);
  const [properties,setProperties] = useState([])


  function getCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  useEffect(() => {
    getCategories();
  }, []);

  async function saveCategory(e) {
    e.preventDefault();
    const data = { name, parentCategory, properties:properties.map(p=>({name:p.name,values:p.values.split(',')})) };
    console.log(data);

    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }

    setName("");
    setParentCategory('');
    setProperties([]);
    getCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id || null);
    setProperties(category.properties.map(p=>({name:p.name,values:p.values.join(',')})));
  }

  async function deleteCategory(category) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete category "${category.name}"?`
    );
    
    if (confirmDelete) {
      await axios.delete(`/api/categories?id=${category._id}`);
      getCategories(); // Refresh the category list
    }
  }

 function addProperty() {
  setProperties(prev =>{
    return [...prev,{name:'', values:''}];
  });
 }

 function handlePropertyNameChange(index, property, newName) {
  setProperties(prev => {
    const properties = [...prev];
    properties[index].name = newName;
    return properties;
  })

 }

 function handlePropertyValuesChange(index, property, newValues) {
  setProperties(prev => {
    const properties = [...prev];
    properties[index].values = newValues;
    return properties;
  })

 }

 function removeProperty(indexToRemove){
          setProperties(prev => {
            return [...prev].filter((p,pIndex)=>{
              return pIndex !== indexToRemove;
            })
          })
 }

  return (
    <Layout>
      <h1>Categories</h1>

      <label>
        {editedCategory ? `Edit category "${editedCategory.name}"` : "Create new category"}
      </label>
      <form onSubmit={saveCategory} >
        <div className="flex gap-1">
        <input
          type="text"
          placeholder="Category name"
          value={name}
         
          onChange={(ev) => setName(ev.target.value)}
        />

        <select
          
          value={parentCategory}
          onChange={(ev) => setParentCategory(ev.target.value)}
        >
          <option value="">No Parent Category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button onClick={addProperty} className="btn-default text-sm mb-2" type="button">Add new property</button>
          {properties.length > 0 && properties.map((property,index) =>(
            <div className="flex gap-1 mb-2">
             <input type='text' placeholder="property name (example: color)"
             value={property.name}
             onChange={(ev)=> handlePropertyNameChange(index,property, ev.target.value)} className="mb-0"/>
             <input type="text" placeholder="values, comma separated"
             value={property.values}
             onChange={(ev)=> handlePropertyValuesChange(index,property, ev.target.value)} className="mb-0"/>

             <button type="button" className="btn-default"
             onClick={()=> removeProperty(index)}>Remove</button>
            </div>
          )

          )}
        </div>
        <div className="flex gap-1">
        {
          editedCategory && (
<button className="btn-default"
onClick={()=> {setEditedCategory(null)
  setName('')
  setParentCategory('')
  setProperties([])

}} type="button">Cancel</button>
          )
        }
        
        <button type="submit" className="btn-primary p-1">Save</button>

        </div>
        
      </form>

      {
        !editedCategory && (
<table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent name</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name || "None"}</td>
                <td>
                  <button className="btn-primary mr-1" onClick={() => editCategory(category)}>
                    Edit
                  </button>
                  <button className="btn-primary bg-red-500" onClick={() => deleteCategory(category)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
        )
      }

      
    </Layout>
  );
}
