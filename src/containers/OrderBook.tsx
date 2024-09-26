import React, { useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import OrderTable from '../components/OrderTable';
import { groupOrdersByTickSize } from '../utils/orderBookUtils';

const OrderBook: React.FC = () => {
  const [market, setMarket] = useState<'PI_XBTUSD' | 'PI_ETHUSD'>('PI_XBTUSD');
  const [groupSize, setGroupSize] = useState<number>(0.5);
  const { buyOrders, sellOrders, switchMarket, killFeed, isKilled } = useWebSocket(market);

  const handleToggleMarket = () => {
    if (market === 'PI_XBTUSD') {
      setMarket('PI_ETHUSD');
    } else {
      setMarket('PI_XBTUSD');
    }
    switchMarket(market);
  };

  const buyOrdersColumns = [
    { header: 'Total', accessor: 'total' as const },
    { header: 'Size', accessor: 'size' as const },
    { header: 'Price', accessor: 'price' as const }
  ];

  const sellOrdersColumns = [
    { header: 'Price', accessor: 'price' as const },
    { header: 'Size', accessor: 'size' as const },
    { header: 'Total', accessor: 'total' as const },
  ];

  const handleGroupSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseFloat(event.target.value);
    setGroupSize(newSize);
  };

  // Sorting the buy and sell orders
  const sortedBuyOrders = groupOrdersByTickSize([...buyOrders].sort((a, b) => b.price - a.price), groupSize);

  const sortedSellOrders = [...sellOrders]
    .sort((a, b) => a.price - b.price);

  return (
    <div>
      <h2>Orderbook - {market === 'PI_XBTUSD' ? 'XBT/USD' : 'ETH/USD'}</h2>
      <div className="controls">
        <div className="button-group">
          <button onClick={handleToggleMarket}>
            Toggle Market: {market === 'PI_XBTUSD' ? 'Switch to ETH/USD' : 'Switch to XBT/USD'}
          </button>
          <button onClick={killFeed}>
            {isKilled ? 'Restart Feed' : 'Kill Feed'}
          </button>
        </div>
        <div className="group-size">
          {/* <label>Group Size: </label>
          <select value={groupSize} onChange={handleGroupSizeChange}>
            <option value={0.5}>0.5</option>
            <option value={1}>1</option>
            <option value={2.5}>2.5</option>
          </select> */}
          <label htmlFor="group-size-select">Group Size: </label>
          <select id="group-size-select" value={groupSize} onChange={handleGroupSizeChange}>
            <option value={0.5}>0.5</option>
            <option value={1}>1</option>
            <option value={2.5}>2.5</option>
          </select>

        </div>
      </div>

      <div className="orderbook">
        <div className="buy-orders" data-testid="buy-orders-container">
          <h3>Buy Orders</h3>
          <OrderTable columns={buyOrdersColumns} data={sortedBuyOrders} />
        </div>
        <div className="sell-orders" data-testid="sell-orders-container">
          <h3>Sell Orders</h3>
          <OrderTable columns={sellOrdersColumns} data={groupOrdersByTickSize(sortedSellOrders, groupSize)} />
        </div>
      </div>

    </div>
  );
};

export default OrderBook;