'use strict'

var React = require('react')
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer

var Footer = React.createClass({
  render: function render () {
    return (
      <div className='footer'>
        <LinkContainer to={{pathname: '/about'}}>
          About this site
        </LinkContainer>
      </div>
    )
  }
})

module.exports = Footer
