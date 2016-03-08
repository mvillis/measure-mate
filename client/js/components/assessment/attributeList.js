"use strict";

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var _ = require('lodash');
var PageHeader = ReactBootstrap.PageHeader;
var Tabs = ReactBootstrap.Tabs;
var Tab = ReactBootstrap.Tab;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var ListGroup = ReactBootstrap.ListGroup;
var Pager = ReactBootstrap.Pager;
var PageItem = ReactBootstrap.PageItem;
var Glyphicon = ReactBootstrap.Glyphicon;
var Moment = require('moment');
var Loader = require('react-loader');
var RatingList = require('./ratingList');
var ObserveInput = require('./observeInput');
var AssessmentReport = require('./assessmentReport');
var $ = require('jquery');

var AttributeList = React.createClass({
  propTypes: {
    params: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      active_tab: 1,
      active_attribute: null,
      measurements: null,
      template: null,
      assessment: null,
      next_hide: false,
      previous_hide: false,
      initial_load: false,
      measure_sync_activity: false,
      observations: {},
      dirty_observation: {}
    };
  },
  componentWillMount: function(){
    this.dataSource("/api/assessments/" + this.props.params.id + "/", this.assessment_callback);
  },
  measurement_callback: function (data) {
    this.setState( {
      measurements: data,
      initial_load: true
    });
    this.handleSelect(1);
  },
  template_callback: function (data) {
    this.setState( {
      template: data
    }, this.dataSource("/api/measurements/" + "?assessment__id=" + this.props.params.id, this.measurement_callback)
    );
  },
  assessment_callback: function (data) {
    this.setState( {
      assessment: data
    }, this.dataSource("/api/templates/" + data.template.id + "/", this.template_callback)
    );
  },
  handleSubmitFailure: function(xhr, ajaxOptions, thrownError) {
      console.error("There was a failure");
  },
  dataSource: function(url, callback){
    $.ajax({
      type: "get",
      dataType: 'json',
      url: url,
      success: callback,
      error: this.handleSubmitFailure,
    });
  },
  measurement_update_callback: function (data) {
    var existing_measurement_index = _.findIndex(this.state.measurements, function(measurement)
    {
      return measurement.id == data.id;
    });
    var updated_dirty_observation = this.state.dirty_observation;
    updated_dirty_observation[this.state.active_tab] = false
    if (existing_measurement_index != -1) {
      var updated_measurements = this.state.measurements.slice();
      updated_measurements[existing_measurement_index] = data;
      this.setState({
        measurements: updated_measurements,
        measure_sync_activity: false,
        dirty_observation: updated_dirty_observation
      });
    }
    else {
      var new_measurements = this.state.measurements.concat([data]);
      this.setState({
        measurements: new_measurements,
        measure_sync_activity: false,
        dirty_observation: updated_dirty_observation
      });
    };
  },
  syncMeasurement: function(postData) {
    var create_new_measure = ((postData.id) ? false : true);
    if (this.state.observations[this.state.active_tab]) {
      postData["observations"] = this.state.observations[this.state.active_tab]
    } else {
      var match_measure = _.find(this.state.measurements, function(measurement)
        {
          return measurement.id == postData.id;
        });
      (match_measure) ? postData["observations"] = match_measure.observations : postData["observations"] = "";
    }
    this.setState({ measure_sync_activity: true });
    console.log('Should a new measurement be created? ' + create_new_measure);
    $.ajax({
      type: ((create_new_measure) ? "POST" : "PUT"),
      contentType: "application/json; charset=utf-8",
      url: ((create_new_measure) ? "/api/measurements/" : ("/api/measurements/" + postData.id + '/')),
      data: JSON.stringify(postData),
      dataType: 'json',
      success: this.measurement_update_callback,
      error: this.handleSubmitFailure,
    });
  },
  onObservationChange: function(text, active_tab) {
    var observations = this.state.observations;
    observations[active_tab] = text;
    var updated_dirty_observation = this.state.dirty_observation;
    updated_dirty_observation[this.state.active_tab] = true
    this.setState({observations: observations, dirty_observation: updated_dirty_observation});
  },
  handleNext: function () {
    if (this.state.active_tab < this.state.template.attributes.length+1 && !this.state.next_hide) {
      var new_tab = this.state.active_tab + 1;
      this.scrollToTop('#att-list');
      this.setState({active_tab: new_tab});
      this.handleTabChange(new_tab);
    };
  },
  handlePrevious: function () {
    if (this.state.active_tab !=1 && !this.state.previous_hide) {
      var new_tab = this.state.active_tab - 1;
      this.scrollToTop('#att-list');
      this.setState({active_tab: new_tab});
      this.handleTabChange(new_tab);
    }
  },
  handleSelect: function (key) {
    this.scrollToTop('#att-list');
    this.setState({active_tab: key});
    this.handleTabChange(key);
  },
  handleTabChange: function (current_tab) {
    if (current_tab == 1) {
      this.setState({previous_hide: true});
    } else {
      this.setState({previous_hide: false});
    }
    if (current_tab >= this.state.template.attributes.length+1) {
      this.setState({next_hide: true});
    } else {
      this.setState({next_hide:false});
    }
  },
  scrollToTop: function (att_list) {
    var $target = $(att_list);

    $('html, body').stop().animate({
        'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
        // window.location.hash = $target;
    });
  },
  getAttributeForRating: function(query_rating) {
    var matching_attribute = null
    for (var i = 0; i<this.state.template.attributes.length; i++) {
      for (var ii = 0; ii<this.state.template.attributes[i].ratings.length; ii++) {
        if (query_rating == this.state.template.attributes[i].ratings[ii].id) {
          matching_attribute = this.state.template.attributes[i].id;
          break;
        }
      }
    }
    return matching_attribute;
  },
  getMeasurementForAttribute: function(attribute) {
    if (this.state.measurements != null) {
      for (var i=0; i < this.state.measurements.length; i++) {
        if (attribute.id == this.getAttributeForRating(this.state.measurements[i].rating)) {
          return this.state.measurements[i];
          break;
        }
      };
    } else {
      return null;
    }
  },
  render: function() {
    if (this.state.template) {
      var attributeNodes = this.state.template.attributes.map(function (attribute, i) {
        var measurement = this.getMeasurementForAttribute(attribute);
        var complete_measurement = measurement && measurement.rating && measurement.target_rating;
        var tab_icon = (complete_measurement) ? <Glyphicon glyph="ok" tabClassName="text-success"/> : <Glyphicon glyph="minus" />;
        return (
          <Tab eventKey={i+1} key={attribute.id} id={i+1} title={<div>{tab_icon} <span>{attribute.name}</span></div>}>
            <Panel header={attribute.name} bsStyle="primary">
              <Alert bsStyle="warning" className={attribute.desc_class}>
                {attribute.desc}
              </Alert>
              <ObserveInput eventKey={i+1} dirty_observation={this.state.dirty_observation} active_tab={this.state.active_tab} measurement={measurement} syncMeasurement={this.syncMeasurement} onObservationChange={this.onObservationChange}/>
              <Loader loaded={!this.state.measure_sync_activity}>
              </Loader>
              <ListGroup fill>
                <RatingList eventKey={i+1} active_tab={this.state.active_tab} dirty_observation={this.state.dirty_observation} key={attribute.id} measurement={measurement} attribute={attribute} assess_id={this.props.params.id} syncMeasurement={this.syncMeasurement}/>
              </ListGroup>
            </Panel>
          </Tab>
        );
      }.bind(this));

      var summaryTab = function () {
        return (
          <Tab eventKey={this.state.template ? this.state.template.attributes.length+1 : null} key={this.state.template ? this.state.template.attributes.length+1 : null} id={this.state.template ? this.state.template.attributes.length+1 : null} title={<div><span className="glyphicon glyphicon-stats"></span> <span>Summary</span></div>}>
            <Panel header="Summary" bsStyle="primary">
              <Alert bsStyle="warning">
                How did you go? Where are you strengths and weaknesses? What are some improvements you could make?
              </Alert>
              <AssessmentReport
                eventKey={this.state.template ? this.state.template.attributes.length+1 : null}
                key={this.state.template ? this.state.template.attributes.length+1 : null}
                id={this.state.template ? this.state.template.attributes.length+1 : null}
                active_tab={this.state.active_tab}
                measurements={this.state.measurements}
                attributes={this.state.template.attributes}
                template={this.state.template}
                assess_id={this.props.params.id}
              />
            </Panel>
          </Tab>
        )
      }.bind(this)();
    }
    return (
      <div id="att-list" className="container-fluid">
        <Loader loaded={this.state.initial_load}>
          <PageHeader>
            {!!this.state.assessment == true ? this.state.assessment.template.name : ""} <small> {!!this.state.assessment ? this.state.assessment.template.short_desc : ""}</small>
          </PageHeader>
          <Tabs position="right" activeKey={this.state.active_tab} onSelect={this.handleSelect} tabWidth={3}>
            {attributeNodes}
            {summaryTab}
            <Pager>
              <PageItem disabled={this.state.previous_hide} onClick={this.handlePrevious}>&larr; Previous</PageItem>
              {' '}
              <PageItem disabled={this.state.next_hide} onClick={this.handleNext}>Next &rarr;</PageItem>
            </Pager>
          </Tabs>
        </Loader>
      </div>
    );
  }
});

module.exports = AttributeList;
