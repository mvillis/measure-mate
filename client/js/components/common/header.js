'use strict'

var React = require('react')
var ReactBootrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Navbar = ReactBootrap.Navbar
var Nav = ReactBootrap.Nav
var NavItem = ReactBootrap.NavItem

var Header = React.createClass({
  propTypes: {
    children: React.PropTypes.object
  },
  render: function render () {
    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to={{pathname: '/'}}>
                <a>Measure Mate</a>
              </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to={{pathname: '/assessment/'}}>
                <NavItem eventKey={1}>Assessments</NavItem>
              </LinkContainer>
              <LinkContainer to={{pathname: '/team/'}}>
                <NavItem eventKey={2}>Teams</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <LinkContainer to={{pathname: '/about'}}>
                <NavItem eventKey={3}>About</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className='container-fluid'>
          {this.props.children}
        </div>
      </div>
    )
  }
})

module.exports = Header
