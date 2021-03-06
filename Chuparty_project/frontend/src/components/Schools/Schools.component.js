import React, { Component } from "react";
import { css } from "@emotion/core";
import { Container, Row } from "react-bootstrap";
import RotateLoader from "react-spinners/ClipLoader";
import School from "./School.component";
import EditSchool from "./EditSchool.component";
import AddSchool from "./AddSchool.component";

const SCHOOLS_ROUTE =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api/getSchools"
    : "/api/getSchools";

const override = css`
  display: block;
  margin: 0 auto;
`;

export default class Schools extends Component {
  constructor() {
    super();
    this.state = {
      schools: null,
      activeSchool: null,
      sonComponents: [],
    };
    this.setSonComponents = this.setSonComponents.bind(this);
    this.chooseActiveSchool = this.chooseActiveSchool.bind(this);
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
        let all_schools = data;
        let schools = [
          ...all_schools.filter(
            (school) =>
              localStorage["logged_schools"].indexOf(school["name"]) > -1
          ),
        ];
        if (localStorage["logged_type"] !== "Admin") {
          this.setSchools(schools);
        } else {
          this.setSchools(all_schools);
        }
      })
      .then(() => this.setSonComponents())
      .catch((err) => console.error("error while fetching schools:", err));
  }

  chooseActiveSchool(school) {
    localStorage["activeSchool"] = school;
    localStorage.removeItem("activeCourse");
    this.setState({ activeSchool: school });
    this.props.parentClickHandler("COURSES");
  }

  changedSchool = (school, index) => {
    let schools = this.state.schools;
    schools[index] = school;

    if (school.name !== this.state.activeSchool) {
      localStorage["activeSchool"] = school.name;
      this.setState({ activeSchool: localStorage["activeSchool"] });
    }

    this.setState({ schools: schools });
  };

  createDeepCopySchool = (school) => {
    let schoolName = school.name;
    let courses = school.courses;

    let school_copy = {};
    school_copy.name = schoolName;
    school_copy.courses = [...courses];

    return school_copy;
  };

  deleteFromSonComponents = (index) => {
    let schools = this.state.schools;
    let sonComponents = this.state.sonComponents;

    if (index < sonComponents.length - 1) {
      schools[index] = "";
      sonComponents[index] = "";
    } else if (index === sonComponents.length - 1) {
      sonComponents.pop();
      schools.pop();
    }

    this.setState({ schools: schools, sonComponents: sonComponents });
  };

  addSchoolToSonComponents = (school) => {
    let sonComponents = this.state.sonComponents;
    sonComponents.pop();

    let schools = this.state.schools;
    this.setState({
      schools: [...schools, school],
      sonComponents: sonComponents,
    });

    this.setSonComponents();
  };

  changeSchoolComponent = (index, component) => {
    let sonComponents = this.state.sonComponents;
    let school_orig = "";
    let school_copy = "";
    if (index !== -1) {
      school_orig = this.state.schools[index];
      school_copy = this.createDeepCopySchool(school_orig);
    }

    switch (component) {
      case "EDIT":
        sonComponents[index] = (
          <EditSchool
            key={index}
            index={index}
            school={school_copy}
            school_orig={school_orig}
            changeSchoolComponent={this.changeSchoolComponent}
            changedSchool={this.changedSchool}
            deleteFromSonComponents={this.deleteFromSonComponents}
          />
        );
        break;
      case "SCHOOL":
        sonComponents[index] = (
          <School
            bounce={true}
            key={index}
            index={index}
            chooseActiveSchool={this.chooseActiveSchool}
            changeSchoolComponent={this.changeSchoolComponent}
            school={this.state.schools[index]}
          />
        );
        break;
      case "ADD_SCHOOL":
        sonComponents = [
          ...sonComponents,
          <AddSchool
            key={sonComponents.length}
            index={sonComponents.length}
            deleteFromSonComponents={this.deleteFromSonComponents}
            addSchoolToSonComponents={this.addSchoolToSonComponents}
          />,
        ];
        break;
      default:
        console.log("no handler for:", component);
    }

    this.setState({ sonComponents: sonComponents });
  };
  setSchools(schools) {
    return new Promise((resolve, reject) => {
      resolve(this.setState({ schools: schools }));
    });
  }

  setSonComponents() {
    console.log("schools:", this.state.schools);
    let sonComponents = [];

    this.state.schools.forEach((elm, index) => {
      let newSchool = "";
      if (elm !== "" && elm !== null && elm !== undefined) {
        newSchool = (
          <School
            bounce={false}
            school={elm}
            index={index}
            key={index}
            chooseActiveSchool={this.chooseActiveSchool}
            changeSchoolComponent={this.changeSchoolComponent}
          />
        );
      }
      sonComponents.push(newSchool);
    });

    this.setState({ sonComponents: sonComponents });
  }

  addSchool = () => {
    this.changeSchoolComponent(-1, "ADD_SCHOOL");
  };

  getSchoolsArr() {
    return (
      <div dir="RTL">
        <div className="page_title"> בתי ספר </div>
        {this.state.activeSchool !== "" && (
          <React.Fragment>
            <div className="active_model_title">
              <span className="active_model">{this.state.activeSchool}</span>
            </div>
          </React.Fragment>
        )}
        <Container fluid className="model_items_container">
          {localStorage["logged_type"] === "Admin" && (
            <span
              className="material-icons add_course_icon"
              onClick={this.addSchool} // TODO
            >
              add
            </span>
          )}
          <Row>{this.state.sonComponents}</Row>
        </Container>
      </div>
    );
  }

  render() {
    let res =
      this.state.schools !== null ? (
        this.getSchoolsArr()
      ) : (
        <div className="col-centered models_loading" dir="RTL">
          <div className="loading_title"> טוען בתי ספר... </div>
          <RotateLoader css={override} size={50} />
        </div>
      );
    return res;
  }
}
