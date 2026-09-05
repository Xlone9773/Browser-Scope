export type ExtensionCategory =
  | 'Development'
  | 'Crypto'
  | 'Security & Privacy'
  | 'Password Managers'
  | 'Productivity & AI'
  | 'Customization'
  | 'Shopping';

export type DetectionMethod =
  | 'global_object'
  | 'dom_marker'
  | 'browser_api'
  | 'style_inject';

export interface DetectedExtension {
  id: string;
  name: string;
  description: string;
  detected: boolean;
  category: ExtensionCategory;
  method: DetectionMethod;
}

type WindowWithExtensions = Window & {
  // DevTools
  __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown;
  __VUE_DEVTOOLS_GLOBAL_HOOK__?: unknown;
  __REDUX_DEVTOOLS_EXTENSION__?: unknown;
  __APOLLO_CLIENT__?: unknown;
  __ANGULAR_DEVTOOLS_GLOBAL_HOOK__?: unknown;
  __SVELTE_DEVTOOLS_GLOBAL_HOOK__?: unknown;
  EmberEnv?: unknown;
  ng?: { probe?: unknown };
  pm?: unknown;
  __wappalyzer?: unknown;
  __whatruns?: unknown;

  // Crypto Wallets
  ethereum?: {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isBraveWallet?: boolean;
    isRabby?: boolean;
    isTrust?: boolean;
    isRainbow?: boolean;
    isZerion?: boolean;
    isTokenPocket?: boolean;
    isBitKeep?: boolean;
  };
  solana?: {
    isPhantom?: boolean;
  };
  phantom?: {
    solana?: {
      isPhantom?: boolean;
    };
  };
  BinanceChain?: unknown;
  suiWallet?: unknown;
  __sui__?: unknown;
  ronin?: unknown;
  keplr?: unknown;
  aptos?: unknown;
  petra?: unknown;
  martian?: unknown;
  okxwallet?: unknown;
  trustwallet?: unknown;
  tronWeb?: unknown;
  tronLink?: unknown;
  tonkeeper?: unknown;
  ton?: unknown;
  rabby?: unknown;
  uniswapWallet?: unknown;
  bitkeep?: unknown;
  backpack?: unknown;
  solflare?: { isSolflare?: boolean };
  injectedWeb3?: Record<string, unknown>;

  // Userscripts
  GM_info?: { scriptHandler?: string };
  GM?: unknown;
  Tampermonkey?: unknown;
  VM?: unknown;

  // Privacy & AdBlockers
  Ghostery?: unknown;
  __ghostery__?: unknown;
  __adguard?: unknown;
  adguard?: unknown;
  privacyBadger?: unknown;
  __pb_injected__?: unknown;
  duckduckgo?: unknown;
  __CanvasBlocker__?: unknown;
  __fingerprint_defender__?: unknown;
  __clearurls__?: unknown;
  noscript?: unknown;

  // Productivity & AI
  __IMMERSIVE_TRANSLATE__?: unknown;
  __notion_clipper__?: unknown;
  Evernote?: unknown;
  Pocket?: unknown;

  // Password Managers
  __OP_EXT__?: unknown;
};

