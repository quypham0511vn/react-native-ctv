import Moment from 'moment';

const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
const FULL_DATE_FORMAT = 'DD/MM/YYYY HH:mm';

function formatSimpleDate(date: string) { return Moment(date).utc(true).format(DEFAULT_DATE_FORMAT); }

function getCurrentYear() {
    return new Date().getFullYear();
}

function getCurrentTime() {
    return Moment().valueOf();
}

function getLongFromDate(date: number, format = DEFAULT_DATE_FORMAT) {
    return Moment(date * 1000).format(format);
}

function formatDatePicker(date: number) { return Moment(date * 1000).utc(true).format(FULL_DATE_FORMAT); }

function getCurrentDateTime() { return Moment(Moment().valueOf()).utc(true).format(FULL_DATE_FORMAT); }

function getCurrentDay() { return Moment(Moment().valueOf()).utc(true).format(DEFAULT_DATE_FORMAT); }
/**
 * 
 * date1: yyyy-MM-ddTHH:mm:ss, convert to milliseconds
 * date2: getTime from server, convert to milliseconds
 */
function isDateBeforeCurrent(date1: number, date2: number) {
    const dateObj = new Date(date1);
    const unixTime = formatUnixTime(date2);
    return dateObj.getTime() < unixTime;
};

/**
 * 
 * input: server time 
 * @returns milliseconds time
 */
function formatUnixTime(input: number) {
    return input / 10000 - 62135596800000;
};

function formatDateToTicks(date: string) {
    return Moment(date, DEFAULT_DATE_FORMAT).utc(true).hours(23).minutes(59).seconds(59).valueOf() * 10000 + 621355968000000000;
};

function getDateDetails(date: string) {
    const convertedDate = Moment(date, DEFAULT_DATE_FORMAT).utc(true);
    return [convertedDate.year(), convertedDate.month()];
};

function getDateFromString(date?: string, format = DEFAULT_DATE_FORMAT) {
    return date ? Moment(date, format).toDate() : new Date();
};

function convertReverseDate(date?: string) {// date: 05/11/1999
    return date?.split('/').reverse().join('/'); // vd: 1999/11/05
};

function convertReverseYear(date?: string) {// date:   1999-11-05
    return date?.split('-').reverse().join('/'); // vd: 05/11/1999
};

function convertBirthdayDate(date?: string) {// date:   05/11/1999
    return date?.split('/').reverse().join('-'); // vd: 1999-11-05
};

export default {
    formatSimpleDate,
    getCurrentYear,
    getCurrentTime,
    formatDatePicker,
    isDateBeforeCurrent,
    formatUnixTime,
    formatDateToTicks,
    getCurrentDateTime,
    getCurrentDay,
    getLongFromDate,
    getDateDetails,
    getDateFromString,
    convertReverseDate,
    convertReverseYear,
    convertBirthdayDate
};
