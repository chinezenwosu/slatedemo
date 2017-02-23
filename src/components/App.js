import React from 'react';
import documentTitles from '../data';
import _ from 'lodash';

class App extends React.Component {
  constructor(props) {
    super();

    let initialState = {
      slideIndex: 1,
    };

    documentTitles.forEach((value) => {
      initialState[value.domName] = JSON.stringify(value.json, null, 2);
    });

    this.state = initialState;

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.slide = this.slide.bind(this);
    this.plusSlides = this.plusSlides.bind(this);
    this.showSlides = this.showSlides.bind(this);
    this.currentSlide = this.currentSlide.bind(this);
  }

  componentDidMount() {
    this.showSlides(this.state.slideIndex);
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
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
    let slides = document.getElementsByClassName('my-slides');
    let previewLinks = document.getElementsByClassName('preview-link');
    let captionText = document.getElementById('caption');
    let captionNumber = document.getElementById('caption-number');
    let slideIndex = position > slides.length ? 1 : (position < 1 ? slides.length : this.state.slideIndex);
    this.setState({
      slideIndex: slideIndex,
    }, () => {
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
        slides[i].className = slides[i].className.replace(' active', '');
        previewLinks[i].className = previewLinks[i].className.replace(' active', '');
      }
      slides[this.state.slideIndex - 1].style.display = 'block';
      slides[this.state.slideIndex - 1].className += ' active';
      previewLinks[this.state.slideIndex - 1].className += ' active';
      captionText.innerHTML = previewLinks[this.state.slideIndex - 1].innerText;
      captionNumber.innerHTML = this.state.slideIndex + ' / ' + slides.length;
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
      <div key={value.name} className="my-slides">
        <textarea spellCheck="false" className="form-control" name={value.domName} value={this.state[value.domName]} onChange={this.onChange} />
      </div>
    );

    return (
      <section id="portfolio" className="no-padding-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <img className="heading" src="img/logo.png" />
              <p className="lead">Edit and copy common configuration files ... </p>
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
              <div className="col-md-3 col-sm-12 hidden-sm hidden-xs toc">
                {previewBoxes}
              </div>

              <div className="col-md-9 col-sm-12 col-xs-12 doc-pane">
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