export const detectExtensions = (): DetectedExtension[] => {
  const w = (typeof window !== 'undefined' ? window : {}) as WindowWithExtensions;
  const doc = typeof document !== 'undefined' ? document : null;

  const extensions: DetectedExtension[] = [];

  const check = (
    id: string,
    name: string,
    description: string,
    category: ExtensionCategory,
    method: DetectionMethod,
    test: () => boolean
  ) => {
    let detected: boolean;
    try {
      detected = test();
    } catch {
      detected = false;
    }
    extensions.push({ id, name, description, category, method, detected });
  };

  const hasDom = (selector: string): boolean => {
    if (!doc) return false;
    try {
      return !!doc.querySelector(selector);
    } catch {
      return false;
    }
  };

  const hasBodyAttr = (attr: string): boolean => {
    if (!doc?.body) return false;
    try {
      return doc.body.hasAttribute(attr);
    } catch {
      return false;
    }
  };

  const hasDocAttr = (attr: string): boolean => {
    if (!doc?.documentElement) return false;
    try {
      return doc.documentElement.hasAttribute(attr);
    } catch {
      return false;
    }
  };

  // ================= 1. Developer Tools =================
  check('react-devtools', 'React Developer Tools', 'Official React debugging extension', 'Development', 'global_object', () => !!w.__REACT_DEVTOOLS_GLOBAL_HOOK__);
  check('vue-devtools', 'Vue.js devtools', 'Official Vue debugging extension', 'Development', 'global_object', () => !!w.__VUE_DEVTOOLS_GLOBAL_HOOK__);
  check('redux-devtools', 'Redux DevTools', 'Redux state debugging', 'Development', 'global_object', () => !!w.__REDUX_DEVTOOLS_EXTENSION__);
  check('apollo-devtools', 'Apollo Client Devtools', 'GraphQL debugging', 'Development', 'global_object', () => !!w.__APOLLO_CLIENT__);
  check('angular-devtools', 'Angular DevTools', 'Angular application inspection', 'Development', 'global_object', () => !!w.__ANGULAR_DEVTOOLS_GLOBAL_HOOK__ || !!w.ng?.probe);
  check('svelte-devtools', 'Svelte DevTools', 'Svelte component inspection', 'Development', 'global_object', () => !!w.__SVELTE_DEVTOOLS_GLOBAL_HOOK__);
  check('ember-inspector', 'Ember Inspector', 'Ember debugging', 'Development', 'global_object', () => !!w.EmberEnv);
  check('postman-interceptor', 'Postman Interceptor', 'HTTP request capture & proxying', 'Development', 'dom_marker', () => hasDom('[id^="postman-"]') || !!w.pm);
  check('json-viewer', 'JSON Formatter / Viewer', 'Formatted JSON document rendering', 'Development', 'dom_marker', () => hasDom('.json-formatter-container, #json-formatter, .json-viewer, [data-json-viewer]'));
  check('wappalyzer', 'Wappalyzer', 'Technology profiler & stack analyzer', 'Development', 'global_object', () => !!w.__wappalyzer || hasDom('meta[name="wappalyzer"]'));
  check('whatruns', 'WhatRuns', 'Web technologies discovery tool', 'Development', 'global_object', () => !!w.__whatruns);

  // ================= 2. Security & Privacy =================
  check('brave-shields', 'Brave Shields', 'Built-in Brave ad & tracker protection', 'Security & Privacy', 'browser_api', () => !!(navigator as unknown as { brave?: { isBrave?: () => boolean } }).brave && typeof (navigator as unknown as { brave?: { isBrave?: () => boolean } }).brave?.isBrave === 'function');
  check('adguard', 'AdGuard AdBlocker', 'Ad blocking and privacy protection', 'Security & Privacy', 'global_object', () => !!w.__adguard || !!w.adguard || hasDom('adguard-root, [data-adguard], #adguard-assistant-container'));
  check('ghostery', 'Ghostery', 'Tracker and ad blocking', 'Security & Privacy', 'global_object', () => !!w.Ghostery || !!w.__ghostery__ || hasDom('ghostery-bubble-root, [id^="ghostery-"]'));
  check('privacy-badger', 'Privacy Badger', 'EFF intelligent tracker blocker', 'Security & Privacy', 'global_object', () => !!w.privacyBadger || !!w.__pb_injected__);
  check('duckduckgo', 'DuckDuckGo Privacy Essentials', 'Tracker blocking & encrypted search', 'Security & Privacy', 'dom_marker', () => !!w.duckduckgo || hasDom('[data-ddg-autofill], [data-ddg-installed]'));
  check('canvas-blocker', 'CanvasBlocker / Fingerprint Defender', 'Canvas & WebGL noise injection', 'Security & Privacy', 'global_object', () => !!w.__CanvasBlocker__ || !!w.__fingerprint_defender__ || hasDom('[data-fingerprint-defender]'));
  check('clearurls', 'ClearURLs', 'Tracking element stripping from URLs', 'Security & Privacy', 'global_object', () => !!w.__clearurls__);
  check('noscript', 'NoScript', 'JavaScript whitelist controller', 'Security & Privacy', 'dom_marker', () => !!w.noscript || hasDom('noscript-elem'));

  // ================= 3. Password Managers =================
  check('bitwarden', 'Bitwarden', 'Open source password manager', 'Password Managers', 'dom_marker', () => hasDom('div[id^="bitwarden-"], [data-bwautofill], [data-bitwarden-watching], [data-bw-input], bitwarden-inline-menu'));
  check('1password', '1Password', 'Password and passkey manager', 'Password Managers', 'dom_marker', () => !!w.__OP_EXT__ || hasDom('com-1password-button, op-vault-menu, [data-onepassword-root], [data-1p-ignore]'));
  check('lastpass', 'LastPass', 'Password manager & vault', 'Password Managers', 'dom_marker', () => hasDom('[data-lp-type], [data-lastpass-root], [data-lastpass-icon-root], #lp-pom-root'));
  check('dashlane', 'Dashlane', 'Password manager & credential filler', 'Password Managers', 'dom_marker', () => hasDom('dashlane-wrapper, [data-dashlane-rid], [data-dashlane-classification]'));
  check('proton-pass', 'Proton Pass', 'Encrypted password & alias manager', 'Password Managers', 'dom_marker', () => hasDom('protonpass-root, [data-protonpass-root], [data-protonpass-inline-icon]'));
  check('nordpass', 'NordPass', 'Encrypted credential vault', 'Password Managers', 'dom_marker', () => hasDom('nordpass-root, [data-nordpass-root], [data-np-autofill]'));
  check('keeper', 'Keeper Security', 'Cybersecurity password vault', 'Password Managers', 'dom_marker', () => hasDom('keeper-lock, [data-keeper-root], [data-keeper-autofill]'));
  check('roboform', 'RoboForm', 'Form and password filler', 'Password Managers', 'dom_marker', () => hasDom('rf-icon-root, [data-roboform-root], [data-rf-autofill]'));
  check('enpass', 'Enpass', 'Offline-first password manager', 'Password Managers', 'dom_marker', () => hasDom('enpass-root, [data-enpass-root], [data-enpass-installed]'));
  check('keepassxc', 'KeePassXC-Browser', 'Local KeePass integration', 'Password Managers', 'dom_marker', () => hasDom('keepassxc-browser, [data-keepassxc-installed]'));

  // ================= 4. Productivity & AI Assistants =================
  check('immersive-translate', 'Immersive Translate', 'Bilingual translation assistant', 'Productivity & AI', 'dom_marker', () => !!w.__IMMERSIVE_TRANSLATE__ || hasDom('immersive-translate-root, [data-immersive-translate-root]') || hasDocAttr('data-immersive-translate-effect'));
  check('grammarly', 'Grammarly', 'AI writing and grammar assistant', 'Productivity & AI', 'dom_marker', () => hasBodyAttr('data-gr-ext-installed') || hasBodyAttr('data-new-gr-c-s-check-loaded') || hasDom('grammarly-desktop-integration, grammarly-extension, [data-gr-ext-installed]'));
  check('languagetool', 'LanguageTool', 'Multilingual grammar checker', 'Productivity & AI', 'dom_marker', () => hasBodyAttr('lt-installed') || hasDom('lt-div, lt-mirror, [lt-installed]'));
  check('deepl', 'DeepL Translate', 'High-accuracy neural translator', 'Productivity & AI', 'dom_marker', () => hasDom('deepl-inline-translate, deepl-input-controller, [data-deepl-installed]'));
  check('monica', 'Monica AI', 'All-in-one AI copilot (GPT-4/Claude)', 'Productivity & AI', 'dom_marker', () => hasDom('monica-root, #monica-content-root, [data-monica-installed]'));
  check('sider', 'Sider (ChatGPT Sidebar)', 'Sidebar AI assistant & chat copilot', 'Productivity & AI', 'dom_marker', () => hasDom('sider-root, [id^="chathub-"], [data-sider-installed]'));
  check('merlin', 'Merlin AI', '1-Click AI summarizer & chat', 'Productivity & AI', 'dom_marker', () => hasDom('merlin-component, [id^="merlin-"]'));
  check('maxai', 'MaxAI.me', 'Generative AI web copilot', 'Productivity & AI', 'dom_marker', () => hasDom('maxai-root, [data-maxai-root]'));
  check('liner', 'Liner AI', 'AI highlighter & web researcher', 'Productivity & AI', 'dom_marker', () => hasDom('liner-root, [id^="liner-"]'));
  check('harpa', 'HARPA AI', 'AI web automation & monitor', 'Productivity & AI', 'dom_marker', () => hasDom('harpa-app, [data-harpa-installed]'));
  check('notion-clipper', 'Notion Web Clipper', 'Capture web content into Notion workspace', 'Productivity & AI', 'global_object', () => !!w.__notion_clipper__ || hasDom('[id^="notion-clipper-"]'));
  check('evernote-clipper', 'Evernote Web Clipper', 'Clip web articles to Evernote', 'Productivity & AI', 'global_object', () => !!w.Evernote || hasDom('#evernote-clipper, [id^="en-clipper-"]'));
  check('pocket', 'Save to Pocket', 'Read-it-later content saver', 'Productivity & AI', 'global_object', () => !!w.Pocket || hasDom('#pocket-extension-root, [id^="pocket-"]'));
  check('obsidian-clipper', 'Obsidian / MarkDownload', 'Markdown content saver for Obsidian', 'Productivity & AI', 'dom_marker', () => hasDom('[data-markdownload-installed], [data-obsidian-clipper]'));
  check('scribe', 'Scribe', 'Automated process documenter & SOP guide', 'Productivity & AI', 'dom_marker', () => hasDom('[data-scribe-installed], scribe-root'));

  // ================= 5. Web3 & Crypto Wallets =================
  check('metamask', 'MetaMask', 'EVM Web3 Ethereum wallet', 'Crypto', 'global_object', () => !!(w.ethereum?.isMetaMask && !w.ethereum?.isBraveWallet && !w.ethereum?.isCoinbaseWallet && !w.ethereum?.isRabby && !w.rabby));
  check('phantom', 'Phantom', 'Solana, Ethereum & Polygon wallet', 'Crypto', 'global_object', () => !!w.phantom?.solana?.isPhantom || !!w.solana?.isPhantom);
  check('coinbase', 'Coinbase Wallet', 'Web3 self-custody wallet', 'Crypto', 'global_object', () => !!w.ethereum?.isCoinbaseWallet);
  check('brave-wallet', 'Brave Wallet', 'Native browser crypto wallet', 'Crypto', 'global_object', () => !!w.ethereum?.isBraveWallet);
  check('rabby', 'Rabby Wallet', 'Game-changing EVM Web3 wallet', 'Crypto', 'global_object', () => !!w.rabby || !!w.ethereum?.isRabby);
  check('okx', 'OKX Wallet', 'Universal multi-chain crypto wallet', 'Crypto', 'global_object', () => !!w.okxwallet);
  check('trust', 'Trust Wallet', 'Multi-asset crypto wallet', 'Crypto', 'global_object', () => !!w.trustwallet || !!w.ethereum?.isTrust);
  check('binance', 'Binance Wallet', 'BNB Chain & EVM Web3 wallet', 'Crypto', 'global_object', () => !!w.BinanceChain);
  check('sui-wallet', 'Sui Wallet', 'Official Sui ecosystem wallet', 'Crypto', 'global_object', () => !!w.suiWallet || !!w.__sui__);
  check('ronin', 'Ronin Wallet', 'Ronin network & gaming wallet', 'Crypto', 'global_object', () => !!w.ronin);
  check('keplr', 'Keplr', 'Interchain Cosmos ecosystem wallet', 'Crypto', 'global_object', () => !!w.keplr);
  check('petra', 'Petra Aptos Wallet', 'Official Aptos blockchain wallet', 'Crypto', 'global_object', () => !!w.aptos || !!w.petra);
  check('martian', 'Martian Wallet', 'Aptos & Sui ecosystem wallet', 'Crypto', 'global_object', () => !!w.martian);
  check('tronlink', 'TronLink', 'Official TRON blockchain wallet', 'Crypto', 'global_object', () => !!w.tronWeb || !!w.tronLink);
  check('tonkeeper', 'Tonkeeper', 'TON blockchain wallet', 'Crypto', 'global_object', () => !!w.tonkeeper || !!w.ton);
  check('uniswap', 'Uniswap Wallet', 'Official Uniswap EVM wallet', 'Crypto', 'global_object', () => !!w.uniswapWallet);
  check('bitget', 'Bitget / BitKeep', 'Decentralized multi-chain Web3 wallet', 'Crypto', 'global_object', () => !!w.bitkeep || !!w.ethereum?.isBitKeep);
  check('rainbow', 'Rainbow Wallet', 'Fun & simple Ethereum wallet', 'Crypto', 'global_object', () => !!w.ethereum?.isRainbow);
  check('zerion', 'Zerion Wallet', 'Smart Web3 portfolio & wallet', 'Crypto', 'global_object', () => !!w.ethereum?.isZerion);
  check('backpack', 'Backpack Wallet', 'Next-gen Solana & xNFT wallet', 'Crypto', 'global_object', () => !!w.backpack);
  check('solflare', 'Solflare Wallet', 'Non-custodial Solana wallet', 'Crypto', 'global_object', () => !!w.solflare?.isSolflare);
  check('subwallet', 'SubWallet', 'Polkadot, Kusama & Substrate wallet', 'Crypto', 'global_object', () => !!w.injectedWeb3?.['subwallet-js']);

  // ================= 6. Customization & Script Managers =================
  check('tampermonkey', 'Tampermonkey', 'World most popular userscript manager', 'Customization', 'global_object', () => !!w.Tampermonkey || (!!w.GM_info && (w.GM_info.scriptHandler === 'Tampermonkey' || !w.GM_info.scriptHandler)));
  check('violentmonkey', 'Violentmonkey', 'Open-source userscript manager', 'Customization', 'global_object', () => !!w.VM || (!!w.GM_info && w.GM_info.scriptHandler === 'Violentmonkey'));
  check('greasemonkey', 'Greasemonkey', 'Classic Firefox userscript extension', 'Customization', 'global_object', () => !!w.GM_info && w.GM_info.scriptHandler === 'Greasemonkey');
  check('scriptcat', 'ScriptCat', 'Next-generation userscript engine', 'Customization', 'global_object', () => !!w.GM_info && w.GM_info.scriptHandler === 'ScriptCat');
  check('stylus', 'Stylus', 'Custom CSS user style manager', 'Customization', 'dom_marker', () => hasDocAttr('stylus') || hasDom('style[id^="stylus-"]'));
  check('stylebot', 'Stylebot', 'Interactive CSS editor and restyler', 'Customization', 'dom_marker', () => hasDom('#stylebot-container, [id^="stylebot-"]'));
  check('darkreader', 'Dark Reader', 'Dynamic dark mode engine for all websites', 'Customization', 'style_inject', () => hasDom('meta[name="darkreader"]') || hasDocAttr('data-darkreader-mode') || hasDom('.darkreader'));

  // ================= 7. Shopping & Coupons =================
  check('honey', 'PayPal Honey', 'Automatic coupons and cash back rewards', 'Shopping', 'dom_marker', () => hasDom('#honey-container, div[id^="honey-"], #honeyContainer, [data-honey-installed]'));
  check('rakuten', 'Rakuten Cash Back', 'Cash back & promo code finder', 'Shopping', 'dom_marker', () => hasDom('[id^="rakuten-"], #ebates-cash-back-container, [data-rakuten-installed]'));
  check('capitalone', 'Capital One Shopping', 'Price comparison and automated coupon test', 'Shopping', 'dom_marker', () => hasDom('#wikibuy-holder, [id^="capitalone-"], [id^="wikibuy-"]'));
  check('keepa', 'Keepa Amazon Price Tracker', 'Amazon price history and alert tracker', 'Shopping', 'dom_marker', () => hasDom('#keepaContainer, [id^="keepa_"]'));
  check('camelizer', 'The Camelizer', 'CamelCamelCamel Amazon price watcher', 'Shopping', 'dom_marker', () => hasDom('#camelizerContainer, [id^="camelizer-"]'));
  check('aliprice', 'AliPrice', 'AliExpress & shopping price history tracker', 'Shopping', 'dom_marker', () => hasDom('[id^="aliprice-"], [data-aliprice-installed]'));

  return extensions;
};

