'use strict'

var React = require('react')
var Loader = require('react-loader')
var $ = require('jquery')
var TeamList = require('./teamList')

var TeamTable = React.createClass({
  loadTeamsFromServer: function () {
    $.ajax({
      url: '/api/teams/',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({data: data, loaded: true})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/api/teams', status, err.toString())
      }
    })
  },
  getInitialState: function () {
    return {
      data: [],
      loaded: false
    }
  },
  componentDidMount: function () {
    this.loadTeamsFromServer()
  },
  render: function () {
    return (
      <div>
        <Loader loaded={this.state.loaded}>
          <TeamList data={this.state.data} />
        </Loader>
      </div>
    )
  }
})

module.exports = TeamTable
