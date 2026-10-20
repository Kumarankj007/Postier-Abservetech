'use client'
import Button from "@/app/component/button";
import DatePickerComp from "@/app/component/datepicker";
import Select from "@/app/component/select";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import Store from "@/app/store/store";
import useSnackbarStore from "@/app/store/toaster";
import { UserVerifyAdress } from "@/app/tools/mutatefn/userdetails";
import { MenuItem } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useContext, useState } from "react";


const VerifyUser = dynamic(() => import('@/app/component/verifyAdress'), { ssr: false });

export default function VerifyAdress() {
    const { i18 } = useContext(PageContext);
     const  router  = UseLoadingRouter();
    const { setModal } = Store()
    const [date, setDate] = useState('')
    const [selectedValue, setSelectedValue] = useState('')
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const [profiles, setFile] = useState<any>({})
    const uploadImage = (file: any) => {
        setFile(file)
    }
    const Profile = useMutation({
        mutationFn: UserVerifyAdress,
        onSuccess: (data) => {
            showSnackbar(data.data.message, "success");
            setModal('')
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    const handleSubmit = () => {
        let formData = new FormData();
        if (selectedValue) {
            formData.append('fieldName', selectedValue)
        }
        if (date) {
            formData.append('expDate', date)
        }
        if (profiles) {
            formData.append('file', profiles);
        }
        Profile.mutateAsync(formData)
    }
    const handleDateChange = (date: any) => {
        const data = dayjs(date)
        const dateformat = data.format('YYYY-MM-DDTHH:mm:ss.000Z')
        setDate(dateformat)
    };
    return (
        <div className=''>
            <div className='flex flex-col items-center gap-4 md:gap-8  mb-4  md:mb-12'>
                <h1 className='font-bold text-2xl md:text-4xl text-center'>
                    {i18?.MYPROFILE?.VERIFYADDRESSDOC || "Verify Your Address With a Document"}
                </h1>
                <div className='flex justify-center items-center w-full md:w-[365px] h-[245px] border border-radius rounded-lg shadow'>
                    <div className='flex flex-col items-center gap-4'>
                        <VerifyUser onData={uploadImage} />
                        <p className='font-normal text-sm'>
                            {i18?.MYPROFILE?.UPLOADDOC || "Upload Your Document"}
                        </p>
                    </div>
                </div>

                <div className="grid w-[90%] gap-5 ">
                    {/* <p className=' col-span-1 flex justify-end font-normal text-sm text-center'>
                            Type of Document
                        </p> */}
                    <Select
                        label={i18?.NEW?.DOCUMENT_TYPE || 'Type of Document'}
                        value={selectedValue}
                        onChange={(e) => setSelectedValue(e.target.value)}
                    >
                        <MenuItem value="AadharCard">{i18?.NEW?.AADHAR_CARD || "Aadhar Card"}</MenuItem>
                        <MenuItem value="PANCard">{i18?.NEW?.PAN_CARD || "PAN Card"}</MenuItem>
                        <MenuItem value="VoterID">{i18?.NEW?.VOTER_ID || "Voter ID"}</MenuItem>
                        <MenuItem value="drivingLicense">{i18?.NEW?.DRIVING_LICENCE || "Driving Lisence"}</MenuItem>
                    </Select>
                    <div className="">
                        {/* <p className='flex justify-end font-normal text-sm  text-center'>
                            Expiry Date of the Document
                        </p> */}
                        <div className="">
                            <DatePickerComp onDate={handleDateChange} label={i18?.NEW?.EXPIRY_DATE_OF_DOCUMENT || 'Expiry Date of the Document'} />
                        </div>
                    </div>
                </div>

                <div className="mt-4 md:mt-6">
                    <Button className='w-full md:w-44 px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer' onClick={handleSubmit} >
                        {i18?.MYPROFILE?.UPLOADSAVE || "Upload & Save"}
                    </Button>
                </div>
            </div>
        </div>
    )
}