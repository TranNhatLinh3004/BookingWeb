import React, { useEffect, useState } from "react";
import "./bookinglist.css";
import booking from "../../assets/images/booking.png";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import queryString from "query-string";

function BookingList(props) {
  const userData = useSelector((state) => state.user);
  const [reloadData, setReloadData] = useState(false);
  const [dataLeave, setDataLeave] = useState({});
  const location = useLocation();
  const currentUrl = window.location.href;
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Tách các tham số từ URL
  const parsedUrl = queryString.parseUrl(currentUrl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/booking/${userData._id}`
        );

        // getbookingLeaveById(userData._id);
        setDataLeave(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <section className="booking ">
        <div lg="8" className="booking__top">
          <h4 className="mb-4 fw-bold">
            <i class="uil uil-angle-left"></i>Danh sách đặt phòng
          </h4>
          {/* <p className="mb-4 fw-bold">Your booking</p>{" "} */}
        </div>

        <div className="information">
          <p className="mb-4 fw-bold">Lịch sử đặt phòng của bạn</p>{" "}
          <div className="wrapper booking__list">
            {Array.isArray(dataLeave) &&
              dataLeave.map((item) => {
                return (
                  <div className="left">
                    {item.rooms.map((room, roomIndex) => (
                      <div key={room.roomId} className="total__wrapper line">
                        <div className="total line">
                          <p>Số phòng:</p>
                          <p>
                            {room.roomNumbers.map((roomNumber, numberIndex) => (
                              <span key={numberIndex}>{roomNumber.number}</span>
                            ))}
                          </p>
                        </div>
                        {/* <div className="total line">
                          <p>Ngày đặt / trả phòng:</p>
                          <p>
                            {new Date(
                              room.unavailableDates[0]
                            ).toLocaleDateString("en-GB")}
                            ,{" "}
                            {new Date(
                              room.unavailableDates[1]
                            ).toLocaleDateString("en-GB")}
                          </p>
                        </div> */}
                        <div className="total line">
                          <p>Ngày đặt / trả phòng:</p>
                          <p>
                            {room.roomNumbers.map((roomNumber, numberIndex) => (
                              <div
                                key={numberIndex}
                                style={{ display: "flex" }}
                              >
                                {roomNumber.unavailableDates.map(
                                  (date, index) => (
                                    <p>
                                      {new Date(date).toLocaleDateString(
                                        "en-GB"
                                      )}{" "}
                                      {index <
                                        roomNumber.unavailableDates.length -
                                          1 && " - "}
                                    </p>
                                  )
                                )}
                              </div>
                            ))}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="total line">
                      <p>Họ và tên:</p>
                      <p>{item.name}</p>
                    </div>
                    <div className="total line">
                      <p>Số điện thoại:</p>
                      <p>(84+) {item.phone}</p>
                    </div>
                    <div className="total line">
                      <p>Email:</p>
                      <p>{userData.email}</p>
                    </div>
                    <div className="total line">
                      <p>Tổng giá:</p>
                      <p>{formatNumberWithCommas(item.totalPrice)} VNĐ</p>
                    </div>
                  </div>
                );
              })}{" "}
            <div className="right">
              <button className="buy__btn auth__btn w-100">
                <Link to="/hotels">Tiếp tục đặt phòng</Link>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookingList;
