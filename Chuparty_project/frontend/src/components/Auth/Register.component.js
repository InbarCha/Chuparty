import React, { Component } from "react";
import { css } from "@emotion/core";
import RotateLoader from "react-spinners/ClipLoader";
import { Row, Col } from "react-bootstrap";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "react-select";
import nacl from "tweetnacl";
import utils from "tweetnacl-util";

const encodeBase64 = utils.encodeBase64;

// Our nonce must be a 24 bytes Buffer (or Uint8Array)
const nonce = nacl.randomBytes(24);
// Our secret key must be a 32 bytes Buffer (or Uint8Array)
const secretKey = Buffer.from("12345678123456781234567812345678", "utf8");

const REGISTER_ROUTE =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api/register"
    : "/api/register";

const SCHOOLS_ROUTE =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api/getSchools"
    : "/api/getSchools";

const override = css`
  display: block;
  margin: 0 auto;
`;

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      email: "",
      isWaiting: false,
      checkedStudent: false,
      checkedLecturer: false,
      checkedAdmin: false,
      usernameWarning: "",
      passwordWarning: "",
      firstNameWarning: "",
      lastNameWarning: "",
      emailWarning: "",
      schoolWarning: "",
      registerWarning: "",
      schools: [],
      userSchool: "",
      selectSchoolsOptions: [],
      selectedSchoolForLecturer: null,
    };
  }

  componentDidMount() {
    fetch(SCHOOLS_ROUTE)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        // this.setState({ schools: data });
        data = data.map((e) => {
          return {
            name: Object.keys(e)[0],
            courses: e[Object.keys(e)[0]].courses,
          };
        });
        this.setState({
          schools: data,
          selectSchoolsOptions: data.map((elm) => {
            return { value: elm["name"], label: elm["name"] };
          }),
        });
      })
      .catch((err) => console.error("error while fetching schools:", err));
  }

  usernameChanged = (e) => {
    let newVal = e.target.value;
    this.setState({
      username: newVal,
      usernameWarning: "",
      registerWarning: "",
    });
  };

  passwordChanged = (e) => {
    let newVal = e.target.value;
    this.setState({
      password: newVal,
      passwordWarning: "",
      registerWarning: "",
    });
  };

  firstNameChanged = (e) => {
    let newVal = e.target.value;
    this.setState({
      first_name: newVal,
      firstNameWarning: "",
      registerWarning: "",
    });
  };

  lastNameChanged = (e) => {
    let newVal = e.target.value;
    this.setState({
      last_name: newVal,
      lastNameWarning: "",
      registerWarning: "",
    });
  };

  emailChanged = (e) => {
    let newVal = e.target.value;
    this.setState({ email: newVal, emailWarning: "", registerWarning: "" });
  };

  //TODO: when registering, set whether the new user is student, lecturer or admin. Then create a user in the matching model
  register = (e) => {
    e.preventDefault();
    console.log("login");

    let username = this.state.username;
    let password = this.state.password;
    let first_name = this.state.first_name;
    let last_name = this.state.last_name;
    let email = this.state.email;
    let school = "";
    let schools = "";

    if (this.state.checkedStudent) {
      school = this.state.userSchool;
    } else if (
      this.state.checkedLecturer &&
      this.state.selectedSchoolForLecturer !== null
    ) {
      schools = this.state.selectedSchoolForLecturer.map((elm) => elm["value"]);
      console.log(schools);
    }

    if (username === "") {
      this.setState({ usernameWarning: "'Username' field is empty!" });
    }
    if (password === "") {
      this.setState({ passwordWarning: "'Password' field is empty!" });
    }
    if (first_name === "") {
      this.setState({ firstNameWarning: "'First Name' field is empty!" });
    }
    if (last_name === "") {
      this.setState({ lastNameWarning: "'LastName' field is empty!" });
    }
    if (email === "") {
      this.setState({ emailWarning: "'email' field is empty!" });
    }
    if (this.state.checkedStudent & (school === "")) {
      this.setState({ schoolWarning: "'school' wasn't chosen!" });
    }
    if (this.state.checkedLecturer && schools === "") {
      this.setState({ schoolWarning: "'schools' weren't chosen!" });
    }

    let type = "";
    if (this.state.checkedStudent) {
      type = "Student";
    } else if (this.state.checkedLecturer) {
      type = "Lecturer";
    } else if (this.state.checkedAdmin) {
      type = "Admin";
    } else {
      this.setState({ registerWarning: "You didn't choose account type!" });
    }

    if (
      username !== "" &&
      password !== "" &&
      first_name !== "" &&
      last_name !== "" &&
      email !== "" &&
      type !== "" &&
      ((this.state.checkedStudent && school !== "") ||
        this.state.checkedAdmin ||
        (this.state.checkedLecturer && schools !== ""))
    ) {
      this.setState({ registerWarning: "" });

      // Make sure your data is also a Buffer of Uint8Array
      const secretData = Buffer.from(password, "utf8");
      const encrypted = nacl.secretbox(secretData, nonce, secretKey);
      const passwordEncrypted = `${encodeBase64(nonce)}:${encodeBase64(
        encrypted
      )}`;
      // console.log(passwordEncrypted);

      let request_body = {
        username: username,
        password: passwordEncrypted,
        first_name: first_name,
        last_name: last_name,
        email: email,
        type: type,
        school: school,
        schools: schools,
      };
      this.setState({ isWaiting: true });

      // console.log(request_body);

      fetch(REGISTER_ROUTE, {
        method: "POST",
        body: JSON.stringify(request_body),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          this.setState({ isWaiting: false });

          if (data["isRegistered"] === true) {
            // server response:
            // {
            //   "isRegistered": True,
            //   "username": user.username,
            //   "first_name": user.first_name,
            //   "last_name" : user.last_name,
            //   "email": user.email,
            //   "type": accountType
            // }
            localStorage["loggedUsername"] = data["username"];
            localStorage["logged_first_name"] = data["first_name"];
            localStorage["logged_last_name"] = data["last_name"];
            localStorage["logged_email"] = data["email"];
            localStorage["logged_type"] = data["type"];
            localStorage["logged_schools"] = data["schools"];
            localStorage["login_time"] = Date.now();
            if (data["schools"] !== undefined) {
              localStorage["activeSchool"] = data["schools"][0];
            }
            localStorage["logged_courses"] = data["courses"];

            this.props.setLoggedIn(true);
            if (
              localStorage["activeSchool"] !== "" &&
              localStorage["activeSchool"] !== undefined &&
              localStorage["logged_type"] === "Student"
            ) {
              this.props.parentClickHandler("COURSES");
            } else {
              this.props.parentClickHandler("HOME");
            }
          } else {
            this.setState({ registerWarning: data["reason"] });
          }
        })
        .catch((err) => {
          console.error("error while registering:", err);
        });
    }
  };

  toLogin = () => {
    this.props.parentClickHandler("LOGIN");
  };

  handleCheckboxChange = (e, index) => {
    if (index === 1) {
      this.setState({
        checkedStudent: !this.state.checkedStudent,
        checkedAdmin: false,
        checkedLecturer: false,
      });
    } else if (index === 2) {
      this.setState({
        checkedLecturer: !this.state.checkedLecturer,
        checkedStudent: false,
        checkedAdmin: false,
      });
    } else if (index === 3) {
      this.setState({
        checkedAdmin: !this.state.checkedAdmin,
        checkedStudent: false,
        checkedLecturer: false,
      });
    }
  };

  changeUserSchool = (e, index) => {
    this.setState({
      userSchool: this.state.schools[index]["name"],
      schoolWarning: "",
    });
  };

  changedLecturerSchool = (selectedOption) => {
    this.setState({ selectedSchoolForLecturer: selectedOption });
  };

  render() {
    return (
      <div>
        <div dir="RTL" className="page_title_unauth">
          ברוכים הבאים לChuParty!{" "}
        </div>
        <hr />
        <Row>
          <Col
            xl={{ span: 4, offset: 4 }}
            lg={{ span: 6, offset: 3 }}
            md={{ span: 6, offset: 3 }}
            sm={{ span: 8, offset: 2 }}
            className="login_wrapper"
          >
            <MDBContainer>
              <MDBRow>
                <MDBCol className="col col-cen">
                  <form className="login_form">
                    <p className="h4 text-center mb-4">Register</p>
                    <label
                      htmlFor="defaultFormLoginEmailEx"
                      className="grey-text"
                    >
                      Your Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.usernameChanged}
                      disabled={this.state.isWaiting}
                    />
                    <label style={{ color: "red" }}>
                      {this.state.usernameWarning}
                    </label>
                    <br />
                    <label
                      htmlFor="defaultFormLoginPasswordEx"
                      className="grey-text"
                    >
                      Your password
                    </label>
                    <input
                      type="password"
                      id="defaultFormLoginPasswordEx"
                      className="form-control"
                      onChange={this.passwordChanged}
                      disabled={this.state.isWaiting}
                    />
                    <label style={{ color: "red" }}>
                      {this.state.passwordWarning}
                    </label>
                    <br />
                    <label
                      htmlFor="defaultFormLoginEmailEx"
                      className="grey-text"
                    >
                      Your First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.firstNameChanged}
                      disabled={this.state.isWaiting}
                    />
                    <label style={{ color: "red" }}>
                      {this.state.firstNameWarning}
                    </label>
                    <br />
                    <label
                      htmlFor="defaultFormLoginEmailEx"
                      className="grey-text"
                    >
                      Your Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.lastNameChanged}
                      disabled={this.state.isWaiting}
                    />
                    <label style={{ color: "red" }}>
                      {this.state.lastNameWarning}
                    </label>
                    <br />
                    <label
                      htmlFor="defaultFormLoginEmailEx"
                      className="grey-text"
                    >
                      Your Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.emailChanged}
                      disabled={this.state.isWaiting}
                    />
                    <label style={{ color: "red" }}>
                      {this.state.emailWarning}
                    </label>
                    <br />
                    <label className="grey-text" style={{ fontWeight: "bold" }}>
                      Please Choose Type:
                    </label>
                    <br />
                    <Checkbox
                      checked={this.state.checkedStudent}
                      onChange={(e) => this.handleCheckboxChange(e, 1)}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                    <label className="grey-text">Student</label>
                    <br />
                    <Checkbox
                      checked={this.state.checkedLecturer}
                      onChange={(e) => this.handleCheckboxChange(e, 2)}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                    <label className="grey-text">Lecturer</label>
                    <br />
                    <Checkbox
                      checked={this.state.checkedAdmin}
                      onChange={(e) => this.handleCheckboxChange(e, 3)}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                    <label className="grey-text">Admin</label>
                    <br /> <br />
                    {this.state.userSchool && (
                      <label className="user_school_label">
                        {this.state.userSchool}
                      </label>
                    )}
                    {!this.state.checkedLecturer && !this.state.checkedAdmin && (
                      <MDBDropdown>
                        <MDBDropdownToggle caret color="primary">
                          Your School
                        </MDBDropdownToggle>
                        <MDBDropdownMenu basic>
                          {this.state.schools.map((school, index) => {
                            return (
                              <MDBDropdownItem
                                key={index}
                                onClick={(e) => this.changeUserSchool(e, index)}
                              >
                                {school["name"]}
                              </MDBDropdownItem>
                            );
                          })}
                        </MDBDropdownMenu>
                      </MDBDropdown>
                    )}
                    {this.state.checkedLecturer && (
                      <div style={{ padding: "40px" }}>
                        <Select
                          placeholder="Select Your Schools"
                          value={this.state.selectedSchoolForLecturer}
                          onChange={this.changedLecturerSchool}
                          options={this.state.selectSchoolsOptions}
                          isMulti={true}
                        />
                      </div>
                    )}
                    <label style={{ color: "red" }}>
                      {this.state.schoolWarning}
                    </label>
                    <div className="text-center mt-4">
                      <MDBBtn
                        color="indigo"
                        type="submit"
                        onClick={this.register}
                      >
                        Register
                      </MDBBtn>
                      <MDBBtn
                        color="indigo"
                        type="submit"
                        onClick={this.toLogin}
                      >
                        Back to Login
                      </MDBBtn>
                    </div>
                    <label style={{ color: "red" }}>
                      {this.state.registerWarning}
                    </label>
                    <div className="col-centered model_loading">
                      <RotateLoader
                        css={override}
                        loading={this.state.isWaiting}
                      />
                    </div>
                    <img className="login_img" alt="not found" />
                  </form>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </Col>
        </Row>
        <div className="col-centered model_loading">
          <RotateLoader css={override} loading={this.state.isWaiting} />
        </div>
      </div>
    );
  }
}

export default Register;
