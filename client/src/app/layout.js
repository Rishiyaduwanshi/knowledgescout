import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "KnowledgeScout - Intelligent Document Q&A",
  description: "Upload documents and ask questions with AI-powered answers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="container-fluid px-0">
            {children}
          </main>
        </AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e1e1e',
              color: '#fff',
              border: '1px solid #333',
            },
          }}
        />
        {/* Bootstrap JS */}
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          async
        ></script>
      </body>
    </html>
  );
}
