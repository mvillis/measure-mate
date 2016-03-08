"use strict";

var React = require('react');
var ReactBootrap = require('react-bootstrap');
var ReactRouterBootstrap = require('react-router-bootstrap');
var LinkContainer = ReactRouterBootstrap.LinkContainer;
var Navbar = ReactBootrap.Navbar;
var Nav = ReactBootrap.Nav;
var NavItem = ReactBootrap.NavItem;

var Header = React.createClass({
  propTypes: {},
  render: function render() {
    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to={{ pathname: '/'}}>
                <a>Measure Mate</a>
              </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to={{ pathname: '/assessment/list'}}>
                <NavItem eventKey={2}>Assessments</NavItem>
              </LinkContainer>
              <LinkContainer to={{ pathname: '/team/list'}}>
                <NavItem eventKey={3}>Teams</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </div>
    )
  }
});

module.exports = Header;
