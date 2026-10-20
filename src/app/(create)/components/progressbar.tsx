import * as React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Store from '@/app/store/store';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ProgressBar({next}:any){
  const param = usePathname()
  const searchparams = useSearchParams()
    const Suggestion_id = searchparams.get('id')
  const multiplyCount = param === '/createtrip/' ? 5.55 : 6.67
  const multiplyCount2 = param === '/chooseparcel/' ? 10 : 7.69
    const value = Suggestion_id === null ?  parseInt(next) * multiplyCount : parseInt(next) * multiplyCount2
    // console.log('value',next)
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 7,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor:'#D9D9D9',
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor:'#004080',
        },
      }));

    return(
        <BorderLinearProgress variant="determinate" value={value} />
    )
}