import React, { useEffect, useState } from "react";
import "./hoteldetail.css";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Map from "../../components/map/Map";
import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
function HotelDetails(props) {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  // const [destination, setDestination] = useState(location.state.destination);
  // const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  // const [options, setOptions] = useState(location.state.options);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const userData = useSelector((state) => state.user);
  const userId = userData._id;
  const { data, loading, error } = useFetch(
    `http://localhost:5000/api/hotels/${id}`
  );
  const navigate = useNavigate();
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  // console.log(data, "usrrrrrrrrrrrrrrrrrrrrrrrrr");
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const start = new Date(dates[0].startDate);
  const end = new Date(dates[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24);

  const handleClick = () => {
    // reFetch();
  };
  const handleOpen = (index) => {
    setSlideNumber(index);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 4 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 4 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };
  const formatNumberWithCommas = (number) => {
    // Check if number is defined
    if (number !== undefined && number !== null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      // Handle the case where number is undefined or null
      return "0"; // Or any default value or message you prefer
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      {loading ? (
        <Skeleton count={10} />
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />{" "}
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <h1 className="hotelTitle">
                  {data.name}{" "}
                  <span
                    style={{
                      marginLeft: "10px",
                      color: "grey",
                    }}
                  >
                    {" "}
                    {`${slideNumber + 1} / ${data.photos.length}`}
                  </span>
                </h1>
                <img
                  src={data.photos[slideNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <div className="hotelHeading">
              <h1 className="hotelTitle">{data.name}</h1>
              <div className="btns">
                <button className="bookNow">
                  <i class="uil uil-upload"></i> Share
                </button>{" "}
                <button className="bookNow">
                  <i class="uil uil-heart"></i> Saved
                </button>
              </div>
            </div>
            <div className="hotelImgGrid">
              {data.photos?.map((photo, index) => (
                <div className="hotelImgWrapper" key={index}>
                  <img
                    onClick={() => handleOpen(index)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
              <button onClick={() => handleOpen(0)}>
                <i class="uil uil-draggabledots"></i> Show more
              </button>
            </div>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.address}</span>
            </div>
            <span className="hotelDistance">
              8 guests - 2 bedrooms - 3 beds - 2 baths
            </span>{" "}
            <span className="hotelPriceHighlight">
              <i class="uil uil-star"></i> {data.rating} -{" "}
              <span style={{ textDecoration: "underline" }}>
                {data.reviews} reviews
              </span>
            </span>
            {/* <span className="hotelPriceHighlight">
              Book a stay over ${data.price} at this property and get a free
              airport taxi
            </span> */}
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">Information about the hotel</h1>
                <p className="hotelDesc">
                  {data.description} The newly built two-bedroom cabin is a
                  mid-century modern piece of architecture. Perched on top of a
                  hill, the property offers a sweeping 360-degree view of the
                  stunning Mount Batulao sunset, calming Balayan Bay, and lush
                  Nasugbu farmlands. Its unique terrain and elevation allow
                  guests to embrace fresh mountain breeze and cool weather
                  practically all year round. By combining the raw beauty of the
                  countryside and the comforts of a boutique hotel, the cabin
                  offers a redefined R&R experience.
                </p>
                <button>
                  Show more<i class="uil uil-angle-right"></i>
                </button>
                <h1>Location</h1>
                <Map items={data} />
                <div className="serviceList">
                  <h1>What this place offers</h1>
                  <div class="amenities">
                    <div class="amenity">
                      <span class="icon">&#127965;</span>
                      <span class="label">Mountain view</span>
                    </div>
                    <div class="amenity">
                      <span class="icon">&#127858;</span>
                      <span class="label">Kitchen</span>
                    </div>
                    <div class="amenity">
                      <span class="icon">&#128188;</span>
                      <span class="label">Dedicated workspace</span>
                    </div>
                    <div class="amenity">
                      <span class="icon">&#128663;</span>
                      <span class="label">Free parking on premises</span>
                    </div>
                    <div class="amenity">
                      <span class="icon">&#128675;</span>
                      <span class="label">Private pool</span>
                    </div>
                    <div class="amenity">
                      <span class="icon">&#128246;</span>
                      <span class="label">TV</span>
                    </div>
                    <div class="amenity">
                      <span class="icon">&#127785;</span>
                      <span class="label">Air conditioning</span>
                    </div>
                    <div class="amenity">
                      <span class="icon">&#128226;</span>
                      <span class="label">Security cameras on property</span>
                    </div>
                    <div class="amenity">
                      <span class="icon">&#9899;</span>
                      <span class="label">Carbon monoxide alarm</span>
                    </div>
                    <div class="amenity">
                      <span class="icon">&#9888;</span>
                      <span class="label">Smoke alarm</span>
                    </div>
                  </div>
                </div>{" "}
                <h1>Guest reviews</h1>
                <div className="reviews__container">
                  <div className="reviews__heading">
                    {data.rating && (
                      <div className="fpRating">
                        <button>{data.rating}</button>
                        <span>Excellent</span>
                      </div>
                    )}
                    <p>{data.reviews} reviews</p>
                    <p>Read all reviews</p>
                  </div>
                  <h4>See what guests loved the most:</h4>
                  <div className="reviews__wrapper">
                    <div className="customer">
                      <div className="customer__top">
                        <img
                          src="https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt=""
                        />
                        <h4 className="customer__name">Adan</h4>
                      </div>
                      <div className="customer__rating">
                        <div className="stars">
                          <i class="uil uil-star"></i>
                          <i class="uil uil-star"></i>
                          <i class="uil uil-star"></i>
                          <i class="uil uil-star"></i>
                          <i class="uil uil-star"></i>
                        </div>
                        <p className="time">1 week ago</p>
                        <p>Stayed a few nights</p>
                      </div>
                      <div className="customer__content">
                        <p>
                          Wow it was amazing experience to live a a cave home
                          with all the first world amenities. The place is a a
                          super quiet location and few steps to nice restaurants
                          and local shops.
                        </p>

                        <button>Show more </button>
                      </div>
                    </div>

                    <div className="customer">
                      <div className="customer__top">
                        <img
                          src="https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt=""
                        />
                        <h4 className="customer__name">Adan</h4>
                      </div>
                      <div className="customer__rating">
                        <div className="stars">
                          <i class="uil uil-star"></i>
                          <i class="uil uil-star"></i>
                          <i class="uil uil-star"></i>
                          <i class="uil uil-star"></i>
                          <i class="uil uil-star"></i>
                        </div>
                        <p className="time">1 week ago</p>
                        <p>Stayed a few nights</p>
                      </div>
                      <div className="customer__content">
                        <p>
                          Wow it was amazing experience to live a a cave home
                          with all the first world amenities. The place is a a
                          super quiet location and few steps to nice restaurants
                          and local shops.
                        </p>

                        <button>Show more</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="listSearch__detail">
                <h1 className="lsTitle">
                  {data.price} VNĐ / <span>night</span>
                </h1>
                <div className="lsItem">
                  <label>Check-in Date</label>
                  <span onClick={() => setOpenDate(!openDate)}>{`${format(
                    dates[0].startDate,
                    "MM/dd/yyyy"
                  )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
                  {openDate && (
                    <DateRange
                      onChange={(item) => setDates([item.selection])}
                      minDate={new Date()}
                      ranges={dates}
                    />
                  )}
                </div>
                <div className="lsItem person">
                  {/* <FontAwesomeIcon icon={faPerson} className="headerIcon" /> */}
                  <span
                    onClick={() => setOpenOptions(!openOptions)}
                    className="headerSearchText text-black"
                  >{`${options.adult} người lớn · ${options.children} trẻ em `}</span>
                  {openOptions && (
                    <div className="options detail">
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
                    </div>
                  )}
                </div>
                <button onClick={handleClick} className="lsButton">
                  <Link
                    to={`/booking?roomId=${data._id}&checkin=${format(
                      dates[0].startDate,
                      "yyyy-MM-dd"
                    )}&checkout=${format(
                      dates[0].endDate,
                      "yyyy-MM-dd"
                    )}&numberOfGuests=${
                      options.adult + options.children
                    }&numberOfAdults=${options.adult}&numberOfChildren=${
                      options.children
                    }&lease=${data.userId}`}
                    className="text-sm text-gray-500"
                  >
                    {" "}
                    Reserve
                  </Link>{" "}
                </button>
                <p>You won't be charged yet</p>{" "}
                <div className="lsOptionItem">
                  <span
                    className="lsOptionText"
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    {data.price} x {dayCount}
                    {dayCount > 1 ? <p>nights</p> : <p>nights</p>}
                  </span>
                  {/* <span className="lsOptionText">{data.price} VNĐ</span> */}
                </div>{" "}
                <div className="lsOptionItem">
                  <span
                    className="lsOptionText"
                    style={{
                      marginBottom: "10px",
                      textDecoration: "underline",
                    }}
                  >
                    Booking service fee
                  </span>
                  <span className="lsOptionText">14%</span>
                </div>
                <hr />
                <div
                  className="lsOptionItem total"
                  style={{
                    marginTop: "20px",
                  }}
                >
                  <span className="lsOptionText">Total</span>
                  <span className="lsOptionText">
                    {dayCount > 0
                      ? formatNumberWithCommas(
                          data.price * dayCount +
                            ((data.price * dayCount) / 100) * 14
                        )
                      : formatNumberWithCommas(data.price)}
                    VNĐ
                  </span>
                </div>
              </div>

              {/* <div className="hotelDetailsPrice">
                <h1>Perfect for a -night stay!</h1>
                <span>
                  Located in the real heart of Krakow, this property has an
                  excellent location score of 9.8!
                </span>
                <button>Reserve or Book Now!</button>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelDetails;
