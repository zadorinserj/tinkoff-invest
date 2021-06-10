import { createSelector } from '@reduxjs/toolkit';

const storeSelector = (store) => store.app;

export const portfolioPositionsSelector = createSelector(storeSelector, (store) => store.portfolio.positions);
export const portfolioRubleBalanceSelector = createSelector(storeSelector, (store) => store.portfolio.roubleBalance);
export const portfolioUsdBalanceSelector = createSelector(storeSelector, (store) => store.portfolio.usdBalance);
