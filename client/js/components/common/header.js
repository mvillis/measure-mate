'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Navbar = ReactBootstrap.Navbar
var Nav = ReactBootstrap.Nav
var NavItem = ReactBootstrap.NavItem
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer

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
              <LinkContainer to='/'>
                <a title='Home'>Measure Mate</a>
              </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to='/assessment/'>
                <NavItem eventKey={1} title='Assessments'>Assessments</NavItem>
              </LinkContainer>
              <LinkContainer to='/team/'>
                <NavItem eventKey={2} title='Teams'>Teams</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={3} title='Admin' href='/admin/' target='_blank'>Admin</NavItem>
              <NavItem eventKey={4} title='Export' href='/export/' target='_blank'>Export</NavItem>
              <LinkContainer to='/about'>
                <NavItem eventKey={5} title='About'>About</NavItem>
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
