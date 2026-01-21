import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
// 1. Import the AuthProvider from your context folder
import { AuthProvider } from "@/context/AuthContext"; 
import ApiProvider from "@/context/ApiContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const myName = process.env.NEXT_PUBLIC_NAME;

export const metadata = {
  title: `${myName} Portfolio`,
  description: "This is my portfolio website",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};




export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {/* 2. Wrap children with AuthProvider to share auth state globally */}
        <AuthProvider>
          <ToastProvider>
            <ApiProvider>
              {children}
            </ApiProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}