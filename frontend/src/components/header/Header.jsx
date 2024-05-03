import React, { useContext, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import { useDispatch, useSelector } from "react-redux";
import { UserMenu } from "../usermenu/UserMenu";
const nav__links = [
  {
    path: "shop",
    display: "Flights",
  },
  {
    path: "/hotels",
    display: "Hotels",
  },
  {
    path: "/noi-that",
    display: "Car rentals",
  },
  {
    path: "/goc-cam-hung",
    display: "Attractions",
  },
];
const nav__lease = [
  {
    path: "shop",
    display: "Lịch",
  },
  {
    path: "/hotels",
    display: "Khách sạn / Phòng cho thuê",
  },
];
const dropdown = [
  {
    path: "home",
    display: "Phòng ngủ",
  },
  {
    path: "home",
    display: "Phòng khách",
  },
];

const policy_lists = [
  {
    icon: "uil uil-truck",
    text: "Giao hàng toàn quốc",
  },
  {
    icon: "uil uil-store",
    text: "Hệ thống cửa hàng Perfect Home",
  },
  {
    icon: "uil uil-headphones-alt",
    text: "Hotline: 1900 71 17 67 (9-21h)",
  },
];

function Header(props) {
  const dispatch = useDispatch();
  const [prevScroll, setPrevScroll] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([""]);
  const [noResults, setNoResults] = useState(false);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef(null);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleScroll = () => {
    const currentScroll = window.pageYOffset;
    setVisible(prevScroll > currentScroll || currentScroll < 100);
    setPrevScroll(currentScroll);
  };
  // const currentUser = useSelector((state) => state.user.currentUser);
  const userData = useSelector((state) => state.user);

  const navigate = useNavigate();
  const navigateToCart = () => {
    navigate("/cart");
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScroll, visible]);

  const profileActionRef = useRef("show__profileActions");

  // const toggleProfileActions = () =>
  //   profileActionRef.current.classList.toggle("show__profileActions");

  // const handleLogout = () => {
  //   // Thực hiện các thao tác cần thiết để đăng xuất
  //   // Sau đó dispatch hành động logout
  //   dispatch(logout());
  // };
  const [menu, setMenu] = useState(true);
  const [menudrop, setMenuDrop] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("uil uil-moon change__bg");

  const storedTheme = localStorage.getItem("theme");
  //   if (storedTheme) {
  //     setTheme(storedTheme);
  //   }
  const [theme, setTheme] = useState(
    // storedTheme === "dark-theme" ? "dark-theme" : "light-theme"
    storedTheme === "light-theme" ? "dark-theme" : "light-theme"
  );
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  useEffect(() => {
    localStorage.setItem("totalQuantity", JSON.stringify(totalQuantity));
  }, [totalQuantity]);

  // const handleClick = () => setMenu(!menu);
  const handleClick = () => {
    setSelectedIcon(
      selectedIcon === "uil uil-moon change__bg"
        ? "uil uil-sun change__bg"
        : "uil uil-moon change__bg"
    );
  };
  const toggleTheme = () => {
    handleClick();
    setTheme(theme === "dark-theme" ? "light-theme" : "dark-theme");
    localStorage.setItem("theme", theme);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearchVisible(false);
    }
  };
  const handleInputClick = (event) => {
    // Ngăn chặn sự kiện click trên ô input lan truyền ra ngoài
    event.stopPropagation();
    setIsSearchVisible(true);
  };
  const handleSearchVisible = (isVisible) => {
    setIsSearchVisible(isVisible);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    document.body.className = theme;
    // document.header.className = icon;
  }, [theme]);
  return (
    <header className={`header ${visible ? "" : "header-hidden"}`}>
      <div className="nav__wrapper">
        <NavLink to="/home">
          <div className="logo">
            {/* <img src={logo} alt="" /> */}
            <i className="uil uil-adobe"></i>
            <div className="">
              <h5>BookingIC</h5>
              {/* <p>Since 1989</p> */}
            </div>
          </div>
        </NavLink>

        <div className="nav__icons">
          <span className="moon__sun">
            <i className={selectedIcon} onClick={() => toggleTheme()}></i>
          </span>
          <span className="fav__icon">
            <i className="uil uil-bell"></i>
            <span className="badge"> 0</span>
          </span>
          {/* <span className="cart__icon" onClick={navigateToCart}>
            <i className="uil uil-heart-alt"></i>
            <span className="badge">{totalQuantity}</span>
          </span>{" "} */}
          <div
            className=""
            style={{
              zIndex: "1001",
            }}
          >
            {userData.username ? (
              <UserMenu />
            ) : (
              <div>
                <span style={{ marginRight: "10px" }}>
                  <NavLink
                    to="/login"
                    activeClassName="active"
                    className="color-link"
                  >
                    Đăng nhập
                  </NavLink>
                </span>
                <NavLink
                  to="/register"
                  activeClassName="active"
                  className="color-link"
                >
                  Đăng ký
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
      {userData.user_type === "lease" ? (
        <div className="nav__desktop">
          <div className={menu ? "navigation" : "navigation active"}>
            <ul className="menu">
              {nav__lease.map((item, index) => {
                return (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}{" "}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <div className="nav__desktop">
          <div className={menu ? "navigation" : "navigation active"}>
            <ul className="menu">
              <li
                className="nav__item dropdown"
                onMouseEnter={() => setMenuDrop(true)}
                onMouseLeave={() => setMenuDrop(false)}
              >
                <NavLink to="/collections/giuong">
                  Stays <i className="uil uil-angle-down"></i>
                </NavLink>

                <div className="dropdownContent">
                  <NavLink className="dropdownItem">Giường nệm</NavLink>
                  <NavLink className="dropdownItem">Niệm</NavLink>
                </div>
              </li>
              {nav__links.map((item, index) => {
                return (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}{" "}
                    </NavLink>
                  </li>
                );
              })}
              <li
                className="nav__item dropdown"
                onMouseEnter={() => setMenuDrop(true)}
                onMouseLeave={() => setMenuDrop(false)}
              >
                <NavLink to="/phong">
                  Airport taxis <i className="uil uil-angle-down"></i>
                </NavLink>

                <div className="dropdownContent">
                  <NavLink className="dropdownItem">Phòng khách</NavLink>
                  <NavLink className="dropdownItem">Phòng ngủ</NavLink>
                  <NavLink className="dropdownItem">Phòng tắm</NavLink>
                </div>
                {/* {menudrop && (
                <ul className="dropdown-menu">
                  {dropdown.map((item, index) => (
                    <li key={index}>
                      <NavLink
                        to={item.path}
                        className={(navClass) =>
                          navClass.isActive ? "nav__active" : ""
                        }
                      >
                        {item.display}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )} */}
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
