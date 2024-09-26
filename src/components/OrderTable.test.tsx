import { render } from '@testing-library/react';
import OrderTable from './OrderTable';
import { OrderBookLevel } from '../hooks/useWebSocket';

describe('OrderTable', () => {
    const columns: { header: string; accessor: keyof OrderBookLevel }[] = [
        { header: 'Price', accessor: 'price' },
        { header: 'Size', accessor: 'size' },
    ];

    const data: OrderBookLevel[] = [
        { price: 100, size: 1, total: 100 },
        { price: 101, size: 2, total: 202 },
    ];

    it('renders table headers correctly', () => {
        const { getByText } = render(<OrderTable columns={columns} data={data} />);
        columns.forEach(column => {
            expect(getByText(column.header)).toBeInTheDocument();
        });
    });

    it('renders table data correctly', () => {
        const { getByText } = render(<OrderTable columns={columns} data={data} />);
        data.forEach(row => {
            columns.forEach(column => {
                expect(getByText(row[column.accessor].toString())).toBeInTheDocument();
            });
        });
    });
});