import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './amount.module.scss';
import { AmountProps } from './types';

const CURRENCY_SYMBOL = {
    'RUR': '₽',
    'USD': '$',
};

const cx = classNames.bind(styles);
export const Amount = React.memo(({
    className = '',
    amount,
    currency = 'RUR',
}: AmountProps) => {
    const [wholePart, setWholePart] = useState<string>('');
    const [fractionalPart, setFractionalPart] = useState<string>('');

    useEffect(() => {
        if (amount !== undefined && amount !== null) {
            const stringedAmount = amount.toString();
            const [whole, fractional = null] = stringedAmount.split('.');

            setWholePart(whole);

            if (fractional) {
                setFractionalPart(`,${fractional}`);
            }
        }
    }, [amount]);

    if (!amount) {
        return null;
    }

    return (
        <div className={ cx(styles.amount, className) }>
            <span className={ styles.wholePart }>
                { wholePart }
            </span>
            { fractionalPart.length > 0 && (
                <span className={ styles.fractionalPart }>
                    { fractionalPart }
                </span>
            ) }
            <span className={ styles.currencyPart }>
                &nbsp;
                { CURRENCY_SYMBOL[currency] }
            </span>
        </div>
    );
});
