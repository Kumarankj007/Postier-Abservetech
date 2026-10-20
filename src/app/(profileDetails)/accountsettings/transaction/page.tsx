"use client";
import Button from "@/app/component/button";
import DropDown from "@/app/component/dropdown";
import Select from "@/app/component/select";
import dayjs from "dayjs";
import TransactionStore from "@/app/store/transaction";
import { useContext, useEffect, useState } from "react";
import TableComponent from "./table";
import EmptyPage from "@/app/component/emptydatapage";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Pagination from "@/app/component/pagination";
import Store from "@/app/store/store";
import CustomBreadCrumb from "@/app/component/breadcrumbs";
import PageContext from "@/app/providers/pagecontext";
import { urlToObject } from "@/utils";
import Link from "next/link";
import ContentTooptip from "@/app/component/contentTooptip";
import { PaymentInformation } from "../content";

const theme = createTheme({
  components: {
    MuiPopper: {
      styleOverrides: {
        root: {
          zIndex: "9999!important",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "#004080",
        },
        root: {
          "&.Mui-focused": {
            borderColor: "transparent!important",
          },
        },
      },
    },
  },
});
export default function Transaction() {
  const { i18 } = useContext(PageContext);
  const { Transaction, fetchTransaction }: any = TransactionStore();
  const params: any =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : {};
  const { Page, setPage, Limit, setLimit } = Store();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<any>("");
  const [month, setMonth] = useState<any>(dayjs().month() + 1);
  const [year, setYear] = useState<any>(dayjs().year());

  const header: any = [
    i18?.TRANSACTION?.DATE || "Date",
    i18?.TRANSACTION?.ACTIVITY || "Activity",
    i18?.TRANSACTION?.DESCRIPTION || "Description",
    i18?.TRANSACTION?.REFERENCEID || "Reference ID",
    i18?.TRANSACTION?.AMOUNT || "Amount",
  ];
  const Dropdrown = [
    {
      text: i18?.DROPDOWN?.CREDIT || "Credit",
      fnc: () => setMode("CREDIT"),
      mode: "CREDIT",
    },
    {
      text: i18?.DROPDOWN?.DEBIT || "Debit",
      fnc: () => setMode("DEBIT"),
      mode: "DEBIT",
    },
  ];

  const handlePageChange = (page: any) => {
    setPage(page);
  };
  const handleLimitChange = (limit: any) => {
    setLimit(limit);
  };
  useEffect(() => {
    fetchTransaction({ mode: mode, onYear: year, onMonth: month });
    if (mode) {
      const data: any = urlToObject(window.location.search);
      if (mode) {
        data.mode = mode;
      }
      const queryString = Object.keys(data)
        .map((key) => `${key}=${encodeURIComponent(data[key])}`)
        .join("&");
      window.history.replaceState(
        { path: `${window.location.pathname}?` + queryString },
        "",
        `${window.location.pathname}?` + queryString
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  const HandleSubmit = () => {
    const data: any = urlToObject(window.location.search);
    if (year) {
      data.onYear = year;
    }
    if (month) {
      data.onMonth = month;
    }
    const queryString = Object.keys(data)
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join("&");
    window.history.replaceState(
      { path: `${window.location.pathname}?` + queryString },
      "",
      `${window.location.pathname}?` + queryString
    );
    fetchTransaction({ mode: mode, onYear: year, onMonth: month });
  };
  const HandleClear = () => {
    params.delete("onYear");
    params.delete("onMonth");
    setMonth(dayjs().month() + 1);
    setYear(dayjs().year());
    window.history.replaceState(
      { path: params.toString() },
      "",
      "?" + params.toString()
    );
    fetchTransaction({ mode: mode, onYear: year, onMonth: month });
  };
  useEffect(() => {
    const year = searchParams.get("onYear");
    const month = searchParams.get("onMonth");
    if (year) {
      setYear(year);
    }
    if (month) {
      setMonth(month);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log("year", year);
  return (
    <>
      <div className=" m-[20px] md:m-[40px] lg:m-[70px]">
        <div className="mb-[30px]">
          <CustomBreadCrumb
            pathSegments={i18?.NEW?.TRANSACTION || "Transactions"}
          />
          <div className="flex items-center">
            <p className="text-[34px] font-[700] leading-[44px]">
              Payments & Payouts
            </p>
            <ContentTooptip value={PaymentInformation()} />
          </div>
        </div>
        <div className="flex mb-[30px]">
          <div className="border border-1 border-btncolor rounded-[21px] p-5 flex flex-col gap-4">
            <p>Available Funds</p>
            <p className="text-[34px] font-[700] leading-[44px]">
              {Transaction?.availableFunds
                ? `$${Transaction?.availableFunds}`
                : "--"}
            </p>
            {/* <Link href={"/managecards"} className="cursor-pointer underline">      
                     <p>Add a Card</p>
                </Link> */}
          </div>
        </div>
        <div className="flex gap-6">
          <DropDown
            width="400px"
            text={i18?.DROPDOWN?.DATERANGE || "Date Range"}
            img2="/svg/icon/dropdownicon.svg"
            className="flex gap-3 justify-center items-center border border-btncolor w-[120px] md:w-[165px] h-[60px] rounded-[17px] text-btncolor p-2 whitespace-nowrap	"
          >
            <div className="p-5">
              <div className="flex flex-col gap-3 mb-3">
                <p className="font-semibold	text-[17px]">
                  {i18?.DROPDOWN?.YEAR || "Year"}
                </p>
                <ThemeProvider theme={theme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DatePicker", "DatePicker", "DatePicker"]}
                    >
                      <label htmlFor="yearInput" className="sr-only">
                        Year
                      </label>
                      <DatePicker
                        // label="Year"
                        views={["year"]}
                        value={dayjs().set("year", year)}
                        disableFuture
                        onChange={(e: any) => {
                          setYear(e?.$y);
                        }}
                        slotProps={{
                          textField: {
                            id: "yearInput",
                            variant: "outlined",
                            fullWidth: true,
                          },
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </ThemeProvider>
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-semibold	text-[17px]">
                  {" "}
                  {i18?.DROPDOWN?.MONTH || "Month"}
                </p>
                <ThemeProvider theme={theme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DatePicker", "DatePicker", "DatePicker"]}
                    >
                      <label htmlFor="monthInput" className="sr-only">
                        Month
                      </label>
                      <DatePicker
                        views={["month"]}
                        // label="Month"
                        value={dayjs().set("month", month - 1)}
                        onChange={(e: any) => {
                          const mon: any = e?.$M;
                          const Month: any = mon + 1;
                          // console.log("Month", Month);
                          setMonth(Month);
                        }}
                        slotProps={{
                          textField: {
                            id: "monthInput",
                            variant: "outlined",
                            fullWidth: true,
                          },
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </ThemeProvider>
              </div>
              <div className="flex justify-between mt-6">
                <Button
                  className="py-[10px] px-[20px] bg-btncolor text-[#fff] rounded-[7px]"
                  onClick={HandleSubmit}
                >
                  {i18?.NEW?.APPLY || "Apply"}
                </Button>
                <Button
                  className="py-[10px] px-[20px] bg-btncolor text-[#fff] rounded-[7px]"
                  onClick={HandleClear}
                >
                  {i18?.NEW?.CLEAR || "Clear"}
                </Button>
              </div>
            </div>
          </DropDown>

          <DropDown
            data={Dropdrown}
            width="200px"
            text={i18?.DROPDOWN?.ACTIVITY || "Activity"}
            img2="/svg/icon/dropdownicon.svg"
            className="flex gap-3 justify-center items-center border border-btncolor  w-[120px] md:w-[165px] h-[60px] rounded-[17px] text-btncolor p-2 whitespace-nowrap	"
          />
        </div>
        {Transaction?.transactions?.length > 0 ? (
          <>
            <div className="flex justify-between my-[40px]">
              <p>
                {i18?.TRANSACTION?.SHOWRES || "Showing results"}{" "}
                {Array.isArray(Transaction?.transactions) &&
                  Transaction?.transactions?.length}{" "}
                of {Transaction.total || "0"}
              </p>
              {/* <div className="flex items-center gap-2">
                                    <img src='/svg/icon/csv.svg' alt='icon' />
                                    <p>Email activity report</p>
                                </div> */}
            </div>
            <TableComponent rows={Transaction.transactions} header={header} />
          </>
        ) : (
          <EmptyPage
            image="/png/tableEmpty.png"
            text={i18?.TRANSACTION?.NOPAYMENT || "No payment records found!"}
          />
        )}
      </div>
      <Pagination
        totalItems={Transaction?.total || 0}
        onLimitChange={handleLimitChange}
        onPageChange={handlePageChange}
      />
    </>
  );
}
