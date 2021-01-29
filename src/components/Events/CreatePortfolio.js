import React, { Component } from 'react'
import './css/portfolio.css';
import {ArrowUpward,ArrowDownward} from '@material-ui/icons';
import { API2 } from '../../backend';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import { Redirect } from 'react-router-dom';
import swal from 'sweetalert';

export default class CreatePortfolio extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             stocksList:undefined,
             selectedStocks:[],
             portfolioName:"portfolio",
             error:"",
             mainStocksList:undefined,
             currentStock:"",
             success:"",
             portfolio:"",
             currTrump:-1,
             doRedirect:false
        }
        this.fetchStocks=this.fetchStocks.bind(this)
    }   
    componentDidMount(){
        this.fetchStocks();
    }
    fetchStocks = () => {
        fetch(`${API2}/stocks?type=NiftyFifty`)
        .then(response => response.json())
        .then(data => {
            this.setState({
                stocksList:data.data,
                mainStocksList:data.data
            })
            // console.log(this.state.stocksList);
        })
    }
    performRedirect = () => {
        const eventid=window.location.pathname.split('/')[2];
        const contestid=window.location.pathname.split('/')[3];
        if(this.state.doRedirect){
          return <Redirect to={`/events/${eventid}/${contestid}/viewportfolio`} />
        }
      }
    selectTheStock = (selectedStock) =>  {
        if(this.state.selectedStocks.length===4){
            swal({text:"your list is full,plz create your portfolio"})
        }
        else{
            this.setState(prevState => ({
                selectedStocks:[...prevState.selectedStocks,selectedStock]
            }),() => {
                // there are 2 stocks list 
                //  1 for all stocks  (without the search query) mainStocksList
                // 2 for updated stocks (search query and all) stockslist 
                let stockslist=this.state.stocksList;
                let remainingStocksAfterSelectedStocks=stockslist.filter((stock)=> stock.name!==selectedStock.name );
                let mainStockslist=this.state.mainStocksList;
                let remainingMainStocks=mainStockslist.filter((stock)=> stock.name!==selectedStock.name );
                this.setState({
                    stocksList:remainingStocksAfterSelectedStocks,
                    mainStocksList:remainingMainStocks
                })
            })
        }
    }  
    removeTheStock = (index) => {
        let currSelectedStocks=this.state.selectedStocks;
        let stockslist=this.state.stocksList;
        let mainStocksList=this.state.mainStocksList;
        stockslist.push(currSelectedStocks[index]);
        mainStocksList.push(currSelectedStocks[index]);
        let selectedStocksAfterRemove1=currSelectedStocks.filter((stock,ind) =>  ind!==index );;
        this.setState({
            selectedStocks:selectedStocksAfterRemove1,
            stocksList:stockslist,
            mainStocksList:mainStocksList
        });
    } 
    makeItTrump  = (index) => {
        if(this.state.selectedStocks.length===0) index=-1;
        this.setState({
            currTrump:index
        })
    }
    handlePortfolioNameChange = (e) => {
        this.setState({
            portfolioName:e.target.value
        })
    }
    handleSearchQueryChange = (e) => {
        let currlist=this.state.mainStocksList.filter(stock => stock.name.toLowerCase().indexOf(e.target.value.toLowerCase())!==-1);        
        this.setState({
            stocksList:currlist
        })
    } 
    createAportfolio = () => {
        if(this.state.currTrump===-1){
            return swal({text:"Plz select trump stock"});
        }
        const eventid=window.location.pathname.split('/')[2];
        const contestid=window.location.pathname.split('/')[3];
        let selectedStocks=this.state.selectedStocks;
        selectedStocks[this.state.currTrump].isTrump=true;
        fetch(`${API2}/portfolios/`,{
            method:"POST",
            headers: {
                Accept:"application/json",
                "authtoken":localStorage.getItem("authToken"),
                "istesting":"false",
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "contestId":contestid,  
                "eventId":eventid,
                "name":this.state.portfolioName,
                "selectedStocks":selectedStocks,
                "userId":localStorage.getItem("id")
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                swal({text:data.error.errorMsg})
            }
            else{
                this.setState({
                    success:"Portfolio Successfully Created",
                    portfolio:data,
                    doRedirect:true
                },() => {
                    swal({text:this.state.success})
                    .then(() => {
                        window.location.reload();
                    })
                })

            }

        })
        .catch(err => console.log(err))
    }
    roundToNPlaces = (num,n) => {
        return +(Math.round(num+"e+"+n)+"e-"+n)
    }
    render() {
        return (
            <div>
            {this.performRedirect()}
            <div className="portfolio-box">
                <div className="portfolio-details">
                    <input type="text" onChange={this.handlePortfolioNameChange} value={this.state.portfolioName} placeholder="enter your portfolio name"  className="portfolioNameInput" />
                    {this.state.currentStock ? 
                    <iframe src={this.state.currentStock.referenceUrl+"&output=embed"}  title={ this.state.currentStock.name}  width="95%" height="80%"  >sunpharama</iframe>
                    :null
                    }
                </div>
            
                <div className="stocks-list">
                    <div className="stock-option-heading">
                    SELECTED STOCKS   
                    {
                        this.state.selectedStocks ?
                        this.state.selectedStocks.map((stock,index)=>{
                            return (
                                <div key={index} id="Selectedstock">
                                    <div >
                                        <span id="Selectedstock-name">{stock.name}</span>
                                        <span id="Selectedstock-val" > 
                                        {
                                            stock.dayTrendPercentage>0 ? <ArrowUpward style={{ fontSize: 15 }} /> 

                                            :<ArrowDownward style={{ fontSize: 15 }}  color="primary" />
                                        }
                                            {stock.dayTrendPercentage>0? this.roundToNPlaces(stock.dayTrendPercentage,2) : -this.roundToNPlaces(stock.dayTrendPercentage,2)}
                                            <span>&#37;</span>
                                        </span>
                                    </div>
                                    <div className="removeAndTrump" >
                                        <span className="TrumpStar">
                                        {
                                            this.state.currTrump===index?<StarIcon style={{color:"#EDBD46"}}/>:
                                            <StarBorderIcon style={{color:"#EDBD46"}} onClick={ ()=> this.makeItTrump(index)}/>
                                        }
                                        </span>
                                        <button id="stock-remove" onClick={() => {
                                            this.removeTheStock(index);
                                            if(index===this.state.currTrump) this.makeItTrump(0);
                                        }}>-</button>
                                    </div>
                                </div>
                            )
                        }) : <div>No stocks avial</div>
                    }

                    {this.state.selectedStocks.length===4 && <button onClick={this.createAportfolio} className="SubmitButton">Create Portfolio</button>}
                    </div>
                    <div className="stock-option-heading2">
                        {/* {this.state.error? swal({text:this.state.error}):null}
                        {this.state.success?swal({text:this.state.success}):null} */}
                        {/* <p style={{fontSize:"20px",color:"red",width:"30%"}}>{this.state.error}</p> */}
                        AVAILABLE STOCKS
                    <div >
                        <input className="Stock-Search-Box" type="text" placeholder="Search Stock By Name" onChange= {this.handleSearchQueryChange}/>
                    </div>
             
                    
                    <div className="stock-listing">
                    

                    {
                        this.state.stocksList ?
                        this.state.stocksList.map((stock,index)=>{
                            return (
                                <div key={index} id="stock">
                                    <button className="stock-describe" onClick={ () => {
                                        console.log("hello world")
                                        this.setState({
                                            currentStock:stock
                                        })
                                    }}>
                                    <div style={{'alignSelf':"flex-end"}}>
                                    <span id="stock-name">{stock.name}</span>
                                    <span id="stock-val"> 
                                    {
                                        stock.dayTrendPercentage>0 ? <ArrowUpward style={{ fontSize: 15 }} /> 

                                        :<ArrowDownward style={{ fontSize: 15,color:"red"}}  />
                                    }
                                        {stock.dayTrendPercentage>0? this.roundToNPlaces(stock.dayTrendPercentage,2) : -this.roundToNPlaces(stock.dayTrendPercentage,2)}
                                        <span>&#37;</span>
                                    </span>
                                    </div>
                                   </button>
                                    <div >
                                       

                                        <button id="stock-sub" onClick={() => {
                                            this.selectTheStock(stock)
                                        }}>+</button>
                                    </div>
                                </div>
                            )
                        }) : <div>No stocks avial</div>
                    }
                    </div>
                    </div>
                </div>
            </div>
           
            </div>
        )
    }
}



 