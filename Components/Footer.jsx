import React from "react";
import { RiFacebookLine, RiTwitterLine } from "react-icons/ri";
import {
  AiOutlineYoutube,
  AiOutlineInstagram,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import Link from "next/link";
import { getSessionUser } from "../Services/functions";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
function Footer() {
  const router = useRouter();
  // FETCHING SESSION USER NAME AND CART LENGTH
  const [userPosition, setUserPosition] = useState();
  useEffect(() => {
    const userName = async () => {
      const userData = await getSessionUser();
      setUserPosition(userData?.user?.position);
    };
    userName();
  }, [userPosition]);

  // // FETCHING SESSION USER NAME AND CART LENGTH
  const [name, setName] = useState("");
  const [cartLength, setCartLength] = useState([]);
  const [session, setSession] = useState([]);
  useEffect(() => {
    async function fetchSessionUser() {
      const userData = await getSessionUser();
      if (userData && userData.user) {
        setSession(userData);
        setName(userData?.user?.username);
        setCartLength(userData?.user.cart);
      }
    }
    fetchSessionUser();
  }, [router]);
  // console.log(userPosition);

  // LOGOUT
  const logOUT = () => {
    Cookies.remove("JWTtoken");
    location.reload();
    router.push("/");
    localStorage.removeItem("userLoginDetails");
  };
  return (
    <div className="footer-main-con">
      <div className="footer-con">
        <div className="top-con">
          <div className="img-con">
            <img
              src="https://res.cloudinary.com/dnfa3ujys/image/upload/v1685984511/WhatsApp_Image_2023-06-05_at_3.43.15_PM_xrkz2v.jpg"
              alt="img"
            />
          </div>
          {/* <p>RSO/Shipping/Marine/Procurement/Logistics</p> */}
          <div className="icon-con">
            <a
              href="https://www.facebook.com/officialjennyskincare"
              target="_blank"
            >
              <RiFacebookLine className="icon" />
            </a>
            <a
              href="https://instagram.com/jennyshairandwig_coventry?igshid=NTc4MTIwNjQ2YQ=="
              target="_blank"
            >
              <AiOutlineInstagram className="icon" />
            </a>
            <a
              target="_blank"
              href="https://wa.me/447404699950?text=Hello, I am a customer on your platfor 'Jenny's Hair & Wig' and I need your support."
            >
              <AiOutlineWhatsApp className="icon" />
            </a>
          </div>
        </div>
        <div className="lower-con">
          <div className="quick-link">
            <h3>Navigate</h3>
            <Link href="/" className="links">
              Home
            </Link>
            <Link href="/products" className="links">
              Products
            </Link>
            <Link href="/orders" className="links">
              Orders
            </Link>
            <a
              href="https://wa.me/447404699950?text=Hello, I am a customer on your platfor 'Jenny's Hair & Wig' and I need your support."
              className="links"
            >
              Support
            </a>
          </div>

          <div className="quick-link">
            <h3>Other Links</h3>
            {userPosition === "admin" || userPosition === "staff" ? (
              <Link href="/Adminpage/AdminDashboard" className="links">
                <i></i>Admin Login
              </Link>
            ) : (
              ""
            )}
            {name ? (
              <button
                style={{
                  height: "70%",
                  color: "#113261",
                  cursor: "pointer",
                  border: ".1px solid #ff69b4",
                  width: "100px",
                }}
                onClick={() => logOUT()}
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/loginpage"
                style={{
                  height: "70%",
                  cursor: "pointer",
                  width: "100px",
                }}
              >
                <button
                  style={{
                    height: "100%",
                    color: "#113261",
                    cursor: "pointer",
                    border: ".1px solid #ff69b4",
                    width: "100px",
                    cursor: "pointer",
                  }}
                >
                  Sign in
                </button>
              </Link>
            )}
          </div>
          <div className="quick-link">
            <h3>Contact</h3>
            <p className="links">
              <b>E-mail Address: </b>{" "}
              <a href="mailto:jikhazuangbe@gmail.com">jikhazuangbe@gmail.com</a>
            </p>
            <p className="links">
              <b>Physical Address:</b> Cv2 4gu, high field road
            </p>
            <p className="links">+447404699950</p>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>
          Copyright © Jenny Hair & Wig {new Date().getFullYear()}. All Rights
          Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
