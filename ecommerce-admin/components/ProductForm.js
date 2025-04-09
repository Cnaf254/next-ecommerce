import {useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs"; 

import axios from "axios";
import { set } from "mongoose";
import Spinner from "./Spinner";
export default function ProductForm({_id,name:existingName,description:existingDescription,price:existingPrice,
images:existingImages, 
category:assignedCategory,
properties:assignedProperties,   
}) {
    const [goToProducts,setGoToProducts] = useState(false)
    const [name, setName] = useState(existingName||'');
    const [category,setcategory] = useState(assignedCategory || "")
    const [productProperties,setProductProperties] = useState(assignedProperties || {});
    const [description, setDescription] = useState(existingDescription||'');
    const [price, setPrice] = useState(existingPrice||'');
    const [images, setImages] = useState(existingImages||[]);
    const [categories, setCategories] = useState([])
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    useEffect(()=>{
        axios.get('/api/categories').then(result=>{
setCategories(result.data);
        })

    },[])

    async function saveProduct(e){
        e.preventDefault();
        const product = {
            name,
            description,
            price,
            images,
            category,
            properties:productProperties,
        };
        if(_id){
            await axios.put('/api/products',{...product,_id });
            
            
        } else{

            
           await axios.post('/api/products',product);
           
        }
        setGoToProducts(true)
        
        }
        if(goToProducts){
            router.push('/products');
        }
        async function uploadImages(e){
            const files = e.target?.files;
            if(files?.length > 0){
                setIsUploading(true);
            const data = new FormData();
            for(const file of files){
                data.append('file',file);
            }

            const res = await axios.post('/api/upload', data);
            setImages(oldImages => [...oldImages,...res.data.uploadedFiles]);
            }
            setIsUploading(false);
          
            

        }

        function updateImagesOrder(images){
            setImages(images);

        }

        function setProductProp(propName,value){
            setProductProperties(prev=>{
                const newProductProps = {...prev};
                newProductProps[propName] = value;
                return newProductProps;
            })
        }
       
       const propertiesToFill = [];
         if(categories.length > 0 && category){
            let categoryInfo = categories.find(({_id})=> _id === category);
            propertiesToFill.push(...categoryInfo.properties);
        while(categoryInfo?.parent?._id){
            const parentCategory = categories.find(({_id})=> _id === categoryInfo.parent._id);
            propertiesToFill.push(...parentCategory.properties);
            categoryInfo = parentCategory;}
        }

            
            
    
    return (
        
            <form onSubmit={saveProduct}>

            
            <label>Product name</label>
            <input 
                type="text" 
                placeholder="product name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
            />
            <label>Category</label>
            <select value={category} onChange={ev=>setcategory(ev.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(category=>(
                    <option value={category._id}>{category.name}</option>
                ))}

            </select>
            {
                propertiesToFill.length > 0 && propertiesToFill.map(p=>(
                    <div className="">
                      <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                      <div>
                      <select value={productProperties[p.name]}
                      onChange={ev=>setProductProp(p.name,ev.target.value)}>
                        {p.values.map(v=>(
                            <option value={v}>{v}</option>
                        ))}
                      </select>
                      </div>
                      

                    </div>
                    
                )

                    
                )
            }
            <label>
                Photos
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
                <ReactSortable className="flex flex-wrap gap-1" list={images} setList={updateImagesOrder}>
            {!!images?.length && images.map(link=>(
               <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                <img src={link} className="rounded-lg"/>
               </div> 
            ))}
            </ReactSortable>
            {isUploading && (
                <div className="h-24 flex items-center">
<Spinner/>
                </div>
            )}
                
                <label className="w-24 h-24 text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
</svg>
<div>
Add image
</div>

          <input type="file" className="hidden" onChange={uploadImages}/>       
                </label>

            </div>

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