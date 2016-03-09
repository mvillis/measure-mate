'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Loader = require('react-loader')
var Table = ReactBootstrap.Table
var $ = require('jquery')

var TagList = require('../assessment/tagList')

var TeamDetails = React.createClass({
  propTypes: {
    teamId: React.PropTypes.string.isRequired
  },
  loadTeamFromServer: function () {
    var url = '/api/teams/' + this.props.teamId
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({team: data, loaded: true})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(url, status, err.toString())
      }
    })
  },
  getInitialState: function () {
    return {
      team: {},
      loaded: false
    }
  },
  componentDidMount: function () {
    this.loadTeamFromServer()
  },
  render: function () {
    return (
      <div>
        <Loader loaded={this.state.loaded}>
          <Table hover fill>
            <tbody>
              <tr>
                <th>Name</th>
                <td>{this.state.team.name}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{this.state.team.short_desc}</td>
              </tr>
              <tr>
                <th>Tags</th>
                <td><TagList tags={this.state.team.tags} /></td>
              </tr>
            </tbody>
          </Table>
        </Loader>
      </div>
    )
  }
})

module.exports = TeamDetails
