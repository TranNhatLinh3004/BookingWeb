import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import SearchHotelCard from "../../components/searchhotelcard/SearchHotelCard";
import ReactPaginate from "react-paginate";
import queryString from "query-string";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./hotelmanager.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
function HotelManager(props) {
  const [hotel, setHotel] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(15);
  let currentUrl = " window.location.href";
  const [triggerFetch, setTriggerFetch] = useState(false);
  const location = useLocation();
  const userData = useSelector((state) => state.user);
  const classes = useStyles();
  const navigate = useNavigate();
  const [dates, setDates] = useState(
    location.state?.dates || [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]
  );
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [menu, setMenu] = useState(true);
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const result = await fetch(`http://localhost:5000/api/hotels`);
        if (!result.ok) {
          throw new Error("Failed to fetch hotels");
        }
        const data = await result.json();
        const listHotels = data.filter((item) => item.userId === userData._id);
        setHotel(listHotels);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHotels();
  }, []);
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
      path: "/hotel-manager/create",
      display: "Thêm khách sạn",
    },
  ];
  const { data, loading, error, reFetch } = useFetch(
    `http://localhost:5000/api/hotels?page=${currentPage}&limit=5`
  );
  let parsedUrl = queryString.parseUrl(currentUrl);

  const [initialDestination, setInitialDestination] = useState(
    parsedUrl.query.city || ""
  );
  const [destination, setDestination] = useState(initialDestination);
  const handleFilter = (e) => {
    let val = e.target.value;
    let sortedHotels;

    switch (val) {
      case "tang":
        sortedHotels = [...hotel].sort((a, b) => a.price - b.price);
        break;
      case "giam":
        sortedHotels = [...hotel].sort((a, b) => b.price - a.price);
        break;
      case "a-z":
        sortedHotels = [...hotel].sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        break;
      case "z-a":
        sortedHotels = [...hotel].sort((a, b) =>
          b.name.toLowerCase().localeCompare(a.name.toLowerCase())
        );
        break;
      case "all":
      default:
        sortedHotels = [...hotel];
        break;
    }

    setHotel(sortedHotels);
  };
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  useEffect(() => {
    if (destination && dates) {
      const fetchData = async () => {
        try {
          const result = await fetch(
            `http://localhost:5000/api/hotels?city=${destination ? destination : parsedUrl.query.city
            }`
          );
          if (!result.ok) {
            throw new Error("Failed to fetch hotels");
          }
          const data = await result.json();
          const listHotels = data.filter(
            (item) => item.userId === userData._id
          );
          setHotel(listHotels);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    } else {
      reFetch(`http://localhost:5000/api/hotels?page=${currentPage}&limit=5`);
    }
  }, [triggerFetch, parsedUrl.query.city]);

  const handleAddRoom = (idd) => {
    navigate("/hotel-manager/create", { state: { id: idd} });
  };
  return (
    <div className="hotel__manager">
      <div className="listResult">
        <div className="heading__top">
          <h1 className="listHeading">
            Budapest: {hotel.length} properties found
          </h1>

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

        <div className="filter__widget">
          <select onChange={handleFilter}>
            <option>Sắp xếp</option> <option value="all">Tất cả Hotels</option>
            <option value="tang">Giá: Tăng dần</option>
            <option value="giam">Giá: Giảm dần</option>
            <option value="a-z">Tên: A-Z</option>{" "}
            <option value="z-a">Tên: Z-A</option>
          </select>
        </div>
        {/* <SearchItem /> */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Tên khách sạn</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Địa Chỉ</TableCell>
                    <TableCell>Tổng phòng</TableCell>
                    <TableCell>Đánh giá</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                {console.log("hotel", hotel)}
                {hotel.map((item) => (
                  <TableBody>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>(+84) 123456789</TableCell>
                      <TableCell>{item.city}</TableCell>
                      <TableCell>{item.rooms.length}</TableCell>
                      <TableCell>4.8 &#10029;</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="primary">Chỉnh sửa</Button>
                        <Button onClick={() => handleAddRoom(item._id)} variant="outlined" color="primary">Thêm phòng</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))}
              </Table>
            </TableContainer>
            {/* {hotel.map((item) => (
              <SearchHotelCard item={item} key={item._id} />
            ))} */}
          </>
        )}
        <ReactPaginate
          breakLabel="..."
          pageCount={pageCount}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
}

export default HotelManager;
