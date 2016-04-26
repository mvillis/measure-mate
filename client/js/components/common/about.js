'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Panel = ReactBootstrap.Panel
var Grid = ReactBootstrap.Grid
var Row = ReactBootstrap.Row
var Col = ReactBootstrap.Col
var Jumbotron = ReactBootstrap.Jumbotron

var About = React.createClass({
  render: function () {
    return (
      <Grid fluid>
        <Row>
          <Col md={3} />
          <Col md={6}>
            <Jumbotron>
              <p className='logo-slogan-text'>This site is based on the <a href='https://github.com/mvillis/measure-mate'>Measure Mate project.</a></p>
            </Jumbotron>
            <Jumbotron>
              <img src='/static/assets/img/measure_mate_plain_optim.svg' className='logo'></img>
              <h1 className='logo-text'>Measure Mate!</h1>
              <p className='logo-slogan-text'>A tool to track maturity assessments for your team.</p>
            </Jumbotron>
          </Col>
          <Col md={3} />
        </Row>
      </Grid>
    )
  }
})

module.exports = About
