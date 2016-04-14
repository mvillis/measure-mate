'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var _ = require('lodash')
var FinaliseAssessment = require('./finaliseAssessment')
var PageHeader = ReactBootstrap.PageHeader
var Nav = ReactBootstrap.Nav
var NavItem = ReactBootstrap.NavItem
var Grid = ReactBootstrap.Grid
var Row = ReactBootstrap.Row
var Col = ReactBootstrap.Col
var Pager = ReactBootstrap.Pager
var PageItem = ReactBootstrap.PageItem
var Glyphicon = ReactBootstrap.Glyphicon
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Loader = require('react-loader')
var $ = require('jquery')

var AttributeList = React.createClass({
  propTypes: {
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    children: React.PropTypes.object
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
      dirtyObservation: {}
    }
  },
  contextTypes: {
    router: React.PropTypes.object
  },
  componentWillMount: function () {
    this.dataSource('/api/assessments/' + this.props.params.assessmentId + '/', this.assessmentCallback)
  },
  measurementCallback: function (data) {
    this.setState({
      measurements: data,
      initialLoad: true
    })
  },
  templateCallback: function (data) {
    this.setState({
      template: data
    }, this.dataSource('/api/measurements/?assessment__id=' + this.props.params.assessmentId, this.measurementCallback)
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
  handleNext: function () {
    this.scrollToTop('#attribute-list')
    var currentAttribute = this.props.params.attribute
    console.log(currentAttribute)
    var index = _.findIndex(this.state.template.attributes, ['id', parseInt(currentAttribute, 10)])
    console.log(index)
    var nextId = (this.state.template.attributes[index + 1]) ? this.state.template.attributes[index + 1].id : 'summary'
    var path = '/assessment/' + this.props.params.assessmentId + '/' + nextId
    this.context.router.push(path)
  },
  handlePrevious: function () {
    this.scrollToTop('#attribute-list')
    var currentAttribute = this.props.params.attribute
    console.log(currentAttribute)
    var index = _.findIndex(this.state.template.attributes, ['id', parseInt(currentAttribute, 10)])
    console.log(index)
    console.log(this.state.template.attributes[-1])
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
        var tabIcon = (completeMeasurement) ? <Glyphicon glyph='ok' tabClassName='text-success'/> : <Glyphicon glyph='minus' />
        return (
          <LinkContainer key={attribute.id} to={{pathname: '/assessment/' + this.state.assessment.id + '/' + attribute.id}}>
            <NavItem activeClassName='active' eventKey={i + 1} id={i + 1}>{tabIcon} {attribute.name}</NavItem>
          </LinkContainer>
        )
      }.bind(this))

      var summaryNode = function () {
        if (!this.state.template) return (undefined)
        return (
          <LinkContainer key='summary' to={{pathname: '/assessment/' + this.state.assessment.id + '/summary'}}>
            <NavItem activeClassName='active' eventKey={this.state.template.attributes.length + 1} id={this.state.template.attributes.length + 1}><Glyphicon glyph='stats'/> Summary</NavItem>
          </LinkContainer>
        )
      }.bind(this)()
    }
    return (
      <div id='attribute-list'>
        <Loader loaded={this.state.initialLoad}>
          <PageHeader>
            {!!this.state.assessment === true ? this.state.assessment.template.name : ''} <small> {this.state.assessment ? this.state.assessment.template.short_desc : ''}</small>
          </PageHeader>
          <Grid fluid>
            <Row>
              <Col className='attribute-content' xs={12} md={10} lg={9}>
                {React.cloneElement(this.props.children, {
                  template: this.state.template,
                  measurements: this.state.measurements,
                  syncMeasurement: this.syncMeasurement,
                  measureSyncActivity: this.state.measureSyncActivity
                })}
                <Pager>
                  <PageItem disabled={this.state.previous_hide} onClick={this.handlePrevious}>
                    <Glyphicon glyph='chevron-left' /> {' '} Previous
                  </PageItem>
                  {' '}
                  <PageItem disabled={this.state.next_hide} onClick={this.handleNext}>
                    Next {' '} <Glyphicon glyph='chevron-right' />
                  </PageItem>
                </Pager>
              </Col>
              <Col className='attribute-tabs' xs={6} md={2} lg={3}>
                <Nav bsStyle='pills' stacked activeKey={1} onSelect={this.handleSelect}>
                  {attributeNodes}
                  {summaryNode}
                  <br></br>
                  <FinaliseAssessment/>
                </Nav>
              </Col>
            </Row>
          </Grid>
        </Loader>
      </div>
    )
  }
})

module.exports = AttributeList
