import React, { useState, useEffect } from "react";
import { Container, Row, Spinner } from "reactstrap";

import Sidebar from "../components/Sidebar";

export default props => {
  const [state, setState] = useState({
    loading: true
  });
  const Loading = props => {
    return (
      <div className="loading">
        <Spinner color="white" />
      </div>
    )
  }
  useEffect(() => {
    setState(prevState => {
      return {
        ...prevState,
        loading: true
      }
    });
    setTimeout(() => {
      setState(prevState => {
        return {
          ...prevState,
          loading: false
        }
      })
    }, 300);
  }, [props])
  return (
    <Container fluid>
      <Row className="body">
        <Sidebar data={props.children[1]} />
        <div
          style={{
            width: "calc(100% - 16rem)",
            paddingLeft: "16rem",
            boxSizing: "content-box"
          }}
        >
          <div
            style={{
              background: "#34495e",
              padding: "0.48rem 0",
              color: "#F3EFF5",
              position: "fixed",
              width: "calc(100% - 16rem)",
              zIndex: 3
            }}
          >
            <span style={{paddingLeft: 20, margin: 0, textTransform: 'capitalize', fontSize: '1.4em', fontWeight: 'lighter'}}>{props.location.pathname.substring(1) || 'home' }</span>
          </div>
          <div className="content d-flex align-items-center">
            {state.loading && <Loading/>}
            {props.children}
          </div>
        </div>
      </Row>
    </Container>
  );
};
