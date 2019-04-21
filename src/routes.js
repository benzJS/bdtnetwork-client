import React from 'react';

import Network from './views/Network';
import Campaign from './views/Campaign';
import Leading from './views/Leading';

export default [
    {
        path: '/network',
        component: Network
    },
    {
        path: '/campaign',
        component: Campaign
    },
    {
        path: '/leading',
        component: Leading
    }
]