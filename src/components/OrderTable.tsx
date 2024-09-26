import React from 'react';
import { OrderBookLevel } from '../hooks/useWebSocket';

interface OrderTableProps {
  columns: { header: string; accessor: keyof OrderBookLevel }[];
  data: OrderBookLevel[];
}

const OrderTable: React.FC<OrderTableProps> = ({ columns, data }) => {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ddd' }}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} style={{ padding: '8px', textAlign: 'left' }}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td key={colIndex} style={{ padding: '8px' }}>
                {row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
