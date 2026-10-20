/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React from 'react'
import dynamic from 'next/dynamic';

const UpdateProfilePic = dynamic(() => import('@/app/component/profileDetails/UpdateProfilePic'), { ssr: false });

const page = () => {

    return (
        <div>
            <UpdateProfilePic />
        </div>
    )
}

export default page
