import React from "react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// react icons
import { GiBookCover } from "react-icons/gi";
import { MdDashboard, MdGroup, MdSettings } from "react-icons/md";
import { RiMessage2Fill } from "react-icons/ri";
import { BiLogOutCircle } from "react-icons/bi";
import { FaStore, FaMoneyCheckAlt } from "react-icons/fa";
import Cookies from "js-cookie";
// import AdminDashboard from "../../Pages/Adminpage/AdminDashboard";
function Sidebar() {
  const [active, setActive] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    if (router.asPath === "/Adminpage/AdminDashboard") {
      setActive(1);
      return;
    }
    if (router.asPath === "/Adminpage/Store") {
      setActive(2);
      return;
    }
    if (router.asPath === "/Adminpage/Transaction") {
      setActive(3);
      return;
    }
    if (router.asPath === "/Adminpage/CustomersData") {
      setActive(4);
      return;
    }
    if (router.asPath === "/Adminpage/Store") {
      setActive(5);
      return;
    }
    if (router.asPath === "/Adminpage/Store") {
      setActive(6);
      return;
    }
  }, [router.pathname]);

  // LOGOUT
  const logOUT = () => {
    Cookies.remove("JWTtoken");
    location.reload();
    router.push("/");
  };
  return (
    <div>
      <section id="sidebar" className="sidebar">
        <a className="brand" style={{ marginTop: "10px" }}>
          <img
            style={{ width: "60px" }}
            src="https://res.cloudinary.com/dnfa3ujys/image/upload/v1685984511/WhatsApp_Image_2023-06-05_at_3.43.15_PM_xrkz2v.jpg"
            className="map"
            alt=""
          />
          {/* <span className="text">ELEGANT COLLECTION</span> */}
        </a>
        <ul className="side-menu top">
          <li
            className={`${active === 1 ? "active" : ""}`}
            onClick={() => setActive(1)}
          >
            <Link className="list-items" href="/Adminpage/AdminDashboard">
              <MdDashboard className="list-icons" />
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li
            className={`${active === 2 ? "active" : ""}`}
            onClick={() => setActive(0)}
          >
            <Link className="list-items" href="/Adminpage/Store">
              <FaStore className="list-icons" />
              <span className="text">My Store</span>
            </Link>
          </li>

          <li
            className={`${active === 3 ? "active" : ""}`}
            onClick={() => setActive(0)}
          >
            <Link href="/Adminpage/Transaction" className="list-items">
              <FaMoneyCheckAlt className="list-icons" />
              <span className="text">Order</span>
            </Link>
          </li>

          <li
            className={`${active === 4 ? "active" : ""}`}
            onClick={() => setActive(0)}
          >
            <Link href="/Adminpage/CustomersData" className="list-items">
              <MdGroup className="list-icons" />
              <span className="text">Users</span>
            </Link>
          </li>
        </ul>
        <ul className="side-menu down">
          <li
            className={`${active === 6 ? "active" : ""}`}
            onClick={() => setActive(0)}
          >
            <p className="list-items">
              <MdSettings className="list-icons" />
              <a href="Tel:08104015180" target="_blank">
                <span className="text">AJIS</span>
              </a>
            </p>
          </li>
          <li
            className={`${active === 7 ? "active" : ""}`}
            onClick={() => setActive(0)}
          >
            <a href="/" className="logout" onClick={() => logOUT()}>
              <BiLogOutCircle className="list-icons" />
              <span className="text">Logout</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Sidebar;
