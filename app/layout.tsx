import "./css/style.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Providers from "@/components/Providers"; // ⬅️ ajoute ça

// … tes fonts et metadata inchangés …

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${nacelle.variable} bg-white font-inter text-base text-gray-900 antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
