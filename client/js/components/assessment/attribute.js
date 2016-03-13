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
var $ = require('jquery')

var Attribute = React.createClass({
  propTypes: {
    key: React.PropTypes.number,
    eventKey: React.PropTypes.number,
    activeTab: React.PropTypes.number,
    attribute: React.PropTypes.object,
    params: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      attribute: null,
      measurement: null,
      measureSyncActivity: false,
      dirtyObservation: false,
      loaded: false
    }
  },
  componentDidMount: function () {
    this.getData(this.props.params.id, this.props.params.attribute)
  },
  componentWillReceiveProps: function (nextProps) {
    this.getData(nextProps.params.id, nextProps.params.attribute)
  },
  getData: function (id, attribute) {
    var setAttribute = function (data) { this.setState({attribute: data}) }.bind(this)
    var setMeasurement = function (data) { this.setState({measurement: _.head(data), loaded: true}) }.bind(this)
    this.dataSource('/api/attributes/' + attribute, setAttribute)
    this.dataSource('/api/measurements/' + '?assessment__id=' + id + '&rating__attribute=' + attribute, setMeasurement)
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
  handleSubmitFailure: function (xhr, ajaxOptions, thrownError) {
    console.error('There was a failure')
  },
  saveMeasurement: function (ratingType, value) {
    var existingMeasurement = this.state.measurement
    var postData = {
      observations: (this.state.measurement.observations) ? this.state.measurement.observations : '',
      id: (this.state.measurement) ? this.state.measurement.id : '',
      assessment: this.props.params.id,
      rating: (ratingType === 'rating') ? value : this.state.measurement.rating,
      target_rating: (ratingType === 'target') ? value : ((existingMeasurement && this.state.measurement.target_rating) ? this.state.measurement.target_rating : '') // eslint-disable-line camelcase
    }
    this.syncMeasurement(postData)
  },
  measurementUpdateCallback: function (data) {
    this.setState({
      measurement: data,
      measureSyncActivity: false,
      dirtyObservation: false
    })
  },
  syncMeasurement: function (postData) {
    var createNewMeasure = !postData.id
    this.setState({ measureSyncActivity: true })
    console.log('Should a new measurement be created? ' + createNewMeasure)
    $.ajax({
      type: ((createNewMeasure) ? 'POST' : 'PUT'),
      contentType: 'application/json; charset=utf-8',
      url: ((createNewMeasure) ? '/api/measurements/' : ('/api/measurements/' + postData.id + '/')),
      data: JSON.stringify(postData),
      dataType: 'json',
      success: this.measurementUpdateCallback,
      error: this.handleSubmitFailure
    })
  },
  render: function () {
    if (this.state.attribute !== null) {
      var ratingList = this.state.attribute.ratings.map(function (rating) {
        return (
          <Rating measurement={this.state.measurement} key={rating.id} rating={rating} saveMeasurement={this.saveMeasurement} assessId={this.props.params.id}/>
        )
      }.bind(this))
    }

    return (
      <Loader loaded={this.state.loaded}>
        <Panel header={(this.state.attribute && this.state.attribute.name) ? this.state.attribute.name : ''} bsStyle='primary'>
            <Alert bsStyle='warning' className={this.state.attribute && this.state.attribute.desc_class ? this.state.attribute.desc_class : ''}>
              {this.state.attribute && this.state.attribute.desc ? this.state.attribute.desc : ''}
            </Alert>
            <Loader loaded={!this.state.measureSyncActivity}/>
            <ListGroup fill>
              {ratingList}
            </ListGroup>
        </Panel>
      </Loader>
    )
  }
})

module.exports = Attribute
