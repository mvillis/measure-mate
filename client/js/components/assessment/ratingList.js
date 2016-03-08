"use strict";

var React = require('react');
global.jQuery = require('jquery');
var Bootstrap = require('bootstrap');
var ReactBootstrap = require('react-bootstrap');
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Popover = ReactBootstrap.Popover;
var Alert = ReactBootstrap.Alert;
var ListGroup = ReactBootstrap.ListGroup;

var RatingList = React.createClass({
  propTypes: {
    key: React.PropTypes.number,
    eventKey: React.PropTypes.number,
    active_tab: React.PropTypes.number,
    measurement: React.PropTypes.object,
    assess_id: React.PropTypes.string.isRequired,
    syncMeasurement: React.PropTypes.func.isRequired,
    attribute: React.PropTypes.object,
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    if (nextProps.active_tab === this.props.eventKey) {
      return true
    }
    return false;
  },
  saveMeasurement: function (value) {
    var existing_measurement = (this.props.measurement) ? true : false;
    var postData = {
      id: (this.props.measurement) ? this.props.measurement.id : "",
      assessment: this.props.assess_id,
      rating: (value['rating']) ? value['rating'] : this.props.measurement.rating,
      target_rating: (value['target']) ? value['target'] : ((existing_measurement && this.props.measurement.target_rating) ? this.props.measurement.target_rating : ""),
    };
    this.props.syncMeasurement(postData);
  },
  render: function() {
    var ratingNodes = this.props.attribute.ratings.map(function (rating) {
        var rating_active = (this.props.measurement && this.props.measurement.rating) ? (this.props.measurement.rating == rating.id) : false;
        var target_active = (this.props.measurement && this.props.measurement.target_rating) ? (this.props.measurement.target_rating == rating.id) : false;
        var target_bs_style = target_active ? "success" : "default";
        var desc_class = (rating.desc_class ? " " + rating.desc_class : "") + (rating.colour ? " rating-colour" : "")
        var header = function () {
          if ((this.props.measurement && this.props.measurement.rating)) {
            return (
              <div>
                <h4 className="inline clickable" onClick={this.saveMeasurement.bind(this, {rating: rating.id})}>{rating.name}</h4>
                <Button ref='currentBtn'
                    onClick={this.saveMeasurement.bind(this, {target: rating.id})}
                    bsStyle={target_bs_style} className="target-btn"
                    active={target_active}
                    bsSize='xsmall'>
                    Target
                </Button>
                <OverlayTrigger trigger="click" placement="left" rootClose overlay={<Popover id={rating.id}>You have decided your current rating. Set your future goal by selecting a target button.</Popover>}>
                  <Glyphicon className="target-help clickable" glyph="glyphicon glyphicon-question-sign" />
                </OverlayTrigger>
              </div>
            );
          } else {
            return (
              <div>
                <h4 className="inline clickable" onClick={this.saveMeasurement.bind(this, {rating: rating.id})}>{rating.name}</h4>
              </div>
            )
          }
        }.bind(this)();
        return (
          <ListGroupItem active={rating_active} id={rating.id} key={rating.id} header={header} className={desc_class} style={ { 'border-left-color': rating.colour } }>
            <div className="clickable" onClick={this.saveMeasurement.bind(this, {rating: rating.id})}>
              {rating.desc}
            </div>
          </ListGroupItem>
        );
    }.bind(this));
    return (<div>
          {ratingNodes}
          </div>
    );
  }
});

module.exports = RatingList;
