'use strict'

var React = require('react')
global.jQuery = require('jquery')
var ReactBootstrap = require('react-bootstrap')
var ListGroupItem = ReactBootstrap.ListGroupItem
var Button = ReactBootstrap.Button
var Glyphicon = ReactBootstrap.Glyphicon
var OverlayTrigger = ReactBootstrap.OverlayTrigger
var Popover = ReactBootstrap.Popover
var ReactMarkdown = require('react-markdown')

var Rating = React.createClass({
  propTypes: {
    eventKey: React.PropTypes.number,
    measurement: React.PropTypes.object,
    assessId: React.PropTypes.string.isRequired,
    attribute: React.PropTypes.object,
    saveMeasurement: React.PropTypes.func.isRequired,
    rating: React.PropTypes.object
  },

  ratingClick: function (e) {
    e.preventDefault()
    this.props.saveMeasurement('rating', this.props.rating.id)
  },
  targetClick: function (e) {
    e.preventDefault()
    this.props.saveMeasurement('target', this.props.rating.id)
  },
  render: function () {
    var ratingActive = (this.props.measurement && this.props.measurement.rating) ? (this.props.measurement.rating === this.props.rating.id) : false
    var targetActive = (this.props.measurement && this.props.measurement.target_rating) ? (this.props.measurement.target_rating === this.props.rating.id) : false
    var targetBsStyle = targetActive ? 'success' : 'default'
    var descClass = (this.props.rating.desc_class || '') + (this.props.rating.colour ? ' rating-colour' : '')

    var header = (
      <div>
        <h4 className='inline clickable' onClick={this.ratingClick}>{this.props.rating.name}</h4>
        {(this.props.measurement && this.props.measurement.rating) &&
          <span>
            <Button onClick={this.targetClick} bsStyle={targetBsStyle} className='target-btn' active={targetActive} bsSize='xsmall'>
              Target
            </Button>
            <OverlayTrigger trigger='click' placement='left' rootClose
              overlay={<Popover id={'rating-popover-' + this.props.rating.id}>You have decided your current rating. Set your future goal by selecting a target button.</Popover>}>
              <Glyphicon className='target-help clickable' glyph='question-sign' />
            </OverlayTrigger>
          </span>}
      </div>
    )

    return (
      <ListGroupItem active={ratingActive} key={this.props.rating.id} header={header} className={descClass} style={{'borderLeftColor': this.props.rating.colour}}>
        <div className='clickable' onClick={this.ratingClick}>
          <ReactMarkdown escapeHtml source={this.props.rating.desc} containerTag='span' className='rating-desc' />
        </div>
      </ListGroupItem>
    )
  }
})

module.exports = Rating
