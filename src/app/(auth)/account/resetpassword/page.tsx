"use client";
import Button from "@/app/component/button";
import Input from "@/app/component/input";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import StoreEmail from "@/app/store/store";
import useSnackbarStore from "@/app/store/toaster";
import { ChangePassword } from "@/app/tools/mutatefn/auth";
import { ResetPassInputs } from "@/interface";
import { openAndroidApp } from "@/utils";
import { IconButton, InputAdornment } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";

export default function ResetPassword() {
  // const { handleSubmit, formState: { errors }, control ,watch} = useForm<Inputs>()
  const router = UseLoadingRouter();
  const SearchParams = useSearchParams();
  const token = SearchParams.get("token");
  const { i18 } = useContext(PageContext);
  const [content, setContent] = useState("emailfield");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { email, otp } = StoreEmail();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  // const onSubmit = (data: any) => {
  //     console.log(data);
  //     setContent('passwordfield')
  // };;
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseDownPassword2 = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<ResetPassInputs>({
    defaultValues: {
      password: "",
    },
  });
  // const resetpassword = async (data: any) => {
  //     const val = {
  //         email: email,
  //         ...data,
  //         verifyFrom: "FORGETPASSWORD",
  //         verifyBy: 'email',
  //         code: otp,
  //         userType: 'USER'
  //     }
  //     const res = await API.POST('common/user/changePassword', val)
  //     return res

  // }
  const saveMutation = useMutation({
    mutationFn: ChangePassword,
    onSuccess: (data: { data: { message: string } }) => {
      showSnackbar(data.data.message, "success");
      const userAgent: string = navigator.userAgent || navigator.vendor;

      if (/android/i.test(userAgent)) {
        // Android device
        openAndroidApp();
      } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        // iOS device
        window.location.href = "myapp://open/path";
        alert("ios");
        // Fallback to website after a timeout if the app doesn't open
        setTimeout(() => {
          router.push("/account/login/?with=email");
        }, 2000);
      } else {
        // Fallback to the website for non-Android and non-iOS devices
        router.push("/account/login/?with=email");
      }
    },
    onError: (err: Error) => {
      showSnackbar(err.message, "error");
    },
  });

  const onSubmit = (data: ResetPassInputs) => {
    saveMutation.mutateAsync({
      userType: "USER",
      verifyBy: "email",
      verifyFrom: "FORGETPASSWORD",
      password: data?.password,
      verificationToken: token,
    });
  };
  // useEffect(() => {
  //     if (email === '' || otp === '') {
  //         router.push('/account/sendotp')
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  return (
    <div className="flex h-full w-full">
      <div className="flex justify-center items-center flex-col gap-6 md:gap-10 w-full">
        <h2 className="font-bold text-[20px] sm:text-[30px] md:text-[50px] leading-265px] sm:leading-[35px] md:leading-[65px] text-center w-full md:w-[850px]">
          {i18?.LOGIN?.CHANGEPASSWORD || "Reset your password"}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-center "
        >
          <div className="flex flex-col justify-center gap-6 w-full md:w-[500px]">
            <div>
              {/* Password */}
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|\\;:'",.<>\/?`~\-]).+$/,
                    message:
                      "Password must include at least one uppercase letter, one number, and one special character",
                  },
                }}
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      label={i18?.NEW?.PASSWORD || "Password"}
                      error={!!errors.password}
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <Image
                                  width={20}
                                  height={20}
                                  src="/svg/icon/unlock.svg"
                                  alt="svg"
                                />
                              ) : (
                                <Image
                                  width={20}
                                  height={20}
                                  src="/svg/icon/lock.svg"
                                  alt="svg"
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                )}
              />
              {errors.password && (
                <span className="text-red-700">{errors.password.message}</span>
              )}
            </div>
            <div>
              <Controller
                name="newpassword"
                control={control}
                defaultValue=""
                rules={{
                  required: "Password confirmation is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                }}
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      error={!!errors.newpassword}
                      label={i18?.NEW?.CONFIRM_PASSWORD || "Confirm Password"}
                      type={showPassword2 ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword2}
                              onMouseDown={handleMouseDownPassword2}
                              edge="end"
                            >
                              {showPassword2 ? (
                                <Image
                                  width={20}
                                  height={20}
                                  src="/svg/icon/unlock.svg"
                                  alt="svg"
                                />
                              ) : (
                                <Image
                                  width={20}
                                  height={20}
                                  src="/svg/icon/lock.svg"
                                  alt="svg"
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                )}
              />
              {errors.newpassword && (
                <span className="text-red-700">
                  {errors.newpassword.message}
                </span>
              )}
            </div>
            <div className="flex justify-center">
              <Button
                className="px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer"
                type="submit"
              >
                {i18?.LOGIN?.CONFIRMPASS || "Change Password"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
