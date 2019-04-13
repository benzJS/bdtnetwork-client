import React from "react";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import data from "../data";

export default props => {
  const expandRow = {
    renderer: row => {
      return (
        <div>
          {/* {Object.keys(row)
            .filter(
              key => columns.findIndex(obj => obj.dataField === key) === -1
            )
            .map(key => {
              return (
                <div>
                  {key}: {row[key]}
                </div>
              );
            })} */}
          something
        </div>
      );
    }
  };
  const columns = [
    {
      dataField: "key",
      text: "Key"
    },
    {
      dataField: "path",
      text: "Path"
    },
    {
      dataField: "component",
      text: "Component"
    }
  ];
  return (
    <div className="Network">
      <BootstrapTable
        hover
        striped
        bootstrap4
        keyField="key"
        data={data}
        columns={columns}
        pagination={paginationFactory()}
        expandRow={expandRow}
      />
    </div>
  );
};
