'use strict'

var React = require('react')
var ReactDOM = require('react-dom')
var ReactBootstrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Moment = require('moment')
var Table = ReactBootstrap.Table
var TagList = require('../common/tagList')
var TablesortCore = require('../common/tablesortCore')

var TeamList = React.createClass({
  propTypes: {
    teams: React.PropTypes.array.isRequired,
    teamTags: React.PropTypes.object.isRequired
  },
  componentDidMount: function () {
    var teamList = ReactDOM.findDOMNode(this.refs.teamList)
    TablesortCore(teamList)
  },

  render: function () {
    return (
      <Table ref='teamList' hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Team Name</th>
            <th className='no-sort'>Tags</th>
            <th data-sort-method='string'>Created Date</th>
            <th data-sort-method='string'>Updated Date</th>
          </tr>
        </thead>
        <tbody>
          {this.props.teams.map(function (team, i) {
            var prettyCreated = Moment(team.created).format('DD/MM/YYYY')
            var relativeCreated = Moment(team.created).fromNow()
            var prettyUpdated = Moment(team.updated).format('DD/MM/YYYY')
            var relativeUpdated = Moment(team.updated).fromNow()
            var teamUrl = '/team/' + team.id + '/'

            return (
              <LinkContainer key={team.id} to={{pathname: teamUrl}}>
                <tr className='clickable'>
                  <td data-sort={team.id} data-sort-method='number'>
                    <a href={teamUrl}>{team.id}</a>
                  </td>
                  <td>{team.name}</td>
                  <td className='wrap'>
                    {this.props.teamTags.hasOwnProperty(team.id)
                      ? <TagList tags={this.props.teamTags[team.id] || []} />
                      : <span>•••&nbsp;</span>}
                  </td>
                  <td data-sort={team.created}>
                    {prettyCreated} <small>({relativeCreated})</small>
                  </td>
                  <td data-sort={team.updated}>
                    {prettyUpdated} <small>({relativeUpdated})</small>
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
