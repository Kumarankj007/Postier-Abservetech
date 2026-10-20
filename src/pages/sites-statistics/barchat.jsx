import { APICONSTANT } from '@/components/services/config';
import { getApiMethos } from '@/components/services/gobal';
import { getAllDatesInMonth, getDaysOfWeekArrayWithKeys, getMonthName, getMonthsArrayWithKeys, serializeQuery } from '@/utils/helper';
import { FormControl, MenuItem, Select } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts';

function Barchat() {
    const [graph, setGraph] = useState('year');
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
    const [state, setState] = React.useState({

        series: [],
        options: {
            chart: {
                height: 350,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    dataLabels: {
                        position: 'top', // top, center, bottom
                    },
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + "%";
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                }
            },

            xaxis: {
                categories: [],
                position: 'top',
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                crosshairs: {
                    fill: {
                        type: 'gradient',
                        gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                }
            },
            yaxis: {
                min: 0, // Minimum value
                max: 30, // Maximum value
                tickAmount: 10, // Number of intervals
                labels: {
                    formatter: function (val) {
                        return val.toFixed(0); // Display integer values
                    },
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"],
                    },
                },
            },
            title: {
                // text: 'Monthly Customer Count',
                floating: false,
                offsetY: 330,
                align: 'center',
                style: {
                    color: '#444'
                }
            }
        },
    });

    const updateCategories = (xlabelStrings, Series) => {
        setState((prev) => {
            const { options } = prev;
            const { xaxis } = options;
            return {
                ...prev,
                series: [{
                    name: 'Customer',
                    data: Series
                }],
                options: {
                    ...options,
                    xaxis: {
                        ...xaxis,
                        categories: xlabelStrings,
                    },
                },
            };
        });
    };

    const handleChangeGraph = (event) => {
        setGraph(event.target.value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const query = {
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
        dateRange: graph,
    };

    const serializedQuery = serializeQuery(query);

    const { data, error, isLoading } = useQuery({
        queryKey: ["customercount", APICONSTANT.customercount, serializedQuery],
        queryFn: getApiMethos,
        retry: 0,
    });

    useEffect(() => {
        if (graph === 'year' && data?.data?.customerCount) {
            const xlabelWeek = getMonthsArrayWithKeys();
            const xlabelStrings = xlabelWeek.map((data) => data.name);
            const Series = xlabelWeek.map((day) => {
                const match = data?.data?.customerCount.find((data) => data._id === day.key);
                return match ? match.count : 0;
            });
            updateCategories(xlabelStrings, Series);
        }
    }, [graph]);

    return (
        <div className='shadow rounded-[7px] p-5 '>
            <p className='text-[#000] font-[600] text-[20px] my-6'>Customer Details</p>
            <ReactApexChart options={state.options} series={state.series} type="bar" height={450} />
        </div>
    );
}

export default Barchat;
