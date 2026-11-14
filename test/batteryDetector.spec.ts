import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBatteryTime,
  formatBatterySnapshot,
  isBatteryValueReadable,
} from '../services/detectors/hardware';

test('isBatteryValueReadable distinguishes valid percentages from fallback states', () => {
  assert.equal(isBatteryValueReadable('85%'), true);
  assert.equal(isBatteryValueReadable('0%'), true);
  assert.equal(isBatteryValueReadable('100%'), true);
  assert.equal(isBatteryValueReadable('Timeout'), false);
  assert.equal(isBatteryValueReadable('Unavailable'), false);
  assert.equal(isBatteryValueReadable('Not Supported'), false);
  assert.equal(isBatteryValueReadable('Unknown'), false);
  assert.equal(isBatteryValueReadable('N/A'), false);
  assert.equal(isBatteryValueReadable('-'), false);
  assert.equal(isBatteryValueReadable(''), false);
  assert.equal(isBatteryValueReadable(null), false);
});

test('formatBatteryTime handles Infinity, 0, NaN, and positive seconds safely', () => {
  assert.equal(formatBatteryTime(Infinity), 'N/A');
  assert.equal(formatBatteryTime(0), 'N/A');
  assert.equal(formatBatteryTime(-10), 'N/A');
  assert.equal(formatBatteryTime(Number.NaN), 'N/A');
  assert.equal(formatBatteryTime(undefined), 'N/A');
  assert.equal(formatBatteryTime(1800), '30m');
  assert.equal(formatBatteryTime(5400), '1h 30m');
});

test('formatBatterySnapshot rejects invalid/uninitialized BatteryManager and clamps valid levels', () => {
  assert.equal(formatBatterySnapshot(null), null);
  assert.equal(formatBatterySnapshot(undefined), null);
  assert.equal(formatBatterySnapshot({ level: Number.NaN, charging: true }), null);

  const valid = formatBatterySnapshot({
    level: 0.73,
    charging: true,
    chargingTime: 3600,
    dischargingTime: Infinity,
  });
  assert.deepEqual(valid, {
    level: '73%',
    charging: 'Yes',
    chargingTime: '1h 0m',
    dischargingTime: 'N/A',
  });

  const clamped = formatBatterySnapshot({
    level: 1.5,
    charging: false,
    chargingTime: Infinity,
    dischargingTime: 900,
  });
  assert.deepEqual(clamped, {
    level: '100%',
    charging: 'No',
    chargingTime: 'N/A',
    dischargingTime: '15m',
  });
});
