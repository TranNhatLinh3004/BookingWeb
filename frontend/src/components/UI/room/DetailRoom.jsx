import React, { useEffect, useState } from "react";
import axios from "axios";
import "./detailroom.css";

function DetailRoom({ onClick, hotelId, roomNumber, isOpen }) {
  const [isData, setIsData] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const data = await axios.get(
        `http://localhost:5000/api/rooms/${hotelId}/${roomNumber}`
      );
      setIsData(data);
    };
    // console.log(isData, "rooms");
    if (isOpen) {
      fetchRoom();
    }
  }, [hotelId, roomNumber, isOpen]);

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClick}>
          &times;
        </span>
        <h3>Số phòng: {roomNumber}</h3>
        {/* <p>{`"${wishlistName}" will be permanently deleted.`}</p> */}
      </div>
    </div>
  ) : null;
}

export default DetailRoom;
