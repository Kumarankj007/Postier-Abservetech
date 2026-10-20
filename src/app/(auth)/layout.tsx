import { Suspense } from "react";
import LinearLoader from "../component/linearLoader";
import LoadingIndicator from "../component/redirection";
import Header from "./header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Suspense>
        <Header />
        <div className="LayoutHeight m-auto">
        <LinearLoader />
        <LoadingIndicator/>
          {children}
        </div>
      </Suspense>
    </div>
  );
}
