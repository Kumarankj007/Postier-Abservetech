'use client'
import Input from '@/app/component/input';
import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/app/component/button';
import Select from '@/app/component/select';
import BpCheckbox from '@/app/component/checkbox';
import { DeliverparcelInputs } from '@/interface';
import PageContext from '@/app/providers/pagecontext';
import { Autocomplete } from '@react-google-maps/api';
import LoaderScript from '@/app/component/loadingscript';
import dayjs from 'dayjs';
import DatePickerComp from '@/app/component/datepicker';
import { useMutation } from '@tanstack/react-query';
import useSnackbarStore from '@/app/store/toaster';
import { PostParcel, PostParcelPostier } from '@/app/tools/mutatefn/Parcelpost';
import { useSearchParams } from 'next/navigation';
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import Timepicker from '@/app/component/timepicker';
import { MenuItem } from '@mui/material';
import Utils from '@/app/store/utils';
import TypeStore from '@/app/store/typeStore';
import Store from '@/app/store/store';


export default function DeliverparcelForm({ formVal }: any) {
    const { i18 } = useContext(PageContext);
     const  router  = UseLoadingRouter();
    const { setModal } = Store()
    const { parcelType, FetchparcelType } = Utils()
    const { setType } = TypeStore()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const [selectedTypes, setSelectedTypes] = useState<string>('');
    const [autocompletePickup, setautocompletePickup] = useState<any>(null)
    const [autocompleteDestination, setautocompleteDestination] = useState<any>(null)
    const searchParams: any = useSearchParams()
    const currentParams = new URLSearchParams(searchParams);
    const SuggestionId = currentParams.get('suggestionId') ? currentParams.get('suggestionId') : null
    const { handleSubmit, formState: { errors }, control, setValue } = useForm<DeliverparcelInputs>({

    });
    const post = useMutation({
        mutationFn: PostParcelPostier,
        onSuccess: (data) => {
            // console.log(data)
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showSnackbar(data.data.message, "success");
            setType('deliverparcel')
            router.push('/mytrips')
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    const onSubmit = (data: DeliverparcelInputs) => {
        if (SuggestionId !== null) {
            setModal('requestfromhome', ({ Type: 'Req', fncD: Submission, values: data }))
        } else {
            Submission(data)
        }
    };
    const Submission = (data: DeliverparcelInputs) => {
        // console.log('ddd', data)
        const Data: any = { ...data }
        if (data.avgPrice) {
            Data.avgPrice = parseInt(data?.avgPrice)
        }
        if (SuggestionId !== null) {
            Data.suggestionId = SuggestionId
        }
        if (data.pickupDate && data.pickupTime) {
            const date = data?.pickupDate ? data?.pickupDate : null
            // const dateformat = value.format('YYYY-MM-DD')
            const pickup: any = data.pickupTime ? data.pickupTime : null
            const hour: any = pickup ? pickup.$d.getHours() : null;
            const minute: any = pickup ? pickup.$d.getMinutes() : null;
            const value = dayjs(date).set('hour', hour).set('minute', minute)
            Data.startDate = value.toISOString()

        }
        if (data.dropDate && data.dropTime) {
            const date = data?.pickupDate ? data?.pickupDate : null
            // const dateformat = value.format('YYYY-MM-DD')
            const pickup: any = data.dropTime ? data.dropTime : null
            const hour: any = pickup ? pickup.$d.getHours() : null;
            const minute: any = pickup ? pickup.$d.getMinutes() : null;
            const value = dayjs(date).set('hour', hour).set('minute', minute)
            Data.endDate = value.toISOString()

        }
        delete Data.pickupTime;
        delete Data.pickupDate;
        delete Data.dropDate;
        delete Data.dropTime;

        post.mutateAsync(Data)
    }
    const handleDateChange = (date: any) => {
        if (date) {
            setValue('pickupDate', date, { shouldDirty: true, shouldValidate: true });
        }
    };
    const handleDateChange2 = (date: any) => {
        if (date) {
            setValue('dropDate', date, { shouldDirty: true, shouldValidate: true });
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
                setValue('pickup', place)
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
                setValue('drop', place)
            }
        } else {
            // console.log('Autocomplete is not loaded yet!');
        }
    }
    const handleCheckboxChange = (type: string) => {
        setSelectedTypes(prevTypes => {
            const typesArray = prevTypes ? prevTypes.split(',') : [];
            if (typesArray.includes(type)) {
                return typesArray.filter(t => t !== type).join(',');
            } else {
                return [...typesArray, type].join(',');
            }
        });
    };
    useEffect(() => {
        setValue('type', selectedTypes)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTypes])
    useEffect(() => {
        FetchparcelType()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleTime = (time: any) => {
        setValue('pickupTime', time)
    }
    const handleTime2 = (time: any) => {
        setValue('dropTime', time)
    }
    // console.log('SuggestionId', SuggestionId !== null ? "Request" : "Publish")
    return (
        <div className='border shadow-shadowbox rounded-[17px] '>
            <div className='p-5'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col gap-8 m-auto'>
                        <div className='md:flex gap-5'>
                            <div className='w-full flex flex-col gap-5'>
                                {/* <p className='text-[25px] font-bold'>
                                    {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.TRIPTITLE || "Trip Title"}</p> */}
                                <Controller
                                    name="title"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Post Title is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label= {'Trip Title'}
                                            error={!!errors.title}
                                        />
                                    )}
                                />
                                {/* {errors.title && <span className='text-red-700'>{errors.title.message}</span>} */}
                            </div>

                            <div className='w-full flex flex-col gap-5 mt-5 md:mt-0'>
                                {/* <p className='text-[25px] font-bold'>
                                    {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.EMAILID || "Email ID"}</p> */}
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
                                            label= {'Email Id'}
                                            error={!!errors.email}
                                        />
                                    )}
                                />
                                {/* {errors.email && <span className='text-red-700'>{errors.email.message}</span>} */}
                            </div>
                        </div>

                        <div className='w-full flex flex-col gap-5'>
                            {/* <p className='text-[25px] font-bold'>
                                {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.TRIPDESC || "Trip Description"}</p> */}
                            <Controller
                                name="description"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Description is required' }}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        rows={4} cols={50}
                                        className='border border-[#004080] p-4 w-[100%] rounded-[7px] placeholder-black'
                                        placeholder= {'Trip Description'}
                                    />
                                )}
                            />
                            {/* {errors.description && <span className='text-red-700'>{errors.description.message}</span>} */}
                        </div>

                        <div className='flex flex-wrap gap-6'>
                            {
                                Array.isArray(parcelType) && parcelType.map((items: any, index: any) => {
                                    return (
                                        <div key={index}>
                                            <div className='flex gap-1 items-center'>
                                                <BpCheckbox
                                                    checked={selectedTypes.split(',').includes(items.name)}
                                                    onChange={() => handleCheckboxChange(items.name)}
                                                />
                                                <p>{items.name}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>

                        <div className='md:flex gap-5'>
                            <div className='w-full flex flex-col gap-5'>
                                {/* <p className='text-[25px] font-bold'>
                                    {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.PICKUPLOC || "Pickup Location"}</p> */}
                                <LoaderScript>
                                    <Autocomplete
                                        onLoad={onLoadpickup}
                                        onPlaceChanged={onPlaceChangedpickup}
                                        options={{
                                        }}
                                    >
                                        <Controller
                                            name="pickup"
                                            control={control}
                                            defaultValue=""
                                            rules={{ required: 'pickup location is required' }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label={'Pickup Location'}
                                                    type="text"
                                                    error={!!errors.pickup}

                                                />
                                            )}
                                        />
                                    </Autocomplete>
                                </LoaderScript>
                                {/* {errors.pickup && <span className='text-red-700'>{errors.pickup.message}</span>} */}
                            </div>
                            <div className='w-full flex flex-col gap-5 mt-5 md:mt-0'>
                                {/* <p className='text-[25px] font-bold'>
                                    {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.DESTINATIONLOC || "Destination Location"}</p> */}
                                <LoaderScript>
                                    <Autocomplete
                                        onLoad={onLoaddestination}
                                        onPlaceChanged={onPlaceChangeddestination}
                                        options={{
                                        }}
                                    >
                                        <Controller
                                            name="drop"
                                            control={control}
                                            defaultValue=""
                                            rules={{ required: 'destination location is required' }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label={'Destination Location'}
                                                    type="text"
                                                    error={!!errors.drop}
                                                />
                                            )}
                                        />
                                    </Autocomplete>
                                </LoaderScript>
                                {/* {errors.drop && <span className='text-red-700'>{errors.drop.message}</span>} */}
                            </div>
                        </div>


                        <div className='md:flex gap-5'>
                            <div className='w-full flex flex-col gap-5'>
                                {/* <p className='text-[25px] font-bold'>
                                    {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.PICKUPDATE || "Pickup Date"}</p> */}
                                <Controller
                                    name="pickupDate"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Pickup Date is required' }}
                                    render={({ field }) => (
                                        <DatePickerComp {...field} onDate={handleDateChange} label={'Pickup Date'} error={!!errors.pickupDate} />
                                    )}
                                />
                                {/* {errors.pickupDate && <span className='text-red-700'>{errors.pickupDate.message}</span>} */}
                            </div>
                            <div className='w-full flex flex-col gap-5 mt-5 md:mt-0'>
                                {/* <p className='text-[25px] font-bold'>
                                    {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.PICKUPTIME || "Pickup Time"}</p> */}
                                <Controller
                                    name="pickupTime"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Pickup Time is required' }}
                                    render={({ field }) => (
                                        // <Input
                                        //     {...field}
                                        //     className='  '
                                        //     label='Enter Your Pickup Time'
                                        //     type="text"
                                        // />
                                        <Timepicker {...field} onDate={handleTime} label={'Pickup Time'} error={!!errors.pickupTime} />
                                    )}

                                />
                                {/* {errors.pickupTime && <span className='text-red-700'>{errors.pickupTime.message}</span>} */}
                            </div>
                        </div>
                        <div className='md:flex gap-5'>
                            <div className='w-full flex flex-col gap-5'>
                                {/* <p className='text-[25px] font-bold'>
                                    {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.PICKUPDATE || "Pickup Date"}</p> */}
                                <Controller
                                    name="dropDate"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Drop Date is required' }}
                                    render={({ field }) => (
                                        <DatePickerComp {...field} onDate={handleDateChange2} label='Drop Date' error={!!errors.dropDate} />
                                    )}
                                />
                                {/* {errors.dropDate && <span className='text-red-700'>{errors.dropDate.message}</span>} */}
                            </div>
                            <div className='w-full flex flex-col gap-5 mt-5 md:mt-0'>
                                {/* <p className='text-[25px] font-bold'>
                                    {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.PICKUPTIME || "Pickup Time"}</p> */}
                                <Controller
                                    name="dropTime"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Drop Time is required' }}
                                    render={({ field }) => (
                                        // <Input
                                        //     {...field}
                                        //     className='  '
                                        //     label='Enter Your Pickup Time'
                                        //     type="text"
                                        // />
                                        <Timepicker {...field} onDate={handleTime2} label={'Drop Time'} error={!!errors.dropTime} />
                                    )}

                                />
                                {/* {errors.dropTime && <span className='text-red-700'>{errors.dropTime.message}</span>} */}
                            </div>
                        </div>
                        <div className='md:flex gap-5'>
                            <div className='w-full flex flex-col gap-5'>
                                {/* <p className='text-[25px] font-bold'>
                                    {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.CAPACITY || "Capacity"}</p> */}
                                <Controller
                                    name="capacity"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Capacity is required' }}
                                    render={({ field }) => (
                                        <Select
                                            error={!!errors.capacity}
                                            {...field}
                                            label={'Select Capacity'}
                                            className="   bg-[#fff]">
                                            <MenuItem value="50">50 kg</MenuItem>
                                            <MenuItem value="60">60 kg</MenuItem>
                                            <MenuItem value="20">20 kg</MenuItem>
                                        </Select>
                                    )}
                                />
                                {/* {errors.capacity && <span className='text-red-700'>{errors.capacity.message}</span>} */}
                            </div>
                            <div className='w-full flex flex-col gap-5 '>
                                {/* <p className='text-[25px] font-bold'>
                                    {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.PRICE || "Price"}</p> */}
                                <Controller
                                    name="avgPrice"
                                    control={control}
                                    rules={{ required: 'Price is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label={i18?.NEW?.PRICE || 'Price'}
                                            type="number"
                                            error={!!errors.avgPrice}
                                        />
                                    )}

                                />
                                {/* {errors.avgPrice && <span className='text-red-700'>{errors.avgPrice.message}</span>} */}
                            </div>
                        </div>

                        <div className='text-center'>
                            <Button className='px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer ' type='submit' >
                                {SuggestionId !== null ? i18?.NEW?.REQUEST || "Request" : i18?.NEW?.PUBLISH || "Publish"}</Button>
                        </div>
                    </div>

                </form >
            </div >
        </div>

    )
}
