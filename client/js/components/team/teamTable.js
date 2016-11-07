'use strict'

var React = require('react')
var Loader = require('react-loader')
var $ = require('jquery')
var TeamList = require('./teamList')

var TeamTable = React.createClass({
  loadTeamTagsFromServer: function (teamId) {
    var url = '/api/tags/?team__id=' + teamId
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        var teamTags = this.state.teamTags
        teamTags[teamId] = data
        this.setState({teamTags: teamTags})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(url, status, err.toString())
      }
    })
  },
  loadTeamsFromServer: function () {
    $.ajax({
      url: '/api/teams/',
      dataType: 'json',
      cache: false,
      success: function (data) {
        var teamTags = {}

        data.forEach(function (team) {
          this.loadTeamTagsFromServer(team.id)
        }, this)

        this.setState({
          teams: data,
          teamTags: teamTags,
          loaded: true
        })
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/api/teams', status, err.toString())
      }
    })
  },
  getInitialState: function () {
    return {
      teams: [],
      teamTags: {},
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
          <TeamList teams={this.state.teams} teamTags={this.state.teamTags} />
        </Loader>
      </div>
    )
  }
})

module.exports = TeamTable
