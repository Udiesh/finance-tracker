import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export const SettingsProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return saved ? JSON.parse(saved) : CURRENCIES[0]; // Default INR
  });

  useEffect(() => {
    localStorage.setItem('currency', JSON.stringify(currency));
  }, [currency]);

  const changeCurrency = (currencyCode) => {
    const found = CURRENCIES.find((c) => c.code === currencyCode);
    if (found) setCurrency(found);
  };

  const formatAmount = (amount) => {
    const num = Number(amount);
    if (currency.code === 'INR') {
      return `${currency.symbol}${num.toLocaleString('en-IN')}`;
    }
    return `${currency.symbol}${num.toLocaleString('en-US')}`;
  };

  return (
    <SettingsContext.Provider value={{ currency, currencies: CURRENCIES, changeCurrency, formatAmount }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
