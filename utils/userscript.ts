export const USERSCRIPT_CODE = `// ==UserScript==
// @name         BrowserScope Comprehensive CORS & TLS Bypass Helper
// @namespace    https://browserleaks.com/
// @version      2.2
// @description  Bypass CORS for BrowserScope network diagnostics, speedtest and TLS fingerprinting safely.
// @author       BrowserScope Architect
// @match        https://browser-scope.vercel.app/*
// @match        https://*.browserleaks.com/*
// @match        https://*.run.app/*
// @match        http://localhost:*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const win = window;

    console.log('[BrowserScope Helper] Safe CORS & TLS bypass helper userscript active.');

    // 1. 广播/响应在场状态
    win.addEventListener('PING_CORS_HELPER', function() {
        win.dispatchEvent(new CustomEvent('PONG_CORS_HELPER', {
            detail: { version: '2.2', active: true }
        }));
    });

    // 兼容 TLS 检查
    win.addEventListener('PING_TLS_HELPER', function() {
        win.dispatchEvent(new CustomEvent('PONG_TLS_HELPER'));
        win.dispatchEvent(new CustomEvent('PONG_CORS_HELPER', {
            detail: { version: '2.2', active: true }
        }));
    });

    // 2. 通用跨域请求处理 (带完整诊断数据与超时控制)
    win.addEventListener('CORS_REQUEST_SEND', function(e) {
        const customEvent = e;
        if (!customEvent.detail) return;
        
        const { id, url, method, headers, data, timeout, responseType } = customEvent.detail;

        if (!id || !url) return;

        GM_xmlhttpRequest({
            method: method || 'GET',
            url: url,
            headers: headers,
            data: data,
            timeout: timeout || 15000, // 默认 15 秒超时
            responseType: responseType || 'text',
            onload: function(response) {
                win.dispatchEvent(new CustomEvent('CORS_REQUEST_RECEIVE_' + id, {
                    detail: { 
                        success: true, 
                        status: response.status, 
                        statusText: response.statusText,
                        responseText: response.responseText,
                        responseHeaders: response.responseHeaders, // 补充返回响应头
                        finalUrl: response.finalUrl,               // 补充最终重定向 URL
                        response: response.response                // 支持 Blob / ArrayBuffer
                    }
                }));
            },
            onerror: function(err) {
                win.dispatchEvent(new CustomEvent('CORS_REQUEST_RECEIVE_' + id, {
                    detail: { 
                        success: false, 
                        error: 'Network Error or CORS Block: ' + (err.statusText || 'Unknown'),
                        status: err.status || 0
                    }
                }));
            },
            ontimeout: function() {
                win.dispatchEvent(new CustomEvent('CORS_REQUEST_RECEIVE_' + id, {
                    detail: { 
                        success: false, 
                        error: 'Request Timeout (' + (timeout || 15000) + 'ms)',
                        status: 408
                    }
                }));
            }
        });
    });

    // 3. TLS 指纹专属接口
    win.addEventListener('GET_TLS_FINGERPRINT', function() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://tls.browserleaks.com/json',
            timeout: 10000,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    win.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                        detail: { success: true, data: data }
                    }));
                } catch (e) {
                    win.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                        detail: { success: false, error: 'Failed to parse TLS Fingerprint JSON' }
                    }));
                }
            },
            onerror: function(err) {
                win.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                    detail: { success: false, error: 'Network error fetching TLS Fingerprint' }
                }));
            },
            ontimeout: function() {
                win.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                    detail: { success: false, error: 'Timeout fetching TLS Fingerprint' }
                }));
            }
        });
    });
})();`;
