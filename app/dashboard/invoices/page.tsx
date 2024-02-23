import Table from '@/app/ui/invoices/table'
import { lusitana } from '@/app/ui/fonts'
import { CreateInvoice } from '@/app/ui/invoices/buttons'
import Search from '@/app/ui/search'
import { InvoicesTableSkeleton } from '@/app/ui/skeletons'
import { Suspense } from 'react'
import { fetchInvoicesPages } from '@/app/lib/data'
import Pagination from '@/app/ui/invoices/pagination'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invoices',
}

export default async function Invoice({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
  }
}) {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1

  const totalPages = await fetchInvoicesPages(query)

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className={`${lusitana.className} text-2xl`}>Invoices</div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search Invoices" />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
