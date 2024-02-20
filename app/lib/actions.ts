'use server'
import { z } from 'zod'

const formSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
})

interface a {z.object({id:z.string()})}.
const createSchema = formSchema.omit({id:true, date:true})

export async function createInvoice(formData: FormData) {
  try {
    const rawFormData = {
      custormersId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }
    console.log(rawFormData)
    console.log(typeof rawFormData.amount)
  } catch (e) {
    console.log(e)
  }
}
