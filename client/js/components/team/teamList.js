'use strict'

var React = require('react')
var ReactDOM = require('react-dom')
var ReactBootstrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Moment = require('moment')
var Table = ReactBootstrap.Table
var TagList = require('../common/tagList')
var tablesort = require('tablesort')

var TeamList = React.createClass({
  propTypes: {
    teams: React.PropTypes.array.isRequired,
    teamTags: React.PropTypes.array
  },
  componentDidMount: function () {
    var teamList = ReactDOM.findDOMNode(this.refs.teamList)
    tablesort(teamList)
  },

  render: function () {
    return (
      <Table ref='teamList' hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Team Name</th>
            <th className='no-sort'>Tags</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {this.props.teams.map(function (team, i) {
            var prettyCreated = Moment(team.created).format('DD/MM/YYYY')
            var relativeCreated = Moment(team.created).fromNow()
            var teamUrl = '/team/' + team.id + '/'
            var tags = this.props.teamTags[team.id] || []
            return (
              <LinkContainer key={team.id} to={{pathname: teamUrl}}>
                <tr className='clickable'>
                  <td data-sort={team.id} data-sort-method='number'>
                    <a href={teamUrl}>{team.id}</a>
                  </td>
                  <td>{team.name}</td>
                  <td className='wrap'><TagList tags={tags} /></td>
                  <td data-sort={team.created} data-sort-method='date'>
                    {prettyCreated} <small>({relativeCreated})</small>
                  </td>
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
