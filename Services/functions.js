import axios from "axios";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Cookies from "js-cookie";
import { db } from "../Firebase";

// FETCH SESSION /USER DETAILS API CALL
export const getSessionUser = async () => {
  const token = Cookies.get("JWTtoken");
  // const storedCart = JSON.parse(localStorage.getItem("localCart")) || [];
  if (token) {
    try {
      const response = await axios.get(
        "https://jniskincare.onrender.com/api/v1/userverification/getSessionUser",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const user = response.data.data;
      const userTransaction = response.data.data.transaction;
      const userCart = response.data.data.cart;

      return {
        user,
        userTransaction,
        userCart,
      };
    } catch (error) {
      console.log(error);
      // return null; // or you can throw the error here
    }
  } else {
    return; // or you can throw the
  }
};

// CHANGE PASSWORD API CALL
export const changePassword = async (
  password,
  userId,
  router,
  setRegBtnLoading,
  setNotificationModal,
  setErrMsgServer
) => {
  // const userId = localStorage.getItem("userId") || [];
  axios
    .post(
      "https://jniskincare.onrender.com/api/v1/userverification/resetpassword",
      {
        password,
        userId,
      }
    )
    .then((resp) => {
      console.log(resp);

      setRegBtnLoading(false);
      localStorage.removeItem("userId");
      alert("passord Reset Successful, Proceed to Login");
      router.push("/loginpage");
    })
    .catch((error) => {
      // console.log(error);
      setErrMsgServer(error.response);
      setRegBtnLoading(false);
      setTimeout(() => {
        setErrMsgServer("");
      }, 3000);
    });
};

// LOG IN API CALL
export const logIN = async (setLoading, router, setErrMsg, details) => {
  axios
    .post(
      "https://jniskincare.onrender.com/api/v1/userverification/loginuser",
      details
    )
    .then((resp) => {
      const token = resp.data.data;
      Cookies.set("JWTtoken", token);
      router.push("/");
      setErrMsg("");
      setLoading(false);
    })
    .catch((error) => {
      setErrMsg(error?.response?.data?.message);
      setLoading(false);
    });
};

// REGISTER USER
export const registerUser = async (
  user,
  setShowOTPForm,
  setShowResendOTPForm,
  setShowResendOTPLink,
  setRegErrMessage,
  setRegBtnLoading,
  setNotificationModal
) => {
  axios
    .post(
      "https://jniskincare.onrender.com/api/v1/userverification/registeruser",
      user
    )
    .then((resp) => {
      // console.log(resp.data.status);
      localStorage.setItem("userId", resp.data.data.userId);
      setShowOTPForm(true);
      setShowResendOTPForm(false);
      setRegBtnLoading(false);
      setNotificationModal(resp.data.status);
    })
    .catch((error) => {
      setRegErrMessage(error.response.data.error);
      setShowResendOTPLink(true);
      setRegBtnLoading(false);
      setNotificationModal(false);
      setTimeout(() => {
        setRegErrMessage("");
      }, 3000);
    });
};

// RESEND OTP
export const emailResendOTP = async (
  user,
  setShowOTPForm,
  setRegErrMessage,
  setRegBtnLoading,
  setNotificationModal
) => {
  axios
    .post(
      "https://jniskincare.onrender.com/api/v1/userverification/resendotp",
      user
    )
    .then((resp) => {
      // console.log(resp.data);
      localStorage.setItem("userId", resp.data.data.userId);
      setShowOTPForm(true);
      setRegErrMessage("");
      // setShowResendOTPForm(false);
      setRegBtnLoading(false);
      setNotificationModal(resp.data.status);
    })
    .catch((error) => {
      // console.log(error);
      setRegErrMessage(error.response.data.error);
      setRegBtnLoading(false);
      setNotificationModal(false);
      setTimeout(() => {
        setRegErrMessage("");
      }, 3000);
    });
};
// RESEND OTP
export const forgetPassword = async (
  user,
  setShowOTPForm,
  setRegErrMessage,
  setRegBtnLoading,
  setNotificationModal
) => {
  axios
    .post(
      "https://jniskincare.onrender.com/api/v1/userverification/forgotPassword",
      user
    )
    .then((resp) => {
      // console.log(resp.data);
      localStorage.setItem("userId", resp.data.data.userId);
      setShowOTPForm(true);
      setRegErrMessage("");
      // setShowResendOTPForm(false);
      setRegBtnLoading(false);
      setNotificationModal(resp.data.status);
    })
    .catch((error) => {
      // console.log(error);
      setRegErrMessage(error.response.data.error);
      setRegBtnLoading(false);
      setNotificationModal(false);
      setTimeout(() => {
        setRegErrMessage("");
      }, 3000);
    });
};

// ENTER OTP
export const fogetPwEnterOTP = async (
  setRegErrMsg,
  userId,
  otp,
  router,
  setOTPBtnLoading,
  setOtpNotificationModal
) => {
  axios
    .post(
      "https://jniskincare.onrender.com/api/v1/userverification/resetpasswordOTP",
      {
        userId,
        otp,
      }
    )
    .then((resp) => {
      // console.log(resp.data);
      setOTPBtnLoading(false);
      setOtpNotificationModal(resp.data.status);
    })
    .catch((error) => {
      // console.log(error);
      setRegErrMsg(error.data.message);
      setOtpNotificationModal(false);
      setOTPBtnLoading(false);
      setTimeout(() => {
        setRegErrMsg("");
      }, 3000);
    });
};

// ENTER OTP
export const enterOTP = async (
  setRegErrMsg,
  userId,
  otp,
  router,
  setOTPBtnLoading,
  setOtpNotificationModal
) => {
  axios
    .post(
      "https://jniskincare.onrender.com/api/v1/userverification/verifyotp",
      {
        userId,
        otp,
      }
    )
    .then((resp) => {
      // console.log(resp.data);
      setOTPBtnLoading(false);
      setOtpNotificationModal(resp.data.status);
    })
    .catch((error) => {
      // console.log(error);
      setRegErrMsg(error.data.message);
      setOtpNotificationModal(false);
      setOTPBtnLoading(false);
      setTimeout(() => {
        setRegErrMsg("");
      }, 3000);
    });
};

//SINGLE TRANSACTION
const singleTransaction = async (transactID) => {
  const token = Cookies.get("JWTtoken");
  const { data } = await axios.get(
    `https://jniskincare.onrender.com/api/v1/transaction/getsingletransaction/${transactID}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  // console.log(data);
  return data.data;
};

export const singleTransactionFetcher = (transactID) =>
  singleTransaction(transactID);

// UPDATE TRANACTION STATUS
const updateTransaction = async (transactionStatus, transactID, userID) => {
  const token = Cookies.get("JWTtoken");
  await axios
    .patch(
      "https://jniskincare.onrender.com/api/v1/transaction/updatetransaction/" +
        `${userID}`,
      {
        transactionstatus: transactionStatus,
        orderRef: transactID,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )

    .then((resp) => {
      // console.log(resp);
    })
    .catch((err) => {
      throw err;
    });
};

// CHECK TRANSACTION STATUS
export const transactionStatus = async (
  transactID,
  userID
  // setGetTransactionDetails
) => {
  try {
    const response = await axios.post(
      "https://jniskincare.onrender.com/api/v1/transaction/gettransactionstatus",
      {
        paymentIntentI: transactID,
      }
    );
    // transacttransactions;
    const transactionStatus = response.data.data.status;
    // console.log(transactionStatus);
    // console.log(response);
    updateTransaction(transactionStatus, transactID, userID);
    // setGetTransactionDetails(response.data);
    return response.data.status;
  } catch (error) {
    console.log(error);
  }
};

// GET ALL TRANSACTION
export const allTransactions = async () => {
  // http://localhost:1234/api/v1/transaction/alltransaction
  const token = Cookies.get("JWTtoken");
  try {
    const response = await axios.get(
      "https://jniskincare.onrender.com/api/v1/transaction/alltransaction",
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    const transactions = response.data.data;

    const naira = transactions.filter((orders) => orders.currency === "ngn");
    const euro = transactions.filter((orders) => orders.currency === "eur");
    const dollar = transactions.filter((orders) => orders.currency == "usd");
    const pound = transactions.filter((orders) => orders.currency === "gbp");
    const failed = transactions.filter(
      (orders) =>
        orders.transactionstatus.toLowerCase() === "processing" ||
        orders.transactionstatus.toLowerCase() === "requires_action" ||
        orders.transactionstatus.toLowerCase() === "canceled" ||
        orders.transactionstatus.toLowerCase() === "requires_action"
    );
    const abandoned = transactions.filter(
      (orders) =>
        orders.transactionstatus.toLowerCase() === "requires_payment_method"
    );
    const pending = transactions.filter(
      (orders) => orders.transactionstatus.toLowerCase() == "pending"
    );
    const succeeded = transactions.filter(
      (orders) => orders.transactionstatus.toLowerCase() === "succeeded"
    );
    // console.log(transactions);
    return {
      transactions,
      naira,
      euro,
      dollar,
      pound,
      failed,
      abandoned,
      pending,
      succeeded,
    };
  } catch (error) {
    console.log(error);
  }
};
// GET ALL USERS
export const allUsers = async () => {
  const token = Cookies.get("JWTtoken");
  try {
    const response = await axios.get(
      "https://jniskincare.onrender.com/api/v1/userverification/allusers",
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    const users = response.data.data;

    return {
      users,
    };
  } catch (error) {
    console.log(error);
  }
};

//SINGLE  USER
const singleUser = async (userID) => {
  const token = Cookies.get("JWTtoken");
  const { data } = await axios.get(
    `https://jniskincare.onrender.com/api/v1/userverification/getsingleuser/${userID}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  // console.log(data);
  return data.data;
};
export const getSingleUser = (userID) => singleUser(userID);
// ADD TO CART
export const addToCart = async (productData, productID) => {
  const token = Cookies.get("JWTtoken");
  // console.log(productData);
  const product = {
    image: productData.image,
    productcategory: productData.productcategory,
    productclass: productData.productclass,
    productdescription: productData.productdescription,
    productname: productData.productname,
    productnumber: productData.productnumber,
    productoldprice: productData.productoldprice,
    productprice: productData.productprice,
    quantity: productData.quantity,
    // user: user._id,
    productID: productID,
  };

  try {
    const { data } = await axios.post(
      "https://jniskincare.onrender.com/api/v1/cart/addtocart",
      product,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    return data.status;
  } catch (error) {
    console.log(error);
  }
};

// ALL  CART
export const allCartItem = async () => {
  const token = Cookies.get("JWTtoken");

  if (token) {
    try {
      const response = await axios.get(
        "https://jniskincare.onrender.com/api/v1/cart/allcart",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const Cart = response.data.data;
      return {
        Cart,
      };
    } catch (error) {
      console.log(error);
      // return null; // or you can throw the error here
    }
  } else {
    return; // or you can throw the
  }
};

// DELETE TO CART
export const deleteCartItem = async (_id) => {
  const token = Cookies.get("JWTtoken");
  try {
    const { data } = await axios.delete(
      `https://jniskincare.onrender.com/api/v1/cart/deletecart/${_id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (data && data.status === "CART DELETED SUCCESSFUL") return true;
    else return false;
  } catch (error) {
    console.log(error);
  }
};

// CheckOUT
export const checkOut = async (productData, setTransactionDetails) => {
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
    .then((resp) => {
      setTransactionDetails(resp.data.data);

      const refID = {
        userData: resp.data.data.Transaction,
        transactID: resp.data.data.Transaction._id,
      };

      localStorage.setItem("refID", JSON.stringify(refID));
      window.location.href = resp.data.data.authorization_url;
    })
    .catch((error) => {
      console.log(error);
    });
};

// login guest

export const logInGuest = async () => {
  let userInLocal = localStorage.getItem("userLoginDetails");
  let logInGuestUser = JSON.parse(userInLocal);
  // console.log(logInGuestUser);

  if (logInGuestUser) {
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
      })
      .catch((error) => {
        console.log(error?.response?.data?.message);
        console.log(false);
      });
  }
};

//SINGLE TRANSACTION
export const getExchange = async (transactID) => {
  const token = Cookies.get("JWTtoken");

  try {
    const data = await axios.get(
      `https://jniskincare.onrender.com/api/v1/transaction/getexchange`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(data);
    return data.data.data[0];
  } catch (error) {
    console.log(error);
  }
};
// export const newRate = (transactID) => getExchange(transactID);
// http://localhost:1235/api/v1/transaction/setexchange/647d4a9db1d2683fe687006e

export const updateExchange = async (newRate) => {
  const token = Cookies.get("JWTtoken");
  await axios
    .patch(
      "https://jniskincare.onrender.com/api/v1/transaction/setexchange/648b0dc409a22b2aca59ae65",
      {
        dolarexchange: newRate.dolarexchange,
        euroexchange: newRate.euroexchange,
        nairaexchange: newRate.nairaexchange,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )

    .then((resp) => {
      location.reload();
      // console.log(resp);
    })
    .catch((err) => {
      throw err;
    });
};
