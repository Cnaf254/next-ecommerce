import {Category} from "../../models/Category"
import { mongooseConnect } from "@/lib/mongoose";
export default async function handle (req,res){
 const {method} = req;
 if(method === 'POST'){
    const {name} = req.body;
    await mongooseConnect();
    const productData = await Category.create({name});
    res.json(productData)
 }

}