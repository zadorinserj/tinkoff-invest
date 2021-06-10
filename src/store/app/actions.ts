import { getTinkoffApi } from '@utils/api';
import { Currency } from "@utils/api/types";
import { getFigiByTicker } from '@constants/common';
import { actions } from './reducer';

export const {
    savePortfolio,
    savePortfolioCurrencies,
    saveCurrenciesCourses,
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
) => async (dispatch, getStore) => {
    const response = await tinkoffApi.getOperations({
        from: new Date(firstDate).toISOString(),
        to: new Date(lastDate).toISOString(),
    });

    console.log(response);
};

export const getCurrenciesCourse = (ticker: Currency) => async (dispatch, getStore) => {
    const response = await tinkoffApi.getCurrenciesCourse(getFigiByTicker(ticker));

    dispatch(saveCurrenciesCourses({
        [ticker]: response,
    }))
};

export const updateApplication = () => async (dispatch, getStore) => {

};
