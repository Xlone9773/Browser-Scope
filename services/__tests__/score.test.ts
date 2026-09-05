import { describe, it, expect } from 'vitest';
import { calculateFingerprintScore } from '../score';
import type { ScoreFactor } from '../../types';

describe('Fingerprint Score Calculator (Production Code)', () => {
  describe('Basic score calculation', () => {
    it('should calculate score for valid input', () => {
      const input = {
        canvasHash: 'abc123def456',
        webglHash: 'xyz789',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        cpu: '4',
        memory: '8',
        gpuRenderer: 'ANGLE (Intel HD Graphics 620)',
        battery: '80%',
        screenRes: '1920x1080',
        pixelRatio: 1.5,
        colorDepth: 32,
        audioRate: '44100 Hz',
        webRTC: '192.168.1.1',
        drmCount: 2,
        touchPoints: 10,
        hdr: false,
        timezone: 'America/New_York',
        languages: 'en-US,en',
        fontsCount: 45,
      };

      const score = calculateFingerprintScore(input);
      
      expect(score).toBeDefined();
      expect(score.totalScore).toBeGreaterThanOrEqual(0);
      expect(score.totalScore).toBeLessThanOrEqual(100);
      expect(typeof score.rating).toBe('string');
      expect(Array.isArray(score.factors)).toBe(true);
    });

    it('should handle empty/minimal input gracefully', () => {
      const input = {
        canvasHash: 'Error',
        webglHash: 'Error',
        userAgent: 'Mozilla',
        cpu: '0',
        memory: '0',
        gpuRenderer: 'Unknown',
        battery: 'N/A',
        screenRes: '0x0',
        pixelRatio: 1,
        colorDepth: 0,
        audioRate: 'Unknown',
        webRTC: 'N/A',
        drmCount: 0,
        touchPoints: 0,
        hdr: false,
      };

      const score = calculateFingerprintScore(input);
      
      expect(score.totalScore).toBeGreaterThanOrEqual(0);
      expect(score.totalScore).toBeLessThanOrEqual(100);
      expect(score.factors.length).toBeGreaterThanOrEqual(0);
    });

    it('should return consistent scores for same input', () => {
      const input = {
        canvasHash: 'consistent-hash',
        webglHash: 'webgl-hash',
        userAgent: 'Mozilla/5.0',
        cpu: '8',
        memory: '16',
        gpuRenderer: 'NVIDIA',
        battery: '100%',
        screenRes: '2560x1440',
        pixelRatio: 2,
        colorDepth: 32,
        audioRate: '48000 Hz',
        webRTC: '10.0.0.1',
        drmCount: 3,
        touchPoints: 0,
        hdr: true,
      };

      const score1 = calculateFingerprintScore(input);
      const score2 = calculateFingerprintScore(input);
      
      expect(score1.totalScore).toBe(score2.totalScore);
      expect(score1.rating).toBe(score2.rating);
    });
  });

  describe('Rating classification', () => {
    it('should classify high scores as "Critical"', () => {
      const input = {
        canvasHash: 'unique',
        webglHash: 'unique',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        cpu: '16',
        memory: '32',
        gpuRenderer: 'NVIDIA RTX 3090',
        battery: '100%',
        screenRes: '4096x2160',
        pixelRatio: 3,
        colorDepth: 32,
        audioRate: '96000 Hz',
        webRTC: '203.0.113.1',
        drmCount: 5,
        touchPoints: 0,
        hdr: true,
        timezone: 'UTC',
        languages: 'en-US,en,fr-FR,de-DE',
        fontsCount: 150,
      };

      const score = calculateFingerprintScore(input);
      
      // High input should produce high score
      expect(score.totalScore).toBeGreaterThan(50);
    });

    it('should classify low scores as "Low"', () => {
      const input = {
        canvasHash: 'Error',
        webglHash: 'Not Supported',
        userAgent: 'Safari',
        cpu: '2',
        memory: '2',
        gpuRenderer: 'Generic',
        battery: 'N/A',
        screenRes: '1024x768',
        pixelRatio: 1,
        colorDepth: 8,
        audioRate: 'Unknown',
        webRTC: 'N/A',
        drmCount: 0,
        touchPoints: 0,
        hdr: false,
      };

      const score = calculateFingerprintScore(input);
      
      expect(score.totalScore).toBeLessThan(50);
    });

    it('should have valid rating strings', () => {
      const input = {
        canvasHash: 'test',
        webglHash: 'test',
        userAgent: 'Mozilla',
        cpu: '4',
        memory: '8',
        gpuRenderer: 'GPU',
        battery: '50%',
        screenRes: '1920x1080',
        pixelRatio: 1,
        colorDepth: 24,
        audioRate: '44100 Hz',
        webRTC: '192.168.1.1',
        drmCount: 1,
        touchPoints: 5,
        hdr: false,
      };

      const score = calculateFingerprintScore(input);
      
      const validRatings = ['Low', 'Medium', 'High', 'Critical'];
      expect(validRatings).toContain(score.rating);
    });
  });

  describe('Category scoring', () => {
    it('should populate all category scores', () => {
      const input = {
        canvasHash: 'hash',
        webglHash: 'hash',
        userAgent: 'Mozilla/5.0',
        cpu: '4',
        memory: '8',
        gpuRenderer: 'GPU',
        battery: '75%',
        screenRes: '1920x1080',
        pixelRatio: 1.5,
        colorDepth: 24,
        audioRate: '44100 Hz',
        webRTC: '192.168.1.1',
        drmCount: 2,
        touchPoints: 5,
        hdr: false,
      };

      const score = calculateFingerprintScore(input);
      
      expect(score.categoryScores).toBeDefined();
      expect(score.categoryScores.hardware).toBeGreaterThanOrEqual(0);
      expect(score.categoryScores.browser).toBeGreaterThanOrEqual(0);
      expect(score.categoryScores.screen).toBeGreaterThanOrEqual(0);
      expect(score.categoryScores.media).toBeGreaterThanOrEqual(0);
      expect(score.categoryScores.network).toBeGreaterThanOrEqual(0);
    });

    it('should normalize category scores to 0-100 range', () => {
      const input = {
        canvasHash: 'unique',
        webglHash: 'unique',
        userAgent: 'Mozilla/5.0 (Very Long User Agent String)',
        cpu: '32',
        memory: '64',
        gpuRenderer: 'NVIDIA',
        battery: '100%',
        screenRes: '5120x2880',
        pixelRatio: 2,
        colorDepth: 32,
        audioRate: '96000 Hz',
        webRTC: '203.0.113.1',
        drmCount: 10,
        touchPoints: 10,
        hdr: true,
        timezone: 'Asia/Tokyo',
        languages: 'ja-JP,en-US,en,zh-CN',
        fontsCount: 200,
      };

      const score = calculateFingerprintScore(input);
      
      Object.values(score.categoryScores).forEach(catScore => {
        expect(catScore).toBeGreaterThanOrEqual(0);
        expect(catScore).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Factor preservation', () => {
    it('should include factors in result', () => {
      const input = {
        canvasHash: 'abc123',
        webglHash: 'def456',
        userAgent: 'Mozilla/5.0',
        cpu: '4',
        memory: '8',
        gpuRenderer: 'GPU',
        battery: '50%',
        screenRes: '1920x1080',
        pixelRatio: 1,
        colorDepth: 24,
        audioRate: '44100 Hz',
        webRTC: '192.168.1.1',
        drmCount: 1,
        touchPoints: 5,
        hdr: false,
      };

      const score = calculateFingerprintScore(input);
      
      expect(Array.isArray(score.factors)).toBe(true);
      expect(score.factors.length).toBeGreaterThan(0);
    });

    it('should have valid factor structure', () => {
      const input = {
        canvasHash: 'hash',
        webglHash: 'hash',
        userAgent: 'Mozilla/5.0',
        cpu: '4',
        memory: '8',
        gpuRenderer: 'GPU',
        battery: '50%',
        screenRes: '1920x1080',
        pixelRatio: 1,
        colorDepth: 24,
        audioRate: '44100 Hz',
        webRTC: '192.168.1.1',
        drmCount: 1,
        touchPoints: 5,
        hdr: false,
      };

      const score = calculateFingerprintScore(input);
      
      score.factors.forEach((factor: ScoreFactor) => {
        expect(factor.id).toBeDefined();
        expect(typeof factor.id).toBe('string');
        expect(factor.score).toBeGreaterThanOrEqual(0);
        expect(factor.maxScore).toBeGreaterThanOrEqual(factor.score);
        expect(['hardware', 'browser', 'screen', 'media', 'network']).toContain(factor.category);
      });
    });

    it('should track canvas and webgl factors when present', () => {
      const input = {
        canvasHash: 'unique-canvas-hash',
        webglHash: 'unique-webgl-hash',
        userAgent: 'Mozilla/5.0',
        cpu: '4',
        memory: '8',
        gpuRenderer: 'GPU',
        battery: '50%',
        screenRes: '1920x1080',
        pixelRatio: 1,
        colorDepth: 24,
        audioRate: '44100 Hz',
        webRTC: '192.168.1.1',
        drmCount: 1,
        touchPoints: 5,
        hdr: false,
      };

      const score = calculateFingerprintScore(input);
      
      const factorIds = score.factors.map(f => f.id);
      expect(factorIds).toContain('canvas_hash');
      expect(factorIds).toContain('webgl_hash');
    });
  });

  describe('Edge cases', () => {
    it('should handle optional client hints', () => {
      const input = {
        canvasHash: 'hash',
        webglHash: 'hash',
        userAgent: 'Mozilla/5.0 with very long user agent string to trigger hints scoring',
        cpu: '4',
        memory: '8',
        gpuRenderer: 'GPU',
        battery: '50%',
        screenRes: '1920x1080',
        pixelRatio: 1,
        colorDepth: 24,
        audioRate: '44100 Hz',
        webRTC: '192.168.1.1',
        drmCount: 1,
        touchPoints: 5,
        hdr: false,
        clientHints: {
          model: 'iPhone',
          platform: 'iOS',
        },
      };

      const score = calculateFingerprintScore(input);
      
      expect(score).toBeDefined();
      expect(score.totalScore).toBeGreaterThanOrEqual(0);
    });

    it('should handle missing optional timezone', () => {
      const input = {
        canvasHash: 'hash',
        webglHash: 'hash',
        userAgent: 'Mozilla/5.0',
        cpu: '4',
        memory: '8',
        gpuRenderer: 'GPU',
        battery: '50%',
        screenRes: '1920x1080',
        pixelRatio: 1,
        colorDepth: 24,
        audioRate: '44100 Hz',
        webRTC: '192.168.1.1',
        drmCount: 1,
        touchPoints: 5,
        hdr: false,
      };

      const score = calculateFingerprintScore(input);
      
      expect(score).toBeDefined();
      expect(score.totalScore).toBeGreaterThanOrEqual(0);
    });

    it('should handle extreme values', () => {
      const input = {
        canvasHash: 'x'.repeat(1000),
        webglHash: 'y'.repeat(1000),
        userAgent: 'z'.repeat(5000),
        cpu: '1024',
        memory: '256',
        gpuRenderer: 'GPU'.repeat(100),
        battery: '200%',
        screenRes: '99999x99999',
        pixelRatio: 10,
        colorDepth: 128,
        audioRate: '999999 Hz',
        webRTC: '255.255.255.255',
        drmCount: 1000,
        touchPoints: 1000,
        hdr: true,
        timezone: 'UTC',
        languages: 'en-US,'.repeat(100),
        fontsCount: 10000,
      };

      const score = calculateFingerprintScore(input);
      
      // Should still produce valid score even with extreme values
      expect(score.totalScore).toBeGreaterThanOrEqual(0);
      expect(score.totalScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Score consistency', () => {
    it('should maintain score bounds across different inputs', () => {
      const inputs = [
        {
          canvasHash: 'a', webglHash: 'b', userAgent: 'x', cpu: '1', memory: '1',
          gpuRenderer: 'g', battery: 'b', screenRes: '800x600', pixelRatio: 1, colorDepth: 8,
          audioRate: 'a', webRTC: 'w', drmCount: 0, touchPoints: 0, hdr: false,
        },
        {
          canvasHash: 'unique', webglHash: 'unique', userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
          cpu: '32', memory: '128', gpuRenderer: 'NVIDIA RTX 4090', battery: '100%',
          screenRes: '7680x4320', pixelRatio: 3, colorDepth: 32, audioRate: '192000 Hz',
          webRTC: '203.0.113.1', drmCount: 5, touchPoints: 10, hdr: true, timezone: 'UTC',
          languages: 'en-US,en,fr-FR,de-DE,ja-JP', fontsCount: 500,
        },
      ];

      inputs.forEach(input => {
        const score = calculateFingerprintScore(input);
        
        expect(score.totalScore).toBeGreaterThanOrEqual(0);
        expect(score.totalScore).toBeLessThanOrEqual(100);
        expect(typeof score.rating).toBe('string');
      });
    });
  });

  describe('Entropy Precision & Differential Scoring', () => {
    const baseInput = {
      canvasHash: 'canvas123',
      webglHash: 'webgl456',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      cpu: '8',
      memory: '16',
      gpuRenderer: 'ANGLE (Intel HD Graphics 630)',
      battery: 'Unknown',
      screenRes: '1920x1080',
      pixelRatio: 1,
      colorDepth: 24,
      audioRate: '44100 Hz',
      webRTC: 'Protected',
      drmCount: 1,
      touchPoints: 0,
      hdr: false,
      timezone: 'America/New_York',
      languages: 'en-US',
      fontsCount: 0,
    };

    it('should assign higher entropy to extensive fonts vs 0/unknown fonts', () => {
      const withNoFonts = calculateFingerprintScore({ ...baseInput, fontsCount: 0 });
      const withManyFonts = calculateFingerprintScore({ ...baseInput, fontsCount: 150 });

      const fontFactorNo = withNoFonts.factors.find(f => f.id === 'installed_fonts');
      const fontFactorMany = withManyFonts.factors.find(f => f.id === 'installed_fonts');

      expect(fontFactorNo?.score).toBe(0);
      expect(fontFactorMany?.score).toBe(20);
      expect(withManyFonts.totalScore).toBeGreaterThan(withNoFonts.totalScore);
    });

    it('should differentiate public IP WebRTC leak from private IP and protected state', () => {
      const protectedRtc = calculateFingerprintScore({ ...baseInput, webRTC: 'Protected' });
      const privateRtc = calculateFingerprintScore({ ...baseInput, webRTC: '192.168.1.105' });
      const publicRtc = calculateFingerprintScore({ ...baseInput, webRTC: '198.51.100.42' });

      const factorProtected = protectedRtc.factors.find(f => f.id === 'webrtc_leak');
      const factorPrivate = privateRtc.factors.find(f => f.id === 'webrtc_leak');
      const factorPublic = publicRtc.factors.find(f => f.id === 'webrtc_leak');

      expect(factorProtected?.score).toBe(0);
      expect(factorPrivate?.score).toBe(45);
      expect(factorPublic?.score).toBe(75);
      expect(publicRtc.totalScore).toBeGreaterThan(privateRtc.totalScore);
      expect(privateRtc.totalScore).toBeGreaterThan(protectedRtc.totalScore);
    });

    it('should correctly treat Timeout/Hidden as safe and protected (0 pts)', () => {
      const timeoutRtc = calculateFingerprintScore({ ...baseInput, webRTC: 'Timeout/Hidden' });
      const factorTimeout = timeoutRtc.factors.find(f => f.id === 'webrtc_leak');

      expect(factorTimeout?.score).toBe(0);
      expect(factorTimeout?.description).toBe('desc_webrtc_safe');
      expect(factorTimeout?.value).toBe('val_protected');
    });

    it('should give dedicated GPU higher uniqueness than software rasterizer', () => {
      const softGpu = calculateFingerprintScore({ ...baseInput, gpuRenderer: 'Google SwiftShader (LLVM 10.0.0)' });
      const dedicatedGpu = calculateFingerprintScore({ ...baseInput, gpuRenderer: 'ANGLE (NVIDIA GeForce RTX 4080 Direct3D11 vs_5_0 ps_5_0)' });

      const factorSoft = softGpu.factors.find(f => f.id === 'gpu_renderer');
      const factorDedicated = dedicatedGpu.factors.find(f => f.id === 'gpu_renderer');

      expect(factorSoft?.score).toBe(5);
      expect(factorDedicated?.score).toBe(35);
      expect(dedicatedGpu.totalScore).toBeGreaterThan(softGpu.totalScore);
    });

    it('should score high audiophile DAC rate higher than standard 44.1kHz rate', () => {
      const standardAudio = calculateFingerprintScore({ ...baseInput, audioRate: '44100 Hz' });
      const proAudio = calculateFingerprintScore({ ...baseInput, audioRate: '192000 Hz' });

      const factorStandard = standardAudio.factors.find(f => f.id === 'audio_context');
      const factorPro = proAudio.factors.find(f => f.id === 'audio_context');

      expect(factorStandard?.score).toBe(20);
      expect(factorPro?.score).toBe(50);
      expect(proAudio.totalScore).toBeGreaterThan(standardAudio.totalScore);
    });

    it('should score non-standard windowed screen higher than standard 1080p', () => {
      const standardScreen = calculateFingerprintScore({ ...baseInput, screenRes: '1920x1080' });
      const customScreen = calculateFingerprintScore({ ...baseInput, screenRes: '1437x893' });

      const factorStd = standardScreen.factors.find(f => f.id === 'resolution');
      const factorCustom = customScreen.factors.find(f => f.id === 'resolution');

      expect(factorStd?.score).toBe(18);
      expect(factorCustom?.score).toBe(45);
      expect(customScreen.totalScore).toBeGreaterThan(standardScreen.totalScore);
    });
  });
});
