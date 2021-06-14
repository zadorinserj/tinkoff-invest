import { createSelector } from '@reduxjs/toolkit';

const storeSelector = (store) => store.app;

export const portfolioInstrumentsSelector = createSelector(storeSelector, (store) => store.portfolio.instruments);
export const portfolioRubleBalanceSelector = createSelector(storeSelector, (store) => store.portfolio.roubleBalance);
export const portfolioUsdBalanceSelector = createSelector(storeSelector, (store) => store.portfolio.usdBalance);
export const portfolioOperationsSelector = createSelector(storeSelector, (store) => store.operations);
export const currencyCourseSelector = (currency = 'USD') => createSelector(storeSelector, (store) => {
    return store.currenciesCourses[currency];
});
