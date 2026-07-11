import React, { useState } from 'react';
import { Bluetooth, Usb, Search, AlertCircle, Radio, Settings2, ShieldCheck, ShieldAlert, Key, Fingerprint, Nfc } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';

interface WebDeviceModalProps {
  onClose: () => void;
  // Type inferred correctly now
  t: Translation['webDevice'];
}

interface WebDeviceItem {
  id: string;
  name: string;
  details?: string;
  raw: unknown;
}

interface WebAuthnRawCredential {
  rawId?: ArrayBuffer;
}

interface BluetoothRawDevice {
  gatt?: {
    connected?: boolean;
  };
}

export const WebDeviceModal: React.FC<WebDeviceModalProps> = ({ onClose, t }) => {
  const [activeTab, setActiveTab] = useState<'bluetooth' | 'usb' | 'serial' | 'webauthn' | 'nfc'>('usb');
  const [btRegex, setBtRegex] = useState<string>('');

  // Universal Device State
  const [usbDevices, setUsbDevices] = useState<WebDeviceItem[]>([]);
  const [btDevices, setBtDevices] = useState<WebDeviceItem[]>([]);
  const [serialDevices, setSerialDevices] = useState<WebDeviceItem[]>([]);
  const [webAuthnDevices, setWebAuthnDevices] = useState<WebDeviceItem[]>([]);
  const [nfcDevices, setNfcDevices] = useState<WebDeviceItem[]>([]);

  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentDevices = activeTab === 'usb' ? usbDevices : 
                         activeTab === 'bluetooth' ? btDevices : 
                         activeTab === 'serial' ? serialDevices : 
                         activeTab === 'webauthn' ? webAuthnDevices :
                         nfcDevices;

  const handleTabChange = (tab: 'bluetooth' | 'usb' | 'serial' | 'webauthn' | 'nfc') => {
      setActiveTab(tab);
      setError(null);
  };

  const handleError = (e: unknown, defaultMsg: string) => {
    console.error(e);
    if (!e || typeof e !== 'object') {
        setError(defaultMsg);
        return;
    }
    const errObj = e as Record<string, unknown>;
    const msgLower = (String(errObj.message || '')).toLowerCase();
    if (errObj.name === 'NotFoundError') {
        setError(t.err_not_found);
        return;
    }
    let msg = String(errObj.message || defaultMsg);
    if (errObj.name === 'NotAllowedError') {
        msg = t.err_not_allowed;
    } else if (errObj.name === 'NotSupportedError' || msgLower.includes('not supported') || msgLower.includes('not implement')) {
        msg = t.err_not_supported;
    } else if (errObj.name === 'SecurityError') {
        msg = t.err_security;
    } else if (msgLower.includes('user gesture')) {
        msg = t.err_user_gesture;
    }
    setError(msg);
  };

  // Web Bluetooth
  const scanBluetooth = async () => {
      if (!navigator.bluetooth) {
          setError(t.bt_not_supported);
          return;
      }
      setScanning(true);
      setError(null);
      try {
          const device = await navigator.bluetooth.requestDevice({
              acceptAllDevices: true,
              optionalServices: ['battery_service', 'device_information']
          });
          
          const nameToTest = device.name || '';
          // Avoid irrelevant devices by matching an optional regex
          if (btRegex.trim()) {
              try {
                  const rx = new RegExp(btRegex, 'i');
                  if (!rx.test(nameToTest)) {
                     throw new Error(`Device name "${nameToTest}" does not match regex filter`);
                  }
              } catch (regExErr: unknown) {
                  const errMsg = regExErr instanceof Error ? regExErr.message : String(regExErr);
                  throw new Error(`Regex check failed: ${errMsg}`);
              }
          } else {
              // Built-in hardcoded filtering to avoid messy irrelevant devices if no custom regex provided
              if (/^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}$/.test(nameToTest) || /^Unknown/i.test(nameToTest) || nameToTest === '') {
                  throw new Error("Filtered out irrelevant/unnamed device (MAC Address or Unknown).");
              }
          }
          setBtDevices(prev => prev.find(d => d.id === device.id) ? prev : [...prev, {
              id: device.id,
              name: device.name || 'Unnamed BT Device',
              raw: device
          }]);
      } catch (e: unknown) {
          handleError(e, 'Scan failed');
      }
      setScanning(false);
  };

  // Web USB
  const scanUsb = async () => {
      if (!navigator.usb) {
          setError(t.usb_not_supported);
          return;
      }
      setScanning(true);
      setError(null);
      try {
          const device = await navigator.usb.requestDevice({ filters: [] });
          setUsbDevices(prev => prev.find(d => d.id === (device.serialNumber || `${device.vendorId}-${device.productId}`)) ? prev : [...prev, {
              id: device.serialNumber || `${device.vendorId}-${device.productId}`,
              name: device.productName || "Unknown USB Device",
              details: `Vendor: ${device.vendorId}, Product: ${device.productId}`,
              raw: device
          }]);
      } catch (e: unknown) {
          handleError(e, 'USB request failed');
      }
      setScanning(false);
  };

  // Web Serial
  const scanSerial = async () => {
      if (!navigator.serial) {
          setError(t.serial_not_supported);
          return;
      }
      setScanning(true);
      setError(null);
      try {
          const port = await navigator.serial.requestPort();
          const info = port.getInfo();
          setSerialDevices(prev => prev.find(d => d.id === `${info.usbVendorId}-${info.usbProductId}`) ? prev : [...prev, {
              id: `${info.usbVendorId}-${info.usbProductId}`,
              name: 'Serial Port',
              details: `Vendor: ${info.usbVendorId}, Product: ${info.usbProductId}`,
              raw: port
          }]);
      } catch (e: unknown) {
          handleError(e, 'Serial port request failed');
      }
      setScanning(false);
  };

  // WebAuthn Passkeys
  const testWebAuthnReg = async () => {
      try {
          if (!window.PublicKeyCredential) throw new Error("WebAuthn not supported in this browser.");
          setScanning(true);
          setError(null);
          const challenge = new Uint8Array(32);
          window.crypto.getRandomValues(challenge);
          const userId = new Uint8Array(16);
          window.crypto.getRandomValues(userId);
          
          const credential = await navigator.credentials.create({
              publicKey: {
                  challenge,
                  rp: { name: "Browser Scope WebAuthn Test", id: window.location.hostname },
                  user: { id: userId, name: "testuser@example.com", displayName: "Test User" },
                  pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
                  authenticatorSelection: { userVerification: "preferred" },
                  timeout: 60000,
                  attestation: "none"
              }
          });
          
          if (credential) {
              setWebAuthnDevices(prev => [...prev, {
                  id: credential.id,
                  name: 'Registered Passkey (New)',
                  details: `Type: ${credential.type}`,
                  raw: credential
              }]);
          }
      } catch (e: unknown) {
          handleError(e, 'Registration failed');
      }
      setScanning(false);
  };

  const testWebAuthnAuth = async (allowedId?: ArrayBuffer) => {
      try {
          if (!window.PublicKeyCredential) throw new Error("WebAuthn not supported in this browser.");
          setScanning(true);
          setError(null);
          const challenge = new Uint8Array(32);
          window.crypto.getRandomValues(challenge);
          
          const publicKeyOpts: PublicKeyCredentialRequestOptions = {
              challenge,
              rpId: window.location.hostname,
              userVerification: "preferred",
              timeout: 60000
          };

          if (allowedId) {
              publicKeyOpts.allowCredentials = [{
                  id: allowedId,
                  type: "public-key"
              }];
          }

          const options: CredentialRequestOptions = {
              publicKey: publicKeyOpts
          };

          const credential = await navigator.credentials.get(options);
          
          if (credential) {
              setWebAuthnDevices(prev => [...prev, {
                  id: credential.id + '-auth',
                  name: 'Authenticated Passkey',
                  details: `Type: ${credential.type}`,
                  raw: credential
              }]);
          }
      } catch (e: unknown) {
          handleError(e, 'Authentication failed');
      }
      setScanning(false);
  };

  // Web NFC
  const scanNfc = async () => {
      if (!('NDEFReader' in window)) {
          setError(t.nfc_not_supported);
          return;
      }
      setScanning(true);
      setError(null);
      try {
          
          // @ts-expect-error fixed implicitly typed external libraries
          const ndef = new NDEFReader();
          await ndef.scan();
          ndef.addEventListener("reading", (event: Event) => {
              const { message, serialNumber } = event as unknown as { message: { records: { recordType: string; data?: DataView }[] }; serialNumber: string };
              setNfcDevices(prev => {
                  const existing = prev.find(d => d.id === serialNumber);
                  const newRecs = message.records.length;
                  if (existing) {
                      return prev.map(d => d.id === serialNumber ? { ...d, details: `${newRecs} records read at ${new Date().toLocaleTimeString()}` } : d);
                  }
                  return [...prev, {
                      id: serialNumber,
                      name: `NFC Tag (${serialNumber || 'Unknown'})`,
                      details: `Read ${newRecs} records`,
                      raw: message
                  }];
              });
              setScanning(false);
          });
          
          ndef.addEventListener("error", (e: Event) => {
              handleError(e, "NFC scan error");
              setScanning(false);
          });
      } catch (e: unknown) {
          handleError(e, "NFC scan failed");
          setScanning(false);
      }
  };

  const writeNfc = async () => {
      if (!('NDEFReader' in window)) {
          setError(t.nfc_not_supported);
          return;
      }
      setScanning(true);
      setError(null);
      try {
          
                    // @ts-expect-error fixed implicitly typed external libraries
                    const ndef = new NDEFReader();
          await ndef.write("Hello from BrowserScope!");
          
          setNfcDevices(prev => [...prev, {
                id: 'write-' + Date.now(),
                name: `NFC Tag Written`,
                details: `Successfully wrote test message`,
                raw: null
          }]);
      } catch (e: unknown) {
          handleError(e, "NFC write failed");
      }
      setScanning(false);
  };

  return (
    <Modal
        title={t.title}
        icon={<Usb size={24} />}
        onClose={onClose}
        size="2xl"
        fullHeight
        noPadding
    >
        {/* Tabs */}
        <div className="flex bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 shrink-0">
            <button onClick={() => handleTabChange('usb')} className={`flex-1 py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'usb' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Usb size={16} /> {t.tab_usb}
            </button>
            <button onClick={() => handleTabChange('bluetooth')} className={`flex-1 py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'bluetooth' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Bluetooth size={16} /> {t.tab_bluetooth}
            </button>
            <button onClick={() => handleTabChange('serial')} className={`flex-1 py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'serial' ? 'text-amber-600 border-b-2 border-amber-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Settings2 size={16} /> {t.tab_serial}
            </button>
            <button onClick={() => handleTabChange('webauthn')} className={`flex-1 py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'webauthn' ? 'text-purple-600 border-b-2 border-purple-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Key size={16} /> {t.tab_webauthn}
            </button>
            <button onClick={() => handleTabChange('nfc')} className={`flex-1 py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'nfc' ? 'text-rose-600 border-b-2 border-rose-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Nfc size={16} /> {t.tab_nfc}
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto flex flex-col h-full">
            {activeTab === 'webauthn' && window.self !== window.top && (
                <div className="mb-6 mx-auto max-w-md p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl flex items-start gap-3 text-sm border border-orange-100 dark:border-orange-900/50">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div>
                        {t.msg_sandbox_webauthn}
                    </div>
                </div>
            )}

            {activeTab === 'bluetooth' && (
                <div className="max-w-md mx-auto w-full mb-6">
                    <input 
                        type="text" 
                        value={btRegex}
                        onChange={(e) => setBtRegex(e.target.value)}
                        placeholder={t.regex_placeholder}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm placeholder:text-slate-400"
                    />
                </div>
            )}

            <div className={`flex justify-center mb-6 ${activeTab === 'webauthn' || activeTab === 'nfc' ? 'gap-4 max-w-md mx-auto w-full flex-col sm:flex-row' : ''}`}>
                {activeTab === 'webauthn' ? (
                    <>
                        <button 
                            onClick={testWebAuthnReg}
                            disabled={scanning}
                            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {scanning ? <Radio className="animate-pulse" /> : <Fingerprint />}
                            {t.btn_req_webauthn_reg}
                        </button>
                        <button 
                            onClick={() => testWebAuthnAuth()}
                            disabled={scanning}
                            className="flex-1 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-200 dark:shadow-fuchsia-900/30 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {scanning ? <Radio className="animate-pulse" /> : <Key />}
                            {t.btn_req_webauthn_auth}
                        </button>
                    </>
                ) : activeTab === 'nfc' ? (
                    <>
                        <button 
                            onClick={scanNfc}
                            disabled={scanning}
                            className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 dark:shadow-rose-900/30 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {scanning ? <Radio className="animate-pulse" /> : <Search />}
                            {t.btn_req_nfc_scan}
                        </button>
                        <button 
                            onClick={writeNfc}
                            disabled={scanning}
                            className="flex-1 px-6 py-3 bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-200 dark:shadow-pink-900/30 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {scanning ? <Radio className="animate-pulse" /> : <Nfc />}
                            {t.btn_req_nfc_write}
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={
                            activeTab === 'bluetooth' ? scanBluetooth : 
                            activeTab === 'usb' ? scanUsb : scanSerial
                        }
                        disabled={scanning}
                        className={`px-6 py-3 text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed ${
                            activeTab === 'usb' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-emerald-900/30' :
                            activeTab === 'bluetooth' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/30' :
                            'bg-amber-600 hover:bg-amber-700 shadow-amber-200 dark:shadow-amber-900/30'
                        }`}
                    >
                        {scanning ? <Radio className="animate-pulse" /> : <Search />}
                        {scanning ? t.btn_scanning : activeTab === 'usb' ? t.btn_req_usb : activeTab === 'bluetooth' ? t.btn_req_bt : t.btn_req_serial}
                    </button>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm mb-4">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 font-semibold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    {t.auth_devices}
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {currentDevices.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                            <ShieldAlert size={32} className="opacity-20" />
                            {t.auth_required}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {currentDevices.map((dev, idx) => {
                                const webauthnRaw = dev.raw as WebAuthnRawCredential | undefined;
                                const bluetoothRaw = dev.raw as BluetoothRawDevice | undefined;
                                return (
                                    <div
                                        key={dev.id || idx}
                                        className={`p-3 rounded-lg flex items-center justify-between border transition-all ${activeTab === 'webauthn' && webauthnRaw?.rawId ? 'hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer border-purple-200 dark:border-purple-800' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-slate-100 dark:border-slate-700'}`}
                                        onClick={() => {
                                            if (activeTab === 'webauthn' && webauthnRaw?.rawId && dev.name === 'Registered Passkey (New)') {
                                                testWebAuthnAuth(webauthnRaw.rawId);
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${
                                                activeTab === 'usb' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' :
                                                activeTab === 'bluetooth' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' :
                                                activeTab === 'webauthn' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-500' :
                                                activeTab === 'nfc' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' :
                                                'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
                                            }`}>
                                                {activeTab === 'usb' && <Usb size={16} />}
                                                {activeTab === 'bluetooth' && <Bluetooth size={16} />}
                                                {activeTab === 'serial' && <Settings2 size={16} />}
                                                {activeTab === 'webauthn' && <Key size={16} />}
                                                {activeTab === 'nfc' && <Nfc size={16} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">{dev.name}</div>
                                                <div className="text-xs text-slate-400 font-mono">
                                                    {dev.details || dev.id}
                                                </div>
                                            </div>
                                        </div>
                                        {bluetoothRaw?.gatt?.connected && (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] rounded-full font-bold">Connected</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </Modal>
  );
};
