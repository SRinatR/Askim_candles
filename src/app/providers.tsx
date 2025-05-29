
"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider as SimulatedAuthProvider } from "@/contexts/AuthContext"; // Renamed to avoid conflict

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider> {/* For NextAuth social logins */}
      <SimulatedAuthProvider> {/* For client-side email/password simulation */}
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </SimulatedAuthProvider>
    </SessionProvider>
  );
}
