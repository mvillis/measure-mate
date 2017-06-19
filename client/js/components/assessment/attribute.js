'use strict'

var PropTypes = require('prop-types')

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Rating = require('./rating')
var ObserveFormControl = require('./observeFormControl')
var Loader = require('react-loader')
var _ = require('lodash')
var Panel = ReactBootstrap.Panel
var Alert = ReactBootstrap.Alert
var ListGroup = ReactBootstrap.ListGroup
var ReactMarkdown = require('react-markdown')

var Attribute = React.createClass({
  propTypes: {
    attribute: PropTypes.object,
    params: PropTypes.object,
    template: PropTypes.object,
    measurements: PropTypes.array,
    syncMeasurement: PropTypes.func,
    measureSyncActivity: PropTypes.bool,
    disabled: PropTypes.bool
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
      attribute: this.state.attribute.id,
      rating: (ratingType === 'rating') ? value : this.state.measurement.rating,
      target_rating: (ratingType === 'target')
        ? value
        : ((existingMeasurement && this.state.measurement.target_rating)
          ? this.state.measurement.target_rating
          : '') // eslint-disable-line camelcase
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
          <Rating
            measurement={this.state.measurement}
            key={rating.id}
            rating={rating}
            saveMeasurement={this.saveMeasurement}
            assessId={this.props.params.assessmentId}
          />
        )
      }, this)
    }

    return (
      <Loader loaded={!!this.state.attribute}>
        {this.state.attribute &&
          <Panel header={this.state.attribute.name || ''} bsStyle='primary'>
            <Alert bsStyle='warning'>
              <ReactMarkdown escapeHtml
                source={this.state.attribute.desc || ''}
                className={this.state.attribute.desc_class || ''} />
            </Alert>
            <ObserveFormControl
              measurement={this.state.measurement}
              syncMeasurement={this.props.syncMeasurement}
              onObservationChange={this.onObservationChange}
              onActionChange={this.onActionChange}
              attributeId={(this.state.attribute) ? this.state.attribute.id : null}
              disabled={this.props.disabled}
            />
            <Loader loaded={!this.props.measureSyncActivity} />
            <ListGroup fill>
              {ratingList}
            </ListGroup>
          </Panel>}
      </Loader>
    )
  }
})

module.exports = Attribute
