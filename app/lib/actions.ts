'use server' // Usando o serivdor e tudo que está no arquivo é uma server function
import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
const formSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
})

const CreateInvoice = formSchema.omit({ id: true, date: true })

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  }) // Validando o schema com parse
  try {
    const amountInCents = amount * 100 // Transformando em centavos
    const date = new Date().toISOString().split('T')[0]

    await sql`
            INSERT INTO 
                invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `
    revalidatePath('/dashboard/invoices') // funciona como o reset do 'hookForms', porém limpa a rota do cache do next e depois faz uma nova soliçitação ao servidor
    console.log('Adicionado')
  } catch (e) {
    console.log(e)
  }
  redirect('/dashboard/invoices')
}

const UpdateInvoice = formSchema.omit({ id: true, date: true })

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  const amountInCents = amount * 100
  try {
    await sql`
      UPDATE invoices SET 
        customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `
  } catch (e) {
    console.log(e)
  }
  revalidatePath('/dashboard/invoices') // Fazendo uma nova requisição para o servidor
  redirect('/dashboard/invoices') // Fazendo um redirecionamento
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice')

  try {
    await sql`
      DELETE FROM invoices WHERE id = ${id}
      `
    revalidatePath('/dashboard/invoices')
    return { message: 'Deleted Invoice' }
  } catch (e) {
    return { message: 'Failed to DELETE invoice' }
  }
}
