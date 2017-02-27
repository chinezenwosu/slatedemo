import React from 'react';
import copy from 'copy-to-clipboard';

class OptionsPanel extends React.Component {
  constructor(props) {
    super();

    let initialState = {
      slideIndex: 1,
    };

    this.state = initialState;

    this.copyAll = this.copyAll.bind(this);
  }

  copyAll() {
    let activeSlide = document.querySelector('.my-slides.active textarea');
    copy(activeSlide.value, {
      debug: true,
      message: 'Press #{key} to copy',
    });
    $('#copy-alert').animate({ 'margin-right': '100%' }, 1000);

    window.setTimeout(function() {
      $('#copy-alert').animate({ 'margin-right': '-405px' }, 1000);
    }, 4000);
  }

  render() {
    return (
      <div className="btn-group-vertical" role="group" aria-label="Example">
        <div id="copy-alert" className="alert alert-success alert-dismissable slide-alert">
          <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
          <strong>Successful! </strong>All texts have been copied.
        </div>
        <button type="button" onClick={this.copyAll} className="btn btn-secondary">Copy All</button>

        <div id="export-alert" className="alert alert-warning alert-dismissable slide-alert">
          <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
          <strong>successful! </strong>All texts have been exported.
        </div>
        <button type="button" className="btn btn-secondary">Export</button>

        <div id="other-alert" className="alert alert-success alert-dismissable slide-alert">
          <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
          <strong>Successful! </strong>All texts have been copied
        </div>
        <button type="button" className="btn btn-secondary">Other</button>
      </div>
    );
  };
};

export default OptionsPanel;
