import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isLeapYear, daysInMonth, dayOfYear, weekNumber, format,
  add, subtract, diff, startOf, endOf, relative, isBefore, isAfter, isSame,
} from './datetime.js';

const d = new Date(2026, 3, 4, 14, 30, 0); // Apr 4, 2026 14:30:00

describe('isLeapYear', () => {
  it('2024 is leap', () => { assert.ok(isLeapYear(2024)); });
  it('2026 is not', () => { assert.ok(!isLeapYear(2026)); });
  it('2000 is leap', () => { assert.ok(isLeapYear(2000)); });
  it('1900 is not', () => { assert.ok(!isLeapYear(1900)); });
});

describe('daysInMonth', () => {
  it('January 31', () => { assert.equal(daysInMonth(2026, 0), 31); });
  it('Feb non-leap 28', () => { assert.equal(daysInMonth(2026, 1), 28); });
  it('Feb leap 29', () => { assert.equal(daysInMonth(2024, 1), 29); });
});

describe('dayOfYear', () => {
  it('Jan 1', () => { assert.equal(dayOfYear(new Date(2026, 0, 1)), 1); });
  it('Apr 4', () => { assert.equal(dayOfYear(d), 94); }); // 31+28+31+4
});

describe('weekNumber', () => {
  it('first week', () => { assert.ok(weekNumber(new Date(2026, 0, 5)) >= 1); });
});

describe('format', () => {
  it('YYYY-MM-DD', () => { assert.equal(format(d, 'YYYY-MM-DD'), '2026-04-04'); });
  it('HH:mm:ss', () => { assert.equal(format(d, 'HH:mm:ss'), '14:30:00'); });
  it('full', () => { assert.ok(format(d, 'MMMM DD, YYYY').includes('April')); });
});

describe('add/subtract', () => {
  it('add days', () => { const r = add(d, 5, 'days'); assert.equal(r.getDate(), 9); });
  it('add months', () => { const r = add(d, 2, 'months'); assert.equal(r.getMonth(), 5); });
  it('add years', () => { const r = add(d, 1, 'years'); assert.equal(r.getFullYear(), 2027); });
  it('subtract days', () => { const r = subtract(d, 4, 'days'); assert.equal(r.getDate(), 31); }); // March 31
  it('add hours', () => { const r = add(d, 3, 'hours'); assert.equal(r.getHours(), 17); });
});

describe('diff', () => {
  it('days', () => { assert.equal(diff(new Date(2026, 3, 10), new Date(2026, 3, 4), 'days'), 6); });
  it('hours', () => { assert.equal(diff(new Date(2026, 3, 4, 15), new Date(2026, 3, 4, 12), 'hours'), 3); });
});

describe('startOf/endOf', () => {
  it('startOf day', () => { const r = startOf(d, 'day'); assert.equal(r.getHours(), 0); assert.equal(r.getMinutes(), 0); });
  it('startOf month', () => { const r = startOf(d, 'month'); assert.equal(r.getDate(), 1); });
  it('endOf day', () => { const r = endOf(d, 'day'); assert.equal(r.getHours(), 23); assert.equal(r.getMinutes(), 59); });
});

describe('relative', () => {
  it('just now', () => { assert.equal(relative(new Date(), new Date()), 'just now'); });
  it('minutes ago', () => { const past = new Date(Date.now() - 5 * 60000); assert.ok(relative(past).includes('minutes ago')); });
  it('hours ago', () => { const past = new Date(Date.now() - 3 * 3600000); assert.ok(relative(past).includes('hours ago')); });
  it('in future', () => { const future = new Date(Date.now() + 3600000); assert.ok(relative(future).includes('in')); });
});

describe('comparison', () => {
  it('isBefore', () => { assert.ok(isBefore(new Date(2020, 0), new Date(2025, 0))); });
  it('isAfter', () => { assert.ok(isAfter(new Date(2025, 0), new Date(2020, 0))); });
  it('isSame day', () => { assert.ok(isSame(new Date(2026, 3, 4, 10), new Date(2026, 3, 4, 20), 'day')); });
  it('not same day', () => { assert.ok(!isSame(new Date(2026, 3, 4), new Date(2026, 3, 5), 'day')); });
});
