import React, { Component } from "react";

export default class Home extends Component {
  componentDidMount() {
    const urls = [
      "url('/background-images/homepage-body-a.jpg')",
      "url('/background-images/homepage-body-b.png')",
      "url('/background-images/homepage-body-c.jpg')",
      "url('/background-images/doctor-doom-squirrel.jpg')",
      "url('/background-images/addstory.jpg')",
      "url('/background-images/stories.jpg')",
      "url('/background-images/addstory.png')"
    ];
    const img = this.refs.whatever;
    let counter = 0;
    setInterval(() => {
      if (counter > urls.length - 1) {
        counter = 0;
      }
      img.style.backgroundImage = urls[counter];
      counter++;
    }, 4000);
  }

  render() {
    return (
      <div className="home-page">
        <div ref="whatever" className="home-page-top">
          Crossover
        </div>
      </div>
    );
  }
}
