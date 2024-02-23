'use server' // Usando o serivdor e tudo que está no arquivo é uma server function
import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
const formSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'please select a customer',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'please select an invoice status',
  }),
  date: z.string(),
})

const CreateInvoice = formSchema.omit({ id: true, date: true })

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  }) // Validando o schema com parse

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice',
    }
  }

  const { customerId, amount, status } = validatedFields.data
  const amountInCents = amount * 100 // Transformando em centavos
  const date = new Date().toISOString().split('T')[0]

  try {
    await sql`
            INSERT INTO 
                invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `
    console.log('Adicionado')
  } catch (error) {
    return {
      message: 'Database Error: Failed to create invoice',
    }
  }
  revalidatePath('/dashboard/invoices') // funciona como o reset do 'hookForms', porém limpa a rota do cache do next e depois faz uma nova soliçitação ao servidor
  redirect('/dashboard/invoices')
}

const UpdateInvoice = formSchema.omit({ id: true, date: true })

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to update invoice',
    }
  }

  const { customerId, amount, status } = validatedFields.data
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
  // throw new Error('Failed to Delete Invoice')

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
