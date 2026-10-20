"use client";
import React, { useContext, useState } from "react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { IconButton, InputAdornment } from "@mui/material";
import Image from "next/image";
import CustomBreadCrumb from "@/app/component/breadcrumbs";
import PageContext from "@/app/providers/pagecontext";
import useScreenDetector from "@/app/hooks/useresize";
import MonthPickerComp from "@/app/component/monthpicker";
import Input from "@/app/component/input";
import { API } from "@/app/tools/apitools";


interface FormValues {
  cardnum: string;
  name: string;
  date: string;
  cvv: string;
}

const validateCardNumber = (cardNumber: string): boolean => {
    const sanitized = cardNumber.replace(/\D/g, "");
    if (sanitized.length !== 16 && sanitized.length !== 15) return false;
  
    let sum = 0;
    let shouldDouble = false;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };
  
  const getCardType = (cardNumber: string): string | null => {
    const sanitized = cardNumber.replace(/\D/g, "");
    const cardPatterns: Record<string, RegExp> = {
      Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      MasterCard: /^5[1-5][0-9]{14}$/,
      Amex: /^3[47][0-9]{13}$/, 
    };
    for (const [card, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(sanitized)) return card;
    }
    return null;
  };
  
  const validateDate = (expiry: string): boolean => {
    if (!expiry.includes("/")) return false;
  
    const [month, year] = expiry.split("/").map((num) => parseInt(num, 10));
    if (!month || !year || month < 1 || month > 12) return false;
  
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
  
    return year > currentYear || (year === currentYear && month >= currentMonth);
  };
  
  const validateCVV = (cvv: string, cardType: string | null): boolean => {
    if (cardType === "Amex") {
      return /^\d{4}$/.test(cvv); 
    }
    return /^\d{3}$/.test(cvv); 
  };
  
const AddCard: React.FC = () => {
  const { i18 } = useContext(PageContext);
  const screen = useScreenDetector();
  const [showPassword, setShowPassword] = useState(false);
  const [cardType, setCardType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const rightSection = [
    { img: "/svg/icon/card.svg", head: "Secure Payments", para: "Your card details are safe with us." },
    { img: "/svg/icon/dollar-sign.svg", head: "Fraud Protection", para: "We ensure encrypted transactions." },
  ];


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const cardType = getCardType(data.cardnum); 
  
    if (!validateCardNumber(data.cardnum) || !validateDate(data.date) || !validateCVV(data.cvv, cardType)) {
      console.error("❌ Invalid Input");
      return;
    }
  
    setLoading(true);
    try {
      // console.log("📝 Form Submitted Data:", data);
      await API.POST(`module/payment/methods/stripe/card`, data);
      // console.log("✅ Card Added Successfully!");
    } catch (error) {
      // console.error("❌ Error Adding Card:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 m-[20px] md:m-[40px] lg:m-[70px]">
      <div className="mb-[30px]">
        <CustomBreadCrumb
        pathSegments = "Transaction"
        link1 = "/accountsettings/transaction"
        pathSegments2={i18?.NEW?.CARD || "Manage Card"}
          link2 ="/managecards"
          pathSegments3={i18?.NEW?.NEWCARD || "Add Card"}
        />
      </div>

      <div className="flex justify-between">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <p>Add your Card</p>
            <div className="flex items-center justify-center space-x-2">
              <Image width={30} height={30} src="/png/Mastercard_logo.png" alt="Mastercard" />
              <Image width={40} height={30} src="/png/visa-card-png.png" alt="Visa" />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <Controller
              name="cardnum"
              control={control}
              defaultValue=""
              rules={{
                required: "Card number is required",
                validate: (value) => validateCardNumber(value) || "Invalid card number",
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Enter your card number"
                  error={!!errors.cardnum}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
                    field.onChange(value);
                    setCardType(getCardType(value));
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {cardType && <Image width={40} height={30} src={`/png/${cardType.toLowerCase()}-card.png`} alt={cardType} />}
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "Name is required" }}
              render={({ field }) => <Input {...field} label="Enter your name" error={!!errors.name} />}
            />

            <Controller
              name="date"
              control={control}
              defaultValue=""
              rules={{
                required: "Expiry date is required",
                validate: (value) => validateDate(value) || "Invalid expiration date (MM/YY)",
              }}
              render={({ field }) => (
                <MonthPickerComp
                  {...field}
                  onDate={(formattedDate: any) => field.onChange(formattedDate)}
                  label="Card Expiration Date"
                  error={!!errors.date}
                />
              )}
            />

<Controller
  name="cvv"
  control={control}
  defaultValue=""
  rules={{
    required: "CVV is required",
    validate: (value) => validateCVV(value, cardType) || `CVV must be ${cardType === "Amex" ? "4" : "3"} digits`,
  }}
  render={({ field }) => (
    <Input
      {...field}
      label="Enter your CVV"
      type={showPassword ? "text" : "password"}
      error={!!errors.cvv}
      onChange={(e) => {
        let maxLength = cardType === "Amex" ? 4 : 3;
        field.onChange(e.target.value.replace(/\D/g, "").slice(0, maxLength));
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)}>
              <Image width={20} height={20} src={`/svg/icon/${showPassword ? "unlock" : "lock"}.svg`} alt="toggle visibility" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )}
/>


            <button type="submit" className="px-6 py-4 bg-btncolor text-white rounded-lg" disabled={loading}>
              {loading ? "Saving..." : "Save Card"}
            </button>
          </form>
        </div>

        {screen === "desktop" && (
          <div className="w-1/2 flex justify-center">
            <div className="flex flex-col gap-6">
              {rightSection.map((item, index) => (
                <div key={index} className="border border-btncolor p-5 rounded-lg">
                  <Image width={50} height={50} src={item.img} alt="icon" />
                  <p className="font-bold">{item.head}</p>
                  <p>{item.para}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCard;
