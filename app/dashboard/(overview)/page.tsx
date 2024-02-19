import { Suspense } from 'react'
import CardWrapper from '../../ui/dashboard/cards'
import LatestInvoices from '../../ui/dashboard/latest-invoices'
import RevenueChart from '../../ui/dashboard/revenue-chart'
import { lusitana } from '../../ui/fonts'
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardSkeleton,
} from '@/app/ui/skeletons'

export default async function Page() {
  // const latestInvoices = await fetchLatestInvoices() esperando a  acabar

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <CardWrapper />
        </Suspense>
        {/* <Card title="Colleted" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          {' '}
          {/* Só irá mostrar o que está dentro após todo o componente carregar */}
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          {' '}
          {/* Só irá mostrar o que está dentro após todo o componente carregar */}
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  )
}
