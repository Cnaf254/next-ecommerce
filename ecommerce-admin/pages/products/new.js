import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import {useState} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function NewProduct() {
    return (
        <Layout>
    <ProductForm />
    </Layout>
    )
}