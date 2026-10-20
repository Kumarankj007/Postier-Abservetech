import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { FlipView, ImageView, SideView, SplitView } from "../../../../../public/svg/svgcomponent"
import Image from "next/image"
import StoreParcel from "@/app/store/store-parcel"
import { useFormContext } from "../../FormCotext"
import CustomizedSwitches from "@/app/component/switch"
import { useSearchParams } from "next/navigation"
import PageContext from "@/app/providers/pagecontext"
import ContentTooptip from "@/app/component/contentTooptip"
import { UploadParcelContent } from "@/app/(profileDetails)/accountsettings/content"
import useSnackbarStore from "@/app/store/toaster"

export default function ParcelImage() {
    const { i18 } = useContext(PageContext)
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const param: any = useSearchParams()
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const { setPacelData, Parceldata } = StoreParcel()
    const { setDisable }: any = useFormContext()
    const [isChecked, setIsChecked] = useState<any>(false);
    const [click, setClick] = useState<any>('primaryImage')
    const [images, setImages] = useState<Record<string, any>>({});
    // const [previewImage, setPreview] = useState<{ key: string; img: any[] }>({ key: '', img: [] });
    const views =
        [
            {
                name: 'primaryImage',
                icon: <ImageView />,
                title: i18?.NEW?.PRIMARY || 'Primary'
            },
            {
                name: 'frontviewImage',
                icon: <FlipView />,
                title: i18?.NEW?.FRONT_VIEW || 'Front view'
            },
            {
                name: 'topviewImage',
                icon: <SplitView />,
                title: i18?.NEW?.TOP_VIEW || 'Top view'
            },
            {
                name: 'sideviewImage',
                icon: <SideView />,
                title: i18?.NEW?.SIDE_VIEW || 'Side view'
            }
        ]

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                    const newFiles = e.target.files ? Array.from(e.target.files) : [];
                    const prev = Parceldata[click] || [];
                    setPacelData(click, [...newFiles]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                };
                img.onerror = () => {
                    // Image failed to load (corrupt or not an actual image file)
                    showSnackbar("Please select a valid image file.", "error");
                    e.target.value = "";
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    return;
                };
                img.src = val?.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const value = useMemo(() => {
        const allImages: { name: string; file: string }[] = [];

        const imageGroups = [
            { name: 'primaryImage', files: Parceldata.primaryImage || [] },
            { name: 'frontviewImage', files: Parceldata.frontviewImage || [] },
            { name: 'topviewImage', files: Parceldata.topviewImage || [] },
            { name: 'sideviewImage', files: Parceldata.sideviewImage || [] },
        ];
        // 
        imageGroups.forEach(({ name, files }) => {
            if (Array.isArray(files)) {
                files.forEach((file: any) => {
                    const url = file instanceof File ? URL.createObjectURL(file) : file;
                    allImages.push({ name, file: url });
                });
            }
            else {
                allImages.push({ name, file: files });
            }
        });

        return allImages;
    }, [Parceldata]);



    const handleDelete = (name: any) => {
        // delete Parceldata[name]
        // const data = Parceldata[name];
        setPacelData(name, []);
    }
    useLayoutEffect(() => {
        if ((Parceldata['primaryImage'] && Parceldata['primaryImage'].length > 0) &&
            (Parceldata['frontviewImage'] && Parceldata['frontviewImage'].length > 0) &&
            (Parceldata['topviewImage'] && Parceldata['topviewImage'].length > 0) &&
            (Parceldata['sideviewImage'] && Parceldata['sideviewImage'].length > 0)) {
            setDisable(false)
        }
        else {
            setDisable(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata])

    useEffect(() => {
        if (!Parceldata.primaryImage || Parceldata.primaryImage.length == 0) {
            setClick('primaryImage')
        } else if (!Parceldata.frontviewImage || Parceldata.frontviewImage.length == 0) {
            setClick('frontviewImage')
        } else if (!Parceldata.topviewImage || Parceldata.topviewImage.length == 0) {
            setClick('topviewImage')
        } else {
            setClick('sideviewImage')
        }
    }, [Parceldata])
    useEffect(() => {
        if (isChecked) {
            setPacelData('isPrivateImage', 'yes')
        } else {
            setPacelData('isPrivateImage', 'no')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isChecked])
    // console.log('value', value)
    return (
        <div className="flex flex-col gap-6 items-center px-[20px]">
            <h3 className="text-[30px] md:text-[50px] font-bold text-center leading-[37px] md:leading-[65px]">{i18?.NEW?.UPLOAD_PARCEL_PHOTOS || "Upload Parcel Photos"}</h3>
            <p className="text-[17px] leading-[31px] font-[500] max-w-[584px] text-center ">
                {i18?.NEW?.UPLOADPARCEL || "Before you publish your parcel, we recommend uploading clear photos of the parcel from different angles."}
                <span className="inline-flex">
                    <ContentTooptip value={UploadParcelContent()} />
                </span>
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
                {
                    views.map((items, index) => {
                        return (
                            <div onClick={() => setClick(items.name)} key={index} className={`p-2 rounded-[8px] w-[100px] h-[100px] flex flex-col gap-4 justify-center items-center cursor-pointer border ${click === items.name ? 'border-2' : 'border-1'} border-btncolor`}>
                                {React.cloneElement(items.icon, { fill: click === items.name ? '#004080' : '#000000' })}
                                {items.title}
                            </div>
                        )
                    })
                }
            </div>
            <div className="flex flex-col gap-4 justify-center items-center p-5 border border-1 border-btncolor rounded-[8px] w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[480px] md:h-[400px] ">
                <label className="cursor-pointer">
                    <>
                        <Image src='/svg/icon/Add.svg' alt='img' width={800} height={800} className="w-[96px] h-[96px]" />
                        <p>{i18?.NEW?.BROWSE_PHOTO || "Browse photo"}</p>
                        <input
                            ref={fileInputRef}
                            onChange={(e) => handleImageUpload(e)}
                            type="file"
                            className='hidden'
                            accept="image/*"
                        />
                    </>
                </label>
            </div>
            <div className="flex flex-wrap gap-4 justify-center max-w-[500px] pb-[40px]">
                {
                    (value) &&
                    value.map((items, index) => {
                        return (
                            <div key={index} className="flex flex-col gap-3">
                                <div className=" relative p-2 flex justify-center items-center border-2 border-btncolor rounded-[8px] h-[100px]">
                                    <Image src={items.file.startsWith('public/') ? process.env.NEXT_PUBLIC_IMAGE_URL + items.file : items.file} alt=" img" width={800} height={800} className="w-[70px] h-[70px] object-contain" />
                                    <div className="absolute bg-btncolor border-btncolor rounded-full top-[-12px] right-[-8px] h-[23px] w-[23px] cursor-pointer" onClick={() => handleDelete(items.name)}>
                                        <Image src='/svg/icon/close2.svg' alt="img" width={800} height={800} />
                                    </div>
                                </div>
                                <p className="capitalize">{items?.name}</p>
                            </div>
                        )
                    })
                }
            </div>
            <div className="max-w-[640px] pb-[30px] flex gap-2">
                <CustomizedSwitches
                    width='100%'
                    checked={isChecked}
                    onChange={() => {
                        setIsChecked(!isChecked)
                    }}
                    label={i18?.NEW?.TOGGLE_PUBLIC_PHOTOS || 'Selecting this toggle will be make all the photos you uploaded to be in public view'}
                />
            </div>
        </div>
    )
}