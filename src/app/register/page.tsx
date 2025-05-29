
// This page is no longer needed as NextAuth.js with social providers handles user registration.
// You can delete this file. Redirects or direct social login buttons are preferred.

// "use client"; // If you were to keep it for some reason, it would need to be a client component

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

export default function RegisterPage() {
  // const router = useRouter();
  // useEffect(() => {
  //   // Redirect to login or a specific page as registration is handled by providers
  //   router.replace("/login"); 
  // }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Registration</h1>
        <p className="text-muted-foreground">
          User registration is handled through our identity providers (e.g., Google).
        </p>
        <p className="text-muted-foreground mt-2">
          Please proceed to the <a href="/login" className="text-primary hover:underline">login page</a> to sign up or sign in.
        </p>
      </div>
    </div>
  );
}

// If you decide to delete this file, ensure all links pointing to /register are updated or removed.
