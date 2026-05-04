import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Lele Farm",
    default: "Lele Farm",
  },
  description: "A dashboard for monitoring and managing your Fish services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      {/* <head>
        <Script
          id="maze-snippet"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function (m, a, z, e) {
  var s, t, u, v;
  try {
    t = m.sessionStorage.getItem('maze-us');
  } catch (err) {}

  if (!t) {
    t = new Date().getTime();
    try {
      m.sessionStorage.setItem('maze-us', t);
    } catch (err) {}
  }

  u = document.currentScript || (function () {
    var w = document.getElementsByTagName('script');
    return w[w.length - 1];
  })();
  v = u && u.nonce;

  s = a.createElement('script');
  s.src = z + '?apiKey=' + e;
  s.async = true;
  if (v) s.setAttribute('nonce', v);
  a.getElementsByTagName('head')[0].appendChild(s);
  m.mazeUniversalSnippetApiKey = e;
})(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'e2d8b224-8fe4-41ef-ab8a-5d7db380c90f');`,
          }}
        />
      </head> */}
      <body className={`antialiased`}>
        <Provider>
          <TooltipProvider>{children}</TooltipProvider>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
