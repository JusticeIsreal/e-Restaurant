import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useSWR from "swr";
import { TiArrowBack } from "react-icons/ti";
import {
  checkOut,
  getExchange,
  getSessionUser,
  newRate,
  registerUser,
} from "../Services/functions";
import { useRouter } from "next/router";
import { Transaction } from "firebase/firestore";
import Cookies from "js-cookie";

function PayForm({
  product,
  count,
  priceNumber,
  setPayModal,
  productsArray,
  totalAmount,
  sessionUser,
  getUserSession,
  payModal,
}) {
  const router = useRouter();
  // currency change

  const [currencySign, setCurrencySign] = useState("₦");
  const [paymentBtn, setPaymentBtn] = useState(true);
  const [converiontAmount, setConvertionAmount] = useState(1);
  const testing = useRef();
  const selectedCurrency = (e) => {
    let data = e.target?.value;
    // console.log(data);
    if (data === "usd") {
      setCurrencySign("$");
      return setConvertionAmount(payCurrency?.dolarexchange);
    } else if (data === "eur") {
      setCurrencySign("€");
      return setConvertionAmount(payCurrency?.euroexchange);
    } else if (data === "ngn") {
      setCurrencySign("₦");
      return setConvertionAmount(payCurrency?.nairaexchange);
    } else {
      setCurrencySign("£");
      return setConvertionAmount(1);
    }
  };
  // console.log(converiontAmount);
  // login
  const logIN = async (logInGuestUser) => {
    axios
      .post(
        "https://jniskincare.onrender.com/api/v1/userverification/loginuser",
        {
          useremail: logInGuestUser.useremail,
          password: logInGuestUser.password,
        }
      )
      .then((resp) => {
        const token = resp.data.data;
        Cookies.set("JWTtoken", token);
        // console.log("login");
      })
      .catch((error) => {
        console.log(error?.response?.data?.message);
      });
  };

  // get user session
  const [getUserSessiond, setGetUserSessiond] = useState(false);
  const [payCurrency, setpayCurrency] = useState();
  useEffect(() => {
    // console.log(productsArray);
    const getSession = async () => {
      if (getUserSession || sessionUser) {
        setGetUserSessiond(true);
      }
      const currencyRate = await getExchange();
      setpayCurrency(currencyRate);
    };

    getSession();
  }, [payModal]);
  // useform config
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  //   console.log(productsArray);
  const addressRef = useRef("");
  const [productData, setProductData] = useState({});
  const [confirmDetails, setConfirmDetails] = useState({});
  const [showConfirmDetails, setShowConfirmDetails] = useState(false);

  const cartFinalProducts = [];
  useEffect(() => {
    if (!product) {
      for (const p of productsArray) {
        // calculate the total cost
        const newProduct = {
          productname: p.productname,
          productspec: p.productspec,
          productprice: (p.productprice / p.quantity) * converiontAmount,
          quantity: p.quantity,
        };
        cartFinalProducts.push(newProduct);
        // console.log(cartFinalProducts);
        // add the total cost to the totalAmount variable
      }
    }
  }, []);

  const onSubmitBanner = async (data, e) => {
    e.preventDefault();
    // const ddd = await selectedCurrency(data);
    // console.log(converiontAmount);
    setConfirmDetails(data);

    if (product) {
      const dynamicItemDetails = {
        deliveryfee: parseInt(data.state.split(",")[1] * converiontAmount),
        homedelivery: parseInt(data.homedelivery * converiontAmount),
        anyinfo: data.anyinfo,
        currency: data.currency,
        converiontAmount,
        deliveryaddress: `${data.street},${data.state.split(",")[0]}`,
        product: [
          {
            productname: product.productname,
            productspec: product.productnumber,
            productprice: parseInt(product.productprice * converiontAmount),
            quantity: count,
            clientnote: data.anyinfo,
            currency: data.currency,
          },
        ],
      };
      setProductData(dynamicItemDetails);
    } else {
      for (const p of productsArray) {
        // calculate the total cost
        const newProduct = {
          productname: p.productname,
          productspec: p.productspec,
          productprice: (p.productprice / p.quantity) * converiontAmount,
          quantity: p.quantity,
          currency: data.currency,
        };
        cartFinalProducts.push(newProduct);
        // console.log(cartFinalProducts);
        // add the total cost to the totalAmount variable
      }

      const cartItemDetails = {
        deliveryfee: parseInt(data.state.split(",")[1] * converiontAmount),
        homedelivery: parseInt(data.homedelivery * converiontAmount),
        anyinfo: data.anyinfo,
        currency: data.currency,
        deliveryaddress: `${data.street}, ${data.state.split(",")[0]}`,
        product: cartFinalProducts,
        converiontAmount,
      };
      setProductData(cartItemDetails);
      // console.log(cartItemDetails);
    }

    // localStorage.setItem("localCartItem", JSON.stringify(localCart));
    if (data.username) {
      const guestUser = {
        username: data.username.toLowerCase() + " " + "(guest)",
        useremail: data.useremail.toLowerCase() + Date.now(),
        position: "guest",
        policy: true,
        userphonenumber: data.userphonenumber,
        password: "guest",
        verified: true,
      };
      localStorage.setItem("userLoginDetails", JSON.stringify(guestUser));

      // register the guest
      setPaymentBtn(false);
      axios
        .post(
          "https://jniskincare.onrender.com/api/v1/userverification/registeruser",
          guestUser
        )
        .then((resp) => {
          let userInLocal = localStorage.getItem("userLoginDetails");
          let logInGuestUser = JSON.parse(userInLocal);
          // console.log(resp.data.status);
          localStorage.setItem("userId", resp.data.data.userId);
          if (resp.data.status === "PENDING") {
            logIN(logInGuestUser);
            // console.log("logine");
            setPaymentBtn(true);
          }
        })
        .catch((error) => {
          console.log(error.response.data.error);
          setPaymentBtn(false);
        });
    }
    setShowConfirmDetails(true);
  };
  //   console.log(showConfirmDetails);
  // DYNAMIC PAGE ITEM TOTAL
  const total =
    converiontAmount *
    (parseInt(confirmDetails?.state?.split(",")[1]) +
      parseInt(confirmDetails.homedelivery) +
      priceNumber);
  const CartTotalPrice =
    converiontAmount *
    (parseInt(totalAmount) +
      parseInt(confirmDetails?.state?.split(",")[1]) +
      parseInt(confirmDetails.homedelivery));
  // CHECKOUT

  const [btnStatus, setBtnStatus] = useState(true);

  const checkOutpayment = () => {
    const token = Cookies.get("JWTtoken");
    axios
      .post(
        "https://jniskincare.onrender.com/api/v1/transaction/posttransaction",
        productData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const transactionID = {
          transactID: res?.data?.data?.paymentIntent?.id,
          transactionID: res?.data?.data?.Transaction?._id,
        };
        // console.log(res.data.data.url);
        localStorage.setItem("transactID", JSON.stringify(transactionID));
        router.push(`${res.data.data.url}`);
      })
      .catch((err) => {
        console.log(err);
      });

    setBtnStatus(false);
  };

  const cancelTransaction = async () => {
    setBtnStatus(false);
    router.push("/");
  };
  // console.log(productData);
  return (
    <div className="modal-main-con">
      <div className="modal-relative">
        <div className="modal-card">
          <button className="go-back" onClick={() => setPayModal(false)}>
            <TiArrowBack />
            Back
          </button>
          {showConfirmDetails && (
            <div className="confirm-form-info">
              <button
                className="go-back"
                onClick={() => setShowConfirmDetails(!showConfirmDetails)}
              >
                <TiArrowBack />
                Back
              </button>
              <h3>Confirm details</h3>
              {product ? (
                <>
                  {" "}
                  <p>
                    Product Name: <span>{product.productname}</span>
                  </p>
                  <p>
                    Product Spec: <span>{product.productspec}</span>
                  </p>
                  <p>
                    Product Price:{" "}
                    <span>
                      {" "}
                      <sup>{currencySign}</sup>
                      {Number(
                        product?.productprice * converiontAmount
                      ).toLocaleString()}
                    </span>{" "}
                  </p>
                  <p>
                    Quantity: <span>{count}</span>
                  </p>
                  <p>
                    Delivery fee:
                    <span>
                      {" "}
                      <sup>{currencySign}</sup>
                      {(
                        converiontAmount *
                        (parseInt(confirmDetails?.state?.split(",")[1]) +
                          parseInt(confirmDetails.homedelivery))
                      ).toLocaleString()}{" "}
                      <span>{confirmDetails?.state?.split(",")[0]}</span>
                    </span>
                  </p>
                  <p>
                    Currency:
                    <span>{confirmDetails?.currency} </span>
                  </p>
                  <p className="total">
                    Total:{" "}
                    <span>
                      {" "}
                      <sup>{currencySign}</sup> {total.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    Delivery address:{" "}
                    <span>
                      {confirmDetails?.street},
                      {confirmDetails?.state?.split(",")[0] + " " + "State"}
                    </span>
                  </p>
                  <p>
                    Adiitional info:{" "}
                    <span>
                      {confirmDetails.anyinfo
                        ? `${confirmDetails.anyinfo}`
                        : "No"}
                    </span>
                  </p>
                </>
              ) : (
                <>
                  {productsArray.map((item) => (
                    <div key={item.productname + Math.random()}>
                      <p>
                        Product Name: <span>{item.productname}</span>
                      </p>
                      <p>
                        Product Spec: <span>{item.productspec}</span>
                      </p>
                      <p>
                        Product Price:{" "}
                        <span>
                          {" "}
                          <sup>{currencySign}</sup>
                          {(
                            converiontAmount *
                            parseInt(item?.productprice / item.quantity)
                          ).toLocaleString()}
                        </span>{" "}
                      </p>
                      <p>
                        Quantity: <span>{item.quantity}</span>
                      </p>

                      <p className="total">
                        Total:{" "}
                        <span>
                          {" "}
                          <sup>{currencySign}</sup>
                          {(
                            converiontAmount *
                            ((item?.productprice / item.quantity) *
                              item.quantity)
                          ).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  ))}
                  <p>
                    Delivery fee:
                    <span>
                      {" "}
                      <sup>{currencySign}</sup>
                      {(
                        converiontAmount *
                        (parseInt(confirmDetails?.state?.split(",")[1]) +
                          parseInt(confirmDetails.homedelivery))
                      ).toLocaleString()}{" "}
                      <span>{confirmDetails?.state?.split(",")[0]}</span>
                    </span>
                  </p>
                  <p>
                    Currency:
                    <span>{confirmDetails?.currency} </span>
                  </p>
                  <p>
                    Delivery address: <span>{confirmDetails?.street}</span>
                  </p>
                  <p>
                    Adiitional info:{" "}
                    <span>
                      {confirmDetails.anyinfo
                        ? `${confirmDetails.anyinfo}`
                        : "No"}
                    </span>
                  </p>
                </>
              )}
              {btnStatus ? (
                <>
                  {paymentBtn && (
                    <>
                      {" "}
                      {CartTotalPrice < 999999 || total < 999999 ? (
                        <div
                          className="checkout-btn"
                          onClick={() => checkOutpayment()}
                        >
                          <button>
                            CHECK OUT ({currencySign}
                            {product ? (
                              `${total.toLocaleString()}`
                            ) : (
                              <>
                                {" "}
                                {(
                                  converiontAmount *
                                  (parseInt(totalAmount) +
                                    parseInt(
                                      confirmDetails?.state?.split(",")[1]
                                    ) +
                                    parseInt(confirmDetails.homedelivery))
                                ).toLocaleString()}
                              </>
                            )}
                            )
                          </button>
                        </div>
                      ) : (
                        <div
                          className="checkout-btn"
                          // onClick={() => checkOutpayment()}
                        >
                          <button>
                            ({currencySign}
                            {product ? (
                              `${total.toLocaleString()}`
                            ) : (
                              <>
                                {" "}
                                {(
                                  converiontAmount *
                                  (parseInt(totalAmount) +
                                    parseInt(
                                      confirmDetails?.state?.split(",")[1]
                                    ) +
                                    parseInt(confirmDetails.homedelivery))
                                ).toLocaleString()}
                              </>
                            )}
                            )
                            <a
                              style={{ color: "white" }}
                              target="_blank"
                              href={`https://wa.me/+447404699950?text=Hello,I want to make a purchange of ${currencySign} ${
                                product
                                  ? total.toLocaleString()
                                  : converiontAmount * parseInt(totalAmount) +
                                    parseInt(
                                      confirmDetails?.state?.split(",")[1]
                                    ) +
                                    parseInt(confirmDetails.homedelivery)
                              }`}
                            >
                              Amount over limit, Click to contact seller
                            </a>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div
                  className="checkout-btn"
                  onClick={() => cancelTransaction()}
                >
                  <button>Loading ...</button>
                </div>
              )}
            </div>
          )}{" "}
          {/* PAYMENT FORM*/}
          <form
            onSubmit={handleSubmit(onSubmitBanner)}
            className="payment-form"
          >
            {/* ADDRESS */}{" "}
            <label ref={addressRef}>Enter delivery details</label>
            {/* STREET */}
            {getUserSessiond ? (
              ""
            ) : (
              <>
                {" "}
                <div>
                  <input
                    type="text"
                    placeholder="Whats's your name ?"
                    {...register("username", { required: true })}
                  />
                  {errors.username && (
                    <span
                      className="errror-msg"
                      style={{
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "red",
                      }}
                    >
                      Kindly Enter your name
                    </span>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Whats's your email address ?"
                    {...register("useremail", { required: true })}
                  />
                  {errors.useremail && (
                    <span
                      className="errror-msg"
                      style={{
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "red",
                      }}
                    >
                      Kindly Enter your name
                    </span>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Whats's your phone number ?"
                    {...register("userphonenumber", { required: true })}
                  />
                  {errors.userphonenumber && (
                    <span
                      className="errror-msg"
                      style={{
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "red",
                      }}
                    >
                      Kindly Enter your phone number
                    </span>
                  )}
                </div>
              </>
            )}{" "}
            {/* ADDRESS */}
            <div>
              <input
                type="text"
                placeholder="Delivery Address"
                {...register("street", { required: true })}
              />
              {errors.street && (
                <span
                  className="errror-msg"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "red",
                  }}
                >
                  Kindly Enter house number and street
                </span>
              )}
            </div>
            {/* STATE */}
            <div>
              <select {...register("state", { required: true })}>
                <option value="">Location</option>
                <option value="Within UK,0">Within UK</option>
                <option value="Outside UK,20">Outside UK</option>
                <option value="Africa,20">Africa</option>
              </select>
              {errors.state && (
                <span
                  className="errror-msg"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "red",
                  }}
                >
                  Kindly Enter Delivery state
                </span>
              )}
            </div>
            {/* home delivery */}
            <div>
              <select {...register("homedelivery", { required: true })}>
                <option value="">Delivery</option>
                <option value="12">Special delivery £12 (1 day)</option>
                <option value="5">Normal delivery £5 (2 - 3 days)</option>
              </select>
              {errors.homedelivery && (
                <span
                  className="errror-msg"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "red",
                  }}
                >
                  Kindly Enter Delivery state
                </span>
              )}
            </div>
            {/* STATE */}
            <div>
              <select
                {...register("currency", { required: true })}
                onChange={(e) => selectedCurrency(e)}
                // ref={testing}
              >
                <option value="">Currency</option>
                <option value="gbp">GBP ("£") </option>
                <option value="usd">UDS ("$")</option>
                <option value="ngn">NGN ("₦")</option>
                <option value="eur">EURO ("€")</option>
              </select>
              {errors.currency && (
                <span
                  className="errror-msg"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "red",
                  }}
                >
                  Kindly Enter preferred currency
                </span>
              )}
            </div>
            <div>
              <textarea
                // type="text"
                placeholder="Enter any other OPTIONAL information."
                {...register("anyinfo")}
              />
            </div>
            <input
              type="submit"
              className="submit-btn"

              //   value={loadingBanner ? "Uploading..." : "Upload Banner"}
            />
            <img
              src="https://res.cloudinary.com/djtneu2rh/image/upload/v1684191585/WhatsApp_Image_2023-05-15_at_11.59.01_PM-removebg-preview_o2anuk.png"
              alt="img"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default PayForm;
