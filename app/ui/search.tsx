'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams() // Metodos da URL
  const pathname = usePathname() // Caminho da URL
  const { replace } = useRouter() // rotas

  // console.log(searchParams)
  // console.log('path ' + pathname)
  // console.log('replace ' + replace)

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('query', term)
      console.log(params.toString())
    } else {
      params.delete('query')
    }
    replace(`${pathname}?${params.toString()}`)
  }
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()} // Associando os valores da URL com o input
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  )
}
