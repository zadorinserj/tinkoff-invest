import { getTinkoffApi } from '@utils/api';
import { Currency } from "@utils/api/types";
import { getFigiByTicker } from '@constants/common';
import { actions } from './reducer';

export const {
    savePortfolio,
    savePortfolioCurrencies,
    saveCurrenciesCourses,
    saveOperations,
} = actions;

const tinkoffApi = getTinkoffApi();

export const getPortfolio = () => async (dispatch, getStore) => {
    const response = await tinkoffApi.getPortfolio();

    dispatch(savePortfolio(response));
};

/**
 * Метод запроса истории операций
 * @param firstDate - Дата начала - формат 01.01.2020 00:00:00 (время не обязательно)
 * @param lastDate - Дата конца - формат 01.01.2020 00:00:00 (время не обязательно)
 */
export const getOperations = (
    firstDate: string = '01.01.2020',
    lastDate: string = '01.01.2025',
) => async (dispatch) => {
    const operations = await tinkoffApi.getOperations({
        from: new Date(firstDate).toISOString(),
        to: new Date(lastDate).toISOString(),
    });

    dispatch(saveOperations(operations))
};

export const getCurrenciesCourse = (ticker: Currency) => async (dispatch, getStore) => {
    const response = await tinkoffApi.getCurrenciesCourse(getFigiByTicker(ticker));

    dispatch(saveCurrenciesCourses({
        [ticker]: response,
    }))
};

export const getCandles = () => async (dispatch, getStore) => {
    const from = new Date('01.01.2018');
    const to = new Date(Date.now());

    const response = await tinkoffApi.getCandles({
        from: from.toISOString(),
        to: to.toISOString(),
        figi: 'BBG000DHPN63',
        interval: 'month',
    });

    console.log(response);
};

export const updateApplication = () => async (dispatch, getStore) => {

};
