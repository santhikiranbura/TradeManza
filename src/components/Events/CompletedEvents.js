import React from 'react'
import './css/eventlist.css';
import { Link } from "react-router-dom";
import { API2 } from '../../backend';


export class CompletedEvents extends React.Component{
        constructor(props) {
            super(props);
            this.state = {  
                eventslist:[],
            }
            this.fetchEvents=this.fetchEvents.bind(this)
        }
        fetchEvents = () =>{
            const userId=localStorage.getItem("id");
            fetch(`${API2}/users/v3/${userId}/events?status=${this.props.status}`)
            .then(response => response.json())
            .then(data => data.data)
            .then(data =>{ 
                this.setState({
                    eventslist:data
                })
            })
        }
        componentWillMount(){
            this.fetchEvents()
            this.props.showSidebar();
        };
        render() { 
            const events=this.state.eventslist;
            return (
                <div className="eventlist">
                    {
                         events.map((task,index) => {
                             return (
                                        <Link to={`/events/${task.id}/${this.props.status}contests`}>
                                 <div key={index} className="eventbox">
                                 <div className="event-item">
                                    {task.name}
                                    </div>
                                    <div className="event-itemlink">
                                                Play
                                    </div> 
                                 </div>
                                        </Link>
                             )
                         })      
                    }
                </div>
          )
        }
}     



