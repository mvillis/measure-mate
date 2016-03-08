"use strict";

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var PageHeader = ReactBootstrap.PageHeader;
var Loader = require('react-loader');
var $ = require('jquery');
var TeamList = require('./teamList');

var TeamTable = React.createClass({
  loadTeamsFromServer: function() {
    $.ajax({
      url: '/api/teams/',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data, loaded: true});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      data: [],
      loaded: false
    };
  },
  componentDidMount: function() {
    this.loadTeamsFromServer();
  },
  render: function() {
    return (
      <div>
        <Loader loaded={this.state.loaded}>
          <TeamList data={this.state.data} />
        </Loader>
      </div>
    );
  }
});

module.exports = TeamTable;
