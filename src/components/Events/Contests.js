import React, { Component } from "react";
import "./css/eventlist.css";
import { Link, withRouter } from "react-router-dom";
import { API2 } from "../../backend";
import swal from "sweetalert";
import { HiArrowNarrowLeft } from "react-icons/hi";
import playstoreImg from "./images/playstore.png";
class Contests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contestslist: undefined,
      group: "",
      eventName: "",
    };
  }
  fetchContests = () => {
    const eventid = window.location.pathname.split("/")[2];
    fetch(`${API2}/contests/v2?eventId=${eventid}&source=app`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        this.setState({
          contestslist: data.data,
        });
      });
  };
  componentDidMount() {
    let { group, eventName } = this.props.location.state;
    if (group === "all") group = "";

    this.setState({
      group: group,
      eventName: eventName,
    });
    this.fetchContests();
    this.props.hideSidebar();
  }
  showMessage() {
    const el = document.createElement("div");
    el.innerHTML =
      `
      <h3>Please Download the app for taking part in this Contest</h3>
      <a href='https://play.google.com/store/apps/details?id=com.trademanza&hl=en_IN'> <img src=${playstoreImg} width="200px" alt="playstore link" /></a>`;
    swal({
      content: el
    });
  }
  render() {
    const eventid = window.location.pathname.split("/")[2];
    return (
      <div>
        <div className="eventTitleheader">
          <span>
            <Link className="showtextLink" to={`/events/${this.state.group}`}>
              <HiArrowNarrowLeft className="arrow-show" />
            </Link>
            {/* <button onClick={this.props.history.goBack} > */}
            {this.state.eventName}
          </span>
        </div>
        <div className="eventlist">
          {this.state.contestslist &&
          this.state.contestslist.NiftyFifty.length !== 0 ? (
            this.state.contestslist.NiftyFifty.map((contest, index) => {
              return (
                <div className="ContestlistItem">
                  {(contest.participationFee > 0  || contest.type==="Quiz") ? (
                    <div onClick={() => this.showMessage()}>
                      <div key={index} className="eventbox contestsbox">
                        <div className="event-item">{contest.name}</div>
                        <div className="event-itemlink">Play</div>
                      </div>
                    </div>
                  ) : (
                    <Link to={`/events/${eventid}/${contest.id}/leaderboard`}>
                      <div key={index} className="eventbox contestsbox">
                        <div className="event-item">{contest.name}</div>
                        <div className="event-itemlink">Play</div>
                      </div>
                    </Link>
                  )}
                </div>
              );
            })
          ) : (
            <div>no contests </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Contests);
