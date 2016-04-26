'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Jumbotron = ReactBootstrap.Jumbotron

var About = React.createClass({
  render: function () {
    return (
      <div className='container'>
        <Jumbotron>
          <img src='/static/assets/img/measure_mate_plain_optim.svg' className='logo'></img>
          <h1 className='logo-text'>Measure Mate!</h1>
          <p className='logo-slogan-text'>A tool to track maturity assessments for your team.</p>
          <p className='logo-slogan-text'>This site is based on the <a href='https://github.com/mvillis/measure-mate'>Measure Mate project hosted on GitHub.</a></p>
        </Jumbotron>
      </div>
    )
  }
})

module.exports = About
