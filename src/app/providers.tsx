

"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider as SimulatedAuthProvider } from "@/contexts/AuthContext"; // For frontend users
// AdminAuthProvider is applied specifically in admin layouts/pages to avoid nesting contexts unnecessarily for non-admin parts

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider> {/* For NextAuth social logins (frontend) */}
      <SimulatedAuthProvider> {/* For client-side email/password simulation (frontend) */}
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </SimulatedAuthProvider>
    </SessionProvider>
  );
}

