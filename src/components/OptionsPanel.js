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
    this.export = this.export.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }

  getActiveSlide() {
    return document.querySelector('.my-slides.active textarea');
  }

  alertMessage(alertId) {
    $(alertId).animate({ 'margin-right': '100%' }, 1000);

    window.setTimeout(function() {
      $(alertId).animate({ 'margin-right': '-405px' }, 1000);
    }, 4000);
  }

  copyAll() {
    copy(this.getActiveSlide().value, {
      debug: true,
      message: 'Press #{key} to copy',
    });
    this.alertMessage('#copy-alert');
  }

  downloadInnerHtml(filename, content, mimeType) {
    let link = document.getElementById('export-link');
    mimeType = mimeType || 'text/plain';

    link.setAttribute('download', filename);
    link.setAttribute(
      'href',
      'data:' + mimeType + ';charset=utf-8,' +
      encodeURIComponent(content)
    );
    link.click();
  }

  export() {
    let caption = document.getElementById('caption');
    let fileName = caption.innerText;
    this.downloadInnerHtml(fileName, this.getActiveSlide().value, 'text/html');
    this.alertMessage('#export-alert');
  }

  clearAll() {
    this.getActiveSlide().value = '';
  }

  render() {
    return (
      <div className="btn-group-vertical" role="group" aria-label="Example">
        <div id="copy-alert" className="alert alert-success alert-dismissable slide-alert">
          <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
          <strong>Successful! </strong>All texts have been copied.
        </div>
        <button type="button" onClick={this.copyAll} className="btn btn-primary">Copy All</button>

        <div id="export-alert" className="alert alert-success alert-dismissable slide-alert">
          <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
          <strong>successful! </strong>All texts have been exported.
        </div>
        <a id="export-link" onClick={this.export} className="btn btn-success">Export</a>

        <div id="other-alert" className="alert alert-success alert-dismissable slide-alert">
          <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
          <strong>Successful! </strong>All texts have been removed
        </div>
        <button type="button" onClick={this.clearAll} className="btn btn-danger">Clear All</button>
      </div>
    );
  };
};

export default OptionsPanel;
