import React from 'react';

import '../layouts/Body.css'

import { NavLink } from 'react-router-dom';

export default props => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <i className="sidebar-icon sidebar-toggle fa fa-bars" />
            </div>
            <NavLink exact className="sidebar-item" to="/">Home</NavLink>
            {
                props.data.map(route => <NavLink key={route.key} className="sidebar-item" to={route.key}>{route.key.substring(1)}</NavLink>)
            }
        </div>
    )
}