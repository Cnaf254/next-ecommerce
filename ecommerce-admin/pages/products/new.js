import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import {useState} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function NewProduct() {
    return (
    <Layout>
    <h1>New Product</h1>
    <ProductForm />
    </Layout>
    )
}