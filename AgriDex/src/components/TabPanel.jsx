import React, { useState } from 'react';
import RecentTradesTable from './tables/RecentTradesTable';
import MyOrdersTable from './tables/MyOrdersTable';
import TradeHistoryTable from './tables/TradeHistoryTable';
import AccountStatusTable from './tables/AccountStatusTable';
import PositionsTable from './tables/PositionsTable';

const TABS = [
    { label: 'Positions', key: 'positions', component: PositionsTable },
    { label: 'Orders', key: 'orders', component: MyOrdersTable },
    { label: 'Trade History', key: 'history', component: TradeHistoryTable },
    { label: 'Account Status', key: 'account', component: AccountStatusTable },
];

const TabPanel = () => {
    const [tab, setTab] = useState('positions');
    const Current = TABS.find(t => t.key === tab)?.component || PositionsTable;
    return (
        <div className="tabpanel" style={{ padding: 0, margin: 0 }}>
            <div className="tabpanel-tabs">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        className={tab === t.key ? 'active' : ''}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div className="overflow-auto custom-scrollbar" style={{ height: 260, padding: 0, margin: 0 }}>
                <Current data={[]} />
            </div>
        </div>
    );
};

export default TabPanel;
