import { useEffect,useState} from 'react';
import Layout from '../../../components/Layout'
import {useRouter} from 'next/router'
import ProductForm from '@/components/ProductForm';
import axios from 'axios';
export default function EditProductPage(){
   const [productInfo, setProductInfo] = useState(null);

   const router = useRouter();
   const {id} = router.query;
   useEffect(()=>{
      if(!id){
          return;}

        axios.get('/api/products?id='+id)
        .then(response=>{
            setProductInfo(response
            .data);
        })
        .catch(error=>{
            console.log(error);
        })
   },[id])
   return (
    <Layout>
      <h1>Edit Product</h1>
      {productInfo && <ProductForm {...productInfo}/>}
        
</Layout>
   )
}