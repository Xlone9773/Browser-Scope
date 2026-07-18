export const USERSCRIPT_CODE = `// ==UserScript==
// @name         BrowserScope Comprehensive CORS & TLS Bypass Helper
// @namespace    https://browserleaks.com/
// @version      2.0
// @description  Bypass CORS for BrowserScope network diagnostics, speedtest and TLS fingerprinting.
// @author       BrowserScope Architect
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // Announce presence to BrowserScope
    window.addEventListener('PING_CORS_HELPER', function() {
        window.dispatchEvent(new CustomEvent('PONG_CORS_HELPER'));
    });

    // Backward compatibility for TLS Fingerprint check
    window.addEventListener('PING_TLS_HELPER', function() {
        window.dispatchEvent(new CustomEvent('PONG_TLS_HELPER'));
        window.dispatchEvent(new CustomEvent('PONG_CORS_HELPER'));
    });

    // Handle generic CORS Request from BrowserScope
    window.addEventListener('CORS_REQUEST_SEND', function(e) {
        if (!e.detail) return;
        const { id, url, method, headers, data } = e.detail;
        GM_xmlhttpRequest({
            method: method || 'GET',
            url: url,
            headers: headers,
            data: data,
            onload: function(response) {
                window.dispatchEvent(new CustomEvent('CORS_REQUEST_RECEIVE_' + id, {
                    detail: { success: true, status: response.status, responseText: response.responseText }
                }));
            },
            onerror: function(err) {
                window.dispatchEvent(new CustomEvent('CORS_REQUEST_RECEIVE_' + id, {
                    detail: { success: false, error: 'Network error or CORS block: ' + (err.statusText || 'Unknown') }
                }));
            }
        });
    });

    // TLS Fingerprint specific endpoint
    window.addEventListener('GET_TLS_FINGERPRINT', function() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://tls.browserleaks.com/json',
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    window.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                        detail: { success: true, data: data }
                    }));
                } catch (e) {
                    window.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                        detail: { success: false, error: 'Failed to parse JSON' }
                    }));
                }
            },
            onerror: function(err) {
                window.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                    detail: { success: false, error: 'Network error in Userscript fetch' }
                }));
            }
        });
    });
})();`;
