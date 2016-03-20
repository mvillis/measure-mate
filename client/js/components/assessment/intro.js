'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Jumbotron = ReactBootstrap.Jumbotron
var Button = ReactBootstrap.Button

var Intro = React.createClass({
  propTypes: {
    attributes: React.PropTypes.array,
    params: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      attribute: undefined,
      measureSyncActivity: false,
      dirtyObservation: false
    }
  },
  render: function () {
    return (
      <Jumbotron>
        <h1>Let's get started!</h1>
        <p>Look to your right. There you will find a list of the areas we are going to measure. Start by selecting the top one.</p>
        <span>
          <LinkContainer to={{pathname: '/assessment/' + this.props.params.id + '/' + ((this.props.attributes) ? this.props.attributes[0].id : '')}}>
            <Button bsStyle='primary'>Begin</Button>
          </LinkContainer>
          &nbsp;
          <LinkContainer to={{pathname: '/assessment/' + this.props.params.id + '/summary'}}>
            <Button bsStyle='default'>See Results</Button>
          </LinkContainer>
        </span>
      </Jumbotron>
    )
  }
})

module.exports = Intro
