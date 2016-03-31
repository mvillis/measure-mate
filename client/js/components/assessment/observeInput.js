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
    onActionChange: React.PropTypes.func.isRequired,
    attributeId: React.PropTypes.number
  },
  getInitialState: function () {
    return {
      dirtyObservation: false,
      saveBtnDisabled: true,
      observations: '',
      action: ''
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
  isActionDirty: function (props) {
    if (props.measurement) {
      if (props.measurement.action === this.state.action) {
        return false
      } else if (!props.measurement.action && !this.state.action) {
        return false
      } else {
        return true
      }
    } else {
      return !!this.state.action
    }
  },
  isSaveDisabled: function (props, dirty) {
    return !(!!props.measurement === true && dirty === true)
  },
  componentWillMount: function () {
    this.handleObserveDebounced = _.debounce(function () {
      this.props.onObservationChange.apply(this, [this.state.observations])
    }, 750)
    this.handleActionDebounced = _.debounce(function () {
      this.props.onActionChange.apply(this, [this.state.action])
    }, 750)
    var saveDisabled = this.isSaveDisabled(this.props, false)
    this.setState({
      observations: (this.props.measurement) ? this.props.measurement.observations : '',
      action: (this.props.measurement) ? this.props.measurement.action : '',
      saveBtnDisabled: saveDisabled,
      dirtyObservation: false
    })
  },
  componentWillReceiveProps: function (nextProps) {
    var dirty = this.isObserveDirty(nextProps) || this.isActionDirty(nextProps)
    var saveDisabled = this.isSaveDisabled(nextProps, dirty)
    if (nextProps.attributeId && nextProps.attributeId !== this.props.attributeId) {
      this.setState({
        observations: (nextProps.measurement) ? nextProps.measurement.observations : '',
        action: (nextProps.measurement) ? nextProps.measurement.action : '',
        saveBtnDisabled: true,
        dirtyObservation: false
      })
    } else {
      this.setState({saveBtnDisabled: saveDisabled, dirtyObservation: dirty})
    }
  },
  onObservationChange: function (event) {
    this.setState({ observations: event.target.value })
    this.handleObserveDebounced()
  },
  onActionChange: function (event) {
    this.setState({ action: event.target.value })
    this.handleActionDebounced()
  },
  handleSave: function () {
    if (this.state.saveBtnDisabled === false) {
      var postData = {
        id: this.props.measurement.id,
        assessment: this.props.measurement.assessment,
        rating: this.props.measurement.rating,
        targetRating: this.props.measurement.targetRating,
        observations: this.state.observations,
        action: this.state.action
      }
      this.props.syncMeasurement(postData)
    }
  },
  render: function () {
    var syncStatus = function () {
      if (this.state.dirtyObservation === false &&
          this.props.measurement &&
          (this.props.measurement.observations || this.props.measurement.action)) {
        return (
          <span>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <Glyphicon glyph='saved' />
          </span>
        )
      } else if (this.state.dirtyObservation === true && !this.props.measurement) {
        return (
          <span className='text-info'>
            <span>&nbsp;&nbsp;</span>
            <Glyphicon glyph='info-sign' />
            Select a rating below to save this comment and complete the form.
          </span>
        )
      } else {
        return (
          <span></span>
        )
      }
    }.bind(this)

    return (
      <div>
        <Input type='textarea' rows='3' label='Observations' placeholder='Discuss your current practices and capture some notes.'
          ref='observeInput'
          value={this.state.observations}
          onChange={this.onObservationChange}
        />
        <Input type='textarea' rows='3' label='Action' placeholder='Record actions you can take to improve your current practices.'
          ref='actionInput'
          value={this.state.action}
          onChange={this.onActionChange}
        />
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
