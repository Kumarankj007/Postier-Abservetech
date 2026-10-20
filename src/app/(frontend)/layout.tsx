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
//   const User_id: any = cookies().get('appUserId')
//   const token: any = cookies().get('appToken')
//   if(User_id && token){
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/common/user/profile/${User_id?.value}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `${token?.value}`,
//       },
//       cache:'no-cache',
//       next: { revalidate: 0 }, // Disable caching for fresh data
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch user profile");
//   }

//   const data = await response.json();
//   console.log('emailVerified', data?.data?.profile?.emailVerified)
//   console.log('phoneVerified', data?.data?.profile?.phoneVerified)
//   if((!data?.data?.profile?.emailVerified || !data?.data?.profile?.phoneVerified)){
//     console.log('iam innn4')
//     redirect('/accountsettings/profileDetails?type=auth')
//   }
// }

return (
    <div className="p-0 m-0">
      <Suspense>
        <Header />
       
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
