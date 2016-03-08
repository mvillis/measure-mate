"use strict";

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Label = ReactBootstrap.Label;
var PageHeader = ReactBootstrap.PageHeader;
var Table = ReactBootstrap.Table;
var $ = require('jquery');

var TeamDetails = require('./teamDetails');
var AssessmentTable = require('../assessment/AssessmentTable');

var Team = React.createClass({
  propTypes: {
    params: React.PropTypes.object.isRequired
  },
  render: function() {
    return (
      <div>
        <TeamDetails team_id={this.props.params.id}/>
        <AssessmentTable team_id={this.props.params.id}/>
      </div>
    );
  }
});

module.exports = Team;
