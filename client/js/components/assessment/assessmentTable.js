'use strict'

var React = require('react')
var Loader = require('react-loader')
var $ = require('jquery')
var AssessmentList = require('./assessmentList')

var AssessmentTable = React.createClass({
  propTypes: {
    teamId: React.PropTypes.number
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
        this.setState({data: data, loaded: true})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(window.location, status, err.toString())
      }
    })
  },
  getInitialState: function () {
    return {
      data: [],
      loaded: false
    }
  },
  componentDidMount: function () {
    this.loadAssessmentsFromServer()
  },
  render: function () {
    return (
      <div>
        <Loader loaded={this.state.loaded}>
          <AssessmentList data={this.state.data} showTeams={!this.props.teamId}/>
        </Loader>
      </div>
    )
  }
})

module.exports = AssessmentTable
