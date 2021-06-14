import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    portfolio: {
        instruments: {},
        positions: null,
        roubleBalance: null,
        usdBalance: null,
    },
    portfolioCurrencies: null,
    currenciesCourses: {},
    operations: null,
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        savePortfolio: (state, { payload }) => {
            const mappedPositions = payload
                .filter(({ instrumentType }) => instrumentType === 'Stock')
                .map(({
                    balance,
                    averagePositionPrice,
                    expectedYield,
                }) => ({
                    currency: averagePositionPrice.currency,
                    quantity: (averagePositionPrice.value * balance) + expectedYield.value,
                }));

            state.portfolio.roubleBalance = Math.ceil(mappedPositions
                .filter(({ currency }) => currency === 'RUB')
                .reduce((acc, { quantity }) => acc + quantity, 0) * 100) / 100;
            state.portfolio.usdBalance = Math.ceil(mappedPositions
                .filter(({ currency }) => currency === 'USD')
                .reduce((acc, { quantity }) => acc + quantity, 0) * 100) / 100;

            payload.forEach((instrument) => {
                state.portfolio.instruments[instrument.ticker] = instrument;
            });
        },
        savePortfolioCurrencies: (state, { payload }) => {
            state.portfolioCurrencies = payload;
        },
        saveCurrenciesCourses: (state, { payload }) => {
            state.currenciesCourses = {
                ...state.currenciesCourses,
                ...payload,
            };
        },
        saveOperations: (state, { payload }) => {
            state.operations = payload.operations;
        },
    },
});

export const actions = appSlice.actions;
