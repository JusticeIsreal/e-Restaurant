import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logOUT } from "../Services/functions";
import Cookies from "js-cookie";
// ICONS
import { BiDish } from "react-icons/bi";
import { FaCartArrowDown } from "react-icons/fa";
import { BsShop, BsTelephoneForward, BsWhatsapp } from "react-icons/bs";
import { FiGrid, FiTruck } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { getSessionUser } from "../Services/functions";
import { CartQuantityContext } from "../pages/_app";
import { AiOutlineMail, AiTwotoneMail } from "react-icons/ai";

function Topbar({ dynamictriger, triga, localCartTriger, localCartLength }) {
  // SET NAV LIST COLOR WITH PAGE PATH NAME
  const cartQty = useContext(CartQuantityContext).cartQty;
  const [active, setActive] = useState(0);
  const router = useRouter();
  const adminEmail = "jusminempire@gmail.com";
  useEffect(() => {
    switch (router.asPath) {
      case "/":
        setActive(1);
        break;
      case "/products":
        setActive(2);
        break;
      case "/orders":
        setActive(3);
        break;
      default:
        setActive(0);
        break;
    }
  }, [router.asPath]);

  // // FETCHING SESSION USER NAME AND CART LENGTH
  const [name, setName] = useState(null);
  const [cartLength, setCartLength] = useState([]);
  const [session, setSession] = useState([]);
  const [localCartSession, setLocalCartSession] = useState([]);
  const [localCart, setLocalCart] = useState([]);
  useEffect(() => {
    // console.log("fgjh");
    // get cart items in local storage
    const existingItemsInLocal = localStorage.getItem("localCartItem")
      ? JSON.parse(localStorage.getItem("localCartItem"))
      : [];
    // console.log(existingItemsInLocal);
    setLocalCart(existingItemsInLocal);
    async function fetchSessionUser() {
      const userData = await getSessionUser();
      setLocalCartSession(userData);
      if (userData && userData.user) {
        setSession(userData);
        setName(userData?.user?.username);
        setCartLength(userData?.user.cart);
      }
    }
    fetchSessionUser();
  }, [router, triga, dynamictriger, localCartTriger, cartQty]);
  // console.log(session.user.position);
  // LOGOUT
  const logOUT = () => {
    Cookies.remove("JWTtoken");
    location.reload();
    router.push("/");
  };
  return (
    <div className="topbar-main-con">
      {/* TOPBAR  */}

      <div className="topbar-top-con">
        {/* logo side */}
        <div className="topbar-top-con-left">
          <Link href="/">
            {/* <SiCoinmarketcap className="icon" /> */}
            <img
              className="icon-img"
              src="https://res.cloudinary.com/isreal/image/upload/v1689604698/WhatsApp_Image_2023-06-05_at_8.50.03_AM-removebg-preview_uoqp8m.png"
              alt="img"
            />
          </Link>
          <p style={{ marginLeft: "5px", color: "#ea9319" }}>
            {name && name.split(" ")[0]}
          </p>
        </div>
        {/* https://res.cloudinary.com/isreal/image/upload/v1689556398/resturant_banner_2_copy_cze2uq.jpg */}
        {/* cart and user icon */}
        <div className="topbar-top-con-right">
          <div className="number">
            <BsTelephoneForward />
            <p>+234 810 401 5180</p>
          </div>
          <div className="cart-icon-con">
            <Link href="/cart">
              <FaCartArrowDown className="icon" />
            </Link>
            {localCartSession ? (
              <sup>{cartQty}</sup>
            ) : (
              <sup>{localCartLength?.length}</sup>
            )}
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <div className="navbar-main-con">
        <nav>
          <ul>
            <Link href="/">
              <li
                className={`${active === 1 ? "listactive" : ""}`}
                onClick={() => setActive(1)}
              >
                {active == 1 ? <div className="nav-active"></div> : ""}
                <span>
                  <BsShop className="menu-icon" />
                  {/* <p>Home</p> */}
                </span>
                <p>Home</p>
              </li>
            </Link>
            <Link href="/products">
              <li
                className={`${active === 2 ? "listactive" : ""}`}
                onClick={() => setActive(2)}
              >
                {active == 2 ? (
                  <div className="nav-active nav-active-dish"></div>
                ) : (
                  ""
                )}
                <span>
                  <BiDish className="menu-icon dish" />
                  {/* <p>Delicacies</p> */}
                </span>
                <p>Delicacies</p>
              </li>
            </Link>
            <Link href="/orders">
              <li
                className={`${active === 3 ? "listactive" : ""}`}
                onClick={() => setActive(2)}
              >
                {active == 3 ? <div className="nav-active"></div> : ""}
                <span>
                  <FiTruck className="menu-icon" />
                  {/* <p> Order</p> */}
                </span>
                <p> Order</p>
              </li>
            </Link>

            {/* <a
              href="https://wa.me/447404699950?text=Hello, I am a customer on your platfor Jenny's Hair & Wig and I need your support."
              target="_blank"
            >
              <li>
                <span>
                  <AiOutlineMail className="menu-icon" />
                </span>
                Support
              </li>
            </a> */}
            {session?.user?.position === "admin" ||
            session?.user?.position === "staff" ? (
              <Link href="/Adminpage/AdminDashboard">
                <li
                  className={`${active === 5 ? "listactive" : ""}`}
                  onClick={() => setActive(5)}
                >
                  {active == 5 ? <div className="nav-active"></div> : ""}
                  <span>
                    <GrUserAdmin className="menu-icon" />
                  </span>
                  <p> Admin</p>
                </li>
              </Link>
            ) : (
              ""
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
export const jgi = () => {};
export default Topbar;
