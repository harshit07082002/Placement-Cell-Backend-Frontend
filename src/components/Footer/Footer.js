import React from "react";

// import ContentWrapper from "../contentWrapper/ContentWrapper";

import "./style.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div>
                <ul className="menuItems">
                    <li className="menuItem">Terms Of Use</li>
                    <li className="menuItem">Privacy-Policy</li>
                    <li className="menuItem">About</li>
                    <li className="menuItem">Blog</li>
                    <li className="menuItem">FAQ</li>
                </ul>
                <div className="infoText">
                    Placement Cell
                </div>
                <h5>&copy;2023 | All Rights Reserved</h5>
            </div>
        </footer>
    );
};

export default Footer;