
import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Header from "@/app/component/header";
import LinearLoader from "@/app/component/linearLoader";
import LinearStepper from "./stepper";
import useScreenWidth from "@/app/hooks/usescreenwidth";
import Children from "./children";

const Footer: any = dynamic(() => import('../../component/footer'))

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;


}>) {

    return (
        <div>
            <div className="">
                <Children>
                    {children}
                </Children>
            </div>
            <div>
            </div>
        </div>
    );
}
