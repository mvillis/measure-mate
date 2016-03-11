'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Panel = ReactBootstrap.Panel
var TeamCreationForm = require('./teamCreationForm')

var Home = React.createClass({
  render: function () {
    return (
      <div className='container-fluid'>
        <Panel header='Team' bsStyle='primary'>
          <TeamCreationForm />
        </Panel>
      </div>
    )
  }
})

module.exports = Home
