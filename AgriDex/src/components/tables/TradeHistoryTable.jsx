import React from 'react';

const TradeHistoryTable = ({ data = [] }) => (
  <table className="table-dark w-full text-xs">
    <thead>
      <tr>
        <th>Time</th>
        <th>Market</th>
        <th>Type</th>
        <th>Price</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {/* TODO: fetch from api.js */}
      {data.length === 0 ? <tr><td colSpan="5" className="text-center text-gray-500">No data</td></tr> : null}
    </tbody>
  </table>
);

export default TradeHistoryTable;
