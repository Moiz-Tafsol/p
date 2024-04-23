import React from "react";
import { Container } from "react-bootstrap";
import { AiOutlineInstagram } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Logo as footerLogo } from "../../constant/imagePath";
import classes from "./Footer.module.css";
const Footer = ({ mainWrapper }) => {

  return (
    <div className={`${[classes.footerMain, mainWrapper].join(" ")}`}>
      <div className={classes.footerBottom}>
        <Container className={`mainContainer`}>
          <p>
            Copyright 2023, <span>TRS Radio Structures LTD,</span> All Rights
            Reserved.
          </p>
        </Container>
      </div>
    </div>
  );
};

export default Footer;
