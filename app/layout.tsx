import AuthProvider from "@/components/providers/AuthProvider";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
// ...fonts + metadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            {children}
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
