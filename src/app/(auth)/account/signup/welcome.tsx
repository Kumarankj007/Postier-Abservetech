"use client"
import Button from "@/app/component/button";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";

export default function Welcome({name= ""}:any) {
  const router = UseLoadingRouter();
  const { i18 } = useContext(PageContext);
  // const searchParams: any = useSearchParams()
  // const name= searchParams.get('name');
  // const postId: any = currentParams.get('parcelid')
  return (
    <div className="flex items-center flex-col justify-center p-10">
      <h2 className="font-bold text-[50px] text-[#004080] mb-5">
        {i18?.NEW?.WELCOME_TO_POSTIER ||"Welcome to Postier!"}
      </h2>
      <Image
        width={570}
        height={425}
        src={"/svg/icon/welcome.svg"}
        alt="welcome"
        className="mb-7"
      />
      <div className="text-[17px] font-medium text-center mb-8">
        <p>{i18?.NEW?.HELLO ||"Hello"} {name}, </p>
        <span>
          {i18?.NEW?.ACCOUNT_CREATED ||"Your Postier account has been created successfully. Let's get you moving!"}
        </span>
      </div>
      <div>
        <button className="px-6 py-3 border rounded-lg bg-btncolor font-medium text-[15px] text-[#fff] hidden md:block"   
          onClick={() => router.push("/")}
          >
          {i18?.NEW?.CONTINUE || "Continue"}
        </button>
      </div>
    </div>
  );
}
