import React from 'react';
import { useTable } from 'react-table';
import classNames from 'classnames';

import styles from './table.module.scss';

type Columns = {
    Header: string;
    accessor: string;
};

type TableProps = {
    columns: Columns[];
    data: any;
};

const cx = classNames.bind(styles);
export const Table = ({ columns, data }: TableProps) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    return (
        <table { ...getTableProps() }>
            <thead>
            { headerGroups.map((headerGroup) => (
                <tr { ...headerGroup.getHeaderGroupProps() }>
                    { headerGroup.headers.map((column) => (
                        <th { ...column.getHeaderProps() } className={ cx(styles.header) }>
                            { column.render('Header') }
                        </th>
                    )) }
                </tr>
            )) }
            </thead>
            <tbody { ...getTableBodyProps() }>
            { rows.map((row, i) => {
                prepareRow(row);

                return (
                    <tr { ...row.getRowProps() }>
                        { row.cells.map((cell) => (
                            <td { ...cell.getCellProps() }>
                                { cell.render('Cell') }
                            </td>
                        )) }
                    </tr>
                )
            }) }
            </tbody>
        </table>
    );
};
