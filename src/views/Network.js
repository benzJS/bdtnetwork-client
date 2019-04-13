import React from 'react';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

export default props => {
    const products = [
        {
            key: 1,
            path: '/network',
            component: 'Network'
        },
        {
            key: 2,
            path: '/campaign',
            component: 'props => <div>Campaign</div>'
        }
    ];
    const columns = [{
        dataField: 'key',
        text: 'Key'
    }, {
        dataField: 'path',
        text: 'Path'
    }, {
        dataField: 'component',
        text: 'Component'
    }];
    return (
        <div className="Network">
            <BootstrapTable bootstrap4 keyField='key' data={ products } columns={ columns } pagination={paginationFactory()} />
        </div>
    )
}