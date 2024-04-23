import React from "react";
import styles from "./MobileFooter.module.css";
import Accordion from "react-bootstrap/Accordion";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Logo as footerLogo } from "../../constant/imagePath";
const MobileFooter = ({ mainWrapper }) => {
  return (
    <>
      <style>
        {`
        .accordion-header > button{
            background-color:unset !important;
            padding-left: 0;
            box-shadow:unset !important;
        }
        `}
      </style>
      <div className={`${[styles.mobileFooter_main, mainWrapper].join(" ")}`}>
        <div className="container">
          <img src={footerLogo} alt="" />
          <div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item className={styles.Accordion_items} eventKey="0">
                <Accordion.Header className={styles.Accordion_header_main}>
                  <p className={`p-17 ${[styles.links_head].join(" ")}`}>
                    Explore
                  </p>
                </Accordion.Header>
                <Accordion.Body className={styles.Accordion_body}>
                  <ul className={styles.Accordion_links_main}>
                    <li>
                      <Link to="/" className="footerLink">
                        Home
                      </Link>

                      <Link to="/about-us" className="footerLink">
                        About Us
                      </Link>
                      {/* <Link to="" className="footerLink">Preferred Company</Link> */}
                      <Link to="/services-of" className="footerLink">
                        Services
                      </Link>
                      <Link to="/latest-news" className="footerLink">
                        News
                      </Link>
                      <Link to="/library" className="footerLink">
                        Pricing
                      </Link>
                      <Link to="/contact-us" className="footerLink">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item className={styles.Accordion_items} eventKey="0">
                <Accordion.Header className={styles.Accordion_header_main}>
                  <p className={`p-17 ${[styles.links_head].join(" ")}`}>
                    Clients
                  </p>
                </Accordion.Header>
                <Accordion.Body className={styles.Accordion_body}>
                  <ul className={styles.Accordion_links_main}>
                    <li>
                      <Link to="/" className="footerLink">
                        Membership
                      </Link>

                      <Link to="/about-us" className="footerLink">
                        Privacy Policy
                      </Link>
                      {/* <Link to="" className="footerLink">Preferred Company</Link> */}
                      <Link to="/products" className="footerLink">
                        Terms And Services
                      </Link>
                      <Link to="/library" className="footerLink">
                        Support
                      </Link>
                      <Link to="/library" className="footerLink">
                        Table Of Contents
                      </Link>
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item className={styles.Accordion_items} eventKey="0">
                <Accordion.Header className={styles.Accordion_header_main}>
                  <p className={`p-17 ${[styles.links_head].join(" ")}`}>
                    Address
                  </p>
                </Accordion.Header>
                <Accordion.Body className={styles.Accordion_body}>
                  <ul className={styles.Accordion_links_main}>
                    <li>
                      <a className="footerLink mt-2 c-p">
                        <EmailIcon
                          style={{
                            marginRight: "8px",
                            color: "var(--main-color)",
                          }}
                        />{" "}
                        Info@Scott.com
                      </a>
                      <a className="footerLink mt-2 c-p">
                        <LocationOnIcon
                          style={{
                            marginRight: "8px",
                            color: "var(--main-color)",
                          }}
                        />{" "}
                        124, Street Road, New York 24, 00000
                      </a>
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <p className={`p-17 ${[styles.links_head].join(" ")}`}>Follow Us</p>
          <div className={styles.socialLinks}>
            <div className={styles.link_main}>
              <FaFacebookF className={styles.all_links} color="#111012" />
            </div>
            <div className={styles.link_main}>
              <FaInstagram className={styles.all_links} color="#111012" />
            </div>
            <div className={styles.link_main}>
              <FaTwitter className={styles.all_links} color="#111012" />
            </div>
          </div>
        </div>
        <div className={styles.hr_line}>
          <hr />
        </div>
        <div className={styles.copy_line_main}>
          <p className={styles.copy_line}>© 2021 Scott. All Rights Reserved.</p>
        </div>
      </div>
    </>
  );
};

export default MobileFooter;
