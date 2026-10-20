import { SendparcelInputs } from "@/interface";
import { Controller, useForm, useWatch } from "react-hook-form";
import { packagecontent, parcelInfo, receiverInfo, senderinfo } from "../../../../content";
import Input from "@/app/component/input";
import CustomizedSwitches from "@/app/component/switch";
import React, { useContext, useEffect, useState } from "react";
import Select from "@/app/component/select";
import Button from "@/app/component/button";
import { useSearchParams } from "next/navigation";
import Store from "@/app/store/store";
import useSnackbarStore from "@/app/store/toaster";
import PostDetailsStore from "@/app/store/parcelDetails";
import { UdateParcelDetails } from "@/app/tools/mutatefn/Parcelpost";
import { useMutation } from "@tanstack/react-query";
import { MenuItem } from "@mui/material";
import Utils from "@/app/store/utils";
import TextArea from "@/app/component/textarea";
import Image from "next/image";
import PageContext from "@/app/providers/pagecontext";



export default function Step2({ handleNext }: any) {
    const { i18 } = useContext(PageContext);
    const searchParams: any = useSearchParams()
    const [selectedValue, setSelectedValue] = useState<string | any>('');
    const [heightT, setheightType] = useState<string | any>('');
    const [weightT, setwidthType] = useState<string | any>('');
    const { fetchPostDetails, postDetails } = PostDetailsStore()
    const { parcelType, FetchparcelType } = Utils()
    const { step, setStep, setStepper } = Store()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const currentParams = new URLSearchParams(searchParams);
    const PostId: any = currentParams.get('id') ? currentParams.get('id') : null
    const Type = currentParams.get('type') ? currentParams.get('type') : null
    const [previewImage, setPreviewImage] = useState<any>([]);
    const [images, setImages] = useState<any>([]);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [click, setClick] = useState<string>()

    const { handleSubmit, formState: { errors, dirtyFields }, control, setValue, reset, register } = useForm<SendparcelInputs>({

    });
    const watchFiles = useWatch({
        control,
        name: 'files'
    })
    useEffect(() => {

        if (images) {
            setValue('files', images);
            const imageArray = Array.from(images).map((file: any) => {
                if (file instanceof File)
                    return URL.createObjectURL(file)
                else
                    return file;
            });
            setPreviewImage(imageArray);
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images, setValue])
    const deleteImage = (e: any) => {
        e.preventDefault();
        if (postDetails?.parcel?.image) {
            const index = parseInt(e.target.dataset.id);
            setPreviewImage((prev: any) => {

                return prev.filter((item: any, i: number) => i != index)
            })
            setImages((prev: any) => prev.filter((item: any, i: number) => i != index))
        } else {
            const index = parseInt(e.target.dataset.id);
            setImages((prev: any) => prev.filter((item: any, i: number) => i != index))

        }

    }
    // console.log('previewImage', previewImage)
    const handleImageChange = (e: any) => {
        // const file = event.target.files[0];
        // if (event.target.files.length>0) {
        //     // const reader = new FileReader();
        //     // reader.onloadend = () => {
        //     // onChange([...Array.from(event.target.files ?? [])])
        //     const file = Array.from(event.target.files);
        //     setImages(event.target.files);
        //     setPreviewImage((prevValue:any)=>([...prevValue, ...file]));
        //     setImageUploaded(true);

        //     // };
        //     // reader.readAsDataURL(file);

        // }

        if (e.target.files) {
            const imageArray = Array.from(e.target.files).map((file: any) =>
                URL.createObjectURL(file)
            );
            setPreviewImage((prevImages: any) => prevImages.concat(imageArray));
        }
    };
    // console.log('postDetails', postDetails)

    const ParcelDetails: any = {
        title: postDetails?.parcel?.title ? postDetails?.parcel?.title : '',
        description: postDetails?.parcel?.description ? postDetails?.parcel?.description : '',
        type: postDetails?.parcel?.type ? postDetails?.parcel?.type : '',
        height: postDetails?.parcel?.height ? postDetails?.parcel?.height : '',
        width: postDetails?.parcel?.width ? postDetails?.parcel?.width : '',
        // files:postDetails?.parcel?.image ? postDetails?.parcel?.image : [],
        size: postDetails?.parcel?.size ? postDetails?.parcel?.size : '',

    }
    useEffect(() => {
        if (PostId) {
            fetchPostDetails(PostId)
        }
        if (ParcelDetails) {
            reset(ParcelDetails)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ PostId, fetchPostDetails, reset, searchParams])
    const Put = useMutation({
        mutationFn: UdateParcelDetails,
        onSuccess: (data) => {
            setStep(4)
            setStepper(3)
            showSnackbar(data.data.message, "success");
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    let handlefunction = handleNext;
    if (Type === 'edit') { // check if routeparams exists
        handlefunction = (data: any) => {
            const formData = new FormData();
            formData.append('action', `step${step}`)
            if (dirtyFields.title) {
                formData.append('title', data.title)
            }
            if (dirtyFields.description) {
                formData.append('description', data.description)
            }
            if (dirtyFields.type) {
                formData.append('type', data.type)
            }
            if (dirtyFields.height) {
                formData.append('height', data.height)
            }
            if (dirtyFields.width) {
                formData.append('width', data.width)
            }
            if (dirtyFields.heightType) {
                formData.append('heightType', data.heightType)
            }
            if (dirtyFields.widthType) {
                formData.append('widthType', data.widthType)
            }
            if (dirtyFields.apprxSize) {
                formData.append('apprxSize', data.apprxSize)
            }
            const oldFiles = [];
            const newFiles = [];

            for (const key of Object.keys(data?.files)) {
                const file = data.files[key];
                if (file instanceof File) {
                    newFiles.push({ file, key });
                } else if (typeof file === 'string') {
                    oldFiles.push(file);
                }
            }

            // Append old files as a comma-separated string
            if (oldFiles.length > 0) {
                formData.append('oldFile', oldFiles.join(','));
            }

            if (newFiles.length > 0) {
                newFiles.forEach(({ file, key }) => {
                    formData.append('files', file, 'file_' + key);
                });
            }
            Put.mutateAsync({ formData, PostId })
        }
    }
    useEffect(() => {
        if (postDetails?.parcel?.image) {
            setPreviewImage(postDetails?.parcel?.image)
            setImages(postDetails?.parcel?.image)
        }
        setClick(postDetails?.parcel?.size)
        setSelectedValue(postDetails?.parcel?.type)
        setheightType(postDetails?.parcel?.heightType)
        setwidthType(postDetails?.parcel?.widthType)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postDetails])
    useEffect(() => {
        FetchparcelType()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <form onSubmit={handleSubmit(handlefunction)}>
            <div className='flex flex-col gap-8 m-auto'>
                <div className='md:flex gap-5'>
                    <div className='w-full flex flex-col gap-5'>
                        <Controller
                            name="title"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Post Title is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label='Write the title of your post here'
                                    error={!!errors.title}
                                />
                            )}
                        />
                        {/* {errors.title && <span className='text-red-700'>{errors.title.message}</span>} */}
                    </div>

                    <div className='w-full flex flex-col gap-5'>
                        <Controller
                            name="type"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Parcel Type is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Select Parcel Type"
                                    value={selectedValue}
                                    error={!!errors.type}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setSelectedValue(e.target.value);
                                        setValue('parcelBy', e.target.value, { shouldDirty: true, shouldValidate: true })
                                    }}
                                    className="bg-[#fff] outline-none">
                                    {
                                        Array.isArray(parcelType) && parcelType.map((item) => {
                                            return (
                                                <MenuItem key={item._id} value={item.name}>{item.name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            )}

                        />
                        {/* {errors.type && <span className='text-red-700'>{errors.type.message}</span>} */}
                    </div>

                </div>
                <div>
                    <div className='w-full flex flex-col gap-5 mt-5 md:mt-0'>
                        <Controller
                            name="description"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Parcel Descriptionis required' }}
                            render={({ field }) => (
                                <TextArea {...field}  error={!!errors.description}/>
                            )}
                        />
                        {/* {errors.description && <span className='text-red-700'>{errors.description.message}</span>} */}
                    </div>
                </div>
                <div className='md:flex gap-5'>
                    <div className='w-full flex flex-col gap-5 mt-5 md:mt-0'>
                        <Controller
                            name="height"
                            control={control}
                            rules={{ required: 'Parcel Height is required' }}
                            render={({ field }) => (
                                <div className="relative">
                                    <Input
                                        {...field}
                                        label='Parcel Height'
                                        error={!!errors.height}
                                    />
                                    <select
                                        value={heightT}
                                        className="
                                        border border-[#D9D9D9] bg-[#D9D9D9] p-1 w-[13%] h-[60%] rounded-full outline-none
                                        absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer
                                        "
                                        onChange={(e) => {
                                            setheightType(e.target.value)
                                            setValue('heightType', e.target.value || 'Meters', { shouldDirty: true, shouldValidate: true })
                                        }}
                                    >
                                        <option value="" disabled selected hidden>
                                            <em>Select</em>
                                        </option>
                                        <option value="Meters">Meters</option>
                                        <option value="Inches">Inches</option>
                                    </select>
                                </div>
                            )}
                        />
                        {/* {errors.height && <span className='text-red-700'>{errors.height.message}</span>} */}
                    </div>

                    <div className='w-full flex flex-col gap-5'>
                        <Controller
                            name="width"
                            control={control}
                            rules={{ required: 'Parcel Width is required' }}
                            render={({ field }) => (
                                <div className='relative'>
                                    <Input
                                        {...field}
                                        label='Parcel Width'
                                        error={!!errors.width}
                                    />
                                    <select
                                        value={weightT}
                                        className="border border-[#D9D9D9] bg-[#D9D9D9] p-1 w-[13%] h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer"
                                        onChange={(e) => {
                                            setwidthType(e.target.value);
                                            setValue('widthType', e.target.value, { shouldDirty: true, shouldValidate: true });
                                        }}
                                    >
                                        <option value="" disabled selected hidden>
                                            <em>Select</em>
                                        </option>
                                        <option value="Meters">Meters</option>
                                        <option value="Inches">Inches</option>
                                    </select>

                                </div>
                            )}
                        />
                        {/* {errors.width && <span className='text-red-700'>{errors.width.message}</span>} */}
                    </div>

                </div>

                <div className='md:flex gap-5'>


                    <div className='w-full flex flex-col gap-5 mt-5 md:mt-0'>
                        <Controller
                            name="apprxSize"
                            control={control}
                            rules={{ required: 'Parcel Weight required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label={i18?.NEW?.ENTER_WEIGHT || 'Enter Weight'}
                                    error={!!errors.apprxSize}
                                />
                            )}
                        />
                        {/* {errors.apprxSize && <span className='text-red-700'>{errors.apprxSize.message}</span>} */}
                    </div>
                </div>
                <div className='w-full flex flex-col gap-5 mt-5 md:mt-0'>
                    <p className='text-[25px] font-bold'>Upload image</p>
                    <div className="">
                        <div className="flex flex-wrap gap-4">
                            {previewImage?.map((each: any, index: any) => (
                                <div key={index} className="relative">
                                    <button className="absolute right-0 top-0"
                                        data-id={index}
                                        onClick={deleteImage}
                                    >
                                        <div className="pointer-events-none">
                                            <Image width={20} height={20} src='/svg/icon/close.svg' alt='Image' />
                                        </div></button>
                                    <Image width={20} height={20} src={each.toString().includes("public") ? process.env.NEXT_PUBLIC_IMAGE_URL + each : each} alt="Preview" className=' w-[130px] h-[130px] ' /></div>
                            ))}
                        </div>
                        <label className='bg-[#F0F0F0] w-[130px] h-[130px] flex items-center justify-center mt-4'>

                            <>
                                <Image width={20} height={20} src='/svg/icon/add.svg' alt='svg' />
                                <input
                                    // {...register('files', { required: true })}
                                    onChange={(e) => {
                                        setImages((prev: any) => [...prev, ...Array.from(e.target.files ?? [])]);
                                    }}
                                    type="file"
                                    className='hidden'
                                    multiple
                                    accept="image/*"
                                />
                            </>

                        </label>
                    </div>

                    {/* <Controller
                            name="files"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        {previewImage?.map((each: any, index: any) => (
                                            <Image width={20} height={20} key={index} src={URL.createObjectURL(each)} alt="Preview" className=' w-[130px] h-[130px] ' />
                                        ))}
                                    </div>
                                    <label className='bg-[#F0F0F0] w-[130px] h-[130px] flex items-center justify-center mt-4'>

                                        <>
                                            <Image width={20} height={20} src='/svg/icon/add.svg' alt='svg' />
                                            <input
                                                {...field}
                                                type="file"
                                                className='hidden'
                                                multiple
                                                accept="image/*"
                                            />
                                        </>

                                    </label>
                                </div>
                            )}
                        /> */}

                    {/* {errors.files && <span className='text-red-700'>{errors.files.message}</span>} */}

                </div>

                {/* <div className='flex flex-col gap-6'>
                    <p className='text-[25px] font-bold'>Parcel size</p>
                    <Controller
                        name="size"
                        control={control}
                        render={({ field }) => (
                            <div className='flex flex-wrap gap-10'>
                                {packagecontent.map((item: any, index: any) => {
                                    return (
                                        <div
                                            {...field}
                                            key={index}
                                            onClick={() => {
                                                setClick(item.value)
                                                setValue('size', item.value, { shouldDirty: true, shouldValidate: true })
                                            }}
                                            className={`border border-btncolor p-4 rounded-[7px] flex flex-col gap-5 w-[160px] h-[160px] items-center justify-center ${click === item.value ? 'border-[2px]' : ''
                                                }`}
                                        >
                                            {React.cloneElement(item.Image, { stroke: click === item.value ? '#004080' : '#000000' })}
                                            <p className={` ${click === item.value ? 'text-btncolor' : 'text-[#000]'}`} >{item.text}</p>
                                        </div>
                                    );
                                })}
                            </div>

                        )}
                    />
                    {errors.size && <span className='text-red-700'>{errors.size.message}</span>}
                </div> */}

                <div className='text-center'>
                    <Button className='px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer ' type="submit">Save & Continue</Button>
                </div>
            </div>
        </form>
    )
}