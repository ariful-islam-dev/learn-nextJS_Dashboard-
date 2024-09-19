import { lusitana } from "@/app/ui/fonts";

import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Customers | Acme Dashboard',
};
export default function Page (){
    return <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Customers Page</h1>
}