import { setLetterCase } from '../helpers/setLetterCase'
import { TGetDate, TDate } from '../types'

/**
 * The function returns a string with a formatted date
 *
 * @param config Configuration Object
 * @param config.date Accepts the same input as the native `new Date()'. See: @link https://www.w3schools.com/js/js_date_formats.asp
 * @param config.sep Accepts a delimited string as input @default '.'
 * @param config.format Date output format
 * @param config.exclude Exception Object
 * @param config.exclude.year Excludes year
 * @param config.exclude.month Excludes month
 * @param config.exclude.day Excludes day
 * @param config.exclude.zero Excludes 0 at the beginning of the month or day if the number is less than 10
 * @param config.nameOfMonths Array with month names - ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
 * @param config.weekDays The object of the days of the week parameters
 * @param config.weekDays.set Responsible for displaying the day of the week - by default `false`
 * @param config.weekDays.locale Localization of the days of the week, accepts the same input as the native method `Date.toLocaleString': 'ru' | 'en', etc
 * @param config.weekDays.format The output format of the days of the week, accepts the same input as the native method `Date.toLocaleString`: 'long' | 'short' | 'narrow'
 * @param config.weekDays.case Letter case: 'capitalize' | 'uppercase' | 'lowercase'
 * @param config.weekDays.position Position of the day of the week relative to the date: 'start' | 'end'
 * @param config.incDay Increases by 'n' days
 * @param config.decDay Decrease by 'n' days
 * @returns A string with a formatted date
 */

export const getDate = (config: TGetDate) => {
  const {
    date = new Date(),
    sep = '.',
    format = 'YYYY-MM-DD',
    exclude = { year: false, month: false, day: false, zero: false },
    nameOfMonths = null,
    weekDays = {
      set: false,
      locale: 'ru',
      format: 'long',
      case: 'capitalize',
      position: 'start',
    },
    incDay,
    decDay,
  } = config

  const DATE = setDate(date)
  const DAY = getDay()
  const WEEKDAY = getWeekday()
  const MONTH = getMonth()
  const YEAR = getYear()
  const DMY = /DD-MM-YY/
  const YMD = /YY-MM-DD/
  const YDM = /YY-DD-MM/
  const MDY = /MM-DD-YY/
  let RESULT: any[] = []

  function setDate(value: TDate) {
    const date = new Date(value)
    incDay && date.setDate(date.getDate() + incDay)
    decDay && date.setDate(date.getDate() - decDay)
    return date
  }

  function getDay() {
    if (exclude.day) return null
    return getValueWithZero(DATE.getDate())
  }

  function getWeekday() {
    const weekday = DATE.toLocaleString(weekDays.locale, {
      weekday: weekDays.format,
    })

    return setLetterCase(weekday, weekDays.case)
  }

  function getMonth() {
    if (exclude.month) return null
    if (nameOfMonths) return nameOfMonths[DATE.getMonth()]
    return getValueWithZero(DATE.getMonth() + 1)
  }

  function getYear() {
    if (exclude.year) return null
    if (format.match(/YYYY/)) return DATE.getFullYear()
    return DATE.getFullYear().toString().substring(2)
  }

  function getValueWithZero(value: string | number) {
    const string = value.toString()
    return !exclude.zero ? string.padStart(2, '0') : string
  }

  function addItemToResult(value: any[], position: string, sep?: string) {
    const array = value.filter((element: any) => element !== null)
    const string = sep ? array.join(sep) : array.join('')

    try {
      switch (position) {
        case 'start':
          RESULT = [string, ...RESULT]
          break
        case 'end':
          RESULT = [...RESULT, string]
          break
        default:
          throw new Error(
            'addItemToResult function takes an array of items with the first argument, takes the position of adding to the resulting array with the second argument: "start" or "end", the third argument (optional) is a delimited string',
          )
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (format.match(DMY)) {
    addItemToResult([DAY, MONTH, YEAR], 'start', sep)
  }
  if (format.match(YMD)) {
    addItemToResult([YEAR, MONTH, DAY], 'start', sep)
  }
  if (format.match(YDM)) {
    addItemToResult([YEAR, DAY, MONTH], 'start', sep)
  }
  if (format.match(MDY)) {
    addItemToResult([MONTH, DAY, YEAR], 'start', sep)
  }

  weekDays.set && addItemToResult([WEEKDAY], weekDays.position)

  console.log(RESULT)

  return RESULT.join(' ')
}
