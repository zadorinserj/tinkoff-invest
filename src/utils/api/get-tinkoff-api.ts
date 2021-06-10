import { stringifyUrl } from 'query-string';
import {
    TINKOFF_API_URL,
    TINKOFF_API_TOKEN,
    TINKOFF_ACCOUNT_ID,
} from '@constants/tinkoff-api';
import {
    Depth,
    MarketInstrument,
    Operations,
    Currencies,
    OrderBook,
} from './types';

export const getTinkoffApi = () => {
    const makeRequest = async (
        url: string,
        { method = 'get', query = {}, body }: any = {},
    ) => {
        const requestUrl = stringifyUrl({
            url: `${TINKOFF_API_URL}${url}`,
            query: {
                ...query,
                brokerAccountId: TINKOFF_ACCOUNT_ID,
            },
        });

        const response = await fetch(requestUrl, {
            method,
            headers: {
                Authorization: `Bearer ${TINKOFF_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: method === 'post' ? JSON.stringify(body) : body,
        });

        switch (response.status) {
            case 401: throw {
                status: 'Error',
                message: 'Unauthorized! Try to use valid token. https://tinkoffcreditsystems.github.io/invest-openapi/auth/',
            };

            case 429: throw {
                status: 'Error',
                message: 'Too Many Requests!',
            };

            case 200: {
                const data = await response.json();

                return data.payload;
            }

            default: return {};
        }
    };

    /** Метод для получение портфеля */
    const getPortfolio = async (): Promise<MarketInstrument[]> => {
         const response = await makeRequest('/portfolio');

         return response.positions;
    }

    /** Метод для получения валютных активов клиента */
    const getPortfolioCurrencies = async (): Promise<Currencies> => {
        const response = await makeRequest('/portfolio/currencies');

        return response.currencies;
    }

    /**
     * Метод для получение стакана
     * @param figi Figi-идентификатор инструмента
     * @param depth Глубина стакана
     */
    const getOrderBook = ({ figi, depth = 3 }: {
        figi: string,
        depth?: Depth,
    }): Promise<OrderBook> =>
        makeRequest('/market/orderbook', {
            query: { figi, depth },
        });

    /** Метод получения курса валют, по умолчанию Доллар США */
    const getCurrenciesCourse = async (figi: string): Promise<number> => {
        const response = await getOrderBook({ figi });

        return response.lastPrice;
    };

    /**
     * Метод получения информации по инструменту
     * @param params - { figi: Фиги инструмента, ticker: Тикер инструмента }
     */
    const getInstrumentInfo = async (params: { figi?: string; ticker?: string; }) => {
        return await getPortfolio()
            .then((positions) => {
                return (positions.find((position) => {
                    if ('figi' in params) {
                        return position.figi === params.figi;
                    }
                    if ('ticker' in params) {
                        return position.ticker === params.ticker;
                    }
                }) || null);
            });
    };

    /** Метод для получения всех активных заявок */
    const getActiveOrders = () => makeRequest('/orders');

    /**
     * Метод для получения исторических свечей по FIGI
     * @param from Начало временного промежутка в формате ISO 8601
     * @param to Конец временного промежутка в формате ISO 8601
     * @param figi Figi-идентификатор инструмента
     * @param interval интервал для свечи
     */
    const getCandles = ({ from, to, figi, interval = '1min', }) =>
        makeRequest('/market/candles', {
            query: { from, to, figi, interval },
        });

    /**
     * Метод для получения операций по цб по инструменту
     * @param from Начало временного промежутка в формате ISO 8601
     * @param to Конец временного промежутка в формате ISO 8601
     * @param figi Figi-идентификатор инструмента
     */
    const getOperations = ({ from, to, figi }: {
        from: string;
        to: string;
        figi?: string;
    }): Promise<Operations> =>
        makeRequest('/operations', {
            query: { from, to, figi },
        });

    return {
        getPortfolio,
        getPortfolioCurrencies,
        getCurrenciesCourse,
        getInstrumentInfo,
        getActiveOrders,
        getCandles,
        getOperations,
    };
};
