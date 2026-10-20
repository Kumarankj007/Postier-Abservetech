import { useRouter } from 'next/router';
import Button from './button';
import Image from 'next/image';

export function NavigateButton1() {
    return (
        <div className='w-[25px] h-[25px] border-btncolor border-[2px] bg-btncolor rounded-full shadow-shadowbox  flex items-center justify-center'>
          <Image width={20} height={20} src='/svg/icon/backicon.svg' alt='img' className='w-[15px] h-[15px]'/>
        </div>
    );
}

export function NavigateButton2() {
    return (
        <div className='w-[25px] h-[25px] border-btncolor border-[2px] bg-btncolor rounded-full shadow-shadowbox  flex items-center justify-center'>
           <Image width={20} height={20} src='/svg/icon/nexticon.svg' alt='img' className='w-[15px] h-[15px]'/>
        </div>
    );
}