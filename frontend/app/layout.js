import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/navbar";
import SplashScreenWrapper from "../components/SplashScreenWrapper";

export const metadata = {
  title: "ENFLIX | Premium Streaming",
  description: "Cinematic movie management platform."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen text-white select-none">
        <Providers>
          <SplashScreenWrapper>
            <Navbar />
            <main className="max-w-7xl mx-auto p-6 md:p-8">{children}</main>
          </SplashScreenWrapper>
        </Providers>
      </body>
    </html>
  );
}
