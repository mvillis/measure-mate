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
    attributeId: React.PropTypes.number
  },
  getInitialState: function () {
    return {
      saveBtnDisabled: true,
      observations: ''
    }
  },
  isObserveDirty: function (props) {
    if (props.measurement) {
      if (props.measurement.observations === this.state.observations) {
        return false
      } else if (!props.measurement.observations && !this.state.observations) {
        return false
      } else {
        return true
      }
    } else {
      return !!this.state.observations
    }
  },
  isSaveDisabled: function (props, dirty) {
    return !(!!props.measurement === true && dirty === true)
  },
  componentWillMount: function () {
    this.handleObserveDebounced = _.debounce(function () {
      this.props.onObservationChange.apply(this, [this.state.observations])
    }, 750)
    var saveDisabled = this.isSaveDisabled(this.props, false)
    this.setState({observations: (this.props.measurement) ? this.props.measurement.observations : '', saveBtnDisabled: saveDisabled, dirtyObservation: false})
  },
  componentWillReceiveProps: function (nextProps) {
    var dirty = this.isObserveDirty(nextProps)
    var saveDisabled = this.isSaveDisabled(nextProps, dirty)
    if (nextProps.attributeId && nextProps.attributeId !== this.props.attributeId) {
      this.setState({observations: (nextProps.measurement) ? nextProps.measurement.observations : '', saveBtnDisabled: true, dirtyObservation: false})
    } else {
      this.setState({saveBtnDisabled: saveDisabled, dirtyObservation: dirty})
    }
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
        targetRating: this.props.measurement.targetRating,
        observations: this.state.observations
      }
      this.props.syncMeasurement(postData)
    }
  },
  render: function () {
    var syncStatus = function () {
      if (this.state.dirtyObservation === false && this.props.measurement && this.props.measurement.observations) {
        return (<span><span>&nbsp;&nbsp;&nbsp;</span><Glyphicon glyph='saved' /></span>)
      } else if (this.state.dirtyObservation === true && !this.props.measurement) {
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
