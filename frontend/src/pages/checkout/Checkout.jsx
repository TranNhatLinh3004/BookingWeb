import React, { useState, useRef, useEffect, useContext } from "react";
import { Col, FormGroup, Form, Container, Row } from "reactstrap";
import "./checkout.css";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Helmet from "../../assets/helmet/Helmet";
import { PayPalButton } from "react-paypal-button-v2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import queryString from "query-string";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import DetailRoom from "../../components/UI/room/DetailRoom";
import { unavailableDatesRoom } from "../../redux/API/apiRoom";
import Vnpay from "../vnpay/Vnpay";
function Checkout(props) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [unavailableDates, setUnavailableDates] = useState([]);
  const userData = useSelector((state) => state.user);
  const userId = userData._id;

  const location = useLocation();
  const currentUrl = window.location.href;

  // Tách các tham số từ URL
  const parsedUrl = queryString.parseUrl(currentUrl);

  const [profileOpen, setProfileOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [isDataHotel, setIsDataHotel] = useState([]);
  const [isRoom, isSetIsRoom] = useState(null);

  const [openRooms, setOpenRooms] = useState({});

  const [unavaliableDates, setUnavaliableDates] = useState([]);
  const [dates, setDates] = useState([
    {
      startDate: new Date(parsedUrl.query.checkin),
      endDate: new Date(parsedUrl.query.checkout),
      key: "selection",
    },
  ]);
  const [priceOfRoom, setPriceOfRoom] = useState(parsedUrl.query.priceOfRoom);
  const getNumberOfDays = (startDate, endDate) => {
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };
  const getHotelById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/hotels/${parsedUrl.query.roomId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data, loading, error } = useFetch(
    `http://localhost:5000/api/hotels/${parsedUrl.query.roomId}`
  );
  const handleChange = (e) => {
    console.log("nameHotel ", bookingData);
    //láy giá tiền vào room và set vào bookingData
    setBookingData({
      ...bookingData,
      price: priceOfRoom * dayCount + ((priceOfRoom * dayCount) / 100) * 10,
      nameHotel: data.name,
      [e.target.name]: e.target.value,
    });
  };
  const [valiableDates, setValiableDates] = useState();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const navigate = useNavigate();
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const [number, setNumber] = useState(parsedUrl.query.numberRoom);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [showPayPalButton, setShowPayPalButton] = useState(false);
  const [options, setOptions] = useState({
    adult: parsedUrl.query.numberOfAdults || 1,
    children: parsedUrl.query.numberOfChildren || 0,
    room: 1,
  });

  const [bookingData, setBookingData] = useState({
    leaseId: parsedUrl.query.lease,
    user: userId,
    name: userData.username,
    phone: "",
    price: "",
    nameHotel: "",
    hotel: parsedUrl.query.roomId,
    rooms: [
      {
        roomId: null,
        price: 0,
        roomNumbers: [
          { number: parsedUrl.query.numberRoom, unavailableDates: [] },
        ],
      },
    ],
  });

  const start = new Date(dates[0].startDate);
  const end = new Date(dates[0].endDate);
  const dayCount = 1 + Math.round(end - start) / (1000 * 60 * 60 * 24);
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleClick = (e) => {
    e.preventDefault();

    navigate("/thank-you");
    // console.log(credentials);
  };

  const handleSelect = (method) => {
    setSelectedPaymentMethod(method);
    if (method === "paypal") {
      setShowPayPalButton(true);
    } else {
      setShowPayPalButton(false);
    }
  };

  const profileOpenRef = useRef(null);
  useEffect(() => {
    // Lắng nghe sự kiện click toàn bộ trang
    const handleDocumentClick = (e) => {
      if (
        profileOpenRef.current &&
        !profileOpenRef.current.contains(e.target)
      ) {
        // Người dùng đã nhấp bên ngoài phạm vi profileOpen
        // console.log(userData._id);
        setProfileOpen(false);
      }
    };

    // Đăng ký sự kiện lắng nghe khi component được mount
    document.addEventListener("click", handleDocumentClick);

    // Hủy đăng ký sự kiện khi component bị hủy
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const unavailableDates = dates
      .map((dateRange) => {
        const startDate = format(dateRange.startDate, "yyyy-MM-dd");
        const endDate = format(dateRange.endDate, "yyyy-MM-dd");
        return [startDate, endDate];
      })
      .flat();
    setValiableDates(unavailableDates);

    // khi thay đổi ngày tháng thuê phòng thì sẽ thay đổi query bằng checkin và checkout
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("checkin", format(dates[0].startDate, "yyyy-MM-dd"));
    newSearchParams.set("checkout", format(dates[0].endDate, "yyyy-MM-dd"));
    const queryString = newSearchParams.toString();

    newSearchParams.delete("checkin");
    newSearchParams.delete("checkout");

    const finalQueryString = `${queryString}`;
    navigate(`${location.pathname}?${finalQueryString}`);
  }, [dates, navigate, location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(bookingData, "new");
      console.log(data, "new");

      await axios.post(`http://localhost:5000/api/booking/create`, bookingData);
      // setBookingSuccess(true);
      navigate("/thank-you");
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };
  const fetchRoomByHotel = async () => {
    console.log(parsedUrl.query.roomId, "aaaaaaaaaaa");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/rooms/hotel/${parsedUrl.query.roomId}`
      );
      isSetIsRoom(response.data);
      //tách dữ liệu ngày bắt đầu và ngày kết thúc để tính giá tiền
      const numberOfDays = getNumberOfDays(
        dates[0].startDate,
        dates[0].endDate
      );
      //tính giá tiền
      const totalPrice = numberOfDays * response.data[0].price;
      //set giá tiền vào bookingData
      setBookingData((prevBookingData) => ({
        ...prevBookingData,
        // nameHotel: response.data.name,
        //láy giá tiền vào room và set vào bookingData
        rooms: prevBookingData.rooms.map((room) => ({
          ...room,
          roomId: response.data[0]._id,
          price: totalPrice,
        })),
      }));
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  };
  useEffect(() => {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      rooms: prevBookingData.rooms.map((room) => ({
        ...room,
        roomNumbers: room.roomNumbers.map((roomNumber) => ({
          ...roomNumber,
          number: number,
          unavailableDates: valiableDates,
        })),
      })),
    }));
    const fetchHotelByUserId = async () => {
      const reponse = await getHotelById(parsedUrl.query.roomId);
      setIsDataHotel(reponse);
    };
    fetchHotelByUserId();
  }, [valiableDates, number]);
  useEffect(() => {
    fetchRoomByHotel();
  }, [dates]);

  const handleUnavailableDates = async (id, number) => {
    try {
      const datesResponse = await unavailableDatesRoom(id, number);
      setUnavailableDates(datesResponse.unavailableDates);
    } catch (error) {
      console.error("Error fetching unavailable dates:", error);
    }
  };

  //tách unavailableDates thành startDate và enđate sau đó sẽ truyền vào DateRange để ẩn đi những ngày tháng
  const sortedDates = unavailableDates
    .map((date) => new Date(date))
    .sort((a, b) => a - b);

  const startDate = sortedDates[0];
  const endDate = sortedDates[sortedDates.length - 1];
  const disabledDates = [];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    disabledDates.push(new Date(d));
  }
  const handleOpenRoom = (roomNumber) => {
    setOpenRooms((prevOpenRooms) => ({
      // ...prevOpenRooms,
      [roomNumber]: !prevOpenRooms[roomNumber],
    }));
  };

  const handleToggleCheckoutDatepicker = () => {
    setOpenDate(!openDate);
  };

  const handleChangeOption = (option) => {
    setNumber(option.number);
  };
  console.log(isRoom, "ssssssssssssssssssssssss");

  // console.log(openRooms, "hhhhhhhhhhhhhh");
  return (
    <Helmet title="Checkout">
      {/* <CommonSection title="Checkout" /> */}
      <section className="checkout__cart">
        <div lg="8" className="checkout__left">
          <h4 className="mb-4 fw-bold">
            <i class="uil uil-angle-left"></i>Confirmation and payment
          </h4>
          <p className="mb-4 fw-bold">Your trip</p>{" "}
          <p className="mb-4 fw-bold">
            Số phòng của bạn là: {parsedUrl.query.numberRoom}
          </p>{" "}
          <div className="headerSearchItem checkout" ref={profileOpenRef}>
            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
            <p
              onClick={() => setOpenDate(!openDate)}
              className="headerSearchText"
            >{`${format(dates[0].startDate, "MM/dd/yyyy")} đến ${format(
              dates[0].endDate,
              "MM/dd/yyyy"
            )}`}</p>
            {/* {openDate && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDates([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dates}
                className="date"
                minDate={new Date()}
              />
            )} */}
          </div>{" "}
          <div className="headerSearchItem  checkguest" ref={profileOpenRef}>
            <FontAwesomeIcon icon={faPerson} className="headerIcon" />
            <span
              onClick={() => setOpenOptions(!openOptions)}
              className="headerSearchText text-black"
            >{`${options.adult} người lớn · ${options.children} trẻ em · ${options.room} phòng`}</span>
            {/* {openOptions && (
              <div className="options">
                <div className="optionItem text-black">
                  <span className="optionText">Người lớn</span>
                  <div className="optionCounter">
                    <button
                      disabled={options.adult <= 1}
                      className="optionCounterButton"
                      onClick={() => handleOption("adult", "d")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">{options.adult}</span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("adult", "i")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="optionItem">
                  <span className="optionText">Trẻ em</span>
                  <div className="optionCounter">
                    <button
                      disabled={options.children <= 0}
                      className="optionCounterButton"
                      onClick={() => handleOption("children", "d")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">
                      {options.children}
                    </span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("children", "i")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="optionItem">
                  <span className="optionText">Phòng</span>
                  <div className="optionCounter">
                    <button
                      disabled={options.room <= 1}
                      className="optionCounterButton"
                      onClick={() => handleOption("room", "d")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">{options.room}</span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("room", "i")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )} */}
          </div>{" "}
          <form onSubmit={handleSubmit} className="form-connect">
            <div className="mb-4">
              <label htmlFor="name" className="one">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={bookingData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className=""
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={bookingData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
                className=""
              />
            </div>
          </form>{" "}
          {/* {Array.isArray(isRoom) &&
            isRoom.map((room) => (
              <div key={room._id} className="wrapper__room">
                {room?.roomNumbers.map((option, index) => (
                  <div key={option._id} className="room__detail">
                    <div className="flex">
                      <input
                        type="radio"
                        id={`option${index}`}
                        name="option"
                        onChange={() => {
                          handleChangeOption(option);
                          handleUnavailableDates(room._id, option.number);
                        }}
                        className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label
                        htmlFor={`option${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {`Phòng ${option.number}`}
                      </label>
                    </div>
                    <button
                      className="border border-black rounded-lg p-1 text-sm"
                      onClick={() => handleOpenRoom(option.number)}
                    >
                      Thông tin phòng
                    </button>
                    <DetailRoom
                      onClick={() => handleOpenRoom(option.number)}
                      hotelId={parsedUrl.query.roomId}
                      roomNumber={option.number}
                      isOpen={openRooms[option.number]}
                    />
                  </div>
                ))}
              </div>
            ))} */}
          <p className="mb-4 fw-bold">Phương thức thanh toán</p>
          <Vnpay data={bookingData} paymentMethod={paymentMethod} />
          {/* <div className="payment__methods">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="creditCard"
                onChange={() => handleSelect("creditCard")}
              />{" "}
              Tiền mặt
            </label>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                onChange={() => handleSelect("paypal")}
              />{" "}
              PayPal
            </label>
          </div>
          {showPayPalButton ? (
            <div
              className="paypal__container"
              style={{
                width: "90%",
                marginLeft: "25px",
                // height: "665px",
                // overflow: "hidden",
              }}
            >
              <PayPalButton
                amount="0.01"
                onSuccess={(details, data) => {
                  toast.success("Đã thêm vào giỏ thành công!");

                  navigate("/thank-you");
                  // Gọi đến server để lưu thông tin giao dịch (nếu cần)
                  // return fetch("/paypal-transaction-complete", {
                  //   method: "post",
                  //   body: JSON.stringify({
                  //     orderID: data.orderID,
                  //   }),
                  // });
                }}
              />
            </div>
          ) : (
            ""
          )}{" "} */}
          <div className="required-for-trip">
            <h4>Required for your trip</h4>
            <div className="message-host">
              <div className="text__box">
                <h5>Message the Host</h5>
                <p>
                  Share why you're traveling, who's coming with you, and what
                  you love about the space.
                </p>
              </div>
              <button>Add</button>
            </div>
            <div className="phone-number">
              <div className="text__box">
                <h5>Phone number</h5>
                <p>Add and confirm your phone number to get trip updates.</p>
              </div>
              <button>Add</button>
            </div>
            <hr />
            <div className="cancellation-policy">
              <h4>Cancellation policy</h4>
              <p>
                Cancel before check-in on{" "}
                <span>
                  {" "}
                  {start.toLocaleString("en", { month: "long" })}
                  <span> </span>
                  {start.getDate().toString()}
                </span>{" "}
                for a partial refund. <br />
                <a href="#">Learn more</a>
              </p>
            </div>
            <hr />
            <div className="ground-rules">
              <h4>Ground rules</h4>
              <p>
                We ask every guest to remember a few simple things about what
                makes a great guest.
              </p>
              <ul>
                <li>Follow the house rules</li>
                <li>Treat your Host's home like your own</li>
              </ul>
            </div>
          </div>
          <div className="host">
            <span>
              <i className="uil uil-hourglass"></i>
            </span>
            <p>
              <span>
                Your reservation won’t be confirmed until the Host accepts your
                request (within 24 hours).
              </span>
              You won’t be charged until then.
            </p>
          </div>
          <button className="buy__btn auth__btn w-100" onClick={handleSubmit}>
            Yêu cầu đặt chỗ
          </button>
          .
        </div>
        <div className="checkout__container">
          <div className="checkout__hotel">
            <img src={data.photos?.[0]} alt="" />
            <div className="content">
              {" "}
              <h4>{data.name}</h4>
              <p>
                <i
                  class="uil uil-map-marker"
                  style={{
                    marginRight: "3px",
                  }}
                >
                  {" "}
                </i>
                {data.address}
              </p>
              <p>
                <i
                  class="uil uil-favorite"
                  style={{
                    marginRight: "3px",
                  }}
                ></i>{" "}
                {data.rating} ({data.reviews}{" "}
                {data.reviews > 1 ? "views" : "view"})
              </p>
            </div>
          </div>
          <hr />
          <h1>Price details</h1>
          <div className="checkout__cost">
            <p
              style={{
                display: "flex",

                textDecoration: "underline",
              }}
            >
              {priceOfRoom ? priceOfRoom : data.price} x {dayCount}
              {dayCount > 1 ? <p>nights</p> : <p>nights</p>}
            </p>
            <span>
              {dayCount > 0
                ? formatNumberWithCommas(
                    priceOfRoom ? priceOfRoom * dayCount : data.price * dayCount
                  )
                : formatNumberWithCommas(
                    priceOfRoom ? priceOfRoom : data.price
                  )}
              <small
                style={{
                  textDecoration: "underline",
                }}
              >
                đ
              </small>
            </span>
          </div>
          <div className="checkout__cost taxes">
            <p
              style={{
                textDecoration: "underline",
              }}
            >
              Taxes
            </p>
            <span>
              <small
                style={{
                  textDecoration: "underline",
                }}
              >
                10%
              </small>
            </span>
          </div>
          <hr />
          <div className="checkout__cost">
            <h4>Total (VNĐ):</h4>
            <span>
              {dayCount > 0
                ? formatNumberWithCommas(
                    priceOfRoom * dayCount +
                      ((priceOfRoom * dayCount) / 100) * 10
                  )
                : formatNumberWithCommas(priceOfRoom)}
              <small
                style={{
                  textDecoration: "underline",
                }}
              >
                đ
              </small>
            </span>
          </div>
        </div>
      </section>
    </Helmet>
  );
}

export default Checkout;
