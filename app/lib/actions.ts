'use server'
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';


const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string()
});

const CreateInvoice = FormSchema.omit({ id: true, date: true })

export default async function createInvoice(fromData: FormData) {

  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: fromData.get('customerId'),
    amount: fromData.get('amount'),
    status: fromData.get('status')
  })

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0]


  try {
    await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
  } catch (error) {
    return {
      message: 'Database Error: Fail to create invoice'
    }
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices')
}

const UpdateInvoice = await FormSchema.omit({ id: true, date: true })

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;
  } catch (error) {
    return {
      message: 'Database Error: Fail to update invoice'
    }
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    // throw new Error('Fail to delete invoice')
 try {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
  return { 
    message: 'Delete Invoice'
  }
 } catch (error) {
  return 'Database Error: Fail to Delete Invoice'
 }
}