'use strict'

var React = require('react')
var createReactClass = require('create-react-class')
var ReactBootstrap = require('react-bootstrap')
var Panel = ReactBootstrap.Panel
var Row = ReactBootstrap.Row
var Col = ReactBootstrap.Col
var Jumbotron = ReactBootstrap.Jumbotron
var TeamCreationForm = require('../team/teamCreationForm')

var Home = createReactClass({
  displayName: 'Home',

  render: function () {
    return (
      <div>
        <Row>
          <Col md={6}>
            <Jumbotron>
              <span className='logo' />
              <h1 className='logo-text wrap'>Measure Mate!</h1>
              <p className='logo-slogan-text'>A tool to track maturity assessments for your team.</p>
            </Jumbotron>
          </Col>
          <Col md={6}>
            <Panel header='Create Team' bsStyle='info' className='center-block'>
              <TeamCreationForm />
            </Panel>
          </Col>
        </Row>
      </div>
    )
  }
})

module.exports = Home
