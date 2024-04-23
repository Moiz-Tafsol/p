import React from "react";
import { Container } from "react-bootstrap";
import style from "./index.module.css";
function Field({ label, value }) {
  return (
    <>
      <Container fluid className={style["container"]}>
        <p>{label}</p>
        <p>{value}</p>
      </Container>
    </>
  );
}

export default Field;
