var TablesortCore = require('tablesort')

// Basic dates in dd/mm/yy or dd-mm-yy format.
// Years can be 4 digits. Days and Months can be 1 or 2 digits.
{
  let parseDate = function (date) {
    date = date.replace(/\-/g, '/')
    date = date.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2}) .*/, '$1/$2/$3') // format before getTime

    return new Date(date).getTime() || -1
  }

  TablesortCore.extend('date', function (item) {
    return (
      item.search(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\.?,?\s*/i) !== -1 ||
      item.search(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/) !== -1 ||
      item.search(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i) !== -1
    ) && !isNaN(parseDate(item))
  }, function (a, b) {
    a = a.toLowerCase()
    b = b.toLowerCase()

    return parseDate(b) - parseDate(a)
  })
}

// Dot separated values. E.g. IP addresses or version numbers.
TablesortCore.extend('dotsep', function (item) {
  return /^(\d+\.)+\d+$/.test(item)
}, function (a, b) {
  a = a.split('.')
  b = b.split('.')

  for (var i = 0, len = a.length, ai, bi; i < len; i++) {
    ai = parseInt(a[i], 10)
    bi = parseInt(b[i], 10)

    if (ai === bi) continue
    if (ai > bi) return -1
    if (ai < bi) return 1
  }

  return 0
})

// Filesizes. e.g. '5.35 K', '10 MB', '12.45 GB', or '4.67 TiB'
{
  let compareNumber = function (a, b) {
    a = parseFloat(a)
    b = parseFloat(b)

    a = isNaN(a) ? 0 : a
    b = isNaN(b) ? 0 : b

    return a - b
  }

  let cleanNumber = function (i) {
    return i.replace(/[^\-?0-9.]/g, '')
  }

  // Returns suffix multiplier
  // Ex. suffix2num('KB') -> 1000
  // Ex. suffix2num('KiB') -> 1024
  let suffix2num = function (suffix) {
    suffix = suffix.toLowerCase()
    var base = suffix[1] === 'i' ? 1024 : 1000

    switch (suffix[0]) {
      case 'k':
        return Math.pow(base, 2)
      case 'm':
        return Math.pow(base, 3)
      case 'g':
        return Math.pow(base, 4)
      case 't':
        return Math.pow(base, 5)
      case 'p':
        return Math.pow(base, 6)
      case 'e':
        return Math.pow(base, 7)
      case 'z':
        return Math.pow(base, 8)
      case 'y':
        return Math.pow(base, 9)
      default:
        return base
    }
  }

  // Converts filesize to bytes
  // Ex. filesize2num('123 KB') -> 123000
  // Ex. filesize2num('123 KiB') -> 125952
  let filesize2num = function (filesize) {
    let matches = filesize.match(/^(\d+(\.\d+)?) ?((K|M|G|T|P|E|Z|Y|B$)i?B?)$/i)

    let num = parseFloat(cleanNumber(matches[1]))
    let suffix = matches[3]

    return num * suffix2num(suffix)
  }

  TablesortCore.extend('filesize', function (item) {
    return /^\d+(\.\d+)? ?(K|M|G|T|P|E|Z|Y|B$)i?B?$/i.test(item)
  }, function (a, b) {
    a = filesize2num(a)
    b = filesize2num(b)

    return compareNumber(b, a)
  })
}

TablesortCore.extend('monthname', function (item) {
  return (
    item.search(/(January|February|March|April|May|June|July|August|September|October|November|December)/i) !== -1
  )
}, function (a, b) {
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return monthNames.indexOf(b) - monthNames.indexOf(a)
})

{
  let cleanNumber = function (i) {
    return i.replace(/[^\-?0-9.]/g, '')
  }

  let compareNumber = function (a, b) {
    a = parseFloat(a)
    b = parseFloat(b)

    a = isNaN(a) ? 0 : a
    b = isNaN(b) ? 0 : b

    return a - b
  }

  TablesortCore.extend('number', function (item) {
    return item.match(/^-?[£\x24Û¢´€]?\d+\s*([,\.]\d{0,2})/) || // Prefixed currency
      item.match(/^-?\d+\s*([,\.]\d{0,2})?[£\x24Û¢´€]/) || // Suffixed currency
      item.match(/^-?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/) // Number
  }, function (a, b) {
    a = cleanNumber(a)
    b = cleanNumber(b)

    return compareNumber(b, a)
  })
}

module.exports = TablesortCore
