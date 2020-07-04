# `@mirinzhang/datetime`

> 日期工具处理类

## Usage

### 安装

`yarn install @mirinzhang/datetime --save`

### 使用

```typescript
import { generatorDateList, IDateListParams } from '@mirinzhang/datetime';

const param: IDateListParams = {
    year: 2020,
    month: 7,
    start: 0,
    blankOut: false
};

// 生成月份日期
console.log(generatorDateList(param));
```


## API

### `generatorDateList(param: IDateListParams) => IDateListSource`

> 生成某个月份的日期，包括上月/下月在本月的日期

#### 参数说明

##### `IDateListParams`

属性名|类型|默认值|是否必须|说明|
---|---|---|---|---|
`year`|`number`|`[currentYear]`|`false`|年份|
`month`|`number`|`[currentMonth]`|`false`|月份|
`start`|`IWeekStart`|`0`|`false`|月份开始周次|
`blankOut`|`boolean`|`false`|`false`|上月/下月日期是否为空|

###### `IWeekStart`

> `0 1 2 3 4 5 6`

##### `IDateListSource`

属性名|类型|默认值|说明|
---|---|---|---|
`dateList`|`Array<IDateListItem>`|`[]`|年份|
`month`|`number`|`-`|月份|
`line`|`number`|`-`|当前月份展示几行（即共有几周）|

###### IDateListItem

属性名|类型|默认值|说明|
---|---|---|---|
`value`|`string`|`-`|日期字符串，如：`2020-07-05`|
`year`|`number`|`-`|年份|
`month`|`number`|`-`|月份|
`date`|`number`|`-`|日期|
`zhStr`|`string`|`-`|日期中文，如：`2020年7月5日`|
`showValue`|`number` or `string`|`-`|用于展示的值，`blankOut`决定这里的值|
`position`|`string`|`-`|当前日期的位置，`previous`(上月)、`current`(当月)、`next`(下月)|

### `convertDyadicArray(param: IDateListSource) => Array<Array<IDateListItem>>`

> 将`generatorDateList`生成的月份数据转为按每周一行的二维数组。

#### 参数说明

##### `IDateListSource`

> 见上面的说明。


### `generatorCalendar(year, startMonth, endMonth, start) => IMonthCalendar`

> 计算某年某个范围内的日期（同年）

#### 参数说明

##### 入参

属性名|类型|默认值|是否必须|说明|
---|---|---|---|---|
`year`|`number`|`[currentYear]`|`false`|年份|
`startMonth`|`number`|`0`|`true`|开始月份|
`endMonth`|`number`|`12`|`true`|结束月份|
`start`|`IWeekStart`|`0`|`false`|月份开始周次|

##### IMonthCalendar

属性名|类型|默认值|说明|
---|---|---|---|
`title`|`string`|`-`|月份标题，如：`2020年7月`|
`weekList`|`Array<Array<IDateListItem>>`|`-`|月份周列表|
`year`|`number`|`-`|年份|
`month`|`number`|`-`|月份|


### `generatorRangeCalendar(minDate, maxDate, start, blankOut) => IMonthCalendar`

> 计算某个时间的日期（可跨年）

#### 参说说明

##### 入参

属性名|类型|默认值|是否必须|说明|
---|---|---|---|---|
`minDate`|`string` or `Date` |`new Date()`|`true`|开始日期|
`maxDate`|`string` or `Date` |`new Date()`|`true`|结束日期|
`start`|`IWeekStart`|`0`|`false`|月份开始周次|
`blankOut`|`boolean`|`false`|`false`|上月/下月日期是否为空|

### `generatorWeekHeader(type, start) => Array<string>`

> 计算周次头部

#### 参说说明

##### 入参

属性名|类型|默认值|是否必须|说明|
---|---|---|---|---|
`type`|`number`(`1` or `2`) |`1`|`false`|中英文|
`start`|`IWeekStart`|`0`|`false`|月份开始周次|

##### 返回

> 如：

```typescript
// 周日开始
console.log(generatorWeekHeader(1, 0)); // ['日', '一', '二', '三', '四', '五', '六']
console.log(generatorWeekHeader(2, 0)); // ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// 周六开始
console.log(generatorWeekHeader(1, 6)); // ['六', '日', '一', '二', '三', '四', '五']
```