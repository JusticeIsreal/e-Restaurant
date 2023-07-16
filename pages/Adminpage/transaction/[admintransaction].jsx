import React, { useEffect, useState } from "react";
import SingleTransaction from "../../../Components/AdminPageComponents/SingleTransaction";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import {
  getSessionUser,
  singleTransactionFetcher,
  transactionStatus,
  updateTransaction,
} from "../../../Services/functions";
import axios from "axios";
import QRCode from "qrcode.react";

import html2canvas from "html2canvas";

import Cookies from "js-cookie";

import { TiArrowBack } from "react-icons/ti";
import Loader from "../../../Components/Loader";
import { SlCallEnd } from "react-icons/sl";
import { BsWhatsapp } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { GrMap } from "react-icons/gr";

// const API = "http://localhost:1234/api/v1/transaction/getsingletransaction";
function admintransaction() {
  const router = useRouter();
  const { admintransaction: transactID } = router.query;
  const {
    data: userData,
    isLoading,
    error,
  } = useSWR(transactID ? transactID : null, singleTransactionFetcher);

  // FETCH TRANSACTION STATUS
  const [currencySign, setCurrencySign] = useState("₦");
  useEffect(() => {
    async function fetchSessionUser() {
      if (userData && transactID) {
        await transactionStatus(userData, transactID);
      }
    }
    fetchSessionUser();

    if (userData?.currency === "usd") {
      setCurrencySign("$");
      return;
    } else if (userData?.currency === "eur") {
      setCurrencySign("€");
      return;
    } else if (userData?.currency === "ngn") {
      setCurrencySign("₦");
      return;
    } else {
      setCurrencySign("£");
      return;
    }
  }, [userData, router, transactID]);

  function goBack() {
    router.back();
  }

  // save pae as image
  const saveAsImage = (element) => {
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.download = "screenshot.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  // get admin session user
  // get usersession
  const [session, setSession] = useState();

  useEffect(() => {
    async function fetchSessionUser() {
      const userData = await getSessionUser(router);
      if (userData) {
        setSession(userData);
      }
    }
    fetchSessionUser();
  }, [router]);

  // useform config
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [btnLoading, setBtnLoading] = useState(true);

  const onSubmitBanner = async (data, e) => {
    e.preventDefault();
    const token = Cookies.get("JWTtoken");
    setBtnLoading(false);
    await axios
      .patch(
        "https://jniskincare.onrender.com/api/v1/transaction/updatetransaction/" +
          `${transactID}`,
        {
          status: data.orderstatus ? data.orderstatus : userData?.status,
          adminnote: data.adminnote,
          transactionstatus: data.transactionstatus
            ? data.transactionstatus
            : userData?.transactionstatus,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )

      .then((resp) => {
        setBtnLoading(false);
        location.reload();
      })
      .catch((err) => {
        throw err;
      });
    // };
  };
 
  return (
    <div className="receipt-main-con">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="receipt-heading">
            <button onClick={goBack} className="go-back">
              <TiArrowBack />
              Back
            </button>
            <h3>Transaction Receipt</h3>
            <p className="paystackRef">
              Order ID: <span>{userData?._id}</span>
            </p>
          </div>
          <div className="receipt-con main-detail-con">
            <div className="detail-con">
              <div className="transaction-order-detail">
                <div
                  className="transaction-status"
                  style={{
                    width: "95%",
                  }}
                >
                  <span>Customer name:</span>
                  <span>{userData?.user[0]?.username}</span>
                </div>
                <div
                  className="transaction-status"
                  style={{
                    width: "95%",
                  }}
                >
                  <span>Customer phonenumber:</span>
                  <span>{userData?.user[0]?.userphonenumber}</span>
                </div>
                <div
                  className="transaction-status"
                  style={{
                    width: "95%",
                  }}
                >
                  <span>Customer email:</span>
                  <span>
                    {userData?.user[0]?.useremail.split(".com")[0] + ".com"}
                  </span>
                </div>
                <div
                  className="transaction-status"
                  style={{
                    width: "95%",
                  }}
                >
                  <span>Position :</span>
                  <span>{userData?.user[0]?.position}</span>
                </div>
                <div
                  className="transaction-status"
                  style={{
                    width: "95%",
                    marginBottom: "20px",
                    borderBottom: "1px dashed gray",
                  }}
                >
                  <span>Verified :</span>
                  <span>{userData?.user[0]?.verified ? "Yes" : "No"}</span>
                </div>

                <p
                  className="item-heading"
                  style={{
                    width: "95%",
                    marginTop: "50px",
                  }}
                >
                  <span className="p-name">Product</span>
                  <span className="p-name">Spec</span>
                  <span>Price</span>
                  <span className="qty">Qty</span>
                  <span>Total</span>
                </p>
                {userData?.product.map((item) => (
                  <div key={item._id} className="product-details">
                    <span className="p-name">{item?.productname}</span>
                    <span className="p-name">{item?.productspec}</span>
                    <span>
                      {currencySign} {item?.productprice?.toLocaleString()}
                    </span>
                    <span className="qty"> {item?.quantity}</span>
                    <span>
                      {currencySign} {item?.total.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div
                  className="transaction-status"
                  style={{
                    width: "95%",
                    marginTop: "10px",
                    borderTop: "1px dashed gray",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Location fee:</span>
                  <span>
                    {currencySign} {userData?.deliveryfee.toLocaleString()}
                  </span>
                  <span> {userData?.deliveryaddress.trim().split(" ").slice(-3).join(" ")}</span>
                </div>
                <div className="transaction-status" style={{ width: "95%" }}>
                  <span>Delivery fee:</span>
                  <span>
                    {currencySign} {userData?.homedelivery.toLocaleString()}
                  </span>
                </div>
                <div className="transaction-status" style={{ width: "95%" }}>
                  <span>Currency:</span>
                  <span>{userData?.currency}</span>
                </div>
                <div className="transaction-status" style={{ width: "95%" }}>
                  <span>Client note:</span>
                  <span>{userData?.anyinfo ? userData.anyinfo : "No"}</span>
                </div>

                <div
                  className="transaction-status first"
                  style={{ width: "95%", borderTop: "1px dashed gray" }}
                >
                  <span>Transaction status:</span>
                  <span
                    style={{
                      color: (() => {
                        switch (userData?.transactionstatus) {
                          case "succeeded":
                            return "#389738";
                          default:
                            return "#db504a";
                        }
                      })(),
                    }}
                  >
                    {userData?.transactionstatus}
                  </span>
                </div>
                <div className="transaction-status" style={{ width: "95%" }}>
                  <span>Order status:</span>
                  <span
                    style={{
                      color: (() => {
                        switch (userData?.status) {
                          case "Processing":
                            return "#db504a";
                          case "Transit":
                            return "#ffce26";
                          case "Delivered":
                            return "#389738";
                          default:
                            return "#3d91e6";
                        }
                      })(),
                    }}
                  >
                    {" "}
                    {userData?.status}
                  </span>
                </div>
                <div className="transaction-status" style={{ width: "95%" }}>
                  <span>Date / Time:</span>
                  <span>
                    {" "}
                    {userData?.timestamp?.substring(0, 20).toString()}
                  </span>
                </div>
                <div className="transaction-status" style={{ width: "95%" }}>
                  <span>Delivery address:</span>
                  <span> {userData?.deliveryaddress}</span>
                </div>
                <div className="transaction-status" style={{ width: "95%" }}>
                  <span>Admin note:</span>
                  <span>{userData?.adminnote}</span>
                </div>
                <div className="total-amount">
                  <h1>
                    {currencySign} {userData?.totalAmount.toLocaleString()}
                  </h1>
                </div>
                <div className="qr-code">
                  <QRCode
                    value={`https://jennyhairandwigs.vercel.app/Adminpage/transaction/${
                      transactID && transactID
                    }`}
                  />
                </div>
              </div>

              {/* SECOND PART */}
              <div className="transaction-order-detail">
                <div className="contact-customer">
                  <a
                    target="_blank"
                    href={`tel:${userData?.user[0]?.userphonenumber}`}
                  >
                    <span>
                      <SlCallEnd />
                      <p>Call</p>
                    </span>
                  </a>
                  <a
                    target="_blank"
                    href={`https://wa.me/${
                      userData?.user[0]?.userphonenumber
                    }?text=Hello, I am a ${
                      session?.user.username
                    } from Jenny hair & wig, I am chatting as regards your Order with Ref No. ${
                      userData?.paystackRef
                    } made on ${userData?.timestamp
                      .substring(0, 20)
                      .toString()}`}
                  >
                    <span>
                      <BsWhatsapp />
                      <p>Whatsapp</p>
                    </span>
                  </a>

                  <a
                    target="_blank"
                    href={`mailto:${
                      userData?.user[0]?.useremail.split(".com")[0] + ".com"
                    }`}
                  >
                    <span>
                      <AiOutlineMail />
                      <p>Email</p>
                    </span>
                  </a>

                  <a
                    target="_blank"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      userData?.deliveryaddress
                    )}`}
                  >
                    <span>
                      <GrMap />
                      <p>Location</p>
                    </span>
                  </a>
                </div>

                {session?.user.position === "admin" ? (
                  <div className="update-transaction-form">
                    <form onSubmit={handleSubmit(onSubmitBanner)}>
                      <div>
                        <select {...register("transactionstatus")}>
                          <option value="">Status of Transaction</option>
                          <option value="failed">failed</option>
                          <option value="succeeded">success</option>
                          <option value="pending">pending</option>
                        </select>
                      </div>
                      {/*ORDER STATUS */}
                      <div>
                        <select {...register("orderstatus")}>
                          <option value="">Status of Order</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Processing">Processing</option>
                          <option value="Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>

                      {/* ADMIN NOTE */}
                      <div>
                        <textarea
                          // type="text"
                          placeholder="Admin note to client."
                          {...register("adminnote")}
                        />
                      </div>

                      <input
                        type="submit"
                        className="submit-btn"
                        value={btnLoading ? "Update Status" : "Uploading..."}
                      />
                    </form>
                  </div>
                ) : (
                  ""
                )}

                <div className="download-page">
                  <p onClick={() => saveAsImage(document.body)}>Print page</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}{" "}
    </div>
  );
}
// admintransaction.requireAuth = true;
export default admintransaction;
