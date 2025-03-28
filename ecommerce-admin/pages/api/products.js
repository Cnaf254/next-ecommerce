
import Product from '@/models/Product';
import { mongooseConnect } from '@/lib/mongoose';   

export default async function handle(req,res){
    const {method} = req;
    await mongooseConnect();
    if(method === 'GET'){
        if(req.query?.id){
            const product = await Product.findOne({_id:req.query.id});
            res.json(product);
           
        }else{
        const products = await Product.find();
        res.json(products);
        }
        
    }
    if(method === 'POST'){
        const {name,description,price,images} = req.body;
        const productDoc= await Product.create({name,description,price,images});
        res.json(productDoc);
        
    }
    if(method === 'PUT'){
        const {name,description,price,images, _id} = req.body;
        
        
        await Product.updateOne({_id}, {name, description, price,images});
        
        res.json(true);

    }
    if(method === 'DELETE'){
        if(req.query?.id){
            await Product.deleteOne({_id:req.query.id});
            res.json(true);
        }
        
    }
        
}