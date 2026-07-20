export const USERSCRIPT_CODE = `// ==UserScript==
// @name         BrowserScope Comprehensive CORS & TLS Bypass Helper
// @namespace    https://browserleaks.com/
// @version      2.1
// @description  Bypass CORS for BrowserScope network diagnostics, speedtest and TLS fingerprinting.
// @author       BrowserScope Architect
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    const win = window;
    
    console.log('[BrowserScope Helper] CORS & TLS bypass helper userscript active.');

    // Announce presence to BrowserScope
    win.addEventListener('PING_CORS_HELPER', function() {
        win.dispatchEvent(new CustomEvent('PONG_CORS_HELPER'));
    });

    // Backward compatibility for TLS Fingerprint check
    win.addEventListener('PING_TLS_HELPER', function() {
        win.dispatchEvent(new CustomEvent('PONG_TLS_HELPER'));
        win.dispatchEvent(new CustomEvent('PONG_CORS_HELPER'));
    });

    // Handle generic CORS Request from BrowserScope
    win.addEventListener('CORS_REQUEST_SEND', function(e) {
        const customEvent = e;
        if (!customEvent.detail) return;
        const { id, url, method, headers, data } = customEvent.detail;
        
        GM_xmlhttpRequest({
            method: method || 'GET',
            url: url,
            headers: headers,
            data: data,
            onload: function(response) {
                win.dispatchEvent(new CustomEvent('CORS_REQUEST_RECEIVE_' + id, {
                    detail: { success: true, status: response.status, responseText: response.responseText }
                }));
            },
            onerror: function(err) {
                win.dispatchEvent(new CustomEvent('CORS_REQUEST_RECEIVE_' + id, {
                    detail: { success: false, error: 'Network error or CORS block: ' + (err.statusText || 'Unknown') }
                }));
            }
        });
    });

    // TLS Fingerprint specific endpoint
    win.addEventListener('GET_TLS_FINGERPRINT', function() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://tls.browserleaks.com/json',
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    win.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                        detail: { success: true, data: data }
                    }));
                } catch (e) {
                    win.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                        detail: { success: false, error: 'Failed to parse JSON' }
                    }));
                }
            },
            onerror: function(err) {
                win.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                    detail: { success: false, error: 'Network error in Userscript fetch' }
                }));
            }
        });
    });
})();`;
