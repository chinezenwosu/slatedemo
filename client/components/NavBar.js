import React from 'react';
import {Link} from 'react-router';

class NavBar extends React.Component {
  render() {
    return(
      <nav className="navbar navbar-inverse" role="navigation">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link to='/' className="navbar-brand">Toast</Link>
        </div>

        <div className="collapse navbar-collapse navbar-ex1-collapse">
          <ul className="nav navbar-nav">
            <li className="active"><a href="#">Link</a></li>
            <li><a href="#">Link</a></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <form className="navbar-form navbar-left" role="search">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Search" />
              </div>
              <button type="submit" className="btn btn-default">Submit</button>
            </form>
            <li><Link to='signup'>Sign up</Link></li>
            <li><Link to='signup'>Log in</Link></li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                Dropdown <b className="caret"></b>
              </a>
              <ul className="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li><a href="#">Separated link</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    );
  };
};

export default NavBar;
