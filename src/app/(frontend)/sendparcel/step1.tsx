'use client'
import { SendparcelInputs } from "@/interface";
import { Controller, useForm } from "react-hook-form";
import { packagecontent, parcelInfo, receiverInfo, senderinfo } from "../../../../content";
import Input from "@/app/component/input";
import CustomizedSwitches from "@/app/component/switch";
import React, { useContext, useEffect, useState } from "react";
import Select from "@/app/component/select";
import Button from "@/app/component/button";
import { Autocomplete } from "@react-google-maps/api";
import DatePickerComp from "@/app/component/datepicker";
import LoaderScript from "@/app/component/loadingscript";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import PostDetailsStore from "@/app/store/parcelDetails";
import Store from "@/app/store/store";
import { useMutation } from "@tanstack/react-query";
import { UdateParcelDetails } from "@/app/tools/mutatefn/Parcelpost";
import useSnackbarStore from "@/app/store/toaster";
import LocationStore from "@/app/store/locations";
import { MenuItem } from "@mui/material";
import Utils from "@/app/store/utils";
import PhoneInputComponent from "@/app/component/phoneinput";
import PageContext from "@/app/providers/pagecontext";


export default function Step1({ handleNext }: any) {
    const { i18 } = useContext(PageContext);
    const searchParams: any = useSearchParams()
    const { country, FetchCountry, state, FetchState, city, FetchCity } = LocationStore()
    const { Deliverparcelby, FetchDeliverparcelby } = Utils()
    const [selectedValue, setSelectedValue] = useState<string | any>('');
    const [countryValue, setSelectedCountry] = useState<string | any>('');
    const [stateValue, setSelectedstate] = useState<string | any>('');
    const [cityValue, setSelectedCity] = useState<string | any>('');
    const { step, setStep, setStepper } = Store()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const currentParams = new URLSearchParams(searchParams);
    const PostId: any = currentParams.get('id') ? currentParams.get('id') : null
    const Type = currentParams.get('type') ? currentParams.get('type') : null
    const { fetchPostDetails, postDetails ,setPostDetails } = PostDetailsStore()
    const [autocompletePickup, setautocompletePickup] = useState<any>(null)
    const [autocompleteDestination, setautocompleteDestination] = useState<any>(null)
    const [isChecked, setIsChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const { handleSubmit, formState: { errors, dirtyFields }, control, setValue, reset } = useForm<SendparcelInputs>({

    });
    const handlePhoneChange = (value: any, data: any) => {
        const code = data.dialCode;
        const number = value.slice(code.length);
        setValue("phone", number, { shouldDirty: true, shouldValidate: true });
        setValue("phCode", code, { shouldDirty: true, shouldValidate: true });
    };
    const handleSwitchChange = () => {
        setIsChecked(!isChecked);
    };
    const handleSelectChange = (event: any, onChange: any) => {
        setSelectedOption(event.target.value);
        onChange(event);
        setValue('parcelBy', event.target.value)
    };
    const handleDateChange = (date: any) => {
        const data = dayjs(date)
        const dateformat = data.format('YYYY-MM-DDTHH:mm:ss.000Z')
        if (dateformat) {
            setValue('deliveryDate', dateformat, { shouldDirty: true, shouldValidate: true });
        }
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
            if (lng) {
                setValue('pickupLng', lng)
            }
            if (lat) {
                setValue('pickupLat', lat)
            }
            if (place) {
                setValue('pickupAddress', place)
            }
        } else {
            // console.log('Autocomplete is not loaded yet!');
        }
    }
    const onLoaddestination = (autocomplete: any) => {
        if (autocomplete !== null && autocomplete.getPlace) {
            setautocompleteDestination(autocomplete)
        }
    }
    const onPlaceChangeddestination = () => {
        if (autocompleteDestination !== null && autocompleteDestination.getPlace) {
            const placeDetail = autocompleteDestination.getPlace()
            const place = placeDetail.formatted_address
            const lat = placeDetail.geometry?.location.lat()
            const lng = placeDetail.geometry?.location.lng()
            if (lng) {
                setValue('dropLng', lng)
            }
            if (lat) {
                setValue('dropLat', lat)
            }
            if (place) {
                setValue('dropAddress', place)
            }
        } else {
            // console.log('Autocomplete is not loaded yet!');
        }
    }
    const PhoneNumber = postDetails ? `${postDetails?.sender?.phoneCode}${postDetails?.sender?.phone}` : null;
    const SenderDetails: any = {
        firstName: postDetails?.sender?.firstName ? postDetails?.sender?.firstName : '',
        lastName: postDetails?.sender?.lastName ? postDetails?.sender?.lastName : '',
        phone: postDetails?.sender?.phone ? postDetails?.sender?.phone : '',
        phCode: postDetails?.sender?.phoneCode ? postDetails?.sender?.phoneCode : '',
        email: postDetails?.sender?.email ? postDetails?.sender?.email : '',
        pinCode: postDetails?.sender?.pinCode ? postDetails?.sender?.pinCode : '',
        country: postDetails?.sender?.country ? postDetails?.sender?.country : '',
        state: postDetails?.sender?.state ? postDetails?.sender?.state : '',
        city: postDetails?.sender?.city ? postDetails?.sender?.city : '',
        address: postDetails?.sender?.address ? postDetails?.sender?.address : '',
        // address2: postDetails?.sender?.address2 ? postDetails?.sender?.address2 : '',
        pickupAddress: postDetails?.location ? postDetails?.location?.pickUp : '',
        dropAddress: postDetails?.location ? postDetails?.location?.drop : '',
        deliveryDate: postDetails?.parcel?.deliveryDate ? postDetails?.parcel?.deliveryDate : '',
        parcelBy: postDetails?.parcel?.deliverBy ? postDetails?.parcel?.deliverBy : ''
    }
    useEffect(() => {
        if (PostId) {
            fetchPostDetails(PostId)
        }
        if (searchParams.get('id')) {
           if(SenderDetails){
            reset(SenderDetails)
           }
        }
        else{
            setPostDetails({})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    useEffect(() => {
        setSelectedValue(postDetails?.parcel?.deliverBy)
        setSelectedCountry(postDetails?.sender?.country)
        setSelectedstate(postDetails?.sender?.state)
        setSelectedCity(postDetails?.sender?.city)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postDetails])
    useEffect(() => {
        if(localStorage.getItem('appUserId'))
        FetchCountry()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (postDetails?.sender?.country && postDetails?.sender?.state && localStorage.getItem('appUserId')) {
            FetchCountry()
            FetchState(postDetails?.sender?.country)
            FetchCity(postDetails?.sender?.country, postDetails?.sender?.state)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postDetails])
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
            if (dirtyFields.firstName) {
                formData.append('firstName', data.firstName)
            }
            if (dirtyFields.lastName) {
                formData.append('lastName', data.lastName)
            }
            if (dirtyFields.phone) {
                formData.append('phone', data.phone)
            }
            if (dirtyFields.phCode) {
                formData.append('phoneCode', data.phoneCode)
            }
            if (dirtyFields.email) {
                formData.append('email', data.email)
            }
            if (dirtyFields.pinCode) {
                formData.append('pinCode', data.pinCode)
            } if (dirtyFields.country) {
                formData.append('country', data.country)
            }
            if (dirtyFields.city) {
                formData.append('city', data.city)
            }
            if (dirtyFields.pickupAddress) {
                formData.append('pickupAddress', data.pickupAddress)
            }
            if (dirtyFields.dropAddress) {
                formData.append('dropAddress', data.dropAddress)
            }
            if (dirtyFields.address) {
                formData.append('address', data.address)
            }
            // if (dirtyFields.address2) {
            //     formData.append('address2', data.address2)
            // }
            Put.mutateAsync({ formData, PostId })
        }
    }
    // console.log('dirtyFields', postDetails)
    useEffect(() => {
        if(localStorage.getItem('appUserId'))
        FetchDeliverparcelby()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <form onSubmit={handleSubmit(handlefunction)}>
            <div className='flex flex-col gap-[35px] m-auto'>
                <div className='grid gap-[35px] md:flex'>
                        {/* <p className='text-[25px] font-bold'>Enter Your First name<span className="text-[#FF0000]">*</span></p> */}
                       <div className="w-full flex flex-col gap-5">
                       <Controller
                            name="firstName"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'First Name is required' }}
                            render={({ field }) => (
                                <>
                                <Input
                                    {...field}
                                    label='First name'
                                    required={true}
                                    type="text"
                                    error={!!errors.firstName}
                                />
                                {/* <LabeledInput 
                                label='Enter Your First name'
                                required={true}
                                /> */}
                                </>
                            )}
                        />
                        {/* {errors.firstName && <span className='text-red-700'>{errors.firstName.message}</span>} */}
                       </div>

                       <div className="w-full flex flex-col gap-5">
                       <Controller
                            name="lastName"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Last Name is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Last name"
                                    required={true}
                                    type="text"
                                    error={!!errors.lastName}
                                />
                            )}
                        />
                        {/* {errors.lastName && <span className='text-red-700'>{errors.lastName.message}</span>} */}
                       </div>
                </div>

                <div className='grid gap-[35px] md:flex'>
                       <div className="w-full flex flex-col gap-5">
                       <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Phone number is required' }}
                            render={({ field }) => (
                                <PhoneInputComponent
                                    {...field}
                                    value={PhoneNumber}
                                    errors={!!errors.phone}
                                    onPhoneChange={(number:any, code:any)=>{
                                        setValue("phone", number, { shouldDirty: true, shouldValidate: true });
                                        setValue("phCode", code, { shouldDirty: true, shouldValidate: true });
                                    }}
                                    country={'us'}
                                />
                            )}
                        />
                        {/* {errors.phone && <span className='text-red-700'>{errors.phone.message}</span>} */}

                       </div>
                    <div className='w-full flex flex-col gap-5'>
                        {/* <p className='text-[25px] font-bold'>Enter Your Email ID<span className="text-[#FF0000]">*</span></p> */}
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{ 
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address",
                                  },
                             }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Email ID"
                                    required={true}
                                    type="text"
                                    error={!!errors.email}
                                />
                            )}
                        />
                        {/* {errors.email && <span className='text-red-700'>{errors.email.message}</span>} */}
                    </div>
                </div>
                <div className="flex flex-col gap-8" >
                    {/* <p className='text-[25px] font-bold mb-6'>Enter Your Full address</p> */}
                    <Controller
                        name="address"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'address is required' }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                label="Full address"
                                required={true}
                                type="text"
                                error={!!errors.address}
                            />
                        )}
                    />
                    {/* {errors.address && <span className='text-red-700'>{errors.address.message}</span>} */}

                    {/* <Controller
                        name="address2"
                        control={control}
                        defaultValue=""
                        // rules={{ required: 'address line 2 is required' }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder='Address Line 2'
                                type="text"
                            />
                        )}
                    />
                    {errors.address2 && <span className='text-red-700'>{errors.address2.message}</span>} */}
                </div>
                {/* <div>
                    <CustomizedSwitches
                        label="Mark this address as favourite"
                        checked={isChecked}
                        onChange={handleSwitchChange}
                    />
                </div>
                {
                    isChecked &&
                    <div className='md:flex md:flex-row gap-5'>
                        <div className='w-[100%] md:w-[50%] flex flex-col gap-5'>
                            <p className='text-[25px] font-bold'>Label The Favourite Address As</p>
                            <Controller
                                name="phone"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Phone number is required' }}
                                render={() => (
                                    <Select className="    bg-[#fff]" value={selectedOption} onChange={handleSelectChange}>
                                        <option value="Home">Home</option>
                                        <option value="Office">Office</option>
                                        <option value="Set Custom Name">Set Custom Name</option>
                                    </Select>
                                )}
                            />
                            {errors.phone && <span className='text-red-700'>{errors.phone.message}</span>}
                        </div>

                        {
                            selectedOption &&
                            <div className='w-[100%] md:w-[50%] flex flex-col gap-5'>
                                <p className='text-[25px] font-bold'>Enter The {selectedOption}</p>
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Email is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            className='  '
                                            placeholder={`Enter The ${selectedOption}`}
                                            type="text"
                                        />
                                    )}
                                />
                                {errors.email && <span className='text-red-700'>{errors.email.message}</span>}
                            </div>
                        }

                    </div>
                } */}
                <div className='grid gap-[35px] md:flex'>
                    <div className='w-full flex flex-col gap-5'>
                        {/* <p className='text-[25px] font-bold'>Enter Your Country Name</p> */}
                        <Controller
                            name="country"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Country Name is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label='Country Name'
                                    required={true}
                                    value={countryValue}
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

                    <div className='w-full flex flex-col gap-5'>
                        {/* <p className='text-[25px] font-bold'> Enter Your State Name</p> */}
                        <Controller
                            name="state"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'State Name is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label='State Name'
                                    required={true}
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

                <div className='grid gap-[35px] md:flex'>
                    <div className='w-full flex flex-col gap-5 '>
                        {/* <p className='text-[25px] font-bold'> Enter Your City Name</p> */}
                        <Controller
                            name="city"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'City Name is required' }}
                            
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label='City Name'
                                    required={true}
                                    value={cityValue}
                                    error={!!errors.city}
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

                    <div className='w-full flex flex-col gap-5'>
                        {/* <p className='text-[25px] font-bold'>Enter Your Pincode</p> */}
                        <Controller
                            name="pinCode"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Pincode is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Pincode"
                                    type="number"
                                    error={!!errors.pinCode}
                                />
                            )}
                        />
                        {/* {errors.pinCode && <span className='text-red-700'>{errors.pinCode.message}</span>} */}
                    </div>


                </div>

                <div className='grid gap-[35px] md:flex'>
                    <div className='w-full flex flex-col gap-5'>
                        {/* <p className='text-[25px] font-bold classdiv'> Enter parcel pickup location</p> */}
                        <LoaderScript>
                            <Autocomplete
                                onLoad={onLoadpickup}
                                onPlaceChanged={onPlaceChangedpickup}
                                options={{
                                }}
                            >
                                <Controller
                                    name="pickupAddress"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'pickup location is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="parcel pickup location"
                                            required={true}
                                            type="text"
                                            error={!!errors.pickupAddress}
                                        />
                                    )}
                                />
                            </Autocomplete>
                        </LoaderScript>

                        {/* {errors.pickupAddress && <span className='text-red-700'>{errors.pickupAddress.message}</span>} */}
                    </div>
                    <div className='w-full flex flex-col gap-5'>
                        {/* <p className='text-[25px] font-bold classdiv'>Enter parcel destination location</p> */}
                        <LoaderScript>
                            <Autocomplete
                                onLoad={onLoaddestination}
                                onPlaceChanged={onPlaceChangeddestination}
                                options={{
                                }}
                            >
                                <Controller
                                    name="dropAddress"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'destination location is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="parcel destination location"
                                            required={true}
                                            type="text"
                                            error={!!errors.dropAddress}
                                        />
                                    )}
                                />
                            </Autocomplete>
                        </LoaderScript>

                        {/* {errors.dropAddress && <span className='text-red-700'>{errors.dropAddress.message}</span>} */}
                    </div>


                </div>
                <div className="grid gap-[35px] md:flex">
                    <div className='w-full flex flex-col gap-5'>
                        {/* <p className='text-[25px] font-bold'> Deliver parcel by</p> */}
                        <Controller
                            name="parcelBy"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Select delivery' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Deliver parcel by"
                                    value={selectedValue}
                                    error={!!errors.parcelBy}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setSelectedValue(e.target.value);
                                        setValue('parcelBy', e.target.value, { shouldDirty: true, shouldValidate: true })
                                    }}
                                >
                                    {
                                        Array.isArray(Deliverparcelby) && Deliverparcelby.map((item) => {
                                            return (
                                                <MenuItem key={item._id} value={item.name}>{item.name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        />
                        {/* {errors.parcelBy && <span className='text-red-700'>{errors.parcelBy.message}</span>} */}
                    </div>
                    <div className='w-full  flex flex-col gap-5'>
                        <Controller
                            name="deliveryDate"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Select delivery date' }}
                            render={({ field }) => (
                                <DatePickerComp 
                                {...field} 
                                onDate={handleDateChange} 
                                date={postDetails?.parcel ? postDetails?.parcel?.deliveryDate : null} 
                                label='Delivery date' 
                                error={!!errors.deliveryDate}
                                />
                            )}
                        />
                        {/* {errors.deliveryDate && <span className='text-red-700'>{errors.deliveryDate.message}</span>} */}
                    </div>
                </div>

                <div className='text-center'>
                    {
                        Type === 'edit' ?
                            <Button className='px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer ' type="submit" >Save & Continue</Button>
                            :
                            <Button className='px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer ' type="submit">Save & Continue</Button>
                    }

                </div>
            </div>
        </form>
    )
}