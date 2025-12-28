// Simple utility to flatten keys for verification
// Run with ts-node if needed (Dev only)

import en from './locales/en.json';

const flattenKeys = (obj: any, prefix = ''): string[] => {
  return Object.keys(obj).reduce((acc: string[], k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      acc.push(...flattenKeys(obj[k], pre + k));
    } else {
      acc.push(pre + k);
    }
    return acc;
  }, []);
};

console.log('--- English Keys ---');
console.log(flattenKeys(en).join('\n'));
