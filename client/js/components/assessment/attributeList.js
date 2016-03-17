'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var _ = require('lodash')
var PageHeader = ReactBootstrap.PageHeader
var Tabs = ReactBootstrap.Tabs
var Tab = ReactBootstrap.Tab
var Panel = ReactBootstrap.Panel
var Alert = ReactBootstrap.Alert
var ListGroup = ReactBootstrap.ListGroup
var Pager = ReactBootstrap.Pager
var PageItem = ReactBootstrap.PageItem
var Glyphicon = ReactBootstrap.Glyphicon
var Loader = require('react-loader')
var RatingList = require('./ratingList')
var ObserveInput = require('./observeInput')
var AssessmentReport = require('./assessmentReport')
var $ = require('jquery')

var AttributeList = React.createClass({
  propTypes: {
    params: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      activeTab: 1,
      activeAttribute: null,
      measurements: null,
      template: null,
      assessment: null,
      nextHide: false,
      previousHide: false,
      initialLoad: false,
      measureSyncActivity: false,
      observations: {},
      dirtyObservation: {}
    }
  },
  componentWillMount: function () {
    this.dataSource('/api/assessments/' + this.props.params.id + '/', this.assessmentCallback)
  },
  measurementCallback: function (data) {
    this.setState({
      measurements: data,
      initialLoad: true
    })
    this.handleSelect(1)
  },
  templateCallback: function (data) {
    this.setState({
      template: data
    }, this.dataSource('/api/measurements/?assessment__id=' + this.props.params.id, this.measurementCallback)
    )
  },
  assessmentCallback: function (data) {
    this.setState({
      assessment: data
    }, this.dataSource('/api/templates/' + data.template.id + '/', this.templateCallback)
    )
  },
  handleSubmitFailure: function (xhr, ajaxOptions, thrownError) {
    console.error('There was a failure')
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
  measurementUpdateCallback: function (data) {
    var existingMeasurementIndex = _.findIndex(this.state.measurements, function (measurement) {
      return measurement.id === data.id
    })
    var updatedDirtyObservation = this.state.dirtyObservation
    updatedDirtyObservation[this.state.activeTab] = false
    if (existingMeasurementIndex !== -1) {
      var updatedMeasurements = this.state.measurements.slice()
      updatedMeasurements[existingMeasurementIndex] = data
      this.setState({
        measurements: updatedMeasurements,
        measureSyncActivity: false,
        dirtyObservation: updatedDirtyObservation
      })
    } else {
      var newMeasurements = this.state.measurements.concat([data])
      this.setState({
        measurements: newMeasurements,
        measureSyncActivity: false,
        dirtyObservation: updatedDirtyObservation
      })
    }
  },
  syncMeasurement: function (postData) {
    var createNewMeasure = !postData.id
    if (this.state.observations[this.state.activeTab]) {
      postData['observations'] = this.state.observations[this.state.activeTab]
    } else {
      var matchMeasure = _.find(this.state.measurements, function (measurement) {
        return measurement.id === postData.id
      })
      postData['observations'] = (matchMeasure ? matchMeasure.observations : '')
    }
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
  onObservationChange: function (text, activeTab) {
    var observations = this.state.observations
    observations[activeTab] = text
    var updatedDirtyObservation = this.state.dirtyObservation
    updatedDirtyObservation[this.state.activeTab] = true
    this.setState({observations: observations, dirtyObservation: updatedDirtyObservation})
  },
  handleNext: function () {
    if (this.state.activeTab < this.state.template.attributes.length + 1 && !this.state.nextHide) {
      var newTab = this.state.activeTab + 1
      this.scrollToTop('#att-list')
      this.setState({activeTab: newTab})
      this.handleTabChange(newTab)
    }
  },
  handlePrevious: function () {
    if (this.state.activeTab !== 1 && !this.state.previousHide) {
      var newTab = this.state.activeTab - 1
      this.scrollToTop('#att-list')
      this.setState({activeTab: newTab})
      this.handleTabChange(newTab)
    }
  },
  handleSelect: function (key) {
    this.scrollToTop('#att-list')
    this.setState({activeTab: key})
    this.handleTabChange(key)
  },
  handleTabChange: function (currentTab) {
    if (currentTab === 1) {
      this.setState({previousHide: true})
    } else {
      this.setState({previousHide: false})
    }
    if (currentTab >= this.state.template.attributes.length + 1) {
      this.setState({nextHide: true})
    } else {
      this.setState({nextHide: false})
    }
  },
  scrollToTop: function (attList) {
    var $target = $(attList)

    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
        // window.location.hash = $target
    })
  },
  getAttributeForRating: function (queryRating) {
    var matchingAttribute = null
    for (var i = 0; i < this.state.template.attributes.length; i++) {
      for (var ii = 0; ii < this.state.template.attributes[i].ratings.length; ii++) {
        if (queryRating === this.state.template.attributes[i].ratings[ii].id) {
          matchingAttribute = this.state.template.attributes[i].id
          break
        }
      }
    }
    return matchingAttribute
  },
  getMeasurementForAttribute: function (attribute) {
    if (this.state.measurements !== null) {
      for (var i = 0; i < this.state.measurements.length; i++) {
        if (attribute.id === this.getAttributeForRating(this.state.measurements[i].rating)) {
          return this.state.measurements[i]
        }
      }
    } else {
      return null
    }
  },
  render: function () {
    if (this.state.template) {
      var attributeNodes = this.state.template.attributes.map(function (attribute, i) {
        var measurement = this.getMeasurementForAttribute(attribute)
        var completeMeasurement = measurement && measurement.rating && measurement.target_rating
        var tabIcon = (completeMeasurement) ? <Glyphicon glyph='ok' tabClassName='text-success'/> : <Glyphicon glyph='minus' />
        return (
          <Tab eventKey={i + 1} key={attribute.id} id={i + 1} title={<div>{tabIcon} <span>{attribute.name}</span></div>}>
            <Panel header={attribute.name} bsStyle='primary'>
              <Alert bsStyle='warning' className={attribute.desc_class}>
                {attribute.desc}
              </Alert>
              <ObserveInput eventKey={i + 1} dirtyObservation={this.state.dirtyObservation} activeTab={this.state.activeTab} measurement={measurement} syncMeasurement={this.syncMeasurement} onObservationChange={this.onObservationChange}/>
              <Loader loaded={!this.state.measureSyncActivity}/>
              <ListGroup fill>
                <RatingList eventKey={i + 1} activeTab={this.state.activeTab} dirtyObservation={this.state.dirtyObservation} key={attribute.id} measurement={measurement} attribute={attribute} assessId={this.props.params.id} syncMeasurement={this.syncMeasurement}/>
              </ListGroup>
            </Panel>
          </Tab>
        )
      }.bind(this))

      var summaryTab = function () {
        var key = this.state.template ? this.state.template.attributes.length + 1 : null
        return (
          <Tab eventKey={key} key={key} id={key} title={<div><Glyphicon glyph='stats'/> <span>Summary</span></div>}>
            <Panel header='Summary' bsStyle='primary'>
              <Alert bsStyle='warning'>
                How did you go? Where are you strengths and weaknesses? What are some improvements you could make?
              </Alert>
              <AssessmentReport
                eventKey={key}
                key={key}
                id={key}
                activeTab={this.state.activeTab}
                measurements={this.state.measurements}
                attributes={this.state.template.attributes}
                template={this.state.template}
                assessId={this.props.params.id}
              />
            </Panel>
          </Tab>
        )
      }.bind(this)()
    }
    return (
      <div id='att-list'>
        <Loader loaded={this.state.initialLoad}>
          <PageHeader>
            {!!this.state.assessment === true ? this.state.assessment.template.name : ''} <small> {this.state.assessment ? this.state.assessment.template.short_desc : ''}</small>
          </PageHeader>
          <Tabs position='right' activeKey={this.state.activeTab} onSelect={this.handleSelect} tabWidth={3}>
            {attributeNodes}
            {summaryTab}
            <Pager>
              <PageItem disabled={this.state.previous_hide} onClick={this.handlePrevious}>
                <Glyphicon glyph='chevron-left' /> {' '} Previous
              </PageItem>
              {' '}
              <PageItem disabled={this.state.next_hide} onClick={this.handleNext}>
                Next {' '} <Glyphicon glyph='chevron-right' />
              </PageItem>
            </Pager>
          </Tabs>
        </Loader>
      </div>
    )
  }
})

module.exports = AttributeList
