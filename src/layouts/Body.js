import React from 'react';
import {
    Container,
    Row
} from 'reactstrap';

import Sidebar from '../components/Sidebar';

export default props => {
    console.log(props.children);
    return (
        <Container fluid>
            <Row className="body">
                <Sidebar data={props.children[1]} />
                <div style={{width: 'calc(100% - 16rem)', paddingLeft: '16rem', boxSizing: 'content-box'}}>
                    <div style={{background: '#34495e', padding: '0.75rem 0', color: '#F3EFF5', position: 'fixed', width: 'calc(100% - 16rem)'}}>
                        Cat
                    </div>
                    <div className="content">
                        {props.children}
                    </div>
                </div>
            </Row>
        </Container>
    )
}