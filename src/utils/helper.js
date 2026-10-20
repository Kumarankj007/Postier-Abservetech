export function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getAllDatesInMonth(userProvidedDate) {
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

export function getMonthName(monthIndex) {
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

export function getMonthsArrayWithKeys() {
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
export function getDaysOfWeekArrayWithKeys() {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return dayNames.map((day, index) => ({
        key: index + 1,
        name: day,
    }));
}

export const serializeQuery = (obj) =>
    Object.entries(obj)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");