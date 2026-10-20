'use client'
import React from 'react'
import LinearStepper from './stepper'
import useScreenWidth from '@/app/hooks/usescreenwidth';

function Children({children}:any) {
    const screen: any = useScreenWidth();
    return (
        <div className={` ${screen.width > 1054 ? 'flex gap-[20px]' : 'flex'} `}>
            <div className={` ${screen.width > 1054 ? 'w-1/4' : 'fixed bottom-0 w-[100%] bg-white shadow-[0_0_6px_rgba(0,0,0,0.1)] h-[50px] text-center z-[9] flex justify-center item-center'} `}>
                <LinearStepper />
            </div>
            <div className={` ${screen.width > 1054 ? 'w-3/4' : 'w-[100%]'} `}>
                {children}
            </div>
        </div>
    )
}

export default Children