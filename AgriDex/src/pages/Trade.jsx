import React from 'react';
import Navbar from '../components/Navbar';
import OrderForm from '../components/OrderForm';
import PriceChart from '../components/PriceChart';
import OrderBook from '../components/OrderBook';
import TabPanel from '../components/TabPanel';

const Trade = () => {
    return (
        <div style={{ background: '#111214', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 8px' }}>
                <div style={{ display: 'flex', gap: '10px', minHeight: '400px' }}>
                    <div style={{ flex: '1 1 25%', minWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'stretch', marginRight: 12 }}>
                        <OrderForm data={[]} />
                    </div>
                    <div style={{ flex: '1 1 75%', minWidth: 800, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: 400 }}>
                            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                                <PriceChart />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                                <OrderBook />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: -14 }}>
                            <TabPanel />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trade;
