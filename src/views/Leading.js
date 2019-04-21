import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import {
    Container,
    Row,
    Col
} from 'reactstrap';

const socket = io('http://localhost:5000');

export default props => {
    const [state, setState] = useState({
        data: []
    });
    socket.on('new campaign', campaign => {
        axios.get('http://localhost:5000/campaigns')
            .then(res => {
                setState(prevState => {
                    return {
                        ...prevState,
                        data: res.data.data.campaigns
                    }
                })
            })
    });
    socket.on('delete campaign', campaign => {
        axios.get('http://localhost:5000/campaigns')
            .then(res => {
                setState(prevState => {
                    return {
                        ...prevState,
                        data: res.data.data.campaigns
                    }
                })
            })
    });
    useEffect(() => {
        console.log(state.data);
    })
    useEffect(() => {
        axios.get('http://localhost:5000/campaigns')
            .then(res => {
                setState(prevState => {
                    return {
                        ...prevState,
                        data: res.data.data.campaigns
                    }
                })
            })
    }, [])
    return (
        <Container>
            <ul>
                {
                    state.data.map(campaign => {
                        return <li key={campaign._id}>{campaign.name} - {campaign.network.name}</li>
                    })
                }
            </ul>
        </Container>
    )
}