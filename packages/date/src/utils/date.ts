import { Language } from 'chayns-api';

export const isToday = (date: Date): boolean => {
    const today = new Date();
    return today.toDateString() === date.toDateString();
};

export const isTomorrow = (date: Date): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toDateString() === date.toDateString();
};

export const isYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString() === date.toDateString();
};

export const isCurrentYear = (date: Date): boolean => {
    const currentYear = new Date().getFullYear();
    const yearOfGivenDate = date.getFullYear();
    return currentYear === yearOfGivenDate;
};

export const isDateNearToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const diffInDays = (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays === 0 || diffInDays === -1 || diffInDays === 1;
};

export const isMorning = (date: Date) => {
    const hours = date.getHours();

    return hours >= 0 && hours < 12;
};

export const isAfter = (firstDate: Date, secondDate: Date): boolean =>
    firstDate.getTime() > secondDate.getTime();

export const isBefore = (firstDate: Date, secondDate: Date): boolean =>
    firstDate.getTime() < secondDate.getTime();

export const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

export const addYears = (date: Date, years: number): Date =>
    new Date(date.getFullYear() + years, date.getMonth(), date.getDate());

export const differenceInCalendarMonths = (firstDate: Date, secondDate: Date): number =>
    (firstDate.getFullYear() - secondDate.getFullYear()) * 12 +
    (firstDate.getMonth() - secondDate.getMonth());

export const isSameDay = (firstDate: Date, secondDate: Date): boolean =>
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate();

export const isSameMonth = (firstDate: Date, secondDate: Date): boolean =>
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth();

interface Interval {
    start: Date;
    end: Date;
}

export const isWithinInterval = (date: Date, interval: Interval): boolean =>
    date.getTime() >= interval.start.getTime() && date.getTime() <= interval.end.getTime();

export const subYears = (date: Date, years: number): Date =>
    new Date(date.getFullYear() - years, date.getMonth(), date.getDate());

export const startOfWeek = (date: Date): Date => {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const start = new Date(date);
    start.setDate(date.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
};

export const endOfWeek = (date: Date): Date => {
    const day = date.getDay();
    const diff = day === 0 ? 0 : 7 - day;
    const end = new Date(date);
    end.setDate(date.getDate() + diff);
    end.setHours(23, 59, 59, 999);
    return end;
};

export const eachDayOfInterval = (interval: { start: Date; end: Date }): Date[] => {
    const days: Date[] = [];
    const currentDate = new Date(interval.start);

    while (currentDate <= interval.end) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
};

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
};

export const addSeconds = (date: Date, seconds: number): Date => {
    const result = new Date(date);
    result.setSeconds(date.getSeconds() + seconds);
    return result;
};

export const subHours = (date: Date, hours: number): Date => {
    const result = new Date(date);
    result.setHours(date.getHours() - hours);
    return result;
};

export const differenceInHours = (date1: Date, date2: Date): number => {
    const diffInMilliseconds = date1.getTime() - date2.getTime();
    return Math.floor(diffInMilliseconds / (1000 * 60 * 60));
};

type RelativeTimeUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

interface GetTimeTillNow {
    date: Date;
    currentDate: Date;
    language: Language;
}

export const getTimeTillNow = ({
    date,
    currentDate,
    language = Language.English,
}: GetTimeTillNow): string => {
    const diffInSeconds = Math.floor((currentDate.getTime() - date.getTime()) / 1000);
    const isPast = diffInSeconds > 0;

    const units: { label: RelativeTimeUnit; seconds: number }[] = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 },
    ];

    const absDiff = Math.abs(diffInSeconds);
    const { label, seconds } = units.find((u) => absDiff >= u.seconds) || {
        label: 'second',
        seconds: 1,
    };
    const count = Math.floor(absDiff / seconds);

    const formatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });

    return formatter.format(isPast ? -count : count, label);
};

export const intervalToDuration = (interval: {
    start: Date;
    end: Date;
}): {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
} => {
    const startTime = interval.start.getTime();
    const endTime = interval.end.getTime();
    const diffInMilliseconds = endTime - startTime;

    const years = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor(
        (diffInMilliseconds % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30),
    );
    const days = Math.floor(
        (diffInMilliseconds % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24),
    );
    const hours = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);

    return { years, months, days, hours, minutes, seconds };
};

export const differenceInMinutes = (date1: Date, date2: Date): number => {
    const diffInMilliseconds = date1.getTime() - date2.getTime();
    return Math.floor(diffInMilliseconds / (1000 * 60));
};
