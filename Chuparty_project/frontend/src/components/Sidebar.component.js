import React, { Component } from "react";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentClickHandler: props.parentClickHandler,
    };
  }
  render() {
    return (
      <div className="sidebar">
        {(localStorage["logged_type"] === "Admin" ||
          localStorage["logged_type"] === "Lecturer") && (
          <React.Fragment>
            <div
              className="side_item"
              onClick={(e) => this.state.parentClickHandler("HOME")}
            >
              <i className="material-icons">home</i>
            </div>
            <div className="side_description">
              <span>בתי ספר</span>
            </div>
          </React.Fragment>
        )}
        <div
          className="side_item"
          onClick={(e) => this.state.parentClickHandler("COURSES")}
        >
          <i className="material-icons">school</i>
        </div>
        <div className="side_description">
          <span>קורסים</span>
        </div>
        <div
          className="side_item"
          onClick={(e) => this.state.parentClickHandler("EXAMS")}
        >
          <i className="material-icons">web</i>
        </div>
        <div className="side_description">
          <span>מבחנים</span>
        </div>
        <div
          className="side_item"
          onClick={(e) => {
            if (localStorage["logged_type"] === "Lecturer") {
              this.state.parentClickHandler("LECTURER_QUESTIONS_PAGE");
            } else {
              this.state.parentClickHandler("QUESTIONS");
            }
          }}
        >
          <i className="material-icons">question_answer</i>
        </div>
        <div className="side_description">
          <span>שאלות</span>
        </div>
        <div
          className="side_item"
          onClick={(e) => this.state.parentClickHandler("FEEDBACK")}
        >
          <i className="material-icons">message</i>
        </div>
        <div className="side_description">
          <span>סטטיסטיקה</span>
        </div>
        {localStorage["logged_type"] === "Admin" && (
          <React.Fragment>
            <div
              className="side_item"
              onClick={(e) => this.state.parentClickHandler("ADMIN")}
            >
              <i className="material-icons">widgets</i>
            </div>
            <div className="side_description">
              <span>אדמין</span>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
