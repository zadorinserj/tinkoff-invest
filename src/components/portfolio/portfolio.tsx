import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import Trend from 'react-trend';

import styles from './porftolio.module.scss';

import { Container } from '../../ui/container';
import { Amount } from '../../ui/amount';

import {
    getPortfolio,
    getOperations,
    getCurrenciesCourse,
} from '@store/app/actions';
import {
    portfolioRubleBalanceSelector,
    portfolioUsdBalanceSelector,
} from '@store/app/selectors';

const cx = classNames.bind(styles);
export const Portfolio = () => {
    const dispatch = useDispatch();

    const rubleBalance = useSelector(portfolioRubleBalanceSelector);
    const usdBalance = useSelector(portfolioUsdBalanceSelector);

    useEffect(() => {
        dispatch(getPortfolio());
        dispatch(getOperations());
        dispatch(getCurrenciesCourse('USD'));
    }, []);

    return (
        <Container>
            <div className={ styles.balance }>
                <Amount amount={ rubleBalance } />
                <Amount amount={ usdBalance } currency='USD' />
            </div>
            <Trend
                smooth
                autoDraw
                autoDrawDuration={3000}
                autoDrawEasing="ease-out"
                data={[0,2,5,9,5,10,3,5,0,0,1,8,2,9,0]}
                gradient={['#00c6ff', '#F0F', '#FF0']}
                radius={10}
                strokeWidth={2}
                strokeLinecap={'butt'}
            />
        </Container>
    );
};
