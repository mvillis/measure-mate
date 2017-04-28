'use strict'

var PropTypes = require('prop-types');

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Jumbotron = ReactBootstrap.Jumbotron
var Button = ReactBootstrap.Button

var Intro = React.createClass({
  propTypes: {
    template: PropTypes.object,
    params: PropTypes.object
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
        <h1>Welcome</h1>
        <p>This assessment is made up of one or many areas of interest.</p>
        <p>For each area we will ask you to rate your current level of capability. You can also select a target and write down some observations.</p>
        <p>Let&#39;s get started!</p>
        <span>
          <LinkContainer to={{pathname: '/assessment/' + this.props.params.assessmentId + '/' + this.props.template.attributes[0].id}}>
            <Button bsStyle='primary'>Begin</Button>
          </LinkContainer>
          &nbsp;
          <LinkContainer to={{pathname: '/assessment/' + this.props.params.assessmentId + '/summary'}}>
            <Button bsStyle='default'>See Results</Button>
          </LinkContainer>
        </span>
      </Jumbotron>
    )
  }
})

module.exports = Intro
