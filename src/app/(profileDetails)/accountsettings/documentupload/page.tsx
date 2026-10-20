"use client";
import CustomBreadCrumb from "@/app/component/breadcrumbs";
import Button from "@/app/component/button";
import DatePickerComp from "@/app/component/datepicker";
import UserStore from "@/app/store/profile";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import useSnackbarStore from "@/app/store/toaster";
import { UserVerifyAdress } from "@/app/tools/mutatefn/userdetails";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageContext from "@/app/providers/pagecontext";
import useScreenDetector from "@/app/hooks/useresize";
import ContentTooptip from "@/app/component/contentTooptip";
import { VerifyDocuments } from "../content";

export default function DocumentUpload() {
  const { i18 } = useContext(PageContext);
  const rightSection = [
    {
      img: "/svg/icon/file-text (1).svg",
      head: i18?.NEW?.YOUR_DOCUMENTS_SAFE || "Your Documents are Safe!",
      para:
        i18?.NEW?.DOCUMENTS_SAFE ||
        " All documents are encrypted during transmission and storage, ensuring maximum privacy.",
    },
    {
      img: "/svg/icon/database.svg",
      head: i18?.NEW?.STORED_IN_SECURE_PLACE || "Stored in Secure Place",
      para:
        i18?.NEW?.STORED_IN_SECURE ||
        "Files are stored in a secure, access-controlled environment and are used only for verification purposes.",
    },
  ];
  const screen = useScreenDetector();
  const { FetchUploadDocument, UploadDocument } = UserStore();
  const [editMode, setEditMode] = useState<any>({});
  const [value, setValue] = useState<any>("");
  const [dateError, setDateError] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<any>({});
  const [file, setFile] = useState<any>("");
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const toggleEditMode = (index: any) => {
    setEditMode((prevState: any) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleImageChange = (e: any, index: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // Allow only image formats
    if (!file.type.startsWith("image/")) {
      showSnackbar("Please select a valid image file.", "error");
      e.target.value = "";
      return;
    }

    // 10MB size limit
    const maxSize = 10 * 1000 * 1024; // 10 MB
    if (file.size > maxSize) {
      showSnackbar("File size must be less than 10MB.", "error");
      e.target.value = "";
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (val) => {
        const img = document.createElement("img");
        img.onload = () => {
          // Image loaded successfully (valid image data)
          setPreviewImage((prevImages: any) => ({
            ...prevImages,
            [index]: reader.result as string, // Use the result specific to the index
          }));
          setFile(file);
        };
        img.onerror = () => {
          // Image failed to load (corrupt or not an actual image file)
          showSnackbar("Please select a valid image file.", "error");
          e.target.value = "";
          return;
        };
        img.src = val?.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDateChange = (date: any) => {
    if (date) {
      const selectedDate = new Date(date);
      const today = new Date();
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setDateError(
          i18?.NEW?.DATE_ERROR || "The selected date cannot be before today.",
        );
        return;
      } else {
        setDateError("");
      }
      setValue(date);
    }
  };
  useEffect(() => {
    FetchUploadDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const Post = useMutation({
    mutationFn: UserVerifyAdress,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      FetchUploadDocument();
      setPreviewImage({});
      setValue("");
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const handleSave = (val: any) => {
    // console.log("val", val);
    const formData = new FormData();
    if (val?.indexName) {
      formData.append("fieldName", val?.indexName);
    }
    if (file) {
      formData.append(val?.fields[0]?.indexName, file);
    }
    if (value) {
      formData.append(val?.fields[1]?.indexName, value);
    }
    Post.mutateAsync(formData);
  };
  // console.log("data11", previewImage);
  return (
    <div>
      <div className="flex flex-col  m-[20px] md:m-[40px] lg:m-[70px]">
        <div className="mb-[30px]">
          <CustomBreadCrumb
            pathSegments={i18?.NEW?.DOCUP || "Document Upload"}
          />
        </div>
        <div className="flex gap-[20px]">
          <div className="w-full md:w-1/2">
            <div className="m-auto flex items-center ">
              <h2 className="font-bold text-[20px] sm:text-[30px] md:text-[34px]">
                {i18?.NEW?.IDVERIFY || "Verify Document"}
              </h2>
              <ContentTooptip value={VerifyDocuments()} />
            </div>
            <div className=" mt-[30px]">
              {Array.isArray(UploadDocument) &&
                UploadDocument.map((items, index) => (
                  <div key={index} className="pb-4">
                    {/* <div className="flex justify-between">
                                    <p className="text-[17px] font-semibold pb-4">{items?.name}</p>
                                    <p
                                        className="underline cursor-pointer"
                                        onClick={() => toggleEditMode(index)}
                                    >
                                        {!editMode[index] ? 'Edit' : 'Cancel'}
                                    </p>
                                </div> */}
                    <Accordion
                      sx={{
                        boxShadow: "none",
                        border: "1px solid #004080",
                        padding: "20px",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <Image
                            src="/svg/icon/downarrow.svg"
                            alt="icon"
                            className="w-[15px] h-[15px]"
                            width={20}
                            height={20}
                          />
                        }
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={{
                          boxShadow: "none",
                          borderBottom: "none",
                        }}
                      >
                        <div className="flex gap-2 items-center">
                          {items.status !== "needAction" &&
                            (items.status === "pending" ? (
                              <Image
                                width={800}
                                height={800}
                                src="/svg/icon/pending-icon 1.svg"
                                alt="img"
                                className="w-[25px] h-[25px]"
                              />
                            ) : (
                              <Image
                                width={800}
                                height={800}
                                src="/svg/icon/verified.svg"
                                alt="img"
                                className="w-[25px] h-[25px]"
                              />
                            ))}
                          <p className="text-[17px] font-semibold">
                            {items?.name}
                          </p>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="flex justify-between">
                          <div>
                            {Array.isArray(items?.fields) &&
                              items.fields.map(
                                (field: any, fieldIndex: any) => (
                                  <div key={fieldIndex} className="">
                                    <div
                                      className={`${
                                        !editMode[index] ? "flex" : "flex-col"
                                      } gap-[30px]`}
                                    >
                                      <p className="py-4">{field?.name}</p>
                                      {!editMode[index] ? (
                                        field?.value.startsWith("public") ? (
                                          <Link
                                            href={
                                              process.env
                                                .NEXT_PUBLIC_IMAGE_URL +
                                              field?.value
                                            }
                                            className="text-btncolor cursor-pointer pt-4"
                                          >
                                            {i18?.NEW?.VIEW || "View"}
                                          </Link>
                                        ) : (
                                          <p className="pt-4">
                                            {field?.value
                                              ? dayjs(field?.value).format(
                                                  "DD-MM-YYYY",
                                                )
                                              : "--"}
                                          </p>
                                        )
                                      ) : field?.type === "date" ? (
                                        <>
                                          <label
                                            htmlFor="expiryDate"
                                            className="text-[20px] font-[700] leading-[26px] sr-only"
                                          >
                                            {field?.name}
                                          </label>
                                          <DatePickerComp
                                            id="expiryDate"
                                            onDate={handleDateChange}
                                            date={field?.value}
                                          />
                                          {dateError && (
                                            <p className="text-red-500 text-sm mt-1">
                                              {dateError}
                                            </p>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          <label
                                            key={index}
                                            className={
                                              (previewImage[index]
                                                ? ""
                                                : "bg-[#F0F0F0]") +
                                              " w-[130px] h-[130px] flex items-center justify-center cursor-pointer"
                                            }
                                          >
                                            <div className="relative flex items-center">
                                              {field?.value ? (
                                                <Image
                                                  src={
                                                    previewImage[index]
                                                      ? previewImage[index]
                                                      : process.env
                                                          .NEXT_PUBLIC_IMAGE_URL +
                                                        field?.value
                                                  }
                                                  alt="Preview"
                                                  className="w-[130px] h-[130px]"
                                                  width={500}
                                                  height={500}
                                                />
                                              ) : (
                                                <Image
                                                  src={
                                                    previewImage[index]
                                                      ? previewImage[index]
                                                      : "/svg/icon/sendng.svg"
                                                  }
                                                  alt="Preview"
                                                  className={
                                                    (previewImage[index]
                                                      ? "w-[130px] h-[130px]"
                                                      : "w-[20px] h-[20px]") +
                                                    " object-contain"
                                                  }
                                                  width={100}
                                                  height={100}
                                                />
                                              )}
                                              <input
                                                type="file"
                                                id="fileInput"
                                                className="hidden"
                                                onChange={(e) =>
                                                  handleImageChange(e, index)
                                                }
                                                accept="image/*"
                                              />
                                            </div>
                                          </label>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}
                          </div>
                          <p
                            className="underline cursor-pointer"
                            onClick={() => toggleEditMode(index)}
                          >
                            {!editMode[index]
                              ? i18?.NEW?.EDIT || "Edit"
                              : i18?.NEW?.CANCEL || "Cancel"}
                          </p>
                        </div>
                        {editMode[index] && (
                          <Button
                            className="py-3 px-5 bg-btncolor text-[#fff] rounded my-4"
                            onClick={() => handleSave(items)}
                          >
                            {i18?.NEW?.SAVE || "Save"}
                          </Button>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </div>
                ))}
            </div>
          </div>
          {screen === "desktop" && (
            <div className="w-1/2 flex  justify-center">
              <div className="flex flex-col gap-6">
                {rightSection.map((items, index) => (
                  <div
                    key={index}
                    className="border border-1 border-btncolor flex flex-col gap-6 p-5 rounded-[31px] w-full md:w-[350px]"
                  >
                    <Image
                      width={800}
                      height={800}
                      src={items.img}
                      alt="svg"
                      className="w-[50px] h-[50px]"
                    />
                    <p className="text-[17px] font-[700] leading-[22px]">
                      {items.head}
                    </p>
                    <p className="text-[17px] font-[400] leading-[22px]">
                      {items.para}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
