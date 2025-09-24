// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Torre Explorer",
  description: "Profile search and strengths exploration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <header className="topbar">
          <div className="container row">
            <Link href="/" className="brand">
              <img src="/torre.svg" alt="Torre" width={28} height={28} />
              <span className="brand-text">Torre Explorer</span>
            </Link>

            <nav className="nav">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/search" className="nav-link">Search by name</Link>
              <a className="nav-link" href="https://torre.ai" target="_blank" rel="noreferrer">torre.ai</a>
            </nav>
          </div>
        </header>

        <main className="container page">{children}</main>

        <footer className="footer">
          <div className="container row footer-row">
            <span className="small">Made with ❤️ for the technical test</span>
            <a className="small link" href="https://github.com/anamvelasco/torre-explorer" target="_blank" rel="noreferrer">Repository</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
