import React from 'react';
import SignUpForm from './SignUpForm';
import { connect } from 'react-redux';
import { userSignUpRequest } from '../../actions/signUpActions';

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);

    this.PropTypes = {
      userSignUpRequest: React.PropTypes.func.isRequired,
    };
  }

  render() {
    const { userSignUpRequest } = this.props;
    return(
      <div className="container">
        <div className="row">
          <SignUpForm userSignUpRequest={userSignUpRequest}/>
        </div>
      </div>
    );
  };
};

function mapStateToProps(state) {
  return {
    users: state.users,
  };
};

export default connect(mapStateToProps, { userSignUpRequest })(SignUpPage);
