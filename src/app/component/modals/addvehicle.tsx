import { createTheme, Tab, Tabs, ThemeProvider } from "@mui/material"
import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import Button from "../button";
import { useMutation } from "@tanstack/react-query";
import { AddVehicleImgAPI } from "@/app/tools/mutatefn/vehicle";
import useSnackbarStore from "@/app/store/toaster";
import VehicleStore from "@/app/store/vehicle";
import Store from "@/app/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import { useFormContext } from "@/app/(create)/FormCotext";
import PageContext from "@/app/providers/pagecontext";

const theme = createTheme({
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'capitalize',
                    fontSize: '17px',
                    fontWeight: '400',
                    '&.Mui-selected': {
                        color: '#004080',
                    },
                    fontFamily: '__DM_Sans_0dfae3, __DM_Sans_FallbackImage_0dfae3'
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    '& .MuiTabs-indicator': {
                        backImagegroundColor: '#004080!important',
                        height: '2px',
                        borderRadius: '5px'
                    },
                },
            },
        },
    }
});

export default function AddVehicleModel({ data }: any) {
    const { i18 } = useContext(PageContext);
    const { setStep } = useFormContext()
    const Params = useSearchParams()
    const search = Params.get('vehicle_id')
    const RedirectUrl = Params.get('redirectUrl')
    
    const router = UseLoadingRouter();
    const Vehicle_id = search ? search : data ? data : null
    const User_id = (typeof window !== "undefined" && window.localStorage.getItem('appUserId') !== '') ? window.localStorage.getItem('appUserId') : null
    const { SingleVehicle, fetchVehicleDoc, VehicleDoc }: any = VehicleStore()
    const { setModal } = Store()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const [value, setValue] = useState('frontImage');
    const [selected, setSelected] = useState<any>({});
    const [files, setFiles] = useState<{ [key: string]: File | null }>({ frontImage: null, backImage: null });
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    // console.log('RedirectUrl', RedirectUrl)
    console.log('search', search)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'frontImage' | 'backImage') => {
        const file = e.target.files?.[0];
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
                    setSelected((prev: any) => ({
                        ...prev,
                        [side]: reader.result as string,
                    }));
                    // Store the actual file for binary upload
                    setFiles((prev) => ({
                        ...prev,
                        [side]: file,
                    }));
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
    const Post = useMutation({
        mutationFn: AddVehicleImgAPI,
        onSuccess: (data) => {
            showSnackbar(data.data.message, "success");
            setModal('')
            if (RedirectUrl) {
                let redirectParams:any = {};
                if (RedirectUrl) {
                    const urlParams:any = new URLSearchParams(RedirectUrl.split("?")[1]);
                    for (const [key, value] of urlParams.entries()) {
                        redirectParams[key] = value;
                    }
                }

                router.push(RedirectUrl)
                // setStep(9)
            }
            else {
                router.push('/accountsettings/manage-vehicles')
            }
        }
    })
    const handleImage = () => {
        const formData = new FormData();
        if (files.frontImage) {
            formData.append('frontImage', files.frontImage)
        }
        if (files.backImage) {
            formData.append('backImage', files.backImage)
        }
        formData.append('fieldName', 'vehicleImage')
        if(files.frontImage && files.backImage){
           Vehicle_id && Post.mutateAsync({ Vehicle_id, formData })
        }else{
            showSnackbar("Please select a Front and back image file.", "error");
        }
    }

    const ImagefromApi = useMemo(() => {
        return VehicleDoc
            ?.find((item: any) => item.indexName === "vehicleImage") // Find the document with indexName "vehicleImage"
            ?.fields || []; // Return the fields array or an empty array if not found
    }, [VehicleDoc]);

    useEffect(() => {
        if (ImagefromApi.length > 1) {
            setSelected({
                frontImage: ImagefromApi[0]?.value,
                backImage: ImagefromApi[1]?.value
            })
            setFiles({
                frontImage: ImagefromApi[0]?.value,
                backImage: ImagefromApi[1]?.value
            })
        }
    }, [ImagefromApi, VehicleDoc])
    useEffect(() => {
        if(Vehicle_id){

            fetchVehicleDoc(User_id, Vehicle_id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Vehicle_id])
    // console.log('VehicleDoc',selected?.frontImage?.startsWith('/public'))
    return (
        <div>
            <div className="my-4">
                <ThemeProvider theme={theme}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label={i18?.NEW?.FRONT_SIDE || "Front Side"} value='frontImage' />
                        <Tab label={i18?.NEW?.BACK_SIDE || "Back Side"} value='backImage' />
                    </Tabs>
                </ThemeProvider>
            </div>
            {
                (value === 'frontImage' || value === 'backImage') &&
                <label className="border border-1 p-3 mt-5 flex items-center justify-center rounded-[7px] h-[360px] cursor-pointer">
                    {
                        selected[value] ?
                            <Image src={selected[value].startsWith('public') ? process.env.NEXT_PUBLIC_IMAGE_URL + selected[value] : selected[value]} alt='img' width={800} height={800} className='w-full h-full object-cover rounded-lg' />
                            :
                            <Image src='/svg/icon/Add.svg' alt='img' width={800} height={800} className='w-[50px] h-[50px] object-cover rounded-lg' />
                    }
                    <input
                        onChange={(e) => handleImageChange(e, value)}
                        type="file"
                        className='hidden'
                        accept="image/*"
                    />
                </label>
            }
            <div className="flex justify-center mt-8">
                <Button onClick={handleImage} className="bg-btncolor px-[30px] py-[15px] rounded-full text-[#fff]">{i18?.NEW?.UPLOAD_PHOTO || "Upload Photo"}</Button>
            </div>
        </div>
    )
}