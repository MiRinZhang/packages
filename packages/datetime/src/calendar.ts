/**
 * 日期计算&处理工具类
 */
import {
    IDateInfo,
    IDateListParams,
    IDateListSource,
    IDayList,
    IMonthCalendar,
    IParseDateInfo,
    IRangeCalendar,
    IWeekList,
    IWeekLocale,
    IWeekStart
} from './interface';

const WEEK_DAYS = [
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ['日', '一', '二', '三', '四', '五', '六']
];

/**
 * 计算日期列表
 * @param param
 *  - year：年份
 *  - month：月份
 *  - start：开始周次
 *  - blankOut：不在本月的日期不展示
 */
export function generatorDateList(param: IDateListParams): IDateListSource {
    const { year, month, start = 0, blankOut = false } = param;
    // 计算时的月份
    const calcMonth: number = month - 1;
    // 当前月第一天
    const currentDate: Date = new Date(year, calcMonth);
    // 当前月的最后一天（这里利用Date的对传入参数为0时的自动调整逻辑，来获取当前月的最后一天）
    const currentMonthEndDay: Date = new Date(year, calcMonth + 1, 0);
    // 上月的最后一天
    const lastMonthEndDay: Date = new Date(year, calcMonth, 0);
    // 当前月第一天是星期几
    const currentFirstDayWeek: number = currentDate.getDay();
    // 当月的最后一天是星期几
    const currentLastDayWeek: number = currentMonthEndDay.getDay();
    // 当前月最后一天的日期
    const currentMonthEndDate: number = currentMonthEndDay.getDate();
    // 上月最后一天的日期
    const lastMonthEndDate: number = lastMonthEndDay.getDate();
    // 上月在本月出现的天数
    const lastMonthDay: number =
        start <= currentFirstDayWeek
            ? currentFirstDayWeek - start
            : 7 - start + currentFirstDayWeek;
    // 下月出现在本月的天数
    const nextMonthDay: number =
        start <= currentLastDayWeek
            ? 6 - currentLastDayWeek + start
            : start - currentLastDayWeek - 1;
    // 日期列表
    const dateList: IDayList = [];

    // 计算上月出现在本月中的日期
    for (let i = 0; i < lastMonthDay; i++) {
        const tempYear = calcMonth > 0 ? year : year - 1;
        const tempMonth = calcMonth > 0 ? calcMonth : 12;
        dateList.unshift({
            ...computeDateStr(
                tempYear,
                tempMonth,
                lastMonthEndDate - i,
                blankOut
            ),
            position: 'previous'
        });
    }

    // 填充当月日期
    for (let i = 1; i < currentMonthEndDate + 1; i++) {
        dateList.push({
            ...computeDateStr(year, calcMonth + 1, i, false),
            position: 'current'
        });
    }

    // 计算下月出现在当前月中的日期
    for (let i = 1; i <= nextMonthDay; i++) {
        const tempYear = calcMonth + 2 < 13 ? year : year + 1;
        const tempMonth = calcMonth + 2 < 13 ? calcMonth + 2 : 1;
        dateList.push({
            ...computeDateStr(tempYear, tempMonth, i, blankOut),
            position: 'next'
        });
    }

    // 展示的行数
    const line = Math.ceil(dateList.length / 7);

    return {
        dateList,
        line,
        month
    };
}

/**
 * 拼接日期信息
 * @param year
 * @param month
 * @param date
 * @param blankOut
 */
function computeDateStr(
    year: number,
    month: number,
    date: number,
    blankOut: boolean
): IDateInfo {
    const tempMonth = month < 10 ? `0${month}` : month;
    const tempDate = date < 10 ? `0${date}` : date;
    const key = `${year}/${month}/${date}`;

    if (blankOut) {
        return {
            value: '',
            zhStr: '',
            year: '',
            month: '',
            date: '',
            showValue: '',
            key
        };
    }

    const value = `${year}-${tempMonth}-${tempDate}`;
    const isCurrentDay = isSameDate(value, new Date());

    return {
        value,
        zhStr: `${year}年${month}月${date}日`,
        year,
        month,
        date,
        showValue: isCurrentDay ? '今天' : date,
        key
    };
}

/**
 * @name convertDyadicArray 一维数组转换为二维数组
 * @param param
 * @example convertDyadicArray([2,3,4,5,6,7], 3) => [[2,3],[4,5],[6,7]]
 */
export function convertDyadicArray(param: IDateListSource): IWeekList {
    const { dateList, line } = param;
    const dyadicArray = [];
    const col = dateList.length / line;

    for (let i = 0; i < line; i++) {
        dyadicArray.push(dateList.slice(i * col, (i + 1) * col));
    }

    return dyadicArray;
}

/**
 * 生成指定年的指定月份的日历
 * @param year 年份
 * @param startMonth 开始月份
 * @param endMonth 结束月份
 * @param start 开始周次
 * @param blankOut 上下月日期是否空白
 */
