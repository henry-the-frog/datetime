// datetime.js — Date/time utilities

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export function isLeapYear(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
export function daysInMonth(y, m) { return [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m]; }
export function dayOfYear(d) { const date = toDate(d); let day = date.getDate(); for (let m = 0; m < date.getMonth(); m++) day += daysInMonth(date.getFullYear(), m); return day; }
export function weekNumber(d) { const date = toDate(d); const oneJan = new Date(date.getFullYear(), 0, 1); return Math.ceil(((date - oneJan) / 86400000 + oneJan.getDay() + 1) / 7); }

function toDate(d) { return d instanceof Date ? d : new Date(d); }
function pad(n, len = 2) { return String(n).padStart(len, '0'); }

// ===== Format =====
export function format(d, fmt) {
  const date = toDate(d);
  return fmt
    .replace('YYYY', date.getFullYear())
    .replace('MMMM', MONTHS[date.getMonth()])
    .replace('MMM', MONTHS[date.getMonth()].slice(0, 3))
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
    .replace('ss', pad(date.getSeconds()))
    .replace('dddd', DAYS[date.getDay()])
    .replace('ddd', DAYS[date.getDay()].slice(0, 3));
}

// ===== Add/Subtract =====
export function add(d, amount, unit) {
  const date = new Date(toDate(d));
  switch (unit) {
    case 'years': date.setFullYear(date.getFullYear() + amount); break;
    case 'months': date.setMonth(date.getMonth() + amount); break;
    case 'days': date.setDate(date.getDate() + amount); break;
    case 'hours': date.setHours(date.getHours() + amount); break;
    case 'minutes': date.setMinutes(date.getMinutes() + amount); break;
    case 'seconds': date.setSeconds(date.getSeconds() + amount); break;
  }
  return date;
}

export function subtract(d, amount, unit) { return add(d, -amount, unit); }

// ===== Difference =====
export function diff(a, b, unit = 'days') {
  const da = toDate(a), db = toDate(b);
  const ms = da - db;
  switch (unit) {
    case 'seconds': return Math.floor(ms / 1000);
    case 'minutes': return Math.floor(ms / 60000);
    case 'hours': return Math.floor(ms / 3600000);
    case 'days': return Math.floor(ms / 86400000);
    case 'weeks': return Math.floor(ms / 604800000);
  }
  return ms;
}

// ===== Start/End =====
export function startOf(d, unit) {
  const date = new Date(toDate(d));
  switch (unit) {
    case 'year': date.setMonth(0); /* fall through */
    case 'month': date.setDate(1); /* fall through */
    case 'day': date.setHours(0, 0, 0, 0); break;
    case 'hour': date.setMinutes(0, 0, 0); break;
    case 'minute': date.setSeconds(0, 0); break;
  }
  return date;
}

export function endOf(d, unit) {
  const date = new Date(toDate(d));
  switch (unit) {
    case 'year': date.setMonth(11, 31); date.setHours(23, 59, 59, 999); break;
    case 'month': date.setDate(daysInMonth(date.getFullYear(), date.getMonth())); date.setHours(23, 59, 59, 999); break;
    case 'day': date.setHours(23, 59, 59, 999); break;
  }
  return date;
}

// ===== Relative time =====
export function relative(d, now = new Date()) {
  const date = toDate(d);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 0) {
    const abs = -seconds;
    if (abs < 60) return 'in a few seconds';
    if (abs < 3600) return `in ${Math.floor(abs / 60)} minutes`;
    if (abs < 86400) return `in ${Math.floor(abs / 3600)} hours`;
    return `in ${Math.floor(abs / 86400)} days`;
  }
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
  return `${Math.floor(seconds / 31536000)} years ago`;
}

// ===== isSame / isBefore / isAfter =====
export function isBefore(a, b) { return toDate(a) < toDate(b); }
export function isAfter(a, b) { return toDate(a) > toDate(b); }
export function isSame(a, b, unit) { return startOf(a, unit).getTime() === startOf(b, unit).getTime(); }
