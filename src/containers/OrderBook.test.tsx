import { render, screen, fireEvent, within } from '@testing-library/react';
import OrderBook from './OrderBook';
import useWebSocket from '../hooks/useWebSocket';
import { groupOrdersByTickSize } from '../utils/orderBookUtils';

jest.mock('../hooks/useWebSocket');
jest.mock('../utils/orderBookUtils');

describe('OrderBook Component', () => {
    const mockUseWebSocket = useWebSocket as jest.Mock;
    const mockGroupOrdersByTickSize = groupOrdersByTickSize as jest.Mock;

    beforeEach(() => {
        mockUseWebSocket.mockReturnValue({
            buyOrders: [],
            sellOrders: [],
            switchMarket: jest.fn(),
            killFeed: jest.fn(),
            isKilled: false,
        });
        mockGroupOrdersByTickSize.mockImplementation((orders) => orders);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders orderbook with default market XBT/USD', () => {
        render(<OrderBook />);
        expect(screen.getByText('Orderbook - XBT/USD')).toBeInTheDocument();
    });

    test('toggles the market to ETH/USD', async () => {
        render(<OrderBook />);

        const toggleButton = await screen.findByRole('button', {
            name: /switch to eth\/usd/i,
        });

        expect(toggleButton).toBeInTheDocument();

        fireEvent.click(toggleButton);

        const newToggleButton = await screen.findByRole('button', {
            name: /switch to xbt\/usd/i,
        });

        expect(newToggleButton).toBeInTheDocument();
    });


    test('changes group size when the select input is changed', () => {
        render(<OrderBook />);

        const select = screen.getByLabelText('Group Size:');
        fireEvent.change(select, { target: { value: '2.5' } });

        expect((select as HTMLSelectElement).value).toBe('2.5');
    });

    test('kills and restarts the feed when kill button is clicked', () => {
        const killFeedMock = jest.fn();
        mockUseWebSocket.mockReturnValue({
            buyOrders: [],
            sellOrders: [],
            switchMarket: jest.fn(),
            killFeed: killFeedMock,
            isKilled: false,
        });

        render(<OrderBook />);
        const killButton = screen.getByText('Kill Feed');
        fireEvent.click(killButton);

        expect(killFeedMock).toHaveBeenCalled();
    });

    test('displays buy and sell orders correctly', () => {
        const mockBuyOrders = [
            { price: 10000, size: 1, total: 10000 },
            { price: 9999, size: 2, total: 19998 },
        ];
        const mockSellOrders = [
            { price: 10001, size: 1, total: 10001 },
            { price: 10002, size: 2, total: 20004 },
        ];

        mockUseWebSocket.mockReturnValue({
            buyOrders: mockBuyOrders,
            sellOrders: mockSellOrders,
            switchMarket: jest.fn(),
            killFeed: jest.fn(),
            isKilled: false,
        });

        render(<OrderBook />);

        // Check for buy orders
        const buyOrderPrices = screen.getAllByText('10000');
        expect(buyOrderPrices.length).toBeGreaterThan(0); // Check at least one exists

        expect(buyOrderPrices[0]).toBeInTheDocument(); // Check the first occurrence

        const sellOrderPrices = screen.getAllByText('10001');
        expect(sellOrderPrices.length).toBeGreaterThan(0);
    });
});
