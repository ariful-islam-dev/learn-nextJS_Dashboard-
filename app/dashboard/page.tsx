import { Suspense } from "react";
import {  fetchLatestInvoices, fetchRevenue } from "../lib/data";
import CardWrapper from "../ui/dashboard/cards";
import LatestInvoices from "../ui/dashboard/latest-invoices";
import RevenueChart from "../ui/dashboard/revenue-chart";
import { lusitana } from "../ui/fonts";
import { CardSkeleton, CardsSkeleton } from "../ui/skeletons";

export default async function Page(){
    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices();


    return <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ">
            <Suspense fallback={<CardsSkeleton/>}>
                <CardWrapper/>
            </Suspense>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
          <RevenueChart revenue={revenue}/>
            <LatestInvoices latestInvoices={latestInvoices} />
        </div>
    </main>
}