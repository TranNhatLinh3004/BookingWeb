import React, { useContext, useEffect, useState } from "react";
import Helmet from "../../assets/helmet/Helmet";
import { Container, Row, Col, NavLink } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "./home.css";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import handleScroll from "../../feature/handleScroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner01 from "../../assets/images/banner01.jpeg";
import banner02 from "../../assets/images/banner05.jpg";
import banner03 from "../../assets/images/banner07.jpeg";
import banner04 from "../../assets/images/banner08.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { newSearch } from "../../redux/slices/searchSlice";
import Featured from "../../components/UI/featured/Featured";
import HotelCard from "../../components/UI/hotelcard/HotelCard";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const slideData = [
  {
    image: banner01,
    alt: "Slide 1",
  },
  {
    image: banner02,
    alt: "Slide 2",
  },
  {
    image: banner03,
    alt: "Slide 3",
  },
  {
    image: banner04,
    alt: "Slide 4",
  },
];
const SampleNextArrow = (props) => {
  const { onClick } = props;
  // console.log(props.onClick);
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="next">
        <i
          style={{
            color: "#111",
            fontSize: "20px",
          }}
          class="uil uil-angle-right"
        ></i>{" "}
      </button>
    </div>
  );
};
const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="prev">
        <i
          style={{
            fontSize: "20px",
            color: "#111",
          }}
          class="uil uil-angle-left"
        ></i>{" "}
      </button>
    </div>
  );
};

function Home(props) {
  const [hotelNames, setHotelNames] = useState({});
  const year = new Date().getFullYear();
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [images, setImages] = useState([heroImg, heroImg1, heroImg2]);
  // const [currentIndex, setCurrentIndex] = useState(0);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((preIndex) =>
  //       preIndex === images.length - 1 ? 0 : preIndex + 1
  //     );
  //   }, 5000);
  //   console.log("Image", currentIndex);
  //   return () => clearInterval(interval);
  // }, [currentIndex, images.length]);
  let height = document.body.scrollHeight;
  const [scrollY, setHeight] = useState(height);
  const [menu, setMenu] = useState(true);
  const classes = useStyles();

  window.addEventListener("scroll", () => {
    setHeight(document.body.scrollHeight);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    handleScroll();

    // document.header.className = icon;
  }, [scrollY]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };
  const handleSearch = () => {
    console.log(destination, dates, options, "search");
    // dispatch(newSearch({ destination, dates, options }));
    navigate(`/hotels?city=${destination}`, {
      state: { destination, dates, options },
    });
  };
  const handleClear = () => {
    setDestination("");
  };
  const nav__links = [
    // {
    //   path: "/home",
    //   display: "Chờ xác nhận",
    // },
    // {
    //   path: "/hotels",
    //   display: "Trống",
    // },
    // {
    //   path: "/reached",
    //   display: "Đã đặt",
    // },
    // {
    //   path: "/out-of-date",
    //   display: "Quá hạn",
    // },
    {
      path: "/goc-cam-hung",
      display: "Hoàn tất mục cho thuê của bạn",
    },
  ];
  const userData = useSelector((state) => state.user);
  const [reloadData, setReloadData] = useState(false);
  const [dataLeave, setDataLeave] = useState([]);

  const handleReloadData = () => {
    setReloadData((prev) => !prev);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/booking/find/${userData._id}`
        );
        console.log(response.data);

        // getbookingLeaveById(userData._id);
        setDataLeave(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [reloadData]);
  const accessBooking = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/booking/accessBooking`,
        data
      );
      if (response) {
        setReloadData((prev) => !prev);
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getNameHotelById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/hotels/${id}`
      );
      return response.data.name;
    } catch (error) {}
  };

  // getNameHotelById("66288c8a0964b2f670122c44")
  //   .then((hotelName) => {
  //     console.log("Hotel name:", hotelName);
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error.message);
  //   });

  const handleaccessBooking = async (leaveData) => {
    // const leaveData = dataLeave[0];
    const newData = {
      bookingId: leaveData._id,
      subtotal: leaveData.rooms.reduce((total, room) => total + room.price, 0),
      userId: userData._id,
      name: leaveData.name,
      phone: leaveData.phone,
      rooms: leaveData.rooms.map((room) => ({
        roomId: room.roomId,
        roomNumbers: room.roomNumbers.map((roomNumber) => ({
          number: roomNumber.number,
          unavailableDates: roomNumber.unavailableDates.map((dateString) => {
            const dateOnly = dateString.substring(0, 10);
            return dateOnly;
          }),
        })),
      })),
    };
    console.log(newData, "newwwwwwwwwwwww");
    await accessBooking(newData);
  };
  // console.log(userData, "linnnnnnnnnnnnnnnnnnnnnnnnn");
  // console.log(dataLeave, "linnnnnnnnnnnnnnnnnnnnnnnnn");
  useEffect(() => {
    const getHotelNames = async () => {
      const newHotelNames = {};
      for (const item of dataLeave) {
        const hotelId = item.hotel;
        if (!hotelNames[hotelId]) {
          try {
            const hotelName = await getNameHotelById(hotelId);
            newHotelNames[hotelId] = hotelName;
          } catch (error) {
            newHotelNames[hotelId] = "Không tìm thấy tên khách sạn";
          }
        }
      }
      setHotelNames(newHotelNames);
    };
    getHotelNames();
  }, [dataLeave]);
  return (
    <>
      {userData.user_type === "lease" ? (
        <div className="wrapper__manage">
          <div className="heading">
            <h4>Tình trạng phòng:</h4>
            {/* <button
              type="
          "
            >
              Hoàn tất mục cho thuê của bạn
            </button> */}
            {/* </div> */}
            <div className={menu ? "navigation" : "navigation active"}>
              <ul className="menu">
                {nav__links.map((item, index) => {
                  return (
                    <li className="" key={index}>
                      <Link
                        to={item.path}
                        className={(navClass) =>
                          navClass.isActive ? "nav__active" : ""
                        }
                      >
                        {item.display}{" "}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div
            style={{
              height: "20px",
            }}
          ></div>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tên khách hàng</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thời gian đặt phòng</TableCell>
                  <TableCell>Khách sạn</TableCell>
                  <TableCell>Giá tiền</TableCell>
                  <TableCell>Số phòng</TableCell>
                  <TableCell>Ngày đặt/trả</TableCell>
                  <TableCell>Chấp nhận</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataLeave
                  .filter((item) => !item.active)
                  .map((item, index) => (
                    <React.Fragment key={item._id}>
                      {item.rooms.map((room) => (
                        <React.Fragment key={room._id}>
                          {room.roomNumbers.map((roomNumber) => (
                            <TableRow key={roomNumber._id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>(+84) {item.phone}</TableCell>
                              <TableCell>
                                {item.active ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {new Date(item.modifiedOn).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {/* {hotelNames[item.hotel] || "Đang tải..."} */}
                                {item.nameHotel}
                              </TableCell>
                              <TableCell>{room.price}</TableCell>
                              <TableCell>{roomNumber.number}</TableCell>
                              <TableCell>
                                {roomNumber.unavailableDates
                                  .map((dateString) => {
                                    const dateOnly = dateString.substring(
                                      0,
                                      10
                                    );
                                    return dateOnly;
                                  })
                                  .join(", ")}
                              </TableCell>
                              <TableCell>
                                <button
                                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                  onClick={() => handleaccessBooking(item)}
                                >
                                  Chấp nhận
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  )) || "Đang tải..."}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <Helmet title="Home">
          <div className="section__home">
            <section className="hero__section" id="home">
              {" "}
              <div className="container__banner">
                <Slider {...settings}>
                  {slideData.map((slide, index) => (
                    <div key={index}>
                      <img
                        style={{
                          width: "100%",
                          height: "360px",
                          backgroundSize: "contain",
                          objectFit: "cover",
                        }}
                        src={slide.image}
                        alt={slide.alt}
                      />
                    </div>
                  ))}
                </Slider>{" "}
              </div>{" "}
              <div className="headerSearch">
                <div className="headerSearchItem place__home">
                  <FontAwesomeIcon icon={faBed} className="headerIcon" />
                  <input
                    type="text"
                    value={destination}
                    placeholder="Bạn muốn đi đâu?"
                    className="headerSearchInput "
                    onChange={(e) => setDestination(e.target.value)}
                  />{" "}
                  {destination ? ( // Checking if the destination has value
                    <span onClick={handleClear}>
                      <i className="uil uil-times"></i>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="headerSearchItem">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="headerIcon"
                  />
                  <span
                    onClick={() => setOpenDate(!openDate)}
                    className="headerSearchText"
                  >{`${format(dates[0].startDate, "MM/dd/yyyy")} đến ${format(
                    dates[0].endDate,
                    "MM/dd/yyyy"
                  )}`}</span>
                  {openDate && (
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => setDates([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={dates}
                      className="date"
                      minDate={new Date()}
                    />
                  )}
                </div>
                <div className="headerSearchItem">
                  <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                  <span
                    onClick={() => setOpenOptions(!openOptions)}
                    className="headerSearchText text-black"
                  >{`${options.adult} người lớn · ${options.children} trẻ em · ${options.room} phòng`}</span>
                  {openOptions && (
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
                          <span className="optionCounterNumber">
                            {options.adult}
                          </span>
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
                          <span className="optionCounterNumber">
                            {options.room}
                          </span>
                          <button
                            className="optionCounterButton"
                            onClick={() => handleOption("room", "i")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="headerSearchItem btn__search">
                  <button className="headerBtn search" onClick={handleSearch}>
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </section>{" "}
            <section className="section__listshotel">
              {" "}
              <div className="header__section bt">
                <h1 className="font-bold text-2xl">
                  Những phòng được khách yêu thích
                </h1>
                <Link to="/hotels">Xem thêm</Link>
              </div>
              <HotelCard />
            </section>
            <section className="offers__container hidden">
              <div className="text-start ">
                {" "}
                <div className="header__section">
                  <div class="loader"></div>
                  <h1 className="font-bold text-2xl">Ưu đãi</h1>
                </div>
                <p className="homeSubtitle">
                  Khuyến mãi, ưu đãi và ưu đãi đặc biệt dành cho bạn
                </p>
              </div>

              <div className="container__content">
                <h4>Năm mới, những chuyến phiêu lưu mới</h4>
                <p>
                  Tiết kiệm 15% trở lên khi bạn đặt phòng và lưu trú trước ngày
                  1 tháng 4 <br />
                  năm 2024
                </p>
                <button
                  className="headerBtn offer"
                  style={{
                    position: "relative",

                    marginTop: "10px",
                  }}
                >
                  Khám phá kỳ nghỉ
                </button>
              </div>
              {/* <div className="container__dot">
            <div class="loader"></div>
          </div> */}
            </section>{" "}
            <section className="trending__container">
              <div className="wrapper__heading">
                <h1 className="font-bold text-2xl">Điểm đến đang thịnh hành</h1>
                <p className="homeSubtitle">
                  Các lựa chọn phổ biến cho du khách Việt Nam
                </p>
              </div>
              <Featured />
            </section>{" "}
            <section className="section__posts">
              {" "}
              <div className="header__section bt">
                <h1 className="font-bold text-2xl">
                  Lấy cảm hứng cho chuyến đi tiếp theo của bạn
                </h1>
                <Link to="/news">Xem thêm</Link>
              </div>
              <div className="container__posts">
                <div className="posts__left posts">
                  <div className="img__wrapper">
                    <img
                      src="https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt=""
                    />
                  </div>
                  <div className="content__wrapper">
                    <h4>New Year’s Eve in New York City</h4>
                    <p>
                      The city that never sleeps lives true to its name each
                      year with a vibrant tapestry.
                    </p>
                  </div>
                </div>
                <div className="posts__right posts">
                  <div className="post">
                    <img
                      src="https://images.pexels.com/photos/1673978/pexels-photo-1673978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt=""
                    />
                    <h4>New Year’s Eve in New York City</h4>
                    <p>
                      The city that never sleeps lives true with a vibrant
                      tapestry.
                    </p>
                  </div>
                  <div className="post">
                    <img
                      src="https://images.pexels.com/photos/1673978/pexels-photo-1673978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt=""
                    />
                    <h4>New Year’s Eve in New York City</h4>
                    <p>
                      The city that never sleeps lives true with a vibrant
                      tapestry.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Helmet>
      )}
    </>
  );
}

export default Home;
