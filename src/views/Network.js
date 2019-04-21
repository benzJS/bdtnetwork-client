import React, { useState, useEffect } from "react";

// import BootstrapTable from "react-bootstrap-table-next";
// import paginationFactory from "react-bootstrap-table2-paginator";
// import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import ReactTable, { ReactTableDefaults } from "react-table";
import {
    Alert,
    Container,
    InputGroup,
    InputGroupAddon,
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
import 'react-table/react-table.css'

import data from "../data";

Object.assign(ReactTableDefaults, {
    defaultFilterMethod: (filter, row, column) => {
        // console.log(filter, row);
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
    const copyToClipboard = text => {
        navigator.clipboard.writeText(text);
    }
    const getColumns = (data) => {
        const width = window.innerWidth;
        const numberOfCol = width >= 1200 ? 8 : width >= 992 ? 6 : width >= 768 ? 4 : 3;
        const keys = Object.keys(data[0]).sort();
        const _idIndex = keys.indexOf('_id');
        const columns = keys.slice(0, _idIndex).concat(keys.slice(_idIndex + 1, numberOfCol)).sort().map(key => { // we don't want _id field to be rendered
        // const columns = keys.slice(0, numberOfCol).map(key => {
            const column = {
                Header: key,
                accessor: key,
                Cell: props => `${props.value}`
            }
            if(key === 'postback') {
                column.Cell = props => {
                    return (
                        <InputGroup>
                            <Input value={props.value} readOnly />
                            <InputGroupAddon addonType="append">
                                <Button style={{zIndex: 1}} onClick={copyToClipboard.bind(this, props.value)}><i className="far fa-copy"></i></Button>
                            </InputGroupAddon>
                        </InputGroup>
                    )
                }
            }
            return column;
        });
        columns.push({
            Header: 'action',
            filterable: false,
            Cell: props => (
                <div className="text-center">
                    <i className="fas fa-edit mr-3" role="button" onClick={e => handleFormikChange({...props.original, _id: props.original._id})} />
                    <i className="fas fa-trash-alt text-danger" role="button" onClick={e => deleteOne(props.original._id)} />
                </div>
            )
        });
        return columns;
    }
    const [state, setState] = useState({
        columns: [],
        data: [],
        isMenuOpen: false,
        modal: false,
        formikInit: { name: '', type: 'banner', postback: 'https://api.bdtnetworks.com/banner/BNaHmwWryUCS8siBhiNnA/{sub_id}', response: 1 },
        tablePage: 0
    })
    const SubComponent = row => {
        const keys = Object.keys(state.data[0]);
        const _idIndex = keys.indexOf('_id');
        const missingCol = keys.slice(0, _idIndex).concat(keys.slice(_idIndex + 1)).filter(
            key => state.columns.findIndex(obj => obj.accessor === key) === -1
        );
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
        confirm('Chắc chắn muốn xóa bản ghi này?') && axios.delete(`http://localhost:5000/network/${id}`)
            .then(res => {
                axios.get('http://localhost:5000/network')
                    .then(res => {
                        const data = res.data.data;
                        setState(prevState => {
                            return {
                                ...prevState,
                                data
                            }
                        });
                    });
            })
            .catch(res => {

            })
    }
    const handleSubmit = (values, actions) => {
        if(values._id) {
            axios.put(`http://localhost:5000/network/${values._id}`, values)
                .then(res => {
                    actions.setSubmitting(false);
                    axios.get('http://localhost:5000/network')
                        .then(res => {
                            const data = res.data.data;
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    data
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
            axios.post('http://localhost:5000/network', values)
                .then(res => {
                    alert(JSON.stringify(res.data.data, null, 2));
                    actions.setSubmitting(false);
                    axios.get('http://localhost:5000/network')
                        .then(res => {
                            const data = res.data.data;
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    data
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
        axios.get('http://localhost:5000/network')
            .then(res => {
                const data = res.data.data;
                setState(prevState => {
                    return {
                        ...prevState,
                        data
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
                    <Col md="6">
                        <Button
                            color="info"
                            className="mr-3"
                            onClick={e => handleFormikChange({
                                name: '',
                                type: 'banner',
                                postback: 'https://api.bdtnetworks.com/banner/BNaHmwWryUCS8siBhiNnA/{sub_id}',
                                response: 1
                            })}
                        >Add new item</Button>
                        <Button color="danger">Delete multiple</Button>
                    </Col>
                    <Col md="6">
                        {/* <Input placeholder="search..." /> */}
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
                                        <Label for="exampleEmail" sm={2}>Name</Label>
                                        <Col sm={10}>
                                            <Input type="text" name="name" placeholder="Network" value={props.values.name} onChange={props.handleChange} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="exampleSelect" sm={2}>Type</Label>
                                        <Col sm={10}>
                                            <Input type="select" name="type" value={props.values.type} onChange={props.handleChange} >
                                                <option value="banner">Banner</option>
                                                <option value="wall">Wall</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="examplePassword" sm={2}>Postback</Label>
                                        <Col sm={10}>
                                            <InputGroup>
                                                <Input type="text" name="postback" value={props.values.postback} onChange={props.handleChange} />
                                                <InputGroupAddon addonType="append">
                                                    <Button style={{zIndex: 1}} onClick={copyToClipboard.bind(this, props.values.postback)}><i className="far fa-copy"></i></Button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="examplePassword" sm={2}>Response</Label>
                                        <Col sm={10}>
                                            <Input type="text" name="response" placeholder="Response" value={props.values.response} onChange={props.handleChange} />
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