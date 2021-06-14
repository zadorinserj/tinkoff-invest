import React from 'react';
import classNames from 'classnames/bind';

import styles from './container.module.scss';
import { ContainerProps } from './types';

const cx = classNames.bind(styles);
export const Container = ({
    className = '',
    fullWidth = false,
    children,
}: ContainerProps) => {
    return (
        <div className={ cx(styles.container, className, { fullWidth }) }>
            { children }
        </div>
    )
};
