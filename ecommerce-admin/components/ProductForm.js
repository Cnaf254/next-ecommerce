import {useState } from "react";
import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs"; 

import axios from "axios";
import { set } from "mongoose";
import Spinner from "./Spinner";
export default function ProductForm({_id,name:existingName,description:existingDescription,price:existingPrice,
images:existingImages,    
}) {
    const [goToProducts,setGoToProducts] = useState(false)
    const [name, setName] = useState(existingName||'');
    const [description, setDescription] = useState(existingDescription||'');
    const [price, setPrice] = useState(existingPrice||'');
    const [images, setImages] = useState(existingImages||[]);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    async function saveProduct(e){
        e.preventDefault();
        const product = {
            name,
            description,
            price,
            images
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
       
    
    return (
        
            <form onSubmit={saveProduct}>

            
            <label>Product name</label>
            <input 
                type="text" 
                placeholder="product name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
            />
            <label>
                Photos
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
                <ReactSortable className="flex flex-wrap gap-1" list={images} setList={updateImagesOrder}>
            {!!images?.length && images.map(link=>(
               <div key={link} className="h-24">
                <img src={link} className="rounded-lg"/>
               </div> 
            ))}
            </ReactSortable>
            {isUploading && (
                <div className="h-24 flex items-center">
<Spinner/>
                </div>
            )}
                
                <label className="w-24 h-24 text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
</svg>
<div>
Upload
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