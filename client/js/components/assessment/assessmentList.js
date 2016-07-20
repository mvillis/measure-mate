'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Moment = require('moment')
var Table = ReactBootstrap.Table
var Label = ReactBootstrap.Label
var TagList = require('../common/tagList')

var AssessmentList = React.createClass({
  propTypes: {
    showTeams: React.PropTypes.bool,
    assessments: React.PropTypes.array.isRequired,
    assessmentTags: React.PropTypes.array.isRequired
  },

  render: function () {
    return (
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Created Date</th>
            <th>Template</th>
            <th>Tags</th>
            <th>Status</th>
            <th className={this.props.showTeams ? '' : 'hidden'}>Team</th>
          </tr>
        </thead>
        <tbody>
          {this.props.assessments.map(function (assessment, i) {
            var prettyCreated = Moment(assessment.created).format('DD/MM/YYYY')
            var relativeCreated = Moment(assessment.created).fromNow()
            var assessmentUrl = '/assessment/' + assessment.id + '/' + 'summary'
            var tags = this.props.assessmentTags[assessment.id] || assessment.tags
            return (
              <LinkContainer key={assessment.id} to={{pathname: assessmentUrl}}>
                <tr className='clickable' >
                  <td><a href={assessmentUrl}>{assessment.id}</a></td>
                  <td>{prettyCreated} <small>({relativeCreated})</small></td>
                  <td>{assessment.template.name}</td>
                  <td className='wrap'><TagList tags={tags} /></td>
                  <td><Label bsStyle='primary'>{assessment.status}</Label></td>
                  <td className={this.props.showTeams ? '' : 'hidden'}>
                    <a href={'/team/' + assessment.team.id + '/'}>{assessment.team.name}</a>
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

module.exports = AssessmentList
