import { IInputProps } from '@/interface';
import React from 'react'
import { NavigateButton1, NavigateButton2 } from './navigateButn';



const CarouselNavigate2 = React.forwardRef<any, IInputProps>
    ((props, ref) => {

        const pointer =
            props.type === 'prev' ? (
                <div className='isEdge&hidden'>
                    <div className={props.isPrevDisabled ? 'hidden' : ''}>
                        <NavigateButton1/>
                    </div>
                </div>
            ) : (
                <div className={props.isNextDisabled ? 'hidden' : ''}>
                    <NavigateButton2/>
                </div>
            );
            const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                // Add custom logic if needed before passing the event
                // console.log('Button clicked', e);
                props.onClick && props.onClick(e); // Call the onClick function from props
            };

        return (
            <button
                ref={ref}
                onClick={handleClick}
                className="flex justify-between items-center  text-base text-black w-[20px] h-[20px]"
                disabled={props.type === 'prev' ? props.isPrevDisabled : props.isNextDisabled}
            >
                {pointer}
            </button>
        )
    });

CarouselNavigate2.displayName = 'CarouselNavigate2';

export default CarouselNavigate2