export interface DetectedExtension {
  id: string;
  name: string;
  description: string;
  detected: boolean;
  category: string;
}

export const detectExtensions = (): DetectedExtension[] => {
  const w = window as any;
  const d = document as any;

  const extensions: DetectedExtension[] = [];

  const check = (id: string, name: string, description: string, category: string, test: () => boolean) => {
    let detected = false;
    try {
      detected = test();
    } catch(e) {}
    extensions.push({ id, name, description, category, detected });
  };

  // Developer Tools
  check('react-devtools', 'React Developer Tools', 'Official React debugging extension', 'Development', () => !!w.__REACT_DEVTOOLS_GLOBAL_HOOK__);
  check('vue-devtools', 'Vue.js devtools', 'Official Vue debugging extension', 'Development', () => !!w.__VUE_DEVTOOLS_GLOBAL_HOOK__);
  check('redux-devtools', 'Redux DevTools', 'Redux state debugging', 'Development', () => !!w.__REDUX_DEVTOOLS_EXTENSION__);
  check('apollo-devtools', 'Apollo Client Devtools', 'GraphQL debugging', 'Development', () => !!w.__APOLLO_CLIENT__);
  check('ember-inspector', 'Ember Inspector', 'Ember debugging', 'Development', () => !!w.EmberEnv);

  // Crypto Wallets
  check('metamask', 'MetaMask', 'Web3 Ethereum wallet', 'Crypto', () => !!w.ethereum?.isMetaMask);
  check('phantom', 'Phantom', 'Web3 Solana wallet', 'Crypto', () => !!w.phantom?.solana?.isPhantom);
  check('binance', 'Binance Wallet', 'Web3 Binance Chain wallet', 'Crypto', () => !!w.BinanceChain);
  check('coinbase', 'Coinbase Wallet', 'Web3 Coinbase wallet', 'Crypto', () => !!w.ethereum?.isCoinbaseWallet);
  check('brave-wallet', 'Brave Wallet', 'Built-in Brave crypto wallet', 'Crypto', () => !!w.ethereum?.isBraveWallet);
  check('sui-wallet', 'Sui Wallet', 'Web3 Sui wallet', 'Crypto', () => !!w.suiWallet);
  check('ronin', 'Ronin Wallet', 'Axie Infinity Wallet', 'Crypto', () => !!w.ronin);
  check('keplr', 'Keplr', 'Cosmos Ecosystem Wallet', 'Crypto', () => !!w.keplr);
  check('petra', 'Petra', 'Aptos Wallet', 'Crypto', () => !!w.aptos);
  check('martian', 'Martian', 'Aptos/Sui Wallet', 'Crypto', () => !!w.martian);
  check('okx', 'OKX Wallet', 'Multi-chain Wallet', 'Crypto', () => !!w.okxwallet);
  check('trust', 'Trust Wallet', 'Multi-chain Wallet', 'Crypto', () => !!w.trustwallet);
  check('tronlink', 'TronLink', 'Tron Wallet', 'Crypto', () => !!w.tronWeb);
  check('tonkeeper', 'Tonkeeper', 'TON Wallet', 'Crypto', () => !!w.tonkeeper);
  check('rabby', 'Rabby Wallet', 'EVM Wallet', 'Crypto', () => !!w.rabby);
  check('uniswap', 'Uniswap Wallet', 'EVM Wallet', 'Crypto', () => !!w.uniswapWallet);
  check('bitget', 'Bitkeep / Bitget', 'Web3 Wallet', 'Crypto', () => !!w.bitkeep);

  // Shopping / Coupons
  check('honey', 'Honey', 'Automatic Coupons', 'Shopping', () => !!document.getElementById('honey-container') || !!document.querySelector('div[id^="honey-"]'));

  // Grammar / Writing
  check('grammarly', 'Grammarly', 'Writing Assistant', 'Productivity', () => document.body.hasAttribute('data-gr-ext-installed'));
  check('languagetool', 'LanguageTool', 'Writing Assistant', 'Productivity', () => document.body.hasAttribute('lt-installed'));

  // Password Managers
  check('1password', '1Password', 'Password Manager', 'Utility', () => !!document.querySelector('com-1password-button'));
  check('lastpass', 'LastPass', 'Password Manager', 'Utility', () => !!document.querySelector('[data-lp-type]'));
  check('dashlane', 'Dashlane', 'Password Manager', 'Utility', () => !!document.querySelector('[data-dashlane-rid]'));

  // Theme / UI
  check('darkreader', 'Dark Reader', 'Dark mode for websites', 'Utility', () => !!document.querySelector('meta[name="darkreader"]'));
  check('stylus', 'Stylus', 'User styles manager', 'Utility', () => document.documentElement.hasAttribute('stylus'));
  check('tampermonkey', 'Tampermonkey', 'Userscript manager', 'Utility', () => !!w.GM_info || !!w.GM);

  // Privacy / Adblock (Heuristics without fetch)
  check('brave-shields', 'Brave Shields', 'Built-in Brave Ad/Tracker Blocker', 'Privacy', () => !!(navigator as any).brave && typeof (navigator as any).brave.isBrave === 'function');
  check('ghostery', 'Ghostery', 'Tracker Blocker', 'Privacy', () => !!w.Ghostery);

  return extensions;
};
