import { APICONSTANT } from '@/components/services/config';
import { getApiMethos } from '@/components/services/gobal';
import { serializeQuery } from '@/utils/helper';
import { Card, FormControl, MenuItem, Select } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';




function PiecChart({ title, api, value }) {
    const [graph, setGraph] = useState('year');
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
    const query = {
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
        dateRange: graph,
    };

    const serializedQuery = serializeQuery(query)

    const { data, error, isLoading } = useQuery({
        queryKey: ["tripcount", APICONSTANT[api], serializedQuery],
        queryFn: getApiMethos,
        retry: 0,
    });

    const handleChangeGraph = (event) => {

        setGraph(event.target.value);
    };
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const [state, setState] = React.useState({
        series: [],
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: [],
            theme: {
                monochrome: {
                    enabled: true,
                },
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },
    });

    // Update chart when data changes
    React.useEffect(() => {
        if (data) {
            const labels = Object.keys(data?.data[value]);
            const series = Object.values(data?.data[value]);

            setState(prevState => ({
                ...prevState,
                series: series,
                options: {
                    ...prevState.options,
                    labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)), // Capitalize labels
                },
            }));
        }
    }, [data]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data!</div>;
    console.log('state', state)
    return (
        <div className='shadow rounded-[7px] p-5 '>
            <div className='flex justify-between items-center'>
                <p className='my-3'>{title}</p>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer components={['DatePicker']} size='small' sx={{ paddingTop: '0px' }}>
                        <DatePicker value={selectedDate} onChange={handleDateChange} />
                    </DemoContainer>
                </LocalizationProvider>
                <FormControl sx={{ width: '25%', marginBottom: '0px' }} >
                    <Select
                        value={graph}
                        onChange={handleChangeGraph}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value="week">week</MenuItem>
                        <MenuItem value="month">month</MenuItem>
                        <MenuItem value="year">year</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <hr className='my-3 ' />
            <div className='flex items-center justify-center'>
                <ReactApexChart options={state.options} series={state.series} type="pie" width={380} />
            </div>
        </div>
    );
}

export default PiecChart;
