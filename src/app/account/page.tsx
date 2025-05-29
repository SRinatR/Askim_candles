"use client";
import { useEffect } from 'react';
import { useRouter }  from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/account/profile');
  }, [router]);

  return null; // Or a loading spinner
}
