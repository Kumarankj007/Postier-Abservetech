"use client";
import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import LabeledInput from "../input";
import Button from "../button";
import PageContext from "@/app/providers/pagecontext";
import { useMutation } from "@tanstack/react-query";
import useSnackbarStore from "@/app/store/toaster";
import UserStore from "@/app/store/profile";
import { ChangePassword, SetPassword } from "@/app/tools/mutatefn/userdetails";
import { IconButton, InputAdornment } from "@mui/material";
import Image from "next/image";

const Password = ({ noPassword = true, setEdit= () => {} }: { noPassword?: boolean, setEdit?: (val: string) => void }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("newPassword");
  const { i18 } = useContext(PageContext);
  const { fetchProfile } = UserStore();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
  const handleClickShowPassword3 = () => setShowPassword3((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const setPassword = useMutation({
    mutationFn: noPassword ? SetPassword : ChangePassword,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      setEdit("");
      fetchProfile();
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });

  const onSubmit = (data: any) => {
    const updated = {
      ...data,
      currentPassword: data.oldPassword,
    };
    delete updated.oldPassword;
    setPassword.mutate(updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Password */}
      {!noPassword && (
        <div>
          <Controller
            name="oldPassword"
            control={control}
            rules={{
              required: "Old Password is required",
            }}
            render={({ field }) => (
              <LabeledInput
                {...field}
                placeholder={"Old Password"}
                id="old-password-input"
                labelId="old-password-input"
                error={!!errors.oldPassword}
                type={showPassword3 ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword3}
                        onMouseDown={handleMouseDownPassword}
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
            )}
          />
          {errors.oldPassword && (
            <p style={{ color: "red" }}>{errors.oldPassword.message}</p>
          )}
        </div>
      )}
      <div>
        <Controller
          name="newPassword"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|\\;:'",.<>\/?`~\-]).+$/,
              message:
                "Password must include at least one uppercase letter, one number, and one special character",
            },
          }}
          render={({ field }) => (
            <LabeledInput
              {...field}
              placeholder={i18?.NEW?.PASSWORD || "Password"}
              id="password-input"
              labelId="password-input"
              error={!!errors.newPassword}
              type={showPassword2 ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword2}
                      onMouseDown={handleMouseDownPassword}
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
          )}
        />
        {errors.newPassword && (
          <p style={{ color: "red" }}>{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === passwordValue || "Passwords do not match",
          }}
          render={({ field }) => (
            <div className="relative">
              <LabeledInput
                {...field}
                placeholder={
                  i18?.NEW?.RECONFIRM_PASSWORD || "Reconfirm Your Password"
                }
                id="confirmPassword-input"
                labelId="confirmPassword-input"
                error={!!errors.confirmPassword}
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
        {errors.confirmPassword && (
          <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <Button
          type="submit"
          className="px-8 py-4 bg-btncolor rounded-full text-[#fff]"
        >
          {" "}
          {i18?.NEW?.SAVE || "Save"}
        </Button>
      </div>
    </form>
  );
};

export default Password;
