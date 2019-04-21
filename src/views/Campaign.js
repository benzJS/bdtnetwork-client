import React, { useState, useEffect } from "react";

// import BootstrapTable from "react-bootstrap-table-next";
// import paginationFactory from "react-bootstrap-table2-paginator";
// import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import ReactTable, { ReactTableDefaults } from "react-table";
import {
    Alert,
    Container,
    Button,
    Input,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import { Formik } from 'formik';
import axios from 'axios';

// import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import 'react-table/react-table.css';

Object.assign(ReactTableDefaults, {
    defaultFilterMethod: (filter, row, column) => {
        const id = filter.pivotId || filter.id;
        const rs = row[id] !== undefined ? String(row[id]).toLowerCase().includes(filter.value.toLowerCase()) : true;
        return rs;
    },
    column: {
        ...ReactTableDefaults.column,
        headerStyle: {background: '#1d2127', color: 'white', width: '1px !important'},
        headerClassName: 'text-capitalize'
    }
})

export default props => {
    const getColumns = (data) => {
        const width = window.innerWidth;
        const numberOfCol = width >= 1200 ? 8 : width >= 992 ? 6 : width >= 768 ? 4 : 3;
        const keys = Object.keys(data[0]).sort();
        const _idIndex = keys.indexOf('_id');
        const columns = keys.slice(0, _idIndex).concat(keys.slice(_idIndex + 1, numberOfCol)).map(key => { // we don't want _id field to be rendered
            const column = {
                Header: key,
                accessor: key,
                Cell: props => `${props.value}`
            }
            if(key === 'network') {
                column.Cell = props => {
                    return (
                        `${props.value.name}`
                    )
                }
            }
            return column;
        });
        columns.push({
            Header: 'action',
            filterable: false,
            Cell: props => {
                return (
                    <div className="text-center">
                        <i className="fas fa-edit mr-3" role="button" onClick={e => handleFormikChange({...props.original, _id: props.original._id, state: String(props.original.state) })} />
                        <i className="fas fa-trash-alt text-danger" role="button" onClick={e => deleteOne(props.original._id)} />
                    </div>
                )
            }
        });
        return columns;
    }
    const [state, setState] = useState({
        columns: [],
        data: [],
        isMenuOpen: false,
        modal: false,
        formikInit: { name: '', network: '', country: '', note: '', point: 0, state: true }, // network will be updated within componentDidMount
        tablePage: 0,
        networks: []
    })
    const SubComponent = row => {
        const keys = Object.keys(state.data[0]);
        const _idIndex = keys.indexOf('_id');
        const missingCol = keys.slice(0, _idIndex).concat(keys.slice(_idIndex + 1)).filter(
            key => state.columns.findIndex(obj => obj.accessor === key) === -1
        ).sort();
        return (
            <ul style={{margin: 0}}>
                {
                    missingCol.map(key => {
                        return (
                            <li key={key}>
                                <b className="text-capitalize">{key}</b>: {`${row.original[key]}`}
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
    const toggle = () => {
        setState(prevState => {
            return {
                ...prevState,
                modal: !prevState.modal
            }
        });
    }
    const handleFormikChange = formikInit => {
        setState(prevState => {
            return {
                ...prevState,
                formikInit
            }
        });
        toggle();
    }
    const deleteOne = id => {
        //eslint-disable-next-line
        confirm('Chắc chắn muốn xóa bản ghi này?') && axios.delete(`http://localhost:5000/campaigns/${id}`)
            .then(res => {
                axios.get('http://localhost:5000/campaigns')
                    .then(res => {
                        const data = res.data.data.campaigns;
                        const networks = res.data.data.networks;
                        setState(prevState => {
                            return {
                                ...prevState,
                                data,
                                networks,
                                formikInit: {...prevState.formikInit, network: networks[0].name}
                            }
                        });
                    });
            })
            .catch(res => {

            })
    }
    const handleSubmit = (values, actions) => {
        if(values._id) {
            // return console.log(values);
            axios.put(`http://localhost:5000/campaigns/${values._id}`, values)
                .then(res => {
                    actions.setSubmitting(false);
                    axios.get('http://localhost:5000/campaigns')
                        .then(res => {
                            const data = res.data.data.campaigns;
                            const networks = res.data.data.networks;
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    data,
                                    networks,
                                    formikInit: {...prevState.formikInit, network: networks[0].name}
                                }
                            });
                        });
                    toggle();
                    return;
                })
                .catch(res => {
                    actions.setErrors({global: 'Failed'});
                    actions.setSubmitting(false);
                })
        } else {
            // return console.log(values);
            axios.post('http://localhost:5000/campaigns', values)
                .then(res => {
                    alert(JSON.stringify(res.data.data, null, 2));
                    actions.setSubmitting(false);
                    axios.get('http://localhost:5000/campaigns')
                        .then(res => {
                            const data = res.data.data.campaigns;
                            const networks = res.data.data.networks;
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    data,
                                    networks,
                                    formikInit: {...prevState.formikInit, network: networks[0].name}
                                }
                            });
                        });
                    toggle();
                    return;
                }).catch(err => {
                    actions.setErrors({global: 'Failed'});
                    actions.setSubmitting(false);
                });
        }
    }
    useEffect(() => {
        axios.get('http://localhost:5000/campaigns')
            .then(res => {
                const data = res.data.data.campaigns;
                const networks = res.data.data.networks;
                setState(prevState => {
                    return {
                        ...prevState,
                        data,
                        networks
                    }
                });
                setState(prevState => {
                    return {
                        ...prevState,
                        columns: getColumns(prevState.data)
                    }
                });
            });
        window.onresize = function() {
            setState(prevState => {
                return {
                    ...prevState,
                    columns: getColumns(prevState.data)
                }
            })
        }
    }, []);
    return (
        <Container>
            <div className="menu-bar">
                <Row>
                    <Col xs="12">
                        <Button
                            color="info"
                            className="mr-3"
                            onClick={e => handleFormikChange({ name: '', network: state.networks[0]._id, country: '', note: '', point: 0, state: 'true' })}
                        >Add new item</Button>
                        <Button color="danger">Delete multiple</Button>
                    </Col>
                </Row>
            </div>
            <ReactTable
                data={state.data}
                columns={state.columns}
                pageSizeOptions={[5, 10, 15, 20, 25, 30]}
                defaultPageSize={5}
                page={state.tablePage}
                onPageChange={pageIndex => setState(prevState => {return {...prevState, tablePage: pageIndex}})}
                className="-striped"
                filterable
                isLoading
                resizable={false}
                SubComponent={Object.keys(state.data.length > 0 && state.data[0]).length > state.columns.length ? SubComponent : null}
            />
            <Modal isOpen={state.modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Add/Edit item</ModalHeader>
                <Formik
                    initialValues={state.formikInit}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {
                        props => {return (
                            <Form onSubmit={props.handleSubmit}>
                                <ModalBody>
                                    {props.errors.global && <Alert color="danger">{props.errors.global}</Alert>}
                                    <FormGroup row>
                                        <Label for="name" sm={2}>Name</Label>
                                        <Col sm={10}>
                                            <Input type="text" name="name" placeholder="Campaign" value={props.values.name} onChange={props.handleChange} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="network" sm={2}>Network</Label>
                                        <Col sm={10}>
                                            <Input type="select" name="network" value={props.values.network} onChange={props.handleChange} >
                                            {
                                                state.networks.map(network => (
                                                    <option key={network._id} value={network._id}>{network.name}</option>
                                                ))
                                            }
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="country" sm={2}>Country</Label>
                                        <Col sm={10}>
                                            <Input type="text" name="country" value={props.values.country} onChange={props.handleChange} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="point" sm={2}>Point</Label>
                                        <Col sm={10}>
                                            <Input type="number" name="point" value={props.values.point} onChange={props.handleChange} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="note" sm={2}>Note</Label>
                                        <Col sm={10}>
                                            <Input type="text" name="note" value={props.values.note} onChange={props.handleChange} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="state" sm={2}>State</Label>
                                        <Col sm={10}>
                                        <FormGroup check>
                                            <Label check>
                                            <Input
                                                type="radio"
                                                name="state"
                                                value={'true'}
                                                checked={props.values.state === 'true'}
                                                onChange={props.handleChange}
                                                />{' '}
                                            Enable
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Label check>
                                            <Input
                                                type="radio"
                                                name="state"
                                                value={'false'}
                                                checked={props.values.state === 'false'}
                                                onChange={props.handleChange}
                                                />{' '}
                                            Disable
                                            </Label>
                                        </FormGroup>
                                        </Col>
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type="submit" color="info" disabled={props.isSubmitting} >Submit</Button>{' '}
                                    <Button color="secondary" onClick={toggle} disabled={props.isSubmitting} >Cancel</Button>
                                </ModalFooter>
                            </Form>
                        )}
                    }
                </Formik>
            </Modal>
        </Container>
    )
}