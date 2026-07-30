import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plano de Manutenção Frota",
  description: "Acesso rápido a arquivos de manutenção da frota",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100 min-h-screen text-gray-900 font-sans antialiased">
        <header className="bg-[#1E2A40] text-white py-4 px-4 sm:px-8 shadow-md sticky top-0 z-10 flex items-center">
          <img src="/icons/logo.png" alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-[15%] mr-4" />
          <h1 className="font-bold uppercase tracking-wide text-xl sm:text-2xl">
            FROTA ENERGIA
          </h1>
        </header>
        <main className="max-w-3xl mx-auto p-4 sm:p-6 pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
