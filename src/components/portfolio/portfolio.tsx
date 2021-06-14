import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import Trend from 'react-trend';

import styles from './porftolio.module.scss';

import { Container } from '../ui/container';
import { Amount } from '../ui/amount';
import { Table } from '../table';

import {
    getPortfolio,
    getOperations,
    getCurrenciesCourse,
    getCandles,
} from '@store/app/actions';
import {
    portfolioInstrumentsSelector,
    portfolioRubleBalanceSelector,
    portfolioUsdBalanceSelector,
    portfolioOperationsSelector,
    currencyCourseSelector,
} from '@store/app/selectors';

const round = (number) => Math.round(number * 100) / 100;
const withPercent = (number) => `${number} %`;

const currencyMap = {
    USD: '$',
    RUB: '₽',
};
const withCurrency = (number, currency: keyof typeof currencyMap) => `${number} ${currencyMap[currency]}`;

const cx = classNames.bind(styles);
export const Portfolio = () => {
    const dispatch = useDispatch();

    const rubleBalance = useSelector(portfolioRubleBalanceSelector);
    const usdBalance = useSelector(portfolioUsdBalanceSelector);

    useEffect(() => {
        dispatch(getPortfolio());
        dispatch(getOperations());
        dispatch(getCurrenciesCourse('USD'));
        dispatch(getCandles());
    }, []);

    const [transformedData, setTransformedData] = useState<any>([]);
    const portfolioInstruments = useSelector(portfolioInstrumentsSelector);
    const portfolioOperations = useSelector(portfolioOperationsSelector);
    const usdCourse = useSelector(currencyCourseSelector());

    const getBrokerCommission = (instrumentFigi) => {
        let commissionCurrency = 'RUB';

        const operationsByFigi = portfolioOperations
            .filter(({ figi, operationType, currency }: { figi: string; operationType: string; currency: 'RUB' | 'USD' }) => {
                if (figi === instrumentFigi && operationType === 'BrokerCommission') {
                    commissionCurrency = currency;

                    return true;
                }
            });

        return round(operationsByFigi
            .reduce((acc, { payment }) => acc + payment, 0) * (commissionCurrency === 'USD' ? usdCourse : 1) * -1);
    };

    const getDividends = (instrumentFigi: string): any => {
        let dividendCurrency = 'RUB';

        const operationsByFigi = portfolioOperations
            .filter(({ figi, operationType, currency }: { figi: string; operationType: string; currency: 'RUB' | 'USD' }) => {
                if (figi === instrumentFigi && operationType === 'Dividend') {
                    dividendCurrency = currency;

                    return true;
                }
            });

        return {
            dividends: round(operationsByFigi.reduce((acc, { payment }) => acc + payment, 0)),
            dividendCurrency,
        };
    };

    useEffect(() => {
        setTransformedData(Object.keys(portfolioInstruments).map((tickerName) => {
            const instrument = portfolioInstruments[tickerName];

            const {
                figi,
                name,
                balance,
                expectedYield: { value: expectedYield },
                averagePositionPrice: {
                    currency,
                    value: averagePrice,
                },
            } = instrument;

            const {
                dividends,
                dividendCurrency,
            } = getDividends(figi);

            const commission = getBrokerCommission(figi);

            return {
                ticker: tickerName,
                name,
                currency,
                balance,
                averagePrice: withCurrency(averagePrice, currency),
                currentPrice: withCurrency(round(averagePrice + expectedYield / balance), currency),
                yield: withPercent(round(expectedYield / (averagePrice * balance) * 100)),
                dividends: withCurrency(dividends, dividendCurrency),
                dividendsYield: withPercent(round(dividends / (averagePrice * balance) * 100)),
                commission: withCurrency(commission, 'RUB'),
            };
        }));
    }, [portfolioInstruments]);

    const columns = React.useMemo(() => [
        {
            Header: 'Тикер',
            accessor: 'ticker',
        },
        {
            Header: 'Название',
            accessor: 'name',
        },
        {
            Header: 'Валюта',
            accessor: 'currency',
        },
        {
            Header: 'Кол-во',
            accessor: 'balance',
        },
        {
            Header: 'Средняя цена',
            accessor: 'averagePrice',
        },
        {
            Header: 'Текущая цена',
            accessor: 'currentPrice',
        },
        {
            Header: 'Доходность',
            accessor: 'yield',
        },
        {
            Header: 'Дивиденды',
            accessor: 'dividends',
        },
        {
            Header: 'Доходность',
            accessor: 'dividendsYield',
        },
        {
            Header: 'Комиссии',
            accessor: 'commission',
        },
    ], []);

    return (
        <Container fullWidth>
            <div className={ styles.balance }>
                <Amount amount={ rubleBalance } />
                <Amount amount={ usdBalance } currency='USD' />
            </div>
            <Table
                columns={ columns }
                data={ transformedData }
            />
            {/*<Trend*/}
            {/*    smooth*/}
            {/*    autoDraw*/}
            {/*    autoDrawDuration={3000}*/}
            {/*    autoDrawEasing="ease-out"*/}
            {/*    data={[0,2,5,9,5,10,3,5,0,0,1,8,2,9,0]}*/}
            {/*    gradient={['#00c6ff', '#F0F', '#FF0']}*/}
            {/*    radius={10}*/}
            {/*    strokeWidth={2}*/}
            {/*    strokeLinecap={'butt'}*/}
            {/*/>*/}
        </Container>
    );
};
