import { OrderBookLevel } from "../hooks/useWebSocket";

const groupOrdersByTickSize = (orders: OrderBookLevel[], tickSize: number): OrderBookLevel[] => {
    const groupedOrders: { [key: number]: OrderBookLevel } = {};
    const orderSequence: number[] = [];

    orders.forEach(order => {
        const groupedPrice = Math.floor(order.price / tickSize) * tickSize;

        if (groupedOrders[groupedPrice]) {
            groupedOrders[groupedPrice].size += order.size;
        } else {
            groupedOrders[groupedPrice] = {
                price: groupedPrice,
                size: order.size,
                total: 0
            };
            orderSequence.push(groupedPrice);
        }
    });

    const groupedOrderArray = orderSequence.map(price => groupedOrders[price]);

    let cumulativeTotal = 0;
    groupedOrderArray.forEach(order => {
        cumulativeTotal += order.size;
        order.total = cumulativeTotal;
    });

    return groupedOrderArray;
};

export { groupOrdersByTickSize };
