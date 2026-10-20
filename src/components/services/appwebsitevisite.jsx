import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
// @mui
import { Card, CardHeader, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CardContent from '@mui/material/CardContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
// import { useChart } from '../../components/chart';
// import ChartDate from '../chart/ChartDate';
// import ChartString from '../chart/ChartString';
import { APICONSTANT } from './config';
import { getApiMethos } from './gobal';
import { useQuery } from '@tanstack/react-query';

// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
    chartData: PropTypes.array.isRequired,
    chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};
const serializeQuery = (obj) =>
    Object.entries(obj)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, ...other }) {
    const [graph, setGraph] = useState('year');
    const handleChangeGraph = (event) => {
        setGraph(event.target.value);
    };
    // const chartOptions = useChart({
    //     plotOptions: { bar: { columnWidth: '16%' } },
    //     fill: { type: chartData.map((i) => i.fill) },
    //     labels: chartLabels,
    //     xaxis: { type: 'datetime' },
    //     tooltip: {
    //         shared: true,
    //         intersect: false,
    //         y: {
    //             formatter: (y) => {
    //                 if (typeof y !== 'undefined') {
    //                     return `${y.toFixed(0)} visits`;
    //                 }
    //                 return y;
    //             },
    //         },
    //     },
    // });
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
    const [stats, setStats] = useState([]);
    const [xlabel, setXlabel] = useState([]);
    const [checkoutYlabel, setCheckoutYlabel] = useState([]);
    const [bookYlabel, setBookYlabel] = useState([]);
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const query = {
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
        dateRange: graph
    }
    const serializedQuery = serializeQuery(query);

    const { data, error, isLoading } = useQuery({
        queryKey: ["siteStatistics", APICONSTANT.siteStatistics, serializedQuery],
        queryFn: getApiMethos,
        retry: 0,
    });
    console.log('siteStatistics', data)
    // const BookingStats = async () => {
    //     const query = {
    //         date: selectedDate,
    //         dateRange: graph
    //     }

    //     // if (data) {
    //     //     const obj = {};
    //     //     const userProvidedDate = new Date(selectedDate);
    //     //     if (graph === 'month') {
    //     //         res.data.data.bookingStat.forEach((item) => {
    //     //             obj[item.date] = item;
    //     //         });
    //     //         const xlabel = getAllDatesInMonth(userProvidedDate);
    //     //         const xlabelStrings = xlabel.map((item) => item.name);
    //     //         setXlabel(xlabelStrings);

    //     //         const checkoutlabels = xlabel.map((item) => {
    //     //             if (obj[item.key] && obj[item.key].value && obj[item.key].value[0]?.checkoutCount) {
    //     //                 return obj[item.key].value[0]?.checkoutCount;
    //     //             }
    //     //             return 0;
    //     //         });
    //     //         setCheckoutYlabel(checkoutlabels);
    //     //         const bookinglabels = xlabel.map((item) => {
    //     //             if (obj[item.key]) {
    //     //                 return obj[item.key].bookingCount;
    //     //             }
    //     //             return 0;

    //     //         });
    //     //         setBookYlabel(bookinglabels);
    //     //     } else if (graph === 'week') {
    //     //         res.data.data.bookingStat.forEach((item) => {
    //     //             const day = new Date(item.date).getDay();
    //     //             obj[day + 1] = item;
    //     //         });
    //     //         const xlabelWeek = getDaysOfWeekArrayWithKeys();
    //     //         const xlabelStrings = xlabelWeek.map((data) => data.name);
    //     //         setXlabel(xlabelStrings);

    //     //         const checkoutlabels = xlabelWeek.map((data) => {
    //     //             if (obj[data.key] && obj[data.key].value && obj[data.key].value[0]?.checkoutCount) {
    //     //                 return obj[data.key].value[0]?.checkoutCount;
    //     //             }
    //     //             return 0;
    //     //         });
    //     //         setCheckoutYlabel(checkoutlabels);
    //     //         const bookinglabels = xlabelWeek.map((data) => {
    //     //             if (obj[data.key]) {
    //     //                 return obj[data.key].bookingCount;
    //     //             }
    //     //             return 0;
    //     //         });
    //     //         setBookYlabel(bookinglabels);
    //     //     } else if (graph === 'year') {
    //     //         res.data.data.bookingStat.forEach((item) => {
    //     //             obj[item._id] = item;
    //     //         });
    //     //         const xlabelWeek = getMonthsArrayWithKeys();
    //     //         const xlabelStrings = xlabelWeek.map((data) => data.name);
    //     //         setXlabel(xlabelStrings);

    //     //         const checkoutlabels = xlabelWeek.map((data) => {
    //     //             if (obj[data.key] && obj[data.key].value && obj[data.key].value[0]?.checkoutCount) {
    //     //                 return obj[data.key].value[0]?.checkoutCount;
    //     //             }
    //     //             return 0;
    //     //         });
    //     //         setCheckoutYlabel(checkoutlabels);
    //     //         const bookinglabels = xlabelWeek.map((data) => {
    //     //             if (obj[data.key]) {
    //     //                 return obj[data.key].bookingCount;
    //     //             }
    //     //             return 0;
    //     //         });
    //     //         setBookYlabel(bookinglabels);
    //     //     }

    //     //     setStats(obj);
    //     // }
    // };
    const userProvidedDate = new Date(selectedDate); // Replace with the user-provided date
    const allDatesInMonth = getAllDatesInMonth(userProvidedDate);
    console.log(allDatesInMonth);
    const month = getMonthsArrayWithKeys();
    const week = getDaysOfWeekArrayWithKeys();
    console.log(week);
    return (
        <div>
            hai
        </div>
    );
}
function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
function getAllDatesInMonth(userProvidedDate) {
    const startDate = new Date(userProvidedDate.getFullYear(), userProvidedDate.getMonth(), 1);
    const endDate = new Date(userProvidedDate.getFullYear(), userProvidedDate.getMonth() + 1, 0);

    const datesArray = [];

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateKey = formatDateToYYYYMMDD(date);
        const name = `${date.getDate()} ${getMonthName(date.getMonth())}`;
        datesArray.push({
            key: dateKey,
            name,
        });
    }

    return datesArray;
}

function getMonthName(monthIndex) {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    return monthNames[monthIndex];
}

function getMonthsArrayWithKeys() {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    return monthNames.map((month, index) => ({
        key: index + 1,
        name: month,
    }));
}
function getDaysOfWeekArrayWithKeys() {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return dayNames.map((day, index) => ({
        key: index + 1,
        name: day,
    }));
}
