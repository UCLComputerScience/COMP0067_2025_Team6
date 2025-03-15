import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard/lab1'); // Redirects to '/auth/sign-in'
}