import React, { Component } from 'react'
import './css/eventlist.css';
import { Link } from "react-router-dom";
export default class Contests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            contestslist:undefined,
        }
        this.fetchContests=this.fetchContests.bind(this)
    }
    fetchContests = () =>{
        const eventid=window.location.pathname.split('/')[2];
        fetch(`https://api.trademanza.com/contests/v2?eventId=${eventid}`)
        .then(response => response.json())
        .then(data => {
            this.setState({
                contestslist:data.data
            })
        })
    }
    componentDidMount(){
        this.fetchContests()
        this.props.hideSidebar();
    };
    render() {
        return (
            <div className="eventlist">
                {
                    (this.state.contestslist &&  this.state.contestslist.NiftyFifty.length!==0) ? 
                    this.state.contestslist.NiftyFifty.map((contest,index) => {
                        return (
                            <div key={index} className="eventbox">
                            <div className="event-item">
                            {contest.name}
                            {contest.startTime}
                            {contest.details}
                            </div>
                            <div className="event-itemlink">
                                <Link to={`/events/${contest.id}/createportfolio`}>
                                        Play
                                </Link>
                            </div> 
                            </div>
                        )
                    }) : <div>no contests </div>     
                }                  
            </div>
        )
    }
}
