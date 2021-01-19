import React from 'react';
import {
  Switch, Route 
} from "react-router-dom";
import './css/events.css';

import Sidebar from './Sidebar';

import { Spotlight } from './Spotlight';
import { Upcomingevent } from './Upcomingevent';
import {Moreevents} from './Moreevents';
import {Todayevent} from './Todayevent';
import {Allevents} from './Allevents';
import { CompletedEvents } from './CompletedEvents';

import {Eventshow} from './Eventshow';
import Contests from './Contests';
import CompletedContests from './CompletedContests';


 class Events extends React.Component {
   constructor(props) {
     super(props)
     this.state = {
        showSidebar:true,
     }
   }
   hideSidebar = () => {
      this.setState({
          showSidebar:false,
      })
   }
   showSidebar = () =>{
    this.setState({
        showSidebar:true,
    })
   }
  render() {
    const somedata="this is coming from events";
    return (
        
        <div className="events-page"  style={{color:'white'}}>
          {this.state.showSidebar && <Sidebar/>}
          <Switch>
                <Route exact path="/events/spotlight"  render={ () => (<Spotlight somedata={somedata}/>) }/>
                <Route exact path="/events/today"  render={ () => (<Todayevent {...this.props} showSidebar={this.showSidebar}/> )} />
                <Route exact path="/events/upcoming" render={ () => (<Upcomingevent {...this.props} showSidebar={this.showSidebar}/> )} />
                <Route exact path="/events/more"   render={ () => (<Moreevents {...this.props} showSidebar={this.showSidebar}/> )} />              
                <Route exact path="/events/completed"   render={ () => (<CompletedEvents {...this.props} showSidebar={this.showSidebar}/> )} />              
                <Route  exact path="/events" render={ () => (<Allevents {...this.props} showSidebar={this.showSidebar} />) } />
                <Route exact path="/events/:id/contests"  render={ () => (<Contests {...this.props} hideSidebar={this.hideSidebar} />) } />
                <Route exact path="/events/:id/completedcontests"  render={ () => (<CompletedContests {...this.props} hideSidebar={this.hideSidebar} />) } />
                <Route path="/events/:id"  render={ () => (<Eventshow {...this.props} hideSidebar={this.hideSidebar} />) }  />
          </Switch>
      </div>
    )
  }
}

export default Events;

