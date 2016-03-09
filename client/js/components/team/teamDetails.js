'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Table = ReactBootstrap.Table

var TagList = require('../assessment/tagList')

var TeamDetails = React.createClass({
  propTypes: {
    team: React.PropTypes.object.isRequired
  },
  render: function () {
    return (
      <div>
        <Table hover fill>
          <tbody>
            <tr>
              <th>Name</th>
              <td>{this.props.team.name}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{this.props.team.short_desc}</td>
            </tr>
            <tr>
              <th>Tags</th>
              <td><TagList tags={this.props.team.tags} /></td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
})

module.exports = TeamDetails
