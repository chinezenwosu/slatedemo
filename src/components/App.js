import React from 'react';
import documentTitles from '../data';
import _ from 'lodash';

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      slideIndex: 1,
    };

    this.onClick = this.onClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.slide = this.slide.bind(this);
    this.plusSlides = this.plusSlides.bind(this);
    this.showSlides = this.showSlides.bind(this);
    this.currentSlide = this.currentSlide.bind(this);
  }

  componentDidMount() {
    this.showSlides(this.state.slideIndex);
  }

  openModal() {
    document.getElementById('myModal').style.display = 'block';
  }

  onClick(event) {
    event.preventDefault();
    this.openModal();
    this.currentSlide(event.target.getAttribute('data-position'));
  }

  slide(event) {
    this.currentSlide(event.target.getAttribute('data-position'));
  }

  closeModal() {
    document.getElementById('myModal').style.display = 'none';
  }

  showSlides(position) {
    let i;
    let slides = document.getElementsByClassName('mySlides');
    let previewLinks = document.getElementsByClassName('preview-link');
    let captionText = document.getElementById('caption');
    let captionNumber = document.getElementById('caption-number');
    let slideIndex = position > slides.length ? 1 : (position < 1 ? slides.length : this.state.slideIndex);
    this.setState({
      slideIndex: slideIndex,
    }, () => {
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
      }
      for (i = 0; i < previewLinks.length; i++) {
        previewLinks[i].className = previewLinks[i].className.replace(' active', '');
      }
      slides[this.state.slideIndex - 1].style.display = 'block';
      previewLinks[this.state.slideIndex - 1].className += ' active';
      captionText.innerHTML = previewLinks[this.state.slideIndex - 1].innerText;
      captionNumber.innerHTML = this.state.slideIndex + ' / 4';
    });
  }

  currentSlide(position) {
    this.setState({
      slideIndex: position,
    }, () => {
      this.showSlides(this.state.slideIndex);
    });
  }

  plusSlides(event) {
    this.setState({
      slideIndex: parseInt(this.state.slideIndex) + parseInt(event.target.getAttribute('data-count')),
    }, () => {
      this.showSlides(this.state.slideIndex);
    });
  }

  render() {
    const boxes = _.map(documentTitles, (value, index) =>
      <div key={value.name} className="col-sm-4 col-md-3">
        <div className="box">
          <a className="doc-link" href="#" data-position={index + 1} onClick={this.onClick}>
            {value.name}
          </a>
        </div>
      </div>
    );

    const previewBoxes = _.map(documentTitles, (value, index) =>
      <div key={value.name} className="column col-sm-12">
        <h4 className="preview-link" data-position={index + 1} onClick={this.slide}>{value.name}</h4>
      </div>
    );

    const docPanes = _.map(documentTitles, (value, index) =>
      <div key={value.name} className="mySlides">
        <textarea className="form-control"></textarea>
      </div>
    );

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
            {boxes}
          </div>
        </div>

        <div id="myModal" className="modal">
          <span className="close cursor" onClick={this.closeModal}>&times;</span>
          <div className="under-slide" />
          <div className="modal-content">
            <div className="row">
              <div className="col-sm-3 toc">
                {previewBoxes}
              </div>

              <div className="col-sm-9 doc-pane">
                <a className="prev" data-count={-1} onClick={this.plusSlides}>&#10094;</a>
                <a className="next" data-count={1} onClick={this.plusSlides}>&#10095;</a>
                <div className="caption-container">
                  <span id="caption-number" />
                  <span id="caption" />
                </div>
                {docPanes}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
};

export default App;
