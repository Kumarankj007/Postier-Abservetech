import { cookies } from "next/headers";
import Header from "../component/header";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import LinearLoader from "../component/linearLoader";
import LoadingIndicator from "../component/redirection";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const User_id: any = cookies().get('appUserId')
  // const token: any = cookies().get('appToken')
  // console.log('token', token.value)
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/common/user/profile/${User_id?.value}`,
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `${token?.value}`,
  //     },
  //     next: { revalidate: 0 }, // Disable caching for fresh data
  //   }
  // );

  // if (!response.ok) {
  //   throw new Error("Failed to fetch user profile");
  // }

  // const data = await response.json();
  // console.log('emailVerified', data?.data?.profile?.emailVerified)
  // if((!data?.data?.profile?.emailVerified || !data?.data?.profile?.phoneVerified)){
  //   redirect('/accountsettings/profileDetails?type=auth')
  // }
  return (
    <div>
      <Suspense>
          <Header />
        <LinearLoader />
        <div className="LayoutHeight m-auto">
        <LoadingIndicator/>
        {children}
        </div>
      </Suspense>
    </div>
  );
}
