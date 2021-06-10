export const CURRENCY_TICKER_BY_FIGI = {
    'BBG0013HGFT4': 'USD',
};

export const getTickerByFigi = (figi: keyof typeof CURRENCY_TICKER_BY_FIGI): string =>
    CURRENCY_TICKER_BY_FIGI[figi] ?? null;

export const getFigiByTicker = (ticker: string): string =>
    Object.entries(CURRENCY_TICKER_BY_FIGI)
        .find(([_, tickerName]) => ticker === tickerName)[0];
