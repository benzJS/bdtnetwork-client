import React from 'react';

import Network from './views/Network';

export default [
    {
        path: '/network',
        component: Network
    },
    {
        path: '/campaign',
        component: props => <div>Campaign</div>
    }
]