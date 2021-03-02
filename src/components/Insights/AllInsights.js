import React, { Component } from "react";
import "./insights.css";
import {API} from "../../backend";
export class AllInsights extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newslist: [],
    };
    this.fetchNews = this.fetchNews.bind(this);
  }
  fetchNews = () => {
    let reqUrl;
    if (this.props.cate) {
        if(this.props.cate==="latest") reqUrl = `${API}/news?Latest=true`;
        else  reqUrl = `${API}/news?category=${this.props.cate}`;
    } else {
      reqUrl = `${API}/news/`;
    }
    fetch(reqUrl)
      .then((response) => response.json())
      .then((data) => data.data)
      .then((data) => {
        this.setState({
          newslist: data,
        });
      });
  };
  componentWillMount() {
    this.fetchNews();
  }

  render() {
    const news = this.state.newslist;
    const DATE_OPTIONS = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return (
      <div className="news-containner">
          {news.map((item) => {
              return (
                <div>
                  <p className="news-title">{item.heading}</p>
                  <p className="news-summary">{item.summary}</p>
                  <p className="date">
                    {new Date(item.createdAt).toLocaleDateString(
                      "en-US",
                      DATE_OPTIONS
                    )}
                  </p>
                </div>
              );
            })}
       </div>
    );
  }
}