import { Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';

const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: 5,
    width: 25,
    height: 25,
    borderColor:'#004080',
    boxShadow:
        theme.palette.mode === 'dark'
            ? '0 0 0 1px rgb(16 22 26 / 40%)'
            : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
   
}));

const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: '#fff',
    '&::before': {
        display: 'block',
        width: 25,
        height: 25,
        backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
            " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
            "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' /%3E%3C/svg%3E\")",
        content: '""',
    },
    'input:hover ~ &': {
        backgroundColor: '#fff',
    },
});

// Inspired by blueprintjs
export default function BpCheckbox(props:any) {
    return (
        <Checkbox
            sx={{
                // '&:hover': { bgcolor: 'transparent' },
                // '& .MuiButtonBase-root':{
                //     '&.MuiCheckbox-root':{
                //         padding:'0px!important'
                //     }
                // }
                padding:'0px !important',
                // components: {
                //     MuiButtonBase:{
                //         styleOverrides:{
                //             root:{
                //                '&.MuiCheckbox-root':{
                //                 padding:'0px !important'
                //     }
                //             }
                //         }
                //     } 
                // }
            }}
            disableRipple
            color="default"
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            inputProps={{ 'aria-label': 'Checkbox demo' }}
            {...props}
        />
    );
}