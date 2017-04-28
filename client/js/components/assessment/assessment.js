'use strict'

var PropTypes = require('prop-types')

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var _ = require('lodash')
var FinaliseAssessment = require('./finaliseAssessment')
var AppAlert = require('../common/appAlert')
var PageHeader = ReactBootstrap.PageHeader
var Nav = ReactBootstrap.Nav
var NavItem = ReactBootstrap.NavItem
var Row = ReactBootstrap.Row
var Col = ReactBootstrap.Col
var Pager = ReactBootstrap.Pager
var Glyphicon = ReactBootstrap.Glyphicon
var Label = ReactBootstrap.Label
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Loader = require('react-loader')
var TagList = require('../common/tagList')
var $ = require('jquery')

var Assessment = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.object,
    children: PropTypes.object
  },
  getInitialState: function () {
    return {
      activeTab: parseInt(this.props.location.query.tab, 10) || 1,
      activeAttribute: null,
      measurements: null,
      template: null,
      assessment: null,
      initialLoad: false,
      measureSyncActivity: false,
      dirtyObservation: {},
      showAlert: false,
      alertDetail: '',
      alertType: '',
      previous_hide: false,
      next_hide: false,
      assessmentTags: []
    }
  },
  contextTypes: {
    router: PropTypes.object
  },
  componentWillMount: function () {
    this.dataSource('/api/assessments/' + this.props.params.assessmentId + '/', this.assessmentCallback)
  },
  tagsCallback: function (data) {
    this.setState({
      assessmentTags: data
    })
  },
  measurementCallback: function (data) {
    this.setState({
      measurements: data,
      initialLoad: true
    }, this.dataSource('/api/tags/?assessment__id=' + this.props.params.assessmentId, this.tagsCallback)
    )
  },
  templateCallback: function (data) {
    this.setState({
      template: data
    }, this.dataSource('/api/measurements/?assessment__id=' + this.props.params.assessmentId, this.measurementCallback)
    )
  },
  assessmentCallback: function (assessment) {
    this.setState({
      assessment: assessment,
      assessmentTags: assessment.tags.map(function (tagId) {
        return { id: tagId, name: '•••' }
      })
    }, this.dataSource('/api/templates/' + assessment.template.id + '/', this.templateCallback)
    )
  },
  handleAlertHide () {
    this.setState({ showAlert: false })
  },
  handleSubmitFailure: function (xhr, ajaxOptions, thrownError) {
    console.log(thrownError)
    console.log(xhr.responseJSON)
    console.log(ajaxOptions)
    this.setState({
      measureSyncActivity: false,
      showAlert: true,
      alertType: thrownError,
      alertDetail: xhr.responseJSON.detail ? xhr.responseJSON.detail : 'Unexpected error'
    })
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
    if (existingMeasurementIndex !== -1) {
      var updatedMeasurements = this.state.measurements.slice()
      updatedMeasurements[existingMeasurementIndex] = data
      this.setState({
        measurements: updatedMeasurements,
        measureSyncActivity: false,
        dirtyObservation: false
      })
    } else {
      var newMeasurements = this.state.measurements.concat([data])
      this.setState({
        measurements: newMeasurements,
        measureSyncActivity: false,
        dirtyObservation: false
      })
    }
  },
  syncMeasurement: function (postData) {
    var createNewMeasure = !postData.id
    this.setState({ measureSyncActivity: true })
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
  markAssessmentDone: function () {
    var data = this.state.assessment
    data.status = 'DONE'
    $.ajax({
      context: this,
      url: '/api/assessments/' + this.state.assessment.id + '/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      type: 'PUT',
      cache: true,
      success: function (output) {
        this.setState({assessment: data})
      }.bind(this),
      error: this.handleSubmitFailure
    })
  },
  handleNext: function () {
    this.scrollToTop('#attribute-list')
    var currentAttribute = this.props.params.attribute
    var index = _.findIndex(this.state.template.attributes, ['id', parseInt(currentAttribute, 10)])
    var nextId = (this.state.template.attributes[index + 1]) ? this.state.template.attributes[index + 1].id : 'summary'
    var path = '/assessment/' + this.props.params.assessmentId + '/' + nextId
    this.context.router.push(path)
  },
  handlePrevious: function () {
    this.scrollToTop('#attribute-list')
    var currentAttribute = this.props.params.attribute
    var index = _.findIndex(this.state.template.attributes, ['id', parseInt(currentAttribute, 10)])
    var nextId = (this.state.template.attributes[index - 1]) ? this.state.template.attributes[index - 1].id : (index === 0) ? 'summary' : _.last(this.state.template.attributes).id
    var path = '/assessment/' + this.props.params.assessmentId + '/' + nextId
    this.context.router.push(path)
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
        var tabIcon = (completeMeasurement) ? <Glyphicon glyph='ok' className='text-success' /> : <Glyphicon glyph='minus' />
        return (
          <LinkContainer
            key={attribute.id}
            to={{pathname: '/assessment/' + this.state.assessment.id + '/' + attribute.id}}>
            <NavItem eventKey={i + 1}>{tabIcon} {attribute.name}</NavItem>
          </LinkContainer>
        )
      }, this)
    }
    var isSummaryTab = this.props.location.pathname.indexOf('/summary') > -1
    return (
      <div id='attribute-list'>
        <Loader loaded={this.state.initialLoad}>
          {this.state.assessment && <PageHeader>
            {this.state.assessment.template.name}
            <small>
              &nbsp;
              {this.state.assessment.template.short_desc}
              &nbsp;
              <span className='wrap'>
                <TagList tags={this.state.assessmentTags} />
              </span>
              {this.state.assessment.status === 'DONE' && <Label>Read Only</Label>}
            </small>
          </PageHeader>}
          <div>
            <Row>
              <Col className='attribute-content' xs={12} md={9} lg={9}>
                {React.cloneElement(this.props.children, {
                  template: this.state.template,
                  measurements: this.state.measurements,
                  syncMeasurement: this.syncMeasurement,
                  measureSyncActivity: this.state.measureSyncActivity,
                  assessment: this.state.assessment,
                  disabled: (this.state.assessment && this.state.assessment.status === 'DONE')
                })}
                <Pager>
                  <Pager.Item disabled={this.state.previous_hide} onClick={this.handlePrevious}>
                    <Glyphicon glyph='chevron-left' /> {' '} Previous
                  </Pager.Item>
                  {' '}
                  <Pager.Item disabled={this.state.next_hide} onClick={this.handleNext}>
                    Next {' '} <Glyphicon glyph='chevron-right' />
                  </Pager.Item>
                </Pager>
              </Col>
              <Col className='attribute-tabs' xs={12} md={3} lg={3}>
                <Nav bsStyle='pills' stacked activeKey={1} onSelect={this.handleSelect}>
                  {attributeNodes}
                  {this.state.template &&
                    <LinkContainer
                      key='summary'
                      to={{pathname: '/assessment/' + this.state.assessment.id + '/summary'}}>
                      <NavItem eventKey={this.state.template.attributes.length + 1}>
                        <Glyphicon glyph='stats' /> Summary
                      </NavItem>
                    </LinkContainer>}
                </Nav>
                <br />
                <FinaliseAssessment
                  assessment={this.state.assessment}
                  markAssessmentDone={this.markAssessmentDone}
                  isSummaryTab={isSummaryTab}
                />
              </Col>
            </Row>
          </div>
        </Loader>
        <AppAlert showAlert={this.state.showAlert} alertType={this.state.alertType} alertDetail={this.state.alertDetail} handleHide={this.handleAlertHide} />
      </div>
    )
  }
})

module.exports = Assessment
