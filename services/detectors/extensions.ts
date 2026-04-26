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

  // Shopping / Coupons
  check('honey', 'Honey', 'Automatic Coupons', 'Shopping', () => !!document.getElementById('honey-container') || !!document.querySelector('div[id^="honey-"]'));

  // Grammar / Writing
  check('grammarly', 'Grammarly', 'Writing Assistant', 'Productivity', () => document.body.hasAttribute('data-gr-ext-installed'));

  // Utility
  check('darkreader', 'Dark Reader', 'Dark mode for websites', 'Utility', () => !!document.querySelector('meta[name="darkreader"]'));

  return extensions;
};
