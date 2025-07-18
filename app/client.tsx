'use client';

import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/login' || pathname === '/register';

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar />}
      {children}
    </AuthProvider>
  );
  
}

