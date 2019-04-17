import React, { useState, useEffect } from "react";

// import BootstrapTable from "react-bootstrap-table-next";
// import paginationFactory from "react-bootstrap-table2-paginator";
// import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import ReactTable from "react-table";
import { Container, InputGroup, InputGroupAddon, Button, Input } from 'reactstrap';

// import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import 'react-table/react-table.css'

import data from "../data";

export default props => {
    const copyToClipboard = text => {
        navigator.clipboard.writeText(text);
    }
    const getColumns = (id = -1) => {
        // console.log('get columns...', state);
        debugger;
        const width = window.innerWidth;
        const numberOfCol = width >= 1200 ? 8 : width >= 992 ? 6 : width >= 768 ? 4 : 3;
        return Object.keys(data[0]).slice(0, numberOfCol).map(key => {
            const column = {
                Header: key,
                accessor: key,
                className: 'onePx',
                headerStyle: {background: '#1d2127', color: 'white', width: '1px !important'},
                Cell: ({value}) => `${value}`
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
        inputRef: null
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
            <ReactTable
                data={data}
                columns={state.columns}
                className="-striped"
                defaultPageSize={10}
                resizable={false}
                SubComponent={Object.keys(data[0]).length > state.columns.length ? SubComponent : null}
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
