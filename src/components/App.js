import React from 'react';
// import NavBar from './NavBar';

class App extends React.Component {
  render() {
    return (
      <section id="portfolio" className="no-padding-bottom"> 
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="heading">Selected works</h2>
              <p className="lead margin-bottom--big">You can make also image gallery with this section easily. </p>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row no-space">
            <div className="col-sm-4 col-md-3">
              <div className="box">
                <a href="img/portfolio/paper-presentation.jpg" title="" data-toggle="lightbox" data-gallery="portfolio" data-title="Name of the work 1" data-footer="Description of Project No.1">
                  <img src="img/portfolio/paper-presentation.jpg" alt="" className="img-responsive" />
                </a>
              </div>
            </div>
            <div className="col-sm-4 col-md-3">
              <div className="box">
                <a href="img/portfolio/business-card-26.jpg" title="" data-toggle="lightbox" data-gallery="portfolio" data-title="Name of the work 2" data-footer="Fifth abundantly made Give sixth hath. Cattle creature i be don't them.">
                  <img src="img/portfolio/business-card-26.jpg" alt="" className="img-responsive" />
                </a>
              </div>
            </div>
            <div className="col-sm-4 col-md-3">
              <div className="box">
                <a href="img/portfolio/gravity-paper.jpg" title="" data-toggle="lightbox" data-gallery="portfolio" data-title="Name of the work 3" data-footer="Fifth abundantly made Give sixth hath. Cattle creature i be don't them.">
                  <img src="img/portfolio/gravity-paper.jpg" alt="" className="img-responsive" />
                </a>
              </div>
            </div>
            <div className="col-sm-4 col-md-3">
              <div className="box">
                <a href="img/portfolio/envelope-brand.jpg" title="" data-toggle="lightbox" data-gallery="portfolio" data-title="Name of the work 4" data-footer="Fifth abundantly made Give sixth hath. Cattle creature i be don't them.">
                  <img src="img/portfolio/envelope-brand.jpg" alt="" className="img-responsive" />
                </a>
              </div>
            </div>
            <div className="col-sm-4 col-md-3">
              <div className="box">
                <a href="img/portfolio/business-card.jpg" title="" data-toggle="lightbox" data-gallery="portfolio" data-title="Name of the work 5" data-footer="Fifth abundantly made Give sixth hath. Cattle creature i be don't them.">
                  <img src="img/portfolio/business-card.jpg" alt="" className="img-responsive" />
                </a>
              </div>
            </div>
            <div className="col-sm-4 col-md-3">
              <div className="box">
                <a href="img/portfolio/trifold.jpg" title="" data-toggle="lightbox" data-gallery="portfolio" data-title="Name of the work 6" data-footer="Fifth abundantly made Give sixth hath. Cattle creature i be don't them.">
                  <img src="img/portfolio/trifold.jpg" alt="" className="img-responsive" />
                </a>
              </div>
            </div>
            <div className="col-sm-4 col-md-3">
              <div className="box">
                <a href="img/portfolio/label-clothes.jpg" title="" data-toggle="lightbox" data-gallery="portfolio" data-title="Name of the work 7" data-footer="Fifth abundantly made Give sixth hath. Cattle creature i be don't them.">
                  <img src="img/portfolio/label-clothes.jpg" alt="" className="img-responsive" />
                </a>
              </div>
            </div>
            <div className="col-sm-4 col-md-3">
              <div className="box">
                <a href="img/portfolio/ipad-air-2.jpg" title="" data-toggle="lightbox" data-gallery="portfolio" data-title="Name of the work 8" data-footer="Fifth abundantly made Give sixth hath. Cattle creature i be don't them.">
                  <img src="img/portfolio/ipad-air-2.jpg" alt="" className="img-responsive" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
};

export default App;
