import { verifyFn } from "@/app/tools/mutatefn/userdetails"
import { useMutation } from "@tanstack/react-query"
import OTPInput from "../otpfield"
import { useContext, useState } from "react";
import { OTPConfig, OtpInputs } from "@/interface";
import Store from "@/app/store/store";
import Button from "../button";
import UserStore from "@/app/store/profile";
import { fetchUser } from "@/app/tools/queryfn/fetch";
import useSnackbarStore from "@/app/store/toaster";
import PageContext from "@/app/providers/pagecontext";

export default function VerificationModal({data}:any) {
    const { i18 } = useContext(PageContext);
    const { setOtp,setModal } = Store();
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const { 
        fetchProfile } = UserStore()
    const [
        { otp, numInputs, separator, minLength, maxLength, placeholder, inputType },
        setConfig,
    ] = useState<OTPConfig>({
        otp: "",
        numInputs: 4,
        separator: "",
        minLength: 0,
        maxLength: 40,
        placeholder: "",
        inputType: "text",
    });

    const handleOTPChange = (otp: any) => {
        setConfig((prevConfig) => ({ ...prevConfig, otp }));
        setOtp(otp);
    };
    const verify = useMutation({
        mutationFn: verifyFn,
        onSuccess: (data) => {
            setModal('')
            fetchProfile()
            showSnackbar(data.data.message, "success");
        }
    })
    const handleVerify = () => {
        const val = {
            email:data?.email ? data?.email : "",
            userType: "USER",
            verifyBy: "email",
            verifyFrom: "VERIFICATION",
            code: otp,
        }
        verify.mutateAsync(val)
    }
    // console.log('datu',otp)
    return (
        <div className="flex flex-col gap-10 justify-center items-center cursor-pointer" >
            <h4 className="flex justify-center items-center text-center font-medium text-[20px] m-0 max-w-[340px] ">{i18?.NEW?.EMAIL_VERIFICATION_MESSAGE || "A verification code has been sent to your email ID, Kindly enter the code to verify your email ID"}
            </h4>
            <div>
                <OTPInput
                    inputStyle="inputStyle"
                    numInputs={numInputs}
                    onChange={handleOTPChange}
                    // renderSeparator={<span>{separator}</span>}
                    renderSeparator={(index) => <span key={index}>{separator}</span>}
                    value={otp}
                    placeholder={placeholder}
                    inputType={inputType}
                    renderInput={(props: any) => (
                        <input
                            {...props}
                            className="p-0   w-[60px] h-[60px] sm:w-[85px] sm:h-[85px] md:w-[60px] md:h-[60px] lg:w-[85px] lg:h-[85px] border border-[#B6B6B6] rounded-xl"
                        />
                    )}
                    shouldAutoFocus
                />
            </div>
            <div>
                <Button
                    onClick={handleVerify}
                    className={`w-[145px] px-6 py-4 ${otp.toString().length !== 4 ? 'bg-gray-400' : 'bg-btncolor'} rounded-[7px] text-[#fff] cursor-pointer`}
                    type="submit"
                    disabled = {otp.toString().length !== 4}
                >
                    {i18?.NEW?.VERIFY || "Verify"}
                </Button>
            </div>
        </div>
    )
}