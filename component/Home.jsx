import React, { Component } from 'react';

export default class Home extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    const urls = [
      "url('https://www.verdict.co.uk/wp-content/uploads/2017/09/get-into-comic-books.jpg')",
      "url('https://i.kinja-img.com/gawker-media/image/upload/s--nuSkmSdp--/c_scale,fl_progressive,q_80,w_800/rgvyhu6nipx8azgbozkt.png')",
      "url('https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/fc/3053666-poster-p-1-general-electric-teams-with-wattpad-to-combine-new-science-with-old-school-sci-fi.jpg')",
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
        <div
          ref="whatever"
          className="home-page-top"
        >Crossover
        </div>
        <div className="home-page-create">
          <div className="home-page-create-b">CREATE</div>
        </div>
        <div className="home-page-collaborate">
          <div className="home-page-collaborate-b">COLLABORATE</div>
        </div>
        <div className="home-page-combine">
          <div className="home-page-combine-b">COMBINE</div>
        </div>
      </div>
    );
  }
}
