'use client'
import React from 'react'
import PostDetailsStore from '@/app/store/parcelDetails';
import dynamic from 'next/dynamic';

const Progress = dynamic(() => import('./progress'), { ssr: false });

const Request = dynamic(() => import('./request'), { ssr: false });

const Suggestion = dynamic(() => import('./suggestion'), { ssr: false });

const Requests = () => {
    const { findPost }: any = PostDetailsStore()
    // console.log('bumble', findPost)
    return (
        <div className='flex flex-col gap-8'>
            {
                Array.isArray(findPost?.progress) && findPost?.progress?.length > 0 &&
                <Progress/>
            }

            {
                Array.isArray(findPost?.requestList) && findPost?.requestList?.length > 0 &&
                <Request/>
            }

            {
                Array.isArray(findPost?.suggestions) && findPost?.suggestions?.length > 0 &&
               <Suggestion/>
            }
        </div>
    )
}

export default Requests
