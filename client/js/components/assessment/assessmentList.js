'use strict'

var React = require('react')
var ReactDOM = require('react-dom')
var ReactBootstrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Moment = require('moment')
var Table = ReactBootstrap.Table
var Label = ReactBootstrap.Label
var TagList = require('../common/tagList')
var TablesortCore = require('../common/tablesortCore')

var AssessmentList = React.createClass({
  propTypes: {
    showTeams: React.PropTypes.bool,
    assessments: React.PropTypes.array.isRequired,
    assessmentTags: React.PropTypes.object.isRequired
  },
  componentDidMount: function () {
    var assessmentList = ReactDOM.findDOMNode(this.refs.assessmentList)
    TablesortCore(assessmentList)
  },

  render: function () {
    return (
      <Table ref='assessmentList' hover>
        <thead>
          <tr>
            <th>#</th>
            <th data-sort-method='string'>Created Date</th>
            <th data-sort-method='string'>Updated Date</th>
            <th>Template</th>
            <th className='no-sort'>Tags</th>
            {this.props.showTeams && <th>Team</th>}
          </tr>
        </thead>
        <tbody>
          {this.props.assessments.map(function (assessment, i) {
            var prettyCreated = Moment(assessment.created).format('DD/MM/YYYY')
            var relativeCreated = Moment(assessment.created).fromNow()
            var prettyUpdated = Moment(assessment.updated).format('DD/MM/YYYY')
            var relativeUpdated = Moment(assessment.updated).fromNow()
            var assessmentUrl = '/assessment/' + assessment.id + '/' + 'summary'

            return (
              <LinkContainer key={assessment.id} to={{pathname: assessmentUrl}}>
                <tr className='clickable' >
                  <td data-sort={assessment.id} data-sort-method='number'>
                    <a href={assessmentUrl}>{assessment.id}</a>
                  </td>
                  <td data-sort={assessment.created}>
                    {prettyCreated} <small>({relativeCreated})</small>
                  </td>
                  <td data-sort={assessment.updated}>
                    {prettyUpdated} <small>({relativeUpdated})</small>
                  </td>
                  <td>{assessment.template.name}</td>
                  <td className='wrap'>
                    {this.props.assessmentTags.hasOwnProperty(assessment.id)
                      ? <TagList tags={this.props.assessmentTags[assessment.id] || []} />
                      : <span>•••&nbsp;</span>}
                    {assessment.status == 'DONE' && <Label bsStyle='default'>Read Only</Label>}
                  </td>
                  {this.props.showTeams && <td>
                    <a href={'/team/' + assessment.team.id + '/'}>{assessment.team.name}</a>
                  </td>}
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
