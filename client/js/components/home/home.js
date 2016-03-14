'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Panel = ReactBootstrap.Panel
var Grid = ReactBootstrap.Grid
var Row = ReactBootstrap.Row
var Col = ReactBootstrap.Col
var Jumbotron = ReactBootstrap.Jumbotron
var TeamCreationForm = require('./teamCreationForm')

var Home = React.createClass({
  render: function () {
    return (
      <Grid fluid>
        <Row>
          <Col md={6}>
            <Jumbotron>
              <h1>Welcome to Measure Mate!</h1>
            </Jumbotron>
          </Col>
          <Col md={6}>
            <Panel header='Create Team' bsStyle='primary' className='center-block'>
              <TeamCreationForm />
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
})

module.exports = Home
