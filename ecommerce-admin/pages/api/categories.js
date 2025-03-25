import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose"; // Ensure you have a connection function

export default async function handle(req, res) {
    await mongooseConnect();  

    const { method } = req;

    if (method === 'GET') {
        const categories = await Category.find().populate('parent'); 
        res.json(categories);
    }

    if (method === 'POST') {
        const { name, parentCategory } = req.body;
        
        const categoryData = { name };
        if (parentCategory) {
            categoryData.parent = parentCategory; // Assign only if valid
        }
        
        const categoryDoc = await Category.create(categoryData);
        res.json(categoryDoc);
    }
}
