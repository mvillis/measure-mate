'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Moment = require('moment')
var Table = ReactBootstrap.Table
var TagList = require('../common/tagList')

var TeamList = React.createClass({
  propTypes: {
    teams: React.PropTypes.array.isRequired,
    teamTags: React.PropTypes.array
  },

  render: function () {
    return (
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Team Name</th>
            <th>Tags</th>
            <th>Created Date</th>
            <th>Updated Date</th>
          </tr>
        </thead>
        <tbody>
          {this.props.teams.map(function (team, i) {
            var prettyCreated = Moment(team.created).format('DD/MM/YYYY')
            var relativeCreated = Moment(team.created).fromNow()
            var prettyUpdated = Moment(team.updated).format('DD/MM/YYYY')
            var relativeUpdated = Moment(team.updated).fromNow()
            var teamUrl = '/team/' + team.id + '/'
            var tags = this.props.teamTags[team.id] || []
            return (
              <LinkContainer key={team.id} to={{pathname: teamUrl}}>
                <tr className='clickable'>
                  <td>
                    <a href={teamUrl}>{team.id}</a>
                  </td>
                  <td>{team.name}</td>
                  <td className='wrap'><TagList tags={tags} /></td>
                  <td>{prettyCreated} <small>({relativeCreated})</small></td>
                  <td>{prettyUpdated} <small>({relativeUpdated})</small></td>
                </tr>
              </LinkContainer>
            )
          }, this)}
        </tbody>
      </Table>
    )
  }
})

module.exports = TeamList
