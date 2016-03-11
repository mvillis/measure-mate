'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var _ = require('lodash')
var Glyphicon = ReactBootstrap.Glyphicon
var Input = ReactBootstrap.Input
var Button = ReactBootstrap.Button

var ObserveInput = React.createClass({
  propTypes: {
    measurement: React.PropTypes.object,
    syncMeasurement: React.PropTypes.func.isRequired,
    onObservationChange: React.PropTypes.func.isRequired,
    dirtyObservation: React.PropTypes.object,
    activeTab: React.PropTypes.number,
    eventKey: React.PropTypes.number
  },
  getInitialState: function () {
    return {
      saveBtnDisabled: true,
      observations: ''
    }
  },
  componentWillMount: function () {
    this.handleObserveDebounced = _.debounce(function () {
      this.props.onObservationChange.apply(this, [this.state.observations, this.props.activeTab])
    }, 1000)
  },
  onChange: function (event) {
    this.setState({ observations: event.target.value })
    this.handleObserveDebounced()
  },
  handleSave: function () {
    if (this.state.saveBtnDisabled === false) {
      var postData = {
        id: this.props.measurement.id,
        assessment: this.props.measurement.assessment,
        rating: this.props.measurement.rating,
        targetRating: this.props.measurement.targetRating
      }
      this.props.syncMeasurement(postData)
    }
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.measurement && !this.state.observations) {
      this.setState({observations: nextProps.measurement.observations})
    }

    if (nextProps.measurement) { this.setState({saveBtnDisabled: false}) }
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    if (nextProps.activeTab === this.props.eventKey) {
      return true
    }
    return false
  },
  render: function () {
    var syncStatus = function () {
      if (this.props.dirtyObservation[this.props.activeTab] === false && this.props.measurement) {
        return (<span><span>&nbsp;&nbsp;&nbsp;</span><Glyphicon glyph='saved' /></span>)
      } else if (this.props.dirtyObservation[this.props.activeTab] === true && !this.props.measurement) {
        return (<span className='text-info'><span>&nbsp;&nbsp;</span><Glyphicon glyph='info-sign' /> Select a rating below to save this comment and complete the form.</span>)
      } else {
        return (<span></span>)
      }
    }.bind(this)
    return (
      <div>
        <Input type='textarea' rows='3' label='Observations' placeholder='Discuss your current practices and capture some notes.'
          ref='observeInput'
          value={this.state.observations}
          onChange={this.onChange}
          Input/>
        <Button ref='obsSaveBtn'
          disabled={this.state.saveBtnDisabled}
          bsStyle='primary'
          bsSize='xsmall'
          onClick={this.handleSave}>
          Save
        </Button>
        {syncStatus()}
      </div>
    )
  }
})

module.exports = ObserveInput
