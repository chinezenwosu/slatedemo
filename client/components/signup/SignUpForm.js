import React from 'react';
import _ from 'lodash';

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slackname: '',
      email: '',
      cohort: '',
      password: '',
      passwordConfirmation: '',
    };

    this.PropTypes = {
      userSignUpRequest: React.PropTypes.func.isRequired,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.userSignUpRequest(this.state);
  }

  render() {
    const options = _.map(_.range(1, 25, 1), (value) =>
      <option key={value} value={value}>Cohort {value}</option>
    );
    return(
      <div className="container">
        <div className="row">
          <div className="col-sm-offset-4 col-sm-4">
            <form action="" method="POST" onSubmit={this.onSubmit} className="form-horizontal" role="form">
              <div className="form-group">
                <legend>Sign up</legend>
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Slack Name"
                  name="slackname"
                  value={this.state.slackname}
                  onChange={this.onChange} />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange} />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange} />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Confirm Password"
                  name="passwordConfirmation"
                  value={this.state.passwordConfirmation}
                  onChange={this.onChange} />
              </div>
              <div className="form-group">
                <select
                  className="form-control"
                  name="cohort"
                  value={this.state.cohort}
                  onChange={this.onChange}>
                  <option value="" disabled>Cohort</option>
                  {options}
                </select>
              </div>
              <div className="form-group pull-right">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
          </form>
          </div>
        </div>
      </div>
    );
  };
};

export default SignUpForm;
