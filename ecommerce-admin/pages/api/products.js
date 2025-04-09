import Product from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    try {
        if (method === "GET") {
            if (req.query?.id) {
                const product = await Product.findOne({ _id: req.query.id });

                if (!product) {
                    return res.status(404).json({ error: "Product not found" });
                }

                return res.status(200).json(product);
            } else {
                const products = await Product.find();

                if (products.length === 0) {
                    return res.status(200).json({ message: "No products available" });
                }

                return res.status(200).json(products);
            }
        }

        if (method === "POST") {
            const { name, description, price, images,category,properties} = req.body;

            if (!name || !price ) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const productDoc = await Product.create({ name, description, price, images,category,properties });
            return res.status(201).json(productDoc);
        }

        if (method === "PUT") {
            const { name, description, price, images,category,properties, _id } = req.body;

            if (!_id) {
                return res.status(400).json({ error: "Missing product ID" });
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                _id,
                { name, description, price, images,category,properties },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ error: "Product not found" });
            }

            return res.status(200).json(updatedProduct);
        }

        if (method === "DELETE") {
            if (!req.query?.id) {
                return res.status(400).json({ error: "Missing product ID" });
            }

            const deletedProduct = await Product.findByIdAndDelete(req.query.id);

            if (!deletedProduct) {
                return res.status(404).json({ error: "Product not found" });
            }

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: `Method ${method} not allowed` });

    } catch (error) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
