'use strict'

var PropTypes = require('prop-types');

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var AssessmentReport = require('./assessmentReport')
var Panel = ReactBootstrap.Panel
var Alert = ReactBootstrap.Alert

var Summary = React.createClass({
  propTypes: {
    eventKey: PropTypes.number,
    activeTab: PropTypes.number,
    params: PropTypes.object,
    template: PropTypes.object,
    measurements: PropTypes.array,
    attribute: PropTypes.object,
    assessment: PropTypes.object
  },
  getInitialState: function () {
    return {
      attribute: undefined,
      dirtyObservation: false
    }
  },
  render: function () {
    return (
      <Panel header='Summary' bsStyle='primary'>
        <Alert bsStyle='warning'>
          How did you go? What improvements can your team make?
        </Alert>
        <AssessmentReport
          eventKey={this.props.template ? this.props.template.attributes.length + 1 : null}
          id={this.props.template ? this.props.template.attributes.length + 1 : null}
          activeTab={this.props.activeTab}
          measurements={(this.props.measurements) ? this.props.measurements : []}
          attributes={(this.props.template) ? this.props.template.attributes : []}
          template={(this.props.template) ? this.props.template : {}}
          assessment={(this.props.assessment) ? this.props.assessment : {}}
          assessId={this.props.params.assessmentId}
        />
      </Panel>
    )
  }
})

module.exports = Summary
