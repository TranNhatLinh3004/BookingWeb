import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { userColumns } from "../../datatablesource";
import { hotelColumns, roomColumns } from "../../datatablesource";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const [list, setList] = useState([]);
  const [path, setPath] = useState(""); // Initialize with default path

  const { data, loading, error, reFetch } = useFetch(path);

  useEffect(() => {
    // Update the path whenever the location changes
    setPath("http://localhost:5000/api" + location.pathname);
  }, [location]);

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${path}/${id}`);
      setList(list.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };
  // Define columns based on the path

  const actionColumn = [
    // ... (unchanged)
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataGrid
          className="datagrid"
          rows={list}
          columns={columns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      )}
    </div>
  );
};

export default Datatable;
