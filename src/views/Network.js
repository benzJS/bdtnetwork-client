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
    column: {
        ...ReactTableDefaults.column,
        headerStyle: {background: '#1d2127', color: 'white', width: '1px !important'}
    }
})

export default props => {
    const copyToClipboard = text => {
        navigator.clipboard.writeText(text);
    }
    const getColumns = () => {
        const width = window.innerWidth;
        const numberOfCol = width >= 1200 ? 8 : width >= 992 ? 6 : width >= 768 ? 4 : 3;
        return Object.keys(data[0]).slice(0, numberOfCol).map(key => {
            const column = {
                Header: key,
                accessor: key,
                Cell: props => `${props.value}`
            }
            key === 'first_name' && (column.Cell = props =>
                {
                    return (
                        <InputGroup>
                            <Input value={props.value} readOnly />
                            <InputGroupAddon addonType="append">
                                <Button style={{zIndex: 1}} onClick={copyToClipboard.bind(this, props.value)}>Copy</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    )
                }
            )
            return column;
        });
    }
    const [state, setState] = useState({
        columns: [],
        progressValue: 20,
        inputRef: null,
        isMenuOpen: false,
        modal: false
    })
    const SubComponent = row => {
        const missingCol = Object.keys(data[0]).filter(
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
        })
    }
    useEffect(() => {
        setState(prevState => {
            return {
                ...prevState,
                columns: getColumns()
            }
        })
        window.onresize = function() {
            setState(prevState => {
                return {
                    ...prevState,
                    columns: getColumns()
                }
            })
        }
    }, []);
    return (
        <Container>
            <div className="menu-bar">
                <Row>
                    <Col md="6">
                        <Button color="info" className="mr-3" onClick={toggle}>Add new item</Button>
                        <Button color="danger">Delete multiples</Button>
                    </Col>
                    <Col md="6">
                        <Input placeholder="search..." />
                    </Col>
                </Row>
            </div>
            <ReactTable
                // TableComponent={props => <table {...props}>{props.children}</table>}
                // TheadComponent={props => <thead {...props}>{props.children}</thead>}
                // TbodyComponent={props => <tbody {...props}>{props.children}</tbody>}
                // ThComponent={props => <th {...props}>{props.children}</th>}
                // TrGroupComponent={props => <tr {...props}>{props.children}</tr>}
                // TrComponent={props => <tr {...props}>{props.children}</tr>}
                // TdComponent={props => <td {...props}>{props.children}</td>}
                data={data}
                columns={state.columns}
                className="-striped"
                defaultPageSize={10}
                SubComponent={Object.keys(data[0]).length > state.columns.length ? SubComponent : null}
            />
            <Formik
                initialValues={{ name: '', type: 'banner', postback: 'https://api.bdtnetworks.com/banner/BNaHmwWryUCS8siBhiNnA/{sub_id}', response: 1 }}
                onSubmit={(values, actions) => {
                    // setTimeout(() => {
                    //     alert(JSON.stringify(values, null, 2));
                    //     actions.setSubmitting(false);
                    // }, 1000);
                    axios.post('http://localhost:5000/network', values)
                        .then(res => {
                            alert(JSON.stringify(res.data.data, null, 2));
                            actions.setSubmitting(false);
                            return;
                        }).catch(err => {
                            console.log(err);
                            actions.setErrors({global: 'Failed'});
                            actions.setSubmitting(false);
                        });
                }}
                render={props => {return (
                    <Modal isOpen={state.modal} toggle={toggle} >
                        <ModalHeader toggle={toggle}>Add new item</ModalHeader>
                        <Form onSubmit={props.handleSubmit}>
                            <ModalBody>
                                {props.isValid.global && <Alert color="danger">{props.errors.global}</Alert>}
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
                                                <Button style={{zIndex: 1}} onClick={copyToClipboard.bind(this, props.values.postback)}>Copy</Button>
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
                    </Modal>
                )}}
            />
        </Container>
    )
}

// export default props => {
//     const getColumns = () => {
//         const width = window.innerWidth;
//         const numberOfCol = width >= 1200 ? 8 : width >= 992 ? 6 : width >= 768 ? 4 : 3;
//         return Object.keys(data[0]).slice(0, numberOfCol).map(key => {
//             return {
//                 dataField: key,
//                 text: key,
//                 sort: true,
//                 editor: {
//                     type: Type.TEXT
//                 }
//             } 
//         });
//     }
//     const [state, setState] = useState({
//         columns: getColumns(),
//     })
// const expandRow = {
//     renderer: row => {
//         const missingCol = Object.keys(data[0]).filter(
//             key => state.columns.findIndex(obj => obj.dataField === key) === -1
//         );
//         return (
//             <div>
//                 {
//                     missingCol.map(key => {
//                         return (
//                             <div key={key}>
//                                 <b class="text-capitalize">{key}</b>: {`${row[key]}`}
//                             </div>
//                         );
//                     })
//                 }
//             </div>
//         );
//     },
//         expanded: []
//     }
//     useEffect(() => {
//         window.onresize = function() {
//             setState(prevState => {
//                 return {
//                     ...prevState,
//                     columns: getColumns()
//                 }
//             });
//         }
//     }, []);
//     return (
//         <Container className="Network">
//             <BootstrapTable
//                 hover
//                 striped
//                 bootstrap4
//                 condensed
//                 keyField="id"
//                 data={data}
//                 columns={state.columns}
//                 headerClasses="thead-dark text-capitalize"
//                 pagination={paginationFactory({showTotal: true})}
//                 cellEdit={ cellEditFactory({ mode: 'dbclick' }) }
//                 expandRow={expandRow}
//             />
//         </Container>
//     );
// };
