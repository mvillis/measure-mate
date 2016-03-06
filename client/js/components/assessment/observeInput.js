"use strict";

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var _ = require('lodash');
var Glyphicon = ReactBootstrap.Glyphicon;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;

var ObserveInput = React.createClass({
    propTypes: {
      measurement: React.PropTypes.object,
      syncMeasurement: React.PropTypes.func.isRequired,
      onObservationChange: React.PropTypes.func.isRequired,
      dirty_observation: React.PropTypes.object,
      active_tab: React.PropTypes.number,
      eventKey: React.PropTypes.number
    },
    getInitialState: function () {
        return {
            save_btn_disabled: true,
            observations: ""
        };
    },
    componentWillMount: function() {
       this.handleObserveDebounced = _.debounce(function () {
         this.props.onObservationChange.apply(this, [this.state.observations, this.props.active_tab]);
       }, 1000);
    },
    onChange: function (event) {
      this.setState({ observations: event.target.value });
      this.handleObserveDebounced();
    },
    handleSave: function() {
      if (this.state.save_btn_disabled == false) {
        var postData = {
          id: this.props.measurement.id,
          assessment: this.props.measurement.assessment,
          rating: this.props.measurement.rating,
          target_rating: this.props.measurement.target_rating
        };
        this.props.syncMeasurement(postData);
      }
    },
    componentWillReceiveProps: function (nextProps) {
      if (nextProps.measurement && !this.state.observations) {
        this.setState({observations: nextProps.measurement.observations})
      }

      if (nextProps.measurement) { this.setState({save_btn_disabled: false})};
    },
    shouldComponentUpdate: function (nextProps, nextState) {
      if (nextProps.active_tab === this.props.eventKey) {
        return true
      }
      return false;
    },
    render: function () {
      var syncStatus = function () {
        if (this.props.dirty_observation[this.props.active_tab] == false && this.props.measurement) {
          return (<span><span>   </span><Glyphicon glyph="glyphicon glyphicon-saved" /></span>);
        } else if (this.props.dirty_observation[this.props.active_tab] == true && !this.props.measurement) {
            return (<span className="text-info"><span>  </span><Glyphicon glyph="glyphicon glyphicon-info-sign" /> Select a rating below to save this comment and complete the form.</span>);
        } else {
          return (<span></span>);
        };
      }.bind(this);
      return (
        <div>
          <Input type="textarea" rows="3" label="Observations" placeholder="Discuss your current practices and capture some notes."
                 ref="observeInput"
                 value={this.state.observations}
                 onChange={this.onChange} Input/>
                   <Button ref="obsSaveBtn" disabled={this.state.save_btn_disabled} bsStyle="primary" bsSize="xsmall" onClick={this.handleSave}>Save</Button>
                   {syncStatus()}
         </div>
      );
    }
});

module.exports = ObserveInput;
