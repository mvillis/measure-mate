'use strict'

var React = require('react')
var Loader = require('react-loader')
var $ = require('jquery')
var AssessmentList = require('./assessmentList')

var AssessmentTable = React.createClass({
  propTypes: {
    teamId: React.PropTypes.number
  },
  loadAssessmentTagsFromServer: function (assessmentId) {
    var url = '/api/tags/?assessment__id=' + assessmentId
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState(function (previousState, currentProps) {
          var assessmentTags = previousState.assessmentTags
          assessmentTags[assessmentId] = data
          return { assessmentTags: assessmentTags}
        })
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(url, status, err.toString())
      }
    })
  },
  loadAssessmentsFromServer: function () {
    var url = '/api/assessments/'
    if (this.props.teamId) {
      url += '?team__id=' + this.props.teamId
    }
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({assessments: data, loaded: true})

        data.forEach(function (assessemnt) {
          this.loadTeamTagsFromServer(assessemnt.id)
        }, this)
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(window.location, status, err.toString())
      }
    })
  },
  getInitialState: function () {
    return {
      assessments: [],
      assessmentTags: [],
      loaded: false
    }
  },
  componentDidMount: function () {
    this.loadAssessmentsFromServer()
  },
  render: function () {
    return (
      <Loader loaded={this.state.loaded}>
        <AssessmentList assessments={this.state.assessments} assessmentTags={this.state.assessmentTags} showTeams={!this.props.teamId} />
      </Loader>
    )
  }
})

module.exports = AssessmentTable
