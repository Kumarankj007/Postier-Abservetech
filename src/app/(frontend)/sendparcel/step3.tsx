import { SendparcelInputs } from "@/interface";
import { Controller, useForm } from "react-hook-form";
import { packagecontent, parcelInfo, receiverInfo, senderinfo } from "../../../../content";
import Input from "@/app/component/input";

import CustomizedSwitches from "@/app/component/switch";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Select from "@/app/component/select";
import Button from "@/app/component/button";
import { useSearchParams } from "next/navigation";
import PostDetailsStore from "@/app/store/parcelDetails";
import Store from "@/app/store/store";
import useSnackbarStore from "@/app/store/toaster";
import { UdateParcelDetails } from "@/app/tools/mutatefn/Parcelpost";
import { useMutation } from "@tanstack/react-query";
import { MenuItem } from "@mui/material";
import LocationStore from "@/app/store/locations";
import LoaderScript from "@/app/component/loadingscript";
import { Autocomplete } from "@react-google-maps/api";
import PhoneInputComponent from "@/app/component/phoneinput";
import PageContext from "@/app/providers/pagecontext";




export default function Step3({ handleNext }: any) {
    const { i18 } = useContext(PageContext);
    const searchParams: any = useSearchParams()
    const [selectedvalue, setSelectedValue] = useState<any>('')
    const [autocompletePickup, setautocompletePickup] = useState<any>(null)
    const { country, FetchCountry, state, FetchState, city, FetchCity, FavLocation, FetchFavLocation } = LocationStore()
    const [countryValue, setSelectedCountry] = useState<string | any>('');
    const [stateValue, setSelectedstate] = useState<string | any>('');
    const [cityValue, setSelectedCity] = useState<string | any>('');
    const [isChecked, setIsChecked] = useState<any>(false);
    const { fetchPostDetails, postDetails } = PostDetailsStore()
    const { step, setStep, setStepper } = Store()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const currentParams = new URLSearchParams(searchParams);
    const PostId: any = currentParams.get('id') ? currentParams.get('id') : null
    const Type = currentParams.get('type') ? currentParams.get('type') : null
    const [selectedOption, setSelectedOption] = useState('');
    const PhoneNumber = postDetails ? `${postDetails?.receiver?.phoneCode}${postDetails?.receiver?.phone}` : null;
    const { handleSubmit, formState: { errors, dirtyFields }, control, setValue, reset } = useForm<SendparcelInputs>({

    });
    const handlePhoneChange = (value: any, data: any) => {
        const code = data.dialCode;
        const number = value.slice(code.length);
        setValue("recvrPhone", number);
        setValue("recvrPhonecode", code);
    };
    const onLoadpickup = (autocomplete: any) => {
        if (autocomplete !== null && autocomplete.getPlace) {
            setautocompletePickup(autocomplete)
        }
    }
    const onPlaceChangedpickup = () => {
        if (autocompletePickup !== null && autocompletePickup.getPlace) {
            const placeDetail = autocompletePickup.getPlace()
            const place = placeDetail.formatted_address
            const lat = placeDetail.geometry?.location.lat()
            const lng = placeDetail.geometry?.location.lng()
            setValue('address', place)
            setValue('location',{lat, lng})
        } else {
            // console.log('Autocomplete is not loaded yet!');
        }
    }
    const memorizedArray: any = useMemo(() => {
        if (selectedvalue !== 'Enter New Address' && selectedvalue !== '') {
            const foundLocation: any = Array.isArray(FavLocation) && FavLocation.find((item: any) => item?._id === selectedvalue);
            return foundLocation ? foundLocation : [];
        }
        return [];
    }, [selectedvalue, FavLocation]);

    const ReceiverDetails: any = {
        recvrFname: postDetails?.receiver?.firstName ? postDetails?.receiver?.firstName : '',
        recvrLname: postDetails?.receiver?.lastName ? postDetails?.receiver?.lastName : '',
        recvrEmail: postDetails?.receiver?.email ? postDetails?.receiver?.email : '',
        recvrPhone: postDetails?.receiver?.phone ? postDetails?.receiver?.phone : '',
        recvrPhonecode: postDetails?.receiver?.phoneCode ? postDetails?.receiver?.phoneCode : '',
        // recvraddress: postDetails?.receiver?.address ? postDetails?.receiver?.address : '',
        // recvrAddress: postDetails?.receiver?.address ? postDetails?.receiver?.address : '',
        // recvrAddress2: postDetails?.receiver?.address2 ? postDetails?.receiver?.address2 : '',
        country: postDetails?.receiver?.country ? postDetails?.receiver?.country : '',
        stateName: postDetails?.receiver?.state ? postDetails?.receiver?.state : '',
        cityName: postDetails?.receiver?.city ? postDetails?.receiver?.city : '',
        address: postDetails?.receiver?.address ? postDetails?.receiver?.address : memorizedArray?.address ? memorizedArray?.address : '',
        pinCode: postDetails?.receiver?.pinCode ? postDetails?.receiver?.pinCode : ''
    }

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
            if (dirtyFields.recvrFname) {
                formData.append('recvrFname', data.recvrFname)
            }
            if (dirtyFields.recvrLname) {
                formData.append('recvrLname', data.recvrLname)
            }
            if (dirtyFields.recvrEmail) {
                formData.append('recvrEmail', data.recvrEmail)
            }
            if (dirtyFields.recvrPhone) {
                formData.append('recvrPhone', data.recvrPhone)
            }
            if (dirtyFields.recvrPhonecode) {
                formData.append('recvrPhonecode', data.recvrPhonecode)
            }
            if (dirtyFields.favAddressId) {
                formData.append('favAddressId', data.favAddressId)
            }
            if (dirtyFields.state) {
                formData.append('state', memorizedArray?.state || postDetails?.receiver?.country)
            }
            if (dirtyFields.city) {
                formData.append('city', memorizedArray?.city || postDetails?.receiver?.country)
            }
            if (dirtyFields.country) {
                formData.append('country', memorizedArray?.country || postDetails?.receiver?.country)
            }
            if (dirtyFields.pinCode) {
                formData.append('pinCode', memorizedArray?.pinCode || postDetails?.receiver?.country)
            }
            if (dirtyFields.address) {
                if (isChecked) {
                    formData.append('address', data.address)
                } else {
                    formData.append('recvrAddress', data.address)
                }

            }
            Put.mutateAsync({ formData, PostId })
        }
    }
    // console.log('postDetails', FavLocation.length)



    useEffect(() => {
        const value: boolean = isChecked === true
        setValue('isEnable', value)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isChecked, selectedvalue])

    useEffect(() => {
        if (PostId) {
            fetchPostDetails(PostId)
            FetchFavLocation()

        }
        if (ReceiverDetails) {
            reset(ReceiverDetails)
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])
    useEffect(() => {
        setValue('address', memorizedArray?.address || postDetails?.receiver?.address, { shouldDirty: true, shouldValidate: true });
        setValue('location', memorizedArray?.location?.coordinates, { shouldDirty: true, shouldValidate: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedvalue, memorizedArray]);
    useEffect(() => {
        if (postDetails?.receiver?.country && postDetails?.receiver?.state) {
            FetchCountry()
            FetchState(postDetails?.receiver?.country)
            FetchCity(postDetails?.receiver?.country, postDetails?.receiver?.state)
        }
        setSelectedValue(postDetails?.receiver?.favAddressId)
        setSelectedCountry(postDetails?.receiver?.country)
        setSelectedstate(postDetails?.receiver?.state)
        setSelectedCity(postDetails?.receiver?.city)
        setIsChecked(postDetails?.receiver?.isEnable)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postDetails])
    // console.log('isChecked', FavLocation)
    return (
        <form onSubmit={handleSubmit(handlefunction)}>
            <div className='flex flex-col gap-8 m-auto'>
                <div className='md:flex gap-5'>
                    <div className='w-full flex flex-col gap-5'>
                        <Controller
                            name="recvrFname"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Receiver First Name is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label='Receiver First Name'
                                    error={!!errors.recvrFname}
                                />
                            )}
                        />
                        {/* {errors.recvrFname && <span className='text-red-700'>{errors.recvrFname.message}</span>} */}
                    </div>

                    <div className='w-full flex flex-col gap-5 mt-5 md:mt-0'>
                        <Controller
                            name="recvrLname"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Receiver Last Name is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label='Receiver Last Name '
                                    error={!!errors.recvrLname}
                                />
                            )}
                        />
                        {/* {errors.recvrLname && <span className='text-red-700'>{errors.recvrLname.message}</span>} */}
                    </div>
                </div>

                <div className='md:flex gap-5'>
                    <div className='w-full flex flex-col gap-5'>
                        <Controller
                            name="recvrEmail"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Receiver Email is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label='Receiver Email ID'
                                    error={!!errors.recvrEmail}
                                />
                            )}
                        />
                        {/* {errors.recvrEmail && <span className='text-red-700'>{errors.recvrEmail.message}</span>} */}
                    </div>

                    <div className='w-full flex flex-col gap-5 mt-5 md:mt-0'>
                        <Controller
                            name="recvrPhone"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Receiver Phone number is required' }}
                            render={({ field }) => (
                                <PhoneInputComponent
                                    // value={field.value}
                                    value={PhoneNumber}
                                    onPhoneChange={(number:any,code:any)=>{
                                        setValue("recvrPhone", number);
                                        setValue("recvrPhonecode", code);
                                    }}
                                    errors={!!errors.recvrPhone}
                                    country={'us'} />
                            )}
                        />
                        {/* {errors.recvrPhone && <span className='text-red-700'>{errors.recvrPhone.message}</span>} */}
                    </div>


                </div>


                <div className='md:flex gap-5'>
                    <div className=' w-[100%] md:w-[50%] flex flex-col gap-5'>
                        <Controller
                            name="favAddressId"
                            control={control}
                            defaultValue=""
                            // rules={{ required: 'Receiver Adress is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    value={selectedvalue}
                                    error={!!errors.favAddressId}
                                    label="Select Receiver Address"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setSelectedValue(e.target.value);
                                        setValue('favAddressId', e.target.value, { shouldDirty: true, shouldValidate: true })
                                    }}
                                >
                                    {
                                       FavLocation?.length === 0 &&   <MenuItem disabled={true} value=''>No Favourite Location</MenuItem>
                                    }
                                    {
                                        Array.isArray(FavLocation) && FavLocation.map((item: any, index: any) => {
                                            return (
                                                <MenuItem key={index} value={item?._id}>{item?.name}</MenuItem>
                                            )
                                        })
                                    }
                                    {
                                        Type !== 'edit' && <MenuItem value="Enter New Address">Enter New Address </MenuItem>
                                    }

                                </Select>
                            )}
                        />
                        {/* {errors.recvraddress && <span className='text-red-700'>{errors.recvraddress.message}</span>} */}
                    </div>
                </div>
                {/* <div className='md:flex gap-5'>
                    <div className=' w-[100%] md:w-[50%] flex flex-col gap-5'>
                        <p className='text-[25px] font-bold'>Select The Receiver Address</p>
                        <Controller
                            name="recvraddress"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Receiver Adress is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label='Enter Receiver Adress'
                                    type="text"
                                />
                            )}
                        />
                        {errors.recvraddress && <span className='text-red-700'>{errors.recvraddress.message}</span>}
                    </div>
                </div> */}
                {
                    (selectedvalue || Type === 'edit') &&
                    (

                        <div  >
                            <div className="flex flex-col">
                                <Controller
                                    name="address"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'address is required' }}
                                    render={({ field }) => (
                                        <LoaderScript>
                                            <Autocomplete
                                                onLoad={onLoadpickup}
                                                onPlaceChanged={onPlaceChangedpickup}
                                                options={{
                                                }}
                                            >
                                                <Input
                                                    {...field}
                                                    label='Address'
                                                    type="text"
                                                    disabled={Type !== 'edit' ? selectedvalue !== 'Enter New Address' : postDetails?.receiver?.favAddressId !== null}
                                                />
                                            </Autocomplete>
                                        </LoaderScript>
                                    )}
                                />
                                {/* {errors.address1 && <span className='text-red-700'>{errors.address1.message}</span>} */}

                                {/* <Controller
                                    name="recvrAddress2"
                                    control={control}
                                    defaultValue=""
                                    // rules={{ required: 'address line 2 is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label='Address Line 1'
                                            type="text"
                                        />
                                    )}
                                /> */}
                                {/* {errors.recvrAddress2 && <span className='text-red-700'>{errors.recvrAddress2.message}</span>} */}
                            </div>
                            {
                                selectedvalue === 'Enter New Address' &&
                                <div className="mt-[30px]">
                                    <CustomizedSwitches
                                        label="Mark this address as favourite"
                                        checked={isChecked}
                                        onChange={() => { setIsChecked(!isChecked) }}
                                        disable={Type === 'edit' ? true : false}
                                    />
                                </div>
                            }

                            {
                                isChecked && Type !== 'edit' &&
                                <div className='md:flex md:flex-row gap-5'>
                                    {/* <div className='w-[100%] md:w-[50%] flex flex-col gap-5'>
                                        <p className='text-[25px] font-bold'>Label The Favourite Address As</p>
                                        <Select
                                            value={selectedOption}
                                            label="Select Favourite Address"
                                            onChange={(e) => {
                                                setSelectedOption(e.target.value);
                                            }}>
                                            <MenuItem value="Home">Home</MenuItem>
                                            <MenuItem value="Office">Office</MenuItem>
                                            <MenuItem value="Set Custom Name">Set Custom Name</MenuItem>
                                        </Select>
                                    </div> */}

                                    {
                                        // selectedOption === 'Set Custom Name' &&
                                        <div className='w-[100%] flex flex-col gap-5 mt-[35px]'>
                                            {/* <p className='text-[25px] font-bold'>Enter The {selectedOption}</p> */}
                                            <Controller
                                                name="name"
                                                control={control}
                                                defaultValue=""
                                                // rules={{ required: 'Email is required' }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label={`Enter The Custom Name`}
                                                        type="text"
                                                        error={!!errors.name}
                                                    />
                                                )}
                                            />
                                            {/* {errors.email && <span className='text-red-700'>{errors.email.message}</span>} */}
                                        </div>
                                    }

                                </div>
                            }
                        </div>
                    )
                }
                {
                    (selectedvalue === '' && postDetails?.receiver?.favAddressId === '' && Type) &&
                    <div className="flex flex-col">
                        <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'address is required' }}
                            render={({ field }) => (
                                <LoaderScript>
                                    <Autocomplete
                                        onLoad={onLoadpickup}
                                        onPlaceChanged={onPlaceChangedpickup}
                                        options={{
                                        }}
                                    >
                                        <Input
                                            {...field}
                                            label='Address'
                                            type="text"
                                            error={!!errors.address}
                                        />
                                    </Autocomplete>
                                </LoaderScript>
                            )}
                        />
                        {/* {errors.address1 && <span className='text-red-700'>{errors.address1.message}</span>} */}
                    </div>
                }
                <div className='md:flex gap-5'>
                    <div className='w-full flex flex-col gap-5'>
                        <Controller
                            name="country"
                            control={control}
                            defaultValue=""
                            // rules={{ required: 'Receiver Country Name is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    value={countryValue}
                                    label='Select Country'
                                    error={!!errors.country}
                                    onChange={(e: any) => {
                                        FetchState(e.target.value)
                                        field.onChange(e);
                                        setSelectedCountry(e.target.value);
                                        setValue('country', e.target.value, { shouldDirty: true, shouldValidate: true })
                                    }}
                                >
                                    <MenuItem disabled={true} value=''>Select Country</MenuItem>
                                    {Array.isArray(country) && country.map((option: any) => (
                                        <MenuItem key={option._id} value={option._id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {/* {errors.country && <span className='text-red-700'>{errors.country.message}</span>} */}
                    </div>

                    <div className='w-full flex flex-col gap-5 mt-5 md:mt-0'>
                        <Controller
                            name="state"
                            control={control}
                            defaultValue=""
                            // rules={{ required: 'Receiver City Name is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label='Select State'
                                    value={stateValue}
                                    error={!!errors.state}
                                    onChange={(e: any) => {
                                        FetchCity(countryValue, e.target.value || stateValue)
                                        field.onChange(e);
                                        setSelectedstate(e.target.value);
                                        setValue('state', e.target.value, { shouldDirty: true, shouldValidate: true })
                                    }}

                                >
                                    <MenuItem disabled={true} value=''>Select State</MenuItem>
                                    {Array.isArray(state) && state.map((option: any) => (
                                        <MenuItem key={option._id} value={option._id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {/* {errors.state && <span className='text-red-700'>{errors.state.message}</span>} */}
                    </div>
                </div>

                <div className='md:flex gap-5'>
                    <div className=' w-[100%] md:w-[50%] flex flex-col gap-5'>
                        <Controller
                            name="city"
                            control={control}
                            defaultValue=""
                            // rules={{ required: 'Receiver Pincode is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    value={cityValue}
                                    error={!!errors.city}
                                    label='Select City'
                                    onChange={(e: any) => {
                                        field.onChange(e);
                                        setSelectedCity(e.target.value);
                                        setValue('city', e.target.value, { shouldDirty: true, shouldValidate: true })
                                    }}
                                >
                                    <MenuItem disabled={true} value=''>Select City</MenuItem>
                                    {Array.isArray(city) && city.map((option: any) => (
                                        <MenuItem key={option._id} data-id={option._id} value={option._id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {/* {errors.city && <span className='text-red-700'>{errors.city.message}</span>} */}
                    </div>
                    <div className='w-[100%] md:w-[50%]  flex flex-col gap-5'>
                        <Controller
                            name="pinCode"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Pincode is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label='Enter Your Pincode'
                                    type="number"
                                    error={!!errors.pinCode}
                                />
                            )}
                        />
                        {/* {errors.pinCode && <span className='text-red-700'>{errors.pinCode.message}</span>} */}
                    </div>
                </div>

                <div className='text-center'>
                    <Button className='px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer ' type="submit">Save & Continue</Button>
                </div>
            </div>
        </form>
    )
}