import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { MdOutlineWatchLater } from "react-icons/md";
import style from "./index.module.css";
import { DaysTimeArr } from "../../config/DummyData";
import moment from "moment";
export default function Schedule({ data }) {
  const formattedTime = moment().format("LT");

  return (
    <>
      <Container fluid>
        <Row className={style["schedule-heading-container"]}>
          <Col xs={12}>
            <CalendarTodayIcon className={style["schedule-heading-icon"]} />
            <p className={style["schedule-heading-text"]}>Schedule</p>
          </Col>
        </Row>
        <Row className={style["schedule-workingDays-container"]}>
          <Col md={2} xxl={1} xl={2}>
            Working Days
          </Col>
          <Col md={10} xxl={10} xl={10}>
            {data?.map((item, indx) => {
              const { day } = item;
              return (
                <div key={indx} className={style["schedule-workingDays"]}>
                  {day.substring(0, 3)}
                </div>
              );
            })}
          </Col>
        </Row>
        <Row className={style["schedule-card-container"]}>
          {data?.map((item, indx) => {
            return (
              <Col xs={1} className={style["schedule-card"]} key={indx}>
                <p>{item?.day}</p>
                <div>
                  <MdOutlineWatchLater
                    className={style["schedule-watchAnalogue-icon"]}
                  />
                  <p className={style["schedule-watchDigitalText-icon"]}>
                    {item?.from} To {item?.to}
                  </p>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
}
