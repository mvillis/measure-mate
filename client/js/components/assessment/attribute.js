'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Rating = require('./rating')
var ObserveInput = require('./observeInput')
var Loader = require('react-loader')
var _ = require('lodash')
var Panel = ReactBootstrap.Panel
var Alert = ReactBootstrap.Alert
var ListGroup = ReactBootstrap.ListGroup

var Attribute = React.createClass({
  propTypes: {
    key: React.PropTypes.number,
    attribute: React.PropTypes.object,
    params: React.PropTypes.object,
    template: React.PropTypes.object,
    measurements: React.PropTypes.array,
    syncMeasurement: React.PropTypes.func,
    measureSyncActivity: React.PropTypes.bool,
    disabled: React.PropTypes.bool
  },
  getInitialState: function () {
    return {
      attribute: null,
      measurement: null,
      measureSyncActivity: false,
      loaded: false,
      observations: '',
      action: ''
    }
  },
  componentDidMount: function () {
    var attribute = this.getAttributeViaTemplate(this.props.template, this.props.params.attribute)
    var measurement = this.getMeasurementForAttribute(this.props.measurements, attribute)
    this.setState(
      {
        attribute: attribute,
        measurement: measurement,
        observations: (measurement) ? measurement.observations : '',
        action: (measurement) ? measurement.action : '',
        loaded: true
      }
    )
  },
  componentWillReceiveProps: function (nextProps) {
    var attribute = this.getAttributeViaTemplate(nextProps.template, nextProps.params.attribute)
    var measurement = this.getMeasurementForAttribute(nextProps.measurements, attribute)
    this.setState(
      {
        attribute: attribute,
        measurement: measurement,
        observations: (measurement) ? measurement.observations : '',
        action: (measurement) ? measurement.action : '',
        loaded: true
      }
    )
  },
  getAttributeViaTemplate: function (template, attributeId) {
    var match = _.find(template.attributes, function (attribute) {
      return attribute.id === parseInt(attributeId, 10)
    })
    return match
  },
  getMeasurementForAttribute: function (measurements, attribute) {
    var ids = _.map(attribute.ratings, 'id')
    return _.head(_.filter(measurements, function (c) {
      return ids.indexOf(c.rating) !== -1
    }))
  },
  saveMeasurement: function (ratingType, value) {
    var existingMeasurement = this.state.measurement
    var postData = {
      observations: (this.state.observations) ? this.state.observations : '',
      action: (this.state.action) ? this.state.action : '',
      id: (this.state.measurement) ? this.state.measurement.id : '',
      assessment: this.props.params.assessmentId,
      rating: (ratingType === 'rating') ? value : this.state.measurement.rating,
      target_rating: (ratingType === 'target') ? value : ((existingMeasurement && this.state.measurement.target_rating) ? this.state.measurement.target_rating : '') // eslint-disable-line camelcase
    }
    this.props.syncMeasurement(postData)
  },
  onObservationChange: function (text) {
    this.setState({observations: text})
  },
  onActionChange: function (text) {
    this.setState({action: text})
  },
  render: function () {
    if (this.state.attribute !== null) {
      var ratingList = this.state.attribute.ratings.map(function (rating) {
        return (
          <Rating measurement={this.state.measurement} key={rating.id} rating={rating} saveMeasurement={this.saveMeasurement} assessId={this.props.params.assessmentId} />
        )
      }.bind(this))
    }

    return (
      <Panel header={(this.state.attribute && this.state.attribute.name) ? this.state.attribute.name : ''} bsStyle='primary'>
        <Alert bsStyle='warning' className={this.state.attribute && this.state.attribute.desc_class ? this.state.attribute.desc_class : ''}>
          {this.state.attribute && this.state.attribute.desc ? this.state.attribute.desc : ''}
        </Alert>
        <ObserveInput measurement={this.state.measurement} syncMeasurement={this.props.syncMeasurement} onObservationChange={this.onObservationChange} onActionChange={this.onActionChange} attributeId={(this.state.attribute) ? this.state.attribute.id : null} disabled={this.props.disabled} />
        <Loader loaded={!this.props.measureSyncActivity} />
        <ListGroup fill>
          {ratingList}
        </ListGroup>
      </Panel>
    )
  }
})

module.exports = Attribute
