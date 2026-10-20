import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import GlobalProvider from "./component/GlobalProvider";
import ErrorBoundary from "./component/ErrorBoundary";
import { getDictionary } from "./component/dictionaries";
import { cookies } from "next/headers";
const inter = DM_Sans({ subsets: ["latin"], variable: '--base-font', });

export const metadata: Metadata = {
  title: "Postier",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang:any = cookies().get('NEXT_LOCALE') || 'en'
  const dict = await getDictionary(lang.value)
  return (
    <html lang="en">
      <head>
      <link rel="shortcut icon" href="/postier-favicon-new.png" />
      </head>
      <body className={inter.className}>
        <GlobalProvider i18={dict}>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
