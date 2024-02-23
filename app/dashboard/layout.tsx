import { ReactNode } from 'react'
import SideNav from '../ui/dashboard/sidenav'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}

interface layoutProps {
  children: ReactNode
}

export default function Layout({ children }: layoutProps) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>

      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  )
}
