'use strict'

var React = require('react')
var Rating = require('./rating')

var RatingList = React.createClass({
  propTypes: {
    key: React.PropTypes.number,
    eventKey: React.PropTypes.number,
    activeTab: React.PropTypes.number,
    measurement: React.PropTypes.object,
    assessId: React.PropTypes.string.isRequired,
    syncMeasurement: React.PropTypes.func.isRequired,
    attribute: React.PropTypes.object
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    if (nextProps.activeTab === this.props.eventKey) {
      return true
    }
    return false
  },
  saveMeasurement: function (ratingType, value) {
    var existingMeasurement = this.props.measurement
    var postData = {
      id: (this.props.measurement) ? this.props.measurement.id : '',
      assessment: this.props.assessId,
      rating: (ratingType === 'rating') ? value : this.props.measurement.rating,
      target_rating: (ratingType === 'target') ? value : ((existingMeasurement && this.props.measurement.target_rating) ? this.props.measurement.target_rating : '') // eslint-disable-line camelcase
    }
    this.props.syncMeasurement(postData)
  },
  render: function () {
    var ratingNodes = this.props.attribute.ratings.map(function (rating) {
      return (
        <Rating {...this.props} key={rating.id} rating={rating} saveMeasurement={this.saveMeasurement}/>
      )
    }.bind(this))
    return (
      <div>
        {ratingNodes}
      </div>
    )
  }
})

module.exports = RatingList
