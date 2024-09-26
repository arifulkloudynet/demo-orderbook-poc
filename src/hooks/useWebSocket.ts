import { useState, useEffect, useRef, useCallback } from 'react';

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

const useWebSocket = (initialMarket: 'PI_XBTUSD' | 'PI_ETHUSD') => {
  const [buyOrders, setBuyOrders] = useState<OrderBookLevel[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderBookLevel[]>([]);
  const [market, setMarket] = useState<'PI_XBTUSD' | 'PI_ETHUSD'>(initialMarket);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isKilled, setIsKilled] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);

  // clear buyOrders and sellOrders every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setBuyOrders([]);
      setSellOrders([]);
    }, 5 * 60000);

    return () => clearInterval(interval);
  }, []);

  const processDelta = useCallback((data: any) => {
    const { bids, asks } = data;
    updateOrderLevels(bids, setBuyOrders);
    updateOrderLevels(asks, setSellOrders);
  }, []);

  const connectWebSocket = useCallback((market: 'PI_XBTUSD' | 'PI_ETHUSD') => {
    if (ws.current) {
      const unsubscribeMessage = JSON.stringify({
        event: 'unsubscribe',
        feed: 'book_ui_1',
        product_ids: [market === 'PI_XBTUSD' ? 'PI_ETHUSD' : 'PI_XBTUSD'],
      });
      ws.current.send(unsubscribeMessage);
      ws.current.close();
    }

    ws.current = new WebSocket('wss://www.cryptofacilities.com/ws/v1');

    ws.current.onopen = () => {
      setIsConnected(true);
      const subscribeMessage = JSON.stringify({
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: [market],
      });
      ws.current?.send(subscribeMessage);
      setIsKilled(false);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.feed === 'book_ui_1') {
        processDelta(data);
      }
    };

    ws.current.onerror = () => {
      console.error('WebSocket error occurred');
      setIsConnected(false);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };
  }, [processDelta]); // Add processDelta to the dependency array

  useEffect(() => {
    connectWebSocket(market);

    return () => {
      ws.current?.close();
    };
  }, [market, connectWebSocket]); // Include connectWebSocket in the dependency array

  const updateOrderLevels = (
    orders: [number, number][],
    setOrders: React.Dispatch<React.SetStateAction<OrderBookLevel[]>>
  ) => {
    setOrders((prevOrders) => {
      const ordersMap = new Map(prevOrders.map(order => [order.price, order]));

      orders?.forEach(([price, size]) => {
        if (size === 0) {
          ordersMap.delete(price);
        } else {
          ordersMap.set(price, { price, size, total: 0 });
        }
      });

      return Array.from(ordersMap.values());
    });
  };

  const killFeed = () => {
    if (!isKilled && ws.current) {
      ws.current.close();
      setIsConnected(false);
      setIsKilled(true);
      console.log('Feed killed manually');

      if (ws.current.onerror) {
        ws.current.onerror(new Event('error'));
      }
    } else {
      console.log('Restarting feed...');
      setBuyOrders([]);
      setSellOrders([]);
      setIsKilled(false);
      connectWebSocket(market);
    }
  };

  const switchMarket = (newMarket: 'PI_XBTUSD' | 'PI_ETHUSD') => {
    setBuyOrders([]);
    setSellOrders([]);
    setMarket(newMarket);
  };

  return {
    buyOrders,
    sellOrders,
    switchMarket,
    killFeed,
    isKilled,
    isConnected,
  };
};

export default useWebSocket;