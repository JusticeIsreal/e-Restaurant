import React, { useEffect, useState } from "react";
import { AiFillBell } from "react-icons/ai";
import { getSessionUser } from "../../Services/functions";

// ICONS
import { GiBookCover } from "react-icons/gi";
import { useRouter } from "next/router";
import { FaMoneyCheckAlt } from "react-icons/fa";
function Topbar() {
  // FETCHING SESSION USER NAME AND CART LENGTH
  const router = useRouter();
  const [name, setName] = useState(null);
  const [userPosition, setUserPosition] = useState("");
  const [transactionNotification, setTransactionNotification] = useState([]);

  useEffect(() => {
    async function fetchSessionUser() {
      const userData = await getSessionUser(router);
      if (userData && userData.user) {
        setName(userData.user.username);
        setUserPosition(userData.user.position);
        setTransactionNotification(userData.user.transaction);
      }
    }
    fetchSessionUser();
  }, []);
  return (
    <div id="content">
      <nav>
        <span className="top-title">
          <img
            style={{ width: "50px" }}
            src="https://res.cloudinary.com/dnfa3ujys/image/upload/v1685984511/WhatsApp_Image_2023-06-05_at_3.43.15_PM_xrkz2v.jpg"
            className="map"
            alt=""
          />
          <h1></h1>
        </span>
        <div style={{ textAlign: "center", color: "#ff69b4" }}>
          {/* <p>{name}</p> */}
          <p style={{ textTransform: "uppercase" }}>{userPosition}</p>
        </div>
        <div className="dark-mode-con">
          <a href="https://dashboard.stripe.com/payments" target="_blank">
            {" "}
            <div className="notification" style={{ fontSize: "40px" }}>
              <FaMoneyCheckAlt className="bx bxs-bell" />
              {/* <span className="num">withdraw fund</span> */}
            </div>
          </a>
        </div>
      </nav>
    </div>
  );
}

export default Topbar;
