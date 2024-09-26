import { groupOrdersByTickSize } from './orderBookUtils';
import { OrderBookLevel } from '../hooks/useWebSocket';

describe('groupOrdersByTickSize', () => {
    it('should group orders by the given tick size', () => {
        const orders: OrderBookLevel[] = [
            { price: 101, size: 1, total: 0 },
            { price: 102, size: 2, total: 0 },
            { price: 103, size: 3, total: 0 },
            { price: 104, size: 4, total: 0 },
        ];
        const tickSize = 2;
        const result = groupOrdersByTickSize(orders, tickSize);

        expect(result).toEqual([
            { price: 100, size: 1, total: 1 },
            { price: 102, size: 5, total: 6 },
            { price: 104, size: 4, total: 10 },
        ]);
    });

    it('should handle an empty order list', () => {
        const orders: OrderBookLevel[] = [];
        const tickSize = 2;
        const result = groupOrdersByTickSize(orders, tickSize);

        expect(result).toEqual([]);
    });

    it('should handle orders with the same price', () => {
        const orders: OrderBookLevel[] = [
            { price: 100, size: 1, total: 0 },
            { price: 100, size: 2, total: 0 },
        ];
        const tickSize = 1;
        const result = groupOrdersByTickSize(orders, tickSize);

        expect(result).toEqual([
            { price: 100, size: 3, total: 3 },
        ]);
    });

    it('should calculate cumulative total correctly', () => {
        const orders: OrderBookLevel[] = [
            { price: 101, size: 1, total: 0 },
            { price: 102, size: 2, total: 0 },
            { price: 103, size: 3, total: 0 },
        ];
        const tickSize = 1;
        const result = groupOrdersByTickSize(orders, tickSize);

        expect(result).toEqual([
            { price: 101, size: 1, total: 1 },
            { price: 102, size: 2, total: 3 },
            { price: 103, size: 3, total: 6 },
        ]);
    });
});