import React from 'react';

const RecentTradesTable = ({ data = [] }) => (
  <table className="table-dark w-full text-xs">
    <thead>
      <tr>
        <th>Time</th>
        <th>Price</th>
        <th>Amount</th>
        <th>Side</th>
      </tr>
    </thead>
    <tbody>
      {/* TODO: fetch from api.js */}
      {data.length === 0 ? <tr><td colSpan="4" className="text-center text-gray-500">No data</td></tr> : null}
    </tbody>
  </table>
);

export default RecentTradesTable;
