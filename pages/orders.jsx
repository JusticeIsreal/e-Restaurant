import React, { useEffect, useState } from "react";
import Topbar from "../Components/Topbar";
import Modal from "../Components/Modal";
import Orders from "../Components/OrderPage/Orders";
import Footer from "../Components/Footer";
import { useRouter } from "next/router";
import { getSessionUser, transactionStatus } from "../Services/functions";
import Loader from "../Components/Loader";
import Pagination from "../Components/Pagination";
import { paginate } from "../paginate";

function orders() {
  const router = useRouter();
  const [userTransaction, setUserTransaction] = useState([]);

  // useEffect(() => {
  //   const userNam = async () => {};
  //   userNam();
  // }, [router]);

  useEffect(() => {
    const userName = async () => {
      // const transactionStatusReturn = await transactionStatus(transactID);
      const userData = await getSessionUser();
      // console.log(userData);
      setUserTransaction(userData?.user?.transaction);
      // console.log(userData);

      if (userData?.user.block === true) {
        router.push("/Login");
      }
    };
    userName();
  }, [router]);

  //  rerout to login for unregustered users
  const [loginTriger, setLoginTriger] = useState(false);

  // ...................................
  // const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const pageOfCountries = paginate(userTransaction, currentPage, pageSize);

  const handlePageChange = (pageNumber, totalPages) => {
    if (pageNumber !== "prev" && pageNumber !== "next")
      setCurrentPage(pageNumber);
    else if (pageNumber === "prev" && currentPage > 1)
      setCurrentPage(currentPage - 1);
    else if (pageNumber === "next" && currentPage < totalPages)
      setCurrentPage(currentPage + 1);
  };

  // ..................................
  const storedRefID = localStorage.getItem("transactID");
  const transactID = JSON.parse(storedRefID);
  const [session, setSession] = useState();
  useEffect(() => {
    async function fetchSessionUser() {
      const transactID = localStorage.getItem("transactID")
        ? JSON.parse(localStorage.getItem("transactID"))
        : [];

      const userSession = await getSessionUser(router);

      if (userSession) {
        setSession(2);
        // location.reload();
      }

      const tStatus = await transactionStatus(
        transactID?.transactID,
        transactID?.transactionID
      );
      // console.log(tStatus);
      // if (!userSession) {
      //   return setLoginTriger(true);
      // }
    }
    fetchSessionUser();
  }, [router, loginTriger, userTransaction, transactID, session]);

  // useEffect(() => {
  //   // location.reload();
  // }, [router]);
  return (
    <div className="order-page-main-con">
      <Topbar />
      {userTransaction ? (
        <Orders userTransaction={pageOfCountries} />
      ) : (
        <>
          <Loader />
          <div style={{ textAlign: "center" }}>
            <h3>SEARCH FOR TRANSACTIONS ...</h3>
          </div>
          {loginTriger && <Modal setLoginTriger={setLoginTriger} />}
        </>
      )}
      <Pagination
        itemsCount={userTransaction?.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        className="pagination-order-page"
      />
      {/* <Footer /> */}
    </div>
  );
}
// orders.requireAuth = true;
export default orders;
