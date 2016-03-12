'use strict'

var React = require('react')
global.jQuery = require('jquery')
var ReactBootstrap = require('react-bootstrap')
var ListGroupItem = ReactBootstrap.ListGroupItem
var Button = ReactBootstrap.Button
var Glyphicon = ReactBootstrap.Glyphicon
var OverlayTrigger = ReactBootstrap.OverlayTrigger
var Popover = ReactBootstrap.Popover

var Rating = React.createClass({
  propTypes: {
    key: React.PropTypes.number,
    eventKey: React.PropTypes.number,
    activeTab: React.PropTypes.number,
    measurement: React.PropTypes.object,
    assessId: React.PropTypes.string.isRequired,
    attribute: React.PropTypes.object,
    saveMeasurement: React.PropTypes.func.isRequired,
    rating: React.PropTypes.object
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    if (nextProps.activeTab === this.props.eventKey) {
      return true
    }
    return false
  },
  render: function () {
    var ratingActive = (this.props.measurement && this.props.measurement.rating) ? (this.props.measurement.rating === this.props.rating.id) : false
    var targetActive = (this.props.measurement && this.props.measurement.target_rating) ? (this.props.measurement.target_rating === this.props.rating.id) : false
    var targetBsStyle = targetActive ? 'success' : 'default'
    var descClass = (this.props.rating.desc_class ? ' ' + this.props.rating.desc_class : '') + (this.props.rating.colour ? ' rating-colour' : '')
    var ratingClick = this.props.saveMeasurement.bind(null, 'rating', this.props.rating.id)
    var targetClick = this.props.saveMeasurement.bind(null, 'target', this.props.rating.id)
    var header = function () {
      if ((this.props.measurement && this.props.measurement.rating)) {
        return (
          <div>
            <h4 className='inline clickable' onClick={ratingClick}>{this.props.rating.name}</h4>
            <Button ref='currentBtn'
              onClick={targetClick}
              bsStyle={targetBsStyle} className='target-btn'
              active={targetActive}
              bsSize='xsmall'>
              Target
            </Button>
            <OverlayTrigger trigger='click' placement='left' rootClose overlay={<Popover id={this.props.rating.id}>You have decided your current rating. Set your future goal by selecting a target button.</Popover>}>
              <Glyphicon className='target-help clickable' glyph='glyphicon glyphicon-question-sign' />
            </OverlayTrigger>
          </div>
        )
      } else {
        return (
          <div>
            <h4 className='inline clickable' onClick={ratingClick}>{this.props.rating.name}</h4>
          </div>
        )
      }
    }.bind(this)()
    return (
      <ListGroupItem active={ratingActive} id={this.props.rating.id} key={this.props.rating.id} header={header} className={descClass} style={{'borderLeftColor': this.props.rating.colour}}>
        <div className='clickable' onClick={ratingClick}>
          {this.props.rating.desc}
        </div>
      </ListGroupItem>
      )
  }
})

module.exports = Rating
