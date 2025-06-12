import React from 'react';

const MyOrdersTable = ({ data = [] }) => (
  <table className="table-dark w-full text-xs">
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Market</th>
        <th>Type</th>
        <th>Price</th>
        <th>Amount</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {/* TODO: fetch from api.js */}
      {data.length === 0 ? <tr><td colSpan="6" className="text-center text-gray-500">No data</td></tr> : null}
    </tbody>
  </table>
);

export default MyOrdersTable;
