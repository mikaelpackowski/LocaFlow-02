export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 text-gray-700 border-t">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xl font-semibold">ForGesty</h2>
            <p className="text-sm">Simplifiez votre gestion locative.</p>
          </div>

          <nav className="space-x-4 text-sm">
            <a href="#proprietaire" className="hover:underline">Propriétaire</a>
            <a href="#locataire" className="hover:underline">Locataire</a>
            <a href="#annonces" className="hover:underline">Annonces</a>
            <a href="#faq" className="hover:underline">FAQ</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
        </div>

        <div className="mt-6 text-xs text-center text-gray-500">
          © 2025 ForGesty. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
