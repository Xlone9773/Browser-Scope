// test/secureBaseline.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  verifyOrStoreBaseline,
  clearAllSecureBaselines,
  computeDigest,
  generateSignature,
  getEnvironmentAnchor
} from '../components/canvas-poisoning/secureBaseline';

describe('Secure Baseline Anti-Tamper Engine', () => {
  beforeEach(async () => {
    localStorage.clear();
    await clearAllSecureBaselines();
    vi.restoreAllMocks();
  });

  it('computes stable SHA-256 digest or fallback', async () => {
    const d1 = await computeDigest('test-content-123');
    const d2 = await computeDigest('test-content-123');
    const d3 = await computeDigest('different-content-456');

    expect(d1).toBe(d2);
    expect(d1).not.toBe(d3);
    expect(d1.length).toBeGreaterThan(10);
  });

  it('generates environment anchor and cryptographic signatures', async () => {
    const anchor = await getEnvironmentAnchor();
    expect(typeof anchor).toBe('string');
    expect(anchor.length).toBeGreaterThan(10);

    const sig1 = await generateSignature('canvas_2d', 'hash_abc', 1000, anchor);
    const sig2 = await generateSignature('canvas_2d', 'hash_abc', 1000, anchor);
    const sig3 = await generateSignature('canvas_2d', 'hash_different', 1000, anchor);

    expect(sig1).toBe(sig2);
    expect(sig1).not.toBe(sig3);
  });

  it('initializes a fresh baseline on first run (FIRST_RUN)', async () => {
    const res = await verifyOrStoreBaseline('canvas_2d', 'original_canvas_hash_111');

    expect(res.status).toBe('FIRST_RUN');
    expect(res.storedBaseline).toBe('original_canvas_hash_111');
    expect(res.currentHash).toBe('original_canvas_hash_111');

    // Check localStorage contains signed record
    const stored = localStorage.getItem('browserscope_sec_baseline_canvas_2d');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.hash).toBe('original_canvas_hash_111');
    expect(parsed.sig).toBeTruthy();
    expect(parsed.anchor).toBeTruthy();
  });

  it('returns MATCH when verified baseline matches current render hash', async () => {
    await verifyOrStoreBaseline('webgl', 'webgl_stable_hash_999');

    const checkRes = await verifyOrStoreBaseline('webgl', 'webgl_stable_hash_999');
    expect(checkRes.status).toBe('MATCH');
    expect(checkRes.storedBaseline).toBe('webgl_stable_hash_999');
  });

  it('returns MISMATCH when genuine cross-session seed noise changes the hash', async () => {
    await verifyOrStoreBaseline('audio', 'original_audio_hash_001');

    const checkRes = await verifyOrStoreBaseline('audio', 'altered_audio_hash_002');
    expect(checkRes.status).toBe('MISMATCH');
    expect(checkRes.storedBaseline).toBe('original_audio_hash_001');
    expect(checkRes.currentHash).toBe('altered_audio_hash_002');
  });

  it('detects tampering when localStorage is replaced with a raw plain string', async () => {
    await verifyOrStoreBaseline('canvas_2d', 'orig_hash');

    // Attacker manually edits localStorage to a forged plain string
    localStorage.setItem('browserscope_sec_baseline_canvas_2d', 'forged_clean_hash_xyz');

    const res = await verifyOrStoreBaseline('canvas_2d', 'forged_clean_hash_xyz');
    expect(res.status).toBe('TAMPERED');
    expect(res.reason).toBe('sig_invalid');
  });

  it('detects tampering when JSON fields are forged without matching HMAC signature', async () => {
    await verifyOrStoreBaseline('canvas_2d', 'orig_hash');

    // Attacker modifies the hash inside the JSON record
    const stored = JSON.parse(localStorage.getItem('browserscope_sec_baseline_canvas_2d')!);
    stored.hash = 'forged_hash_without_matching_sig';
    localStorage.setItem('browserscope_sec_baseline_canvas_2d', JSON.stringify(stored));

    const res = await verifyOrStoreBaseline('canvas_2d', 'forged_hash_without_matching_sig');
    expect(res.status).toBe('TAMPERED');
    expect(res.reason).toBe('sig_invalid');
  });

  it('detects environment anchor mismatch when baseline is transplanted from another device', async () => {
    await verifyOrStoreBaseline('canvas_2d', 'orig_hash');

    const stored = JSON.parse(localStorage.getItem('browserscope_sec_baseline_canvas_2d')!);
    stored.anchor = 'foreign_device_anchor_xyz';
    // Recompute signature with fake anchor
    stored.sig = await generateSignature(stored.key, stored.hash, stored.timestamp, stored.anchor);
    localStorage.setItem('browserscope_sec_baseline_canvas_2d', JSON.stringify(stored));

    const res = await verifyOrStoreBaseline('canvas_2d', 'orig_hash');
    expect(res.status).toBe('TAMPERED');
    expect(res.reason).toBe('anchor_mismatch');
  });

  it('detects and recovers when localStorage is wiped to evade comparison (IndexedDB recovery)', async () => {
    await verifyOrStoreBaseline('media_devices', 'device_list_hash_abc');

    // Attacker wipes localStorage hoping for a clean new baseline
    localStorage.removeItem('browserscope_sec_baseline_media_devices');

    // Second run with altered device hash
    const res = await verifyOrStoreBaseline('media_devices', 'device_list_hash_different');
    // Because authentic baseline is preserved in secure vault / in-memory, it catches the mismatch
    expect(res.status).toBe('MISMATCH');
    expect(res.storedBaseline).toBe('device_list_hash_abc');
  });

  it('clears all secure baselines completely on clearAllSecureBaselines()', async () => {
    await verifyOrStoreBaseline('canvas_2d', 'hash1');
    await verifyOrStoreBaseline('webgl', 'hash2');

    await clearAllSecureBaselines();

    expect(localStorage.getItem('browserscope_sec_baseline_canvas_2d')).toBeNull();
    expect(localStorage.getItem('browserscope_sec_baseline_webgl')).toBeNull();

    // Next run should be treated as FIRST_RUN
    const res = await verifyOrStoreBaseline('canvas_2d', 'hash_new');
    expect(res.status).toBe('FIRST_RUN');
  });
});
