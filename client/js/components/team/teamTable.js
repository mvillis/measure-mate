'use strict'

var React = require('react')
var createReactClass = require('create-react-class')
var Loader = require('react-loader')
var $ = require('jquery')
var TeamList = require('./teamList')

var TeamTable = createReactClass({
  displayName: 'TeamTable',

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

        this.setState({ teamTags: teamTags })
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
        var teamTags = {}
        teams.forEach(function (team) {
          teamTags[team.id] = team.tags.map(function (tagId) {
            return { id: tagId, name: '•••' }
          })
        }, this)

        this.setState({
          teams: teams,
          teamTags: teamTags,
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
