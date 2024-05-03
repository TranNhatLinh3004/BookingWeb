import React, { useState, useEffect, useContext } from "react";
import { Col, Container, Row, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { toast } from "react-toastify";
import Helmet from "../../assets/helmet/Helmet";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/userSlice";
import { AuthContext } from "../../customer-hooks/AuthContext";
import userIcon from "../../assets/images/user-icon.png";
import { ImagetoBase64 } from "../../utility/ImagetoBase64";
function Register(props) {
  const [redirect, setRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**code sua */
  const [image, setImage] = useState(null);
  /**code sua */

  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
    user_type: "user",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  /**code sua */
  const handleImageChange = async (e) => {
    const data = await ImagetoBase64(e.target.files[0]);

    setData((preve) => {
      return {
        ...preve,
        avatar: data,
      };
    });
  };
  /**code sua */

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data), // Đảm bảo truyền dữ liệu email và password trong một đối tượng JSON
        headers: { "Content-Type": "application/json" },
        // credentials: "include", // Chỉnh sửa "Content Type" thành "Content-Type"
      });
      const responseData = await response.json();
      if (response.ok) {
        toast.success(
          "You are registered in successfully. Welcome " +
            data.username.toLocaleUpperCase()
        );
        // Xử lý khi yêu cầu thành công
        setRedirect(true);
      } else {
        if (responseData.error === "User Already Exists") {
          toast.error("User Already Exists. Please try again.");
        } else if (
          responseData.error === "Password must have at least 6 characters"
        ) {
          toast.error("Password must have at least 6 characters");
        } else {
          toast.error("Unknown error occurred. Please try again.");
        }
      }
    } catch (error) {
      setRedirect(false);
    }
  };
  if (redirect) {
    navigate("/login");
  }
  return (
    <Helmet title="Register">
      <section className="">
        <Container>
          <Row>
            <Col lg="6" className="m-auto text-center">
              <Form className="auth__form register" onSubmit={handleSubmit}>
                <h3
                  className="fw-bold fs-4
                 mb-4
                "
                >
                  Đăng Ký
                </h3>
                <FormGroup className="form__group image">
                  <label class="avatar" for="file">
                    <img
                      src={
                        data.avatar
                          ? data.avatar
                          : "https://www.pngfind.com/pngs/m/66-661092_png-file-upload-image-icon-png-transparent-png.png"
                      }
                      alt=""
                    />
                    <input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </FormGroup>

                <FormGroup className="form__group">
                  <input
                    required
                    type="text"
                    placeholder="Username"
                    value={data.username}
                    name="username"
                    onChange={handleOnChange}
                    id="username"
                  />
                </FormGroup>

                <FormGroup className="form__group">
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={data.email}
                    name="email"
                    id="email"
                    onChange={handleOnChange}
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <input
                    required
                    value={data.password}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Mật khẩu"
                    onChange={handleOnChange}
                  />{" "}
                  <span className="icon-eye" onClick={handleShowPassword}>
                    {showPassword ? (
                      <i
                        class="uil uil-eye"
                        style={{
                          position: "relative",
                          right: "10px",
                        }}
                      ></i>
                    ) : (
                      <i
                        class="uil uil-eye-slash"
                        style={{
                          position: "relative",
                          right: "10px",
                        }}
                      ></i>
                    )}
                  </span>
                </FormGroup>
                <FormGroup className="form__group">
                  <select
                    id="role"
                    name="user_type"
                    value={data.user_type}
                    onChange={handleOnChange}
                    className=""
                  >
                    <option value="user">Role</option>
                    <option value="user">Người dùng</option>
                    <option value="lease">Người cho thuê phòng</option>
                  </select>
                </FormGroup>
                <button>
                  <span class="circle1"></span>
                  <span class="circle2"></span>
                  <span class="circle3"></span>
                  <span class="circle4"></span>
                  <span class="circle5"></span>
                  <span class="text">Submit</span>
                </button>
                <p>
                  Already Have Account? <Link to="/login">Log in</Link>
                </p>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default Register;
