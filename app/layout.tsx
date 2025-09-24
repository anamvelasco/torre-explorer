export const metadata = {
  title: "Torre Explorer",
  description: "Profiles viewer",
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
