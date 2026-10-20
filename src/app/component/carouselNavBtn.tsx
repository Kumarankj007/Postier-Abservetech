import { IInputProps } from '@/interface';
import Image from 'next/image';
import React from 'react'



const CarouselNavigate = React.forwardRef<any, IInputProps>
    ((props, ref) => {

        const pointer =
            props.type === 'prev' ? (
                <div className='isEdge&hidden'>
                    <div>
                        <Image width={10} height={10} src='/svg/icon/pre.svg' alt='svg' />
                    </div>
                </div>
            ) : (
                <div>
                    <Image width={10} height={10} src='/svg/icon/next.svg' alt='svg' />
                </div>
            );

        return (
            <button
                ref={ref}
                onClick={props.onClick}
                className="flex justify-center items-center button bg-btncolor text-base text-black rounded-[50px] shadow-md p-3 w-[50px] h-[50px]"
            >
                {pointer}
            </button>
        )
    });

CarouselNavigate.displayName = 'CarouselNavigate';

export default CarouselNavigate