import React from 'react'
import {
    Switch
} from "react-router-dom";
import './css/eventshow.css'


import CreatePortfolio from './CreatePortfolio';
import EventSidebar from './EventSidebar';
import Leaderboard from './Leaderboard';
import PrizeBreakup from './PrizeBreakup';
import ViewPortfolio from './ViewPortfolio';
import PrivateRoute from './helper/PrivateRoutes';
import { API2 } from '../../backend';
import EditPortfolio from './EditPortfolio';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Report from './Report';
import { Link } from "react-router-dom";

export class Eventshow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
             contest:{}
        }
    }
   
    fetchContest = () => {
        const contestid=window.location.pathname.split('/')[3];
        const userid=localStorage.getItem('id');
        fetch(`${API2}/contests/v2/${contestid}?userId=${userid}`)
        .then(res => res.json())
        .then(data => this.setState({
            contest:data.data
        }))
    }
    // goBackToAllContests = () => {

    // }
    componentWillMount(){
        this.fetchContest()
        this.props.hideSidebar();
    }
    render() {
        const eventid=window.location.pathname.split('/')[2];
        return (
            <div>
                <div className="eventheader">
                    <h1>
                    <Link to={`/events/${eventid}/contests`}>
                    <ArrowBackIcon style={{fontSize:40}}/>
                    </Link>
                    {this.state.contest.name} 
                    </h1> 
                </div>
                <div className='eventshow-flex'>
                   
                <EventSidebar/>
                <Switch>
                        
                        <PrivateRoute exact path="/events/:eventid/:contestid/prizebreakup"  component={PrizeBreakup}/>
                        <PrivateRoute exact path="/events/:eventid/:contestid/leaderboard"  component={Leaderboard} />
                        <PrivateRoute exact path="/events/:eventid/:contestid/createportfolio"  component={CreatePortfolio} />
                        <PrivateRoute exact path="/events/:eventid/:contestid/editportfolio"  component={EditPortfolio} />
                        <PrivateRoute exact path="/events/:eventid/:contestid/report"  component={Report} />
                        <PrivateRoute exact path="/events/:eventid/:contestid/viewportfolio"   component={ViewPortfolio} />              
                </Switch>
                
                </div>
            </div>
        )
    }
}


