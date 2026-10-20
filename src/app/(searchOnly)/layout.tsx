import type { Metadata } from "next";
import Header from "../component/header";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import MyProfile from "../component/profileDetails/MyProfile";
import { redirect } from "next/navigation";
import LinearLoader from "../component/linearLoader";
import LoadingIndicator from "../component/redirection";
import LoadingWidget from "../component/link";

const Footer: any = dynamic(() => import('../component/footer'))

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

return (
    <div className="p-0 m-0">
      <Suspense>
        <Header helpCenter={true}/>
       
        <div className="LayoutHeight1">
          <LoadingIndicator/>
          { children }
        </div>
        <div>
          <Footer />
        </div>
      </Suspense>
    </div>
  );
}
