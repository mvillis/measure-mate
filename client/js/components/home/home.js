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
              <img src='/static/assets/img/measure_mate_plain.svg' className='logo'></img>
              <h1 className='logo-text'>Measure Mate!</h1>
              <p className='logo-slogan-text'>A tool to track maturity assessments for your team.</p>
            </Jumbotron>
          </Col>
          <Col md={6}>
            <Panel header='Create Team' bsStyle='info' className='center-block'>
              <TeamCreationForm />
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
})

module.exports = Home
