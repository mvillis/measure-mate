'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Moment = require('moment')
var Table = ReactBootstrap.Table
var TagList = require('../assessment/tagList')

var TeamList = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
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
          </tr>
        </thead>
        <tbody>
          {this.props.data.map(function (team, i) {
            var prettyCreated = Moment(team.created).format('DD/MM/YYYY')
            var relativeCreated = Moment(team.created).fromNow()
            var teamUrl = '/team/' + team.id + '/'
            console.log('teamUrl=' + teamUrl)
            return (
              <LinkContainer key={team.id} to={{pathname: teamUrl}}>
                <tr className='clickable'>
                  <td>
                    <a href={'#' + teamUrl}>{team.id}</a>
                  </td>
                  <td>{team.name}</td>
                  <td className='wrap'><TagList tags={team.tags}/></td>
                  <td>{prettyCreated} <small>({relativeCreated})</small></td>
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
