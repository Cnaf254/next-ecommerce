import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import {isAdminRequest } from "./auth/[...nextauth]";


export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
     await isAdminRequest(req, res); 


    try {
        if (method === "GET") {
            const categories = await Category.find().populate("parent");
            return res.status(200).json(categories);  
        }

        if (method === "PUT") {
            const { name, parentCategory,properties, _id } = req.body;
            const categoryDoc = await Category.updateOne({ _id }, { name, parent: parentCategory || undefined, properties });
            return res.status(200).json(categoryDoc); 
        }

        if (method === "POST") {
            const { name, parentCategory,properties } = req.body;
            const categoryDoc = await Category.create({ name, parent: parentCategory || undefined, properties });
            return res.status(201).json(categoryDoc); 
        }

        if (method === "DELETE") {
            if (!req.query?.id) {
                return res.status(400).json({ error: "Missing category ID" }); 
            }

            await Category.deleteOne({ _id: req.query.id });
            return res.status(200).json({ success: true }); 
        }

        //Handle unsupported methods
        return res.status(405).json({ error: `Method ${method} not allowed` });

    } catch (error) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
