'use strict'

var React = require('react')
var Loader = require('react-loader')
var $ = require('jquery')
var TeamList = require('./teamList')

var TeamTable = React.createClass({
  loadAllTagsFromServer: function () {
    var url = '/api/tags/'
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        var tags = {}

        data.forEach(function (tag) {
          tags[tag.id] = tag
        }, this)

        var teamTags = {}
        this.state.teams.forEach(function (team) {
          teamTags[team.id] = team.tags.map(function (tagId) {
            return tags[tagId]
          }, this)
        }, this)

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
      success: function (teams) {
        var tags = {}
        teams.forEach(function (team) {
          if (team.tags.length > 0) {
            tags[team.id] = team.tags.map(function (tagId) {
              return { id: tagId, name: '•••' }
            })
          } else {
            tags[team.id] = []
          }
        }, this)

        this.setState({
          teams: teams,
          teamTags: tags,
          loaded: true
        })
        this.loadAllTagsFromServer()
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
