export default {
  '*.{ts,tsx}': [
    'eslint --fix',
    // Passing staged file paths to `tsc --noEmit` makes it ignore
    // tsconfig.json (JSX/esModuleInterop/DOM lib all get dropped), so this
    // must run as a fixed, project-wide command instead.
    () => 'tsc --noEmit',
  ],
};
