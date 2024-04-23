"use client";
import React from "react";
import classes from "./CardsLoading.module.css";
import { Skeleton } from "@mui/material";
import { Col, Row } from "react-bootstrap";
const CardsLoading = ({ totalNo = 12, height = 340, cardCol=3 }) => {
  return (
    <>
      <div className={classes.loadingContainer}>
        <Row>
          {Array(totalNo)
            .fill()
            .map((_, index) => (
              <Col md={cardCol} className={classes.loadingCard} key={index}>
                <Skeleton
                  sx={{
                    height: height,
                  }}
                  variant="rounded"
                />
              </Col>
            ))}
        </Row>
      </div>
    </>
  );
};

export default CardsLoading;
