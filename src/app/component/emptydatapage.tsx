import Image from "next/image";
import Link from "next/link";

export default function EmptyPage({ image, text, link, linktext }: any) {
    return (
        <div className="flex h-full m-auto">
            <div className="m-auto flex flex-col gap-6 md:gap-10 p-5 justify-center">
                <div className="w-full flex justify-center">
                <Image src={image} alt="imf" className="w-[100%] h-[100%] md:w-[50%] md:h-[50%]"  width={500} height={500} />
                </div>
                <p className="text-center font-bold text-[15px] sm:text-[20px] md:text-[25px] leading-[30px]">
                    {text}
                </p>
                {
                    link &&
                    <Link href={link} className="text-center font-semibold text-btncolor text-[12px] md:text-[15px] leading-[22px]">
                        {linktext}
                    </Link>
                }

            </div>
        </div>
    )
}