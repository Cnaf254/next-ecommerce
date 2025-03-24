import { model, Schema, models } from 'mongoose';

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images:[{type: String}],
});

// Prevent redefining the model
const Product = models.Product || model('Product', ProductSchema);

export default Product;
