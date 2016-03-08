'use strict'

var React = require('react')
var Loader = require('react-loader')
var $ = require('jquery')
var AssessmentList = require('./assessmentList')

var AssessmentTable = React.createClass({
  loadRatingsFromServer: function () {
    $.ajax({
      url: '/api/assessments/',
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
    this.loadRatingsFromServer()
  },
  render: function () {
    return (
      <div className='container-fluid'>
        <Loader loaded={this.state.loaded}>
          <AssessmentList data={this.state.data} />
        </Loader>
      </div>
    )
  }
})

module.exports = AssessmentTable
