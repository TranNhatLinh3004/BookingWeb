import axios from "axios";

export const getRoomById = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/rooms/find/${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const createRoom = async (room) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/rooms/create`,
      room
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const unavailableDatesRoom = async (roomId, number) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/rooms/unavailableDates/${roomId}?number=${number}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
