
import PageContext from '@/app/providers/pagecontext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react'

const AccountSettings = () => {
    const { i18 } = useContext(PageContext);
    const content = [

        { text: i18?.ACCOUNTSETTINGS?.MYPROFILE || 'My Profile', url: '/accountsettings/profileDetails' },
        { text: i18?.ACCOUNTSETTINGS?.CHANGEPASSWORD || 'Change Password', url: '/accountsettings/changepassword' },
        { text: i18?.ACCOUNTSETTINGS?.SAVEDADDRESS || 'Saved Address', url: '/accountsettings/savedaddress' },
        { text: i18?.ACCOUNTSETTINGS?.PAYMENTS || 'Payments', url: '/accountsettings/transaction' },
        { text: i18?.ACCOUNTSETTINGS?.IDVERIFY || 'Identity Verify', url: ' /accountsettings/documentupload' },
        { text: i18?.ACCOUNTSETTINGS?.REVIEWRATINGS || 'Review & Ratings You have provided', url: '/accountsettings/reviews' },
    ]
    return (
        <div className='max-w-full m-[20px] md:m-[40px] lg:m-[70px]'>
            <div className='flex flex-col gap-4 md:gap-8 mt-4 mb-4 md:mt-12 md:mb-12'>
                <h1 className='font-bold text-2xl md:text-4xl '>
                    {i18?.ACCOUNTSETTINGS?.HEADING || "Account Settings"}
                </h1>
            </div>
            <div>
                {
                    content.map((items, index) => {
                        return (
                            <div key={index}>
                                <Link href={items.url} prefetch>
                                    <div className="flex justify-between  border-t border-[#B7B7B7] cursor-pointer">
                                        <p className="font-normal text-[17px] pt-8 pb-8">
                                            {items.text}
                                        </p>
                                        <div className="flex gap-10">
                                            <Image width={10} height={10} src='/svg/icon/rightarrow.svg' alt='svg' />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default AccountSettings
