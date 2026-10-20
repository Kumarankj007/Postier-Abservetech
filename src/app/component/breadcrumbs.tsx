import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';

import Stack from '@mui/material/Stack';
import Link from 'next/link';
import PageContext from '../providers/pagecontext';

export default function CustomBreadCrumb({ pathSegments, link, pathSegments2,pathSegments3,type,typeLink }: any) {
  // const { i18 } = React.useContext(PageContext);
  // console.log('pathSegments2',pathSegments2)
  const breadcrumbs = [
    // Link to Account Settings
    <Link key={1} href={typeLink ? typeLink : '/dashboard'}>
      <Typography
        color="#000"
        sx={{
          textTransform: 'capitalize',
          fontFamily: '__DM_Sans_0dfae3, __DM_Sans_Fallback_0dfae3',
          textDecoration: 'underline',
        }}
      >
        {type ? type : 'Account'}
      </Typography>
    </Link>,
    link ?
      <Link key={2} href={link ? link : ''}>
        <Typography
          key={2}
          color="#000"
          sx={{
            textTransform: 'capitalize',
            fontFamily: '__DM_Sans_0dfae3, __DM_Sans_Fallback_0dfae3',
            textDecoration: pathSegments2 ? 'underline' : 'none',
          }}
        >
          {pathSegments}
        </Typography>
      </Link>
      :
      <Typography
        key={2}
        color="#000"
        sx={{
          textTransform: 'capitalize',
          fontFamily: '__DM_Sans_0dfae3, __DM_Sans_Fallback_0dfae3',
          textDecoration: pathSegments2 ? 'underline' : 'none',
        }}
      >
        {pathSegments}
      </Typography>,

    (pathSegments2 && pathSegments2 !== 'undefined to undefined') && (
      <Typography
        key={3}
        color="#000"
        sx={{
          textTransform: 'capitalize',
          fontFamily: '__DM_Sans_0dfae3, __DM_Sans_Fallback_0dfae3',
        }}
      >
        {pathSegments2}
      </Typography>
    ),
    (pathSegments3 || pathSegments3 !== undefined) && (
      <Typography
        key={3}
        color="#000"
        sx={{
          textTransform: 'capitalize',
          fontFamily: '__DM_Sans_0dfae3, __DM_Sans_Fallback_0dfae3',
        }}
      >
        {pathSegments3}
      </Typography>
    ),
  ];

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}
