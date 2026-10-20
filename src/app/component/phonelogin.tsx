import { Controller, useForm } from "react-hook-form";
import Button from "./button";
import ThreeDotLoader from "./threedotloader";
import useLoaderStore from "../hooks/loader";
import { useMutation } from "@tanstack/react-query";
import { LoginData, SendOtpApi, UserExist } from "../tools/mutatefn/auth";
import { LoginInputs, OTPConfig } from "@/interface";
import { useContext, useState } from "react";
import OTPInput from "./otpfield";
import Store from "../store/store";
import PageContext from "../providers/pagecontext";
import useSnackbarStore from "../store/toaster";
import { setCookie } from "@/utils";
import { API } from "../tools/apitools";
import UseCryptodeviceid from "../hooks/deviceid";
import { fetchUser } from "../tools/queryfn/fetch";
import UserStore from "../store/profile";
import UseLoadingRouter from "../hooks/useLoadingRoutes";
import PhoneInputComponent from "./phoneinput";

export default function LoginWithPhone() {
  const router = UseLoadingRouter();
  const { setOtp } = Store();
  const { i18 } = useContext(PageContext);
  const deviceId: any = UseCryptodeviceid();
  const { setToken } = Store();
  const { setUser } = UserStore();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { loading } = useLoaderStore();
  const [otpfield, setOtpField] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
    setError,
  } = useForm<LoginInputs>({
    defaultValues: {
      phone: "",
      phoneCode: "",
    },
  });
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
  const phonevalue = watch("phone", "");
  const inputStyle = {
    border: errors.phone ? "0.5px solid red" : "0.5px solid #004080",
    width: "100%",
    padding: "28px",
  };
  const handlePhoneChange = (value: any, data: any) => {
    const code = data.dialCode;
    const number = value.slice(code.length);
    setValue("phone", number);
    setValue("phoneCode", code);
    setPhoneCode(code);
    setPhoneNumber(number);
  };
  const handleOTPChange = (otp: any) => {
    setConfig((prevConfig) => ({ ...prevConfig, otp }));
    setOtp(otp);
  };
  const sendOtp = useMutation({
    mutationFn: SendOtpApi,
    onSuccess: (data) => {
      setOtpField(true);
      showSnackbar(data?.data?.message, "success");
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const Exist = useMutation({
    mutationFn: UserExist,
    onSuccess: (data) => {
      if (data?.data?.account?.isExist) {
        sendOtp.mutateAsync({
          phoneCode: phoneCode,
          phone: phone,
          userType: "USER",
          verifyBy: "phone",
          verifyFrom: "LOGIN",
        });
      } else {
        setError("phone", {
          type: "server",
          message: "User not exist",
        });
      }
    },
  });

  const onSubmit = (data: any) => {
    Exist.mutateAsync(data);
  };
  const FetchProfile = async () => {
    const res: any = await fetchUser();
    if (res) {
      setUser(res.profile);
    }
  };
  const saveMutation = useMutation({
    mutationFn: LoginData,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("appToken", data.data.token);
        setCookie("appToken", data.data.token);
        API.token = data.data.token;
        API.deviceId = deviceId;
        setCookie("appUserId", data.data.user._id);
        window.localStorage.setItem("appUserId", data.data.user._id);
        window.localStorage.setItem("deviceId", deviceId);
        if (data.data.token) {
          setToken(true);
        }
        if (data.data.user._id) {
          FetchProfile();
        }
        showSnackbar(data.data.message, "success");
        router.push("/");
      }
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const onSubmitOtp = () => {
    saveMutation.mutateAsync({
      code: otp,
      phone: phone,
      phoneCode: phoneCode,
      verifyBy: "phone",
      userType: "USER",
    });
  };
  return (
    <div className="flex flex-col gap-2 md:gap-6  h-[380px] sm:h-[370px] md:h-[360px] lg:h-[350px]">
      <h2 className="font-bold text-[25px] sm:text-[40px] md:text-[50px] leading-[65px] text-center">
        {otpfield ? "Verify OTP" : "What’s Your Phone Number?"}
      </h2>
      {!otpfield && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center">
          <div className="w-full md:w-[500px]">
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{ required: "Phone number is required" }}
              render={({ field }) => (
                <PhoneInputComponent
                  // value={field.value}
                  onPhoneChange={(number: any, code: any) => {
                    const formattedCode = `${code}`;
                    setValue("phone", number);
                    setValue("phoneCode", formattedCode);
                    setPhoneCode(formattedCode);
                    setPhoneNumber(number);
                  }}
                  country={"us"}
                  errors={errors?.phone}
                  inputId="phone_field"
                  labelId="phone_field"
                />
              )}
            />
            {errors.phone && (
              <span className="text-red-700 ml-2">
                {errors?.phone?.message}
              </span>
            )}
            {
              <div className="flex items-center justify-center mt-6">
                <Button
                  className={`px-6 py-4 ${
                    loading ? "bg-[#EBEBEB]" : "bg-btncolor"
                  } rounded-[7px] text-[#fff] cursor-pointer`}
                  type="submit"
                >
                  {loading ? <ThreeDotLoader /> : "Get OTP"}
                </Button>
              </div>
            }
          </div>
        </form>
      )}
      {otpfield && (
        <form onSubmit={handleSubmit(onSubmitOtp)}>
          <div className="flex justify-center">
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
          <div className="mt-6 flex justify-center">
            <Button
              className={`w-[145px] px-6 py-4 ${
                otp.toString().length !== 4 ? "bg-gray-400" : "bg-btncolor"
              } rounded-[7px] text-[#fff] cursor-pointer`}
              type="submit"
              disabled={otp.toString().length !== 4}
            >
              {"Verify"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
