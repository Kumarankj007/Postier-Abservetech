/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Step1 from './step1';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PostParcel, PublishParcel } from '@/app/tools/mutatefn/Parcelpost';
import Store from '@/app/store/store';
import { useSearchParams } from 'next/navigation';
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import { fetchPostDetails } from '@/app/tools/queryfn/fetch';
import useSnackbarStore from '@/app/store/toaster';
import PageContext from '@/app/providers/pagecontext';

const Step2 = dynamic(() => import('./step2'));
const Step3 = dynamic(() => import('./step3'));
const Step4 = dynamic(() => import('./step4'));
const Step5 = dynamic(() => import('./step5'));




export default function SendparcelForm() {
     const  router  = UseLoadingRouter();
    const { i18 } = useContext(PageContext);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const searchParams: any = useSearchParams()
    const currentParams = new URLSearchParams(searchParams);
    const postId: any = currentParams.get('id')
    const PostId: any = postId ? postId : null
    const queryClient = useQueryClient()
    const SuggestionId = currentParams.get('suggestionId') ?  currentParams.get('suggestionId') : null
    const { data, error, isLoading } = useQuery({
        queryKey: ['post', { PostId }],
        queryFn: fetchPostDetails,
        retry: 0
    });

    const { step, setStep, setStepper }: any = Store()

    // console.log('PostId', PostId)
    const { setPostId } = Store()
    const post = useMutation({
        mutationFn: PostParcel,
        onSuccess: (data) => {
            // console.log(data)
            if (data.data.post._id) {
                currentParams.set('id', data.data.post._id)
                router.replace(`?${currentParams}`, { scroll: false })
            }
            queryClient.invalidateQueries({ queryKey: ['post'] })
            setStep(step + 1);
            window.scrollTo({top: 0, behavior: 'smooth'});
            setStepper(step)
            showSnackbar(data.data.message, "success");
        },
        onError : (err) => {
            showSnackbar(err.message, "error");
        }
    })
    const publish:any = useMutation({
        mutationFn: PublishParcel,
        onSuccess: (data:any) => {
            setStep(step + 1);
            setStepper(step)
            window.scrollTo({top: 0, behavior: 'smooth'});
            showSnackbar(data?.message, "success");
        },
        onError : (err) => {
            showSnackbar(err.message, "error");
        }
    })
    const handleNext = (data: any) => {
        // console.log('data',data)
        const formData = new FormData();
        formData.append('action', `step${step}`)
        if(SuggestionId !== null && step === 1) {
            formData.append('suggestionId',SuggestionId)
        }
        if(data?.files){
            for (const key of Object.keys(data?.files)) {
                formData.append('files', data.files[key], 'file_'+key);
              }
              delete data.files;
        }
        Object.keys(data).forEach(key => {
            let formKey = key;
        
            if (key === 'address' && step === 3) {
                if (key === 'address') {
                    formKey = data.isEnable ? 'address' : 'recvrAddress';
                    formData.append(formKey, data[key]);
                }
            } else if (key === 'location') {
                if (data.isEnable) {
                    // console.log('data[key]', data[key])
                    if (typeof data[key] === 'object' && data[key] !== null) {
                        const { lat, lng } = data[key];
                        // Append lat and lng directly as separate fields
                        formData.append(`${formKey}[lat]`, lat);
                        formData.append(`${formKey}[lng]`, lng);
                    }
                }
            }
            else if (key === 'favAddressId') {
               if(data.favAddressId === 'Enter New Address'){
                formData.append(formKey,'')
               }
               else {
                formData.append(formKey,data[key])
               }
            }  
            else {
                formData.append(formKey, data[key]);
            }
        
            // console.log('key', formKey, data[key]);
        });
        
        
        post.mutateAsync({ formData, PostId })
    };
    const handleNextStep = () => {
        publish.mutateAsync({ PostId })
    }
    useEffect(() => {
        if (data?.receiver?.firstName) {
            setStep(4);
            setStepper(3);
        } else if (data?.parcel?.title) {
            setStep(3);
            setStepper(2);
        } else if (data?.sender?.email) {
            setStep(2);
            setStepper(1);
        } else {
            setStep(1);
            setStepper(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (currentParams.get('id')) {
            const id = currentParams.get('id')
            setPostId(id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])
    // console.log('step',step)
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Step1
                        handleNext={handleNext}
                    />
                );
            case 2:
                return (
                    <Step2
                        handleNext={handleNext}
                    />
                );
            case 3:
                return (
                    <Step3
                        handleNext={handleNext}
                    />
                );
            case 4:
                return (
                    <Step4
                        handleNextStep={handleNextStep}
                    />
                );
            case 5:
                return (
                    <Step5
                        handleNext={handleNext}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className='border shadow-shadowbox rounded-[17px] m-11 max-w-[1440px] mx-auto'>
            <div className='p-5'>
                <h2 className="font-bold text-[15px] sm:text-[20px] md:text-[35px] leading-[65px] mb-8 ">
                    {step === 1 &&  (i18?.PARCELSEND?.SENDERDETAILS || 'Sender Details')}
                    {step === 2 && ( i18?.PARCELSEND?.PARCELINFO || 'Parcel Information')}
                    {step === 3 &&  (i18?.PARCELSEND?.RECEIVERINFO || 'Receiver Information')}
                    {step === 4 &&  (i18?.PARCELSEND?.SUMMARY|| 'Summary ')}
                </h2>

                {renderStep()}
            </div>
        </div>
    )
}