export function generatorCalendar(
    year: number,
    startMonth = 0,
    endMonth = 12,
    start: IWeekStart,
    blankOut: boolean
): Array<IMonthCalendar> {
    if (
        !isValidMonth(startMonth) ||
        !isValidMonth(endMonth) ||
        startMonth > endMonth
    ) {
        return [];
    }

    const calendars = [];

    for (let i = startMonth; i <= endMonth; i++) {
        const dayList: IDateListSource = generatorDateList({
            year,
            month: i,
            start,
            blankOut
        });
        const weekList: IWeekList = convertDyadicArray(dayList);

        calendars.push({
            title: `${year}年${i}月`,
            key: `${year}/${i}/1`,
            weekList,
            year,
            month: i
        });
    }

    return calendars;
}

/**
 * 计算某个范围内的日历
 * @param minDate
 * @param maxDate
 * @param start
 * @param blankOut
 */
export function generatorRangeCalendar(
    minDate: string | Date,
    maxDate: string | Date,
    start: IWeekStart,
    blankOut: boolean
): Array<IMonthCalendar> {
    // 如果最小日期不小于最大日期，则终止操作
    if (!compareDate(minDate, maxDate)) {
        return [];
    }

    const rangYears = computeRangeYear(minDate, maxDate);
    let rangDateList: Array<IMonthCalendar> = [];

    // 遍历生成范围日历
    rangYears.forEach((item) => {
        const result = generatorCalendar(
            item.year,
            item.startMonth,
            item.endMonth,
            start,
            blankOut
        );
        rangDateList = rangDateList.concat(result);
    });

    return rangDateList;
}

/**
 * 计算某个范围内的年份数据
 * @param minDate
 * @param maxDate
 */
function computeRangeYear(
    minDate: string | Date,
    maxDate: string | Date
): IRangeCalendar {
    // 转换日期
    const minDateInfo = parseDateInfo(minDate);
    const maxDateInfo = parseDateInfo(maxDate);

    // 如果最大最小日期在同一年
    if (minDateInfo.year === maxDateInfo.year) {
        return [
            {
                year: minDateInfo.year,
                startMonth: minDateInfo.month,
                endMonth: maxDateInfo.month
            }
        ];
    }

    const years: IRangeCalendar = [
        { year: minDateInfo.year, startMonth: minDateInfo.month, endMonth: 12 }
    ];

    for (let i = minDateInfo.year + 1; i < maxDateInfo.year; i++) {
        years.push({
            year: i,
            startMonth: 1,
            endMonth: 12
        });
    }

    years.push({
        year: maxDateInfo.year,
        startMonth: 1,
        endMonth: maxDateInfo.month
    });

    return years;
}

/**
 * 解析传入的日期
 * @param date
 */
function parseDateInfo(date: string | Date): IParseDateInfo {
    if (typeof date === 'string') {
        const result = /(.*)[^\d](.*)[^\d](.*)/.exec(date);

        // 是否有匹配到结果（传入日期合适是否正确）
        if (!result) {
            // 如果日期格式错误，则直接返回房钱日期
            const now = new Date();
            return {
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                date: now.getDate()
            };
        }

        return {
            year: parseInt(result[1], 10),
            month: parseInt(result[2], 10),
            date: parseInt(result[3], 10)
        };
    }

    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate()
    };
}

/**
 * 比较两个日期
 *  1、这里同时会判断日期是否为空的情况，任何一个为空，则判断为不合格
 *  2、如果任何一个日期的格式不正确，亦会被判断为不合格
 * @param start
 * @param end
 */
function compareDate(start: string | Date, end: string | Date): boolean {
    // 任何一个为空，都不通过
    if (!start || !end) {
        return false;
    }

    const startDate = adjustDate(start);
    const endDate = adjustDate(end);

    return endDate > startDate;
}

/**
 * 调整日期，如果是字符串，则将其中的-替换为/；
 * 例如：
 *  input：2020-07-02
 *  output：new Date('2020/07/02')
 * @param date
 */
function adjustDate(date: string | Date): Date {
    if (typeof date === 'string') {
        return new Date(date.replace(/-/g, '/'));
    }

    return date;
}

/**
 * 校验月份
 * @param month
 */
function isValidMonth(month: number): boolean {
    return !(month <= 0 || month > 12);
}

/**
 * 是否是同一天
 * @param start
 * @param end
 */
export function isSameDate(start: string | Date, end: string | Date): boolean {
    const startDate = new Date(adjustDate(start)).setHours(0, 0, 0, 0);
    const endDate = new Date(adjustDate(end)).setHours(0, 0, 0, 0);

    return startDate === endDate;
}

/**
 * 计算顶部周名称
 * @param type
 * @param start
 */
export function generatorWeekHeader(
    type: IWeekLocale = 1,
    start: IWeekStart = 0
): Array<string> {
    const weekdays = WEEK_DAYS[type];
    const after = weekdays.slice(0, start);
    const before = weekdays.slice(start);

    return before.concat(after);
}
