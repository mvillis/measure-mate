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
    params: React.PropTypes.object,
    template: React.PropTypes.object,
    measurements: React.PropTypes.array,
    attribute: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      attribute: undefined,
      loaded: false,
      dirtyObservation: false
    }
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
    }, this.dataSource('/api/measurements/' + '?assessment__id=' + this.props.params.assessmentId, this.measurementCallback)
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
        <Alert bsStyle='warning'>
          How did you go? Where are you strengths and weaknesses? What are some improvements you could make?
        </Alert>
        <AssessmentReport
          eventKey={this.props.template ? this.props.template.attributes.length + 1 : null}
          key={this.props.template ? this.props.template.attributes.length + 1 : null}
          id={this.props.template ? this.props.template.attributes.length + 1 : null}
          activeTab={this.props.activeTab}
          measurements={(this.props.measurements) ? this.props.measurements : []}
          attributes={(this.props.template) ? this.props.template.attributes : []}
          template={(this.props.template) ? this.props.template : {}}
          assessId={this.props.params.assessmentId}
        />
      </Panel>
    )
  }
})

module.exports = Summary
