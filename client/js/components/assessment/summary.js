'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var AssessmentReport = require('./assessmentReport')
var Loader = require('react-loader')
var Panel = ReactBootstrap.Panel
var Alert = ReactBootstrap.Alert
var $ = require('jquery')

var Summary = React.createClass({
  propTypes: {
    key: React.PropTypes.number,
    eventKey: React.PropTypes.number,
    activeTab: React.PropTypes.number,
    attribute: React.PropTypes.object,
    params: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      attribute: undefined,
      loaded: false,
      dirtyObservation: false
    }
  },
  componentWillMount: function () {
    this.dataSource('/api/assessments/' + this.props.params.id + '/', this.assessmentCallback)
  },
  measurementCallback: function (data) {
    this.setState({
      measurements: data,
      loaded: true
    })
  },
  templateCallback: function (data) {
    this.setState({
      template: data
    }, this.dataSource('/api/measurements/' + '?assessment__id=' + this.props.params.id, this.measurementCallback)
    )
  },
  assessmentCallback: function (data) {
    this.setState({
      assessment: data
    }, this.dataSource('/api/templates/' + data.template.id + '/', this.templateCallback)
    )
  },
  handleSubmitFailure: function (xhr, ajaxOptions, thrownError) {
    console.error('There was a failure')
  },
  dataSource: function (url, callback) {
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: url,
      success: callback,
      error: this.handleSubmitFailure
    })
  },
  render: function () {
    return (
      <Panel header='Summary' bsStyle='primary'>
        <Loader scale={0.25} top={'10'} loaded={this.state.loaded}>
          <Alert bsStyle='warning'>
            How did you go? Where are you strengths and weaknesses? What are some improvements you could make?
          </Alert>
          <AssessmentReport
            eventKey={this.state.template ? this.state.template.attributes.length + 1 : null}
            key={this.state.template ? this.state.template.attributes.length + 1 : null}
            id={this.state.template ? this.state.template.attributes.length + 1 : null}
            activeTab={this.state.activeTab}
            measurements={(this.state.measurements) ? this.state.measurements : []}
            attributes={(this.state.template) ? this.state.template.attributes : []}
            template={(this.state.template) ? this.state.template : {}}
            assessId={this.props.params.id}
          />
        </Loader>
      </Panel>
    )
  }
})

module.exports = Summary
