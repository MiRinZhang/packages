export type IWeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type IDatePosition =
    | 'previous' // 上月日期
    | 'current' // 当月日期
    | 'next'; // 下月日期

export type IWeekLocale =
    | 1 // 中文
    | 2; // 英文

export interface IDateListParams {
    year: number; // 年
    month: number; // 月
    start: IWeekStart; // 日历开始星期
    blankOut?: boolean;
}

export type IDayList = Array<IDateListItem>;

export type IWeekList = Array<IDayList>;

export interface IDateInfo {
    value: string;
    year: number | string;
    month: number | string;
    date: number | string;
    zhStr: string;
    showValue: string | number;
    key: string;
}

export interface IDateListItem extends IDateInfo {
    position: IDatePosition;
}

export interface IDateListSource {
    dateList: IDayList;
    line: number;
    month: number;
}

export interface IMonthCalendar {
    title: string;
    key: string;
    weekList: IWeekList;
    year: number;
    month: number;
}

export interface IParseDateInfo {
    year: number;
    month: number;
    date: number;
}

export interface IRangeCalendarItem {
    year: number;
    startMonth: number;
    endMonth: number;
}

export type IRangeCalendar = Array<IRangeCalendarItem>;
