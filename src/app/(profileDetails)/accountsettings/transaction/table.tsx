import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

const theme = createTheme({
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: 'none!important',
                    border: '1px solid #D9D9D9'
                }
            }
        }
    },
});
export default function TableComponent({ rows, header }: any) {
    // console.log('header', rows)
    const formattedDate = (date:any) =>{
      const value = dayjs(date).format('DD-MM-YYYY')
      return value;
    }
    return (
        <ThemeProvider theme={theme}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                Array.isArray(header) && header.map((item: any, index: any) => (
                                    <TableCell align='center' key={index}>
                                        <p className='font-semibold	text-[17px]'>
                                            {item}
                                        </p>
                                    </TableCell>
                                ))
                            }

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(rows) && rows.map((row: any) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >

                                <TableCell align="center">
                                    <p className='font-normal text-[17px]'>{row.createdAt ? formattedDate(row.createdAt) : '--'}</p>
                                </TableCell>

                                <TableCell align="center">
                                    <p className='font-normal text-[17px]'>{row.mode ? row.mode : '--'}</p>
                                </TableCell>

                                <TableCell align="center">
                                    <p className='font-normal text-[17px]'>{row.description ? row.description : '--'}</p>
                                </TableCell>

                                <TableCell align="center">
                                    <p className='font-normal text-[17px]'>{row.referenceId ? row.referenceId : '--'}</p>
                                </TableCell>

                                <TableCell align="center">
                                <p className='font-normal text-[17px]'>{row.amount ? row.amount : '--'}</p>
                                </TableCell>

                                {/* <TableCell align="center">
                                <p className='font-normal text-[17px]'>{row.name}</p>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>

    )
}