'use strict'

var PropTypes = require('prop-types')

var React = require('react')
var createReactClass = require('create-react-class')
var browserHistory = require('react-router').browserHistory
var ReactBootstrap = require('react-bootstrap')
var Alert = ReactBootstrap.Alert
var Form = ReactBootstrap.Form
var Button = ReactBootstrap.Button
var FormGroup = ReactBootstrap.FormGroup
var ControlLabel = ReactBootstrap.ControlLabel
var Col = ReactBootstrap.Col
var TemplateSelect = require('./templateSelect')
var TagSelect = require('../common/tagSelect')
var $ = require('jquery')
var _ = require('lodash')
var HttpStatus = require('http-status-codes')

var AssessmentCreationForm = createReactClass({
  displayName: 'AssessmentCreationForm',

  propTypes: {
    teamId: PropTypes.number.isRequired
  },

  getInitialState: function () {
    return {
      template: '',
      taggable: false,
      tags: [],
      creatingTag: false,
      formError: ''
    }
  },

  changeHandlerTemplate: function (val) {
    this.setState({
      template: val.value,
      taggable: val.taggable
    })
  },

  handleSubmit: function (e) {
    e.preventDefault()
    if (this.state.template) {
      var template = this.state.template
      var teamId = this.props.teamId
      var tags = this.state.tags.map(function (value) {
        return (
          value.value
        )
      })
      this.showError('')
      this.createAssessment(template, teamId, tags)
    } else {
      var message = 'Template required.'
      this.showError(message)
    }
  },

  showError: function (message) {
    this.setState({
      formError: message
    })
  },

  createTag: function (tagName) {
    var data = {
      name: tagName
    }
    this.setState({ creatingTag: true })
    this.showError('')
    $.ajax({
      context: this,
      url: '/api/tags/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      type: 'POST',
      cache: true,
      success: function (newTag) {
        var tags = this.state.tags
        tags.push({ value: newTag.id, label: newTag.name })
        this.setState({ tags: _.uniq(tags), creatingTag: false })
      },
      error: function (xhr, status, err) {
        console.log(xhr.status + ' ' + xhr.statusText)
        console.log(xhr.responseText)
        console.log(err)
        var message = 'Tag creation failed due to unknown reason. Try again later.'
        if (xhr.status === HttpStatus.BAD_REQUEST) {
          if (xhr.responseJSON && xhr.responseJSON.name) {
            message = 'Invalid tag name: ' + xhr.responseJSON.name
          } else {
            message = 'Tag creation failed: ' + xhr.responseText
          }
        }
        this.showError(message)
      }
    })
  },

  // FIXME Temporary until react-select fixes allowCreate={true}
  filterOptions: function (options, filterValue, currentValues) {
    // ditch existing values
    var filteredOptions = _(options)
      .difference(currentValues)

    if (filterValue) {
      var potentialTag = filterValue.toLowerCase()
        .replace(/[^\w-]/g, '_')
        .replace(/__+/g, '_')

      // only the values matching the typed string
      filteredOptions = filteredOptions
        .filter((o) => RegExp(potentialTag, 'ig').test(o.label))

      // if the typed string doesn't exactly match an existing tag...
      if (!filteredOptions.find((o) => o.label.toLowerCase() === potentialTag)) {
        // ... add the option to create the tag
        filteredOptions = filteredOptions
          .concat(
            _.some(currentValues, { label: potentialTag })
              ? []
              : [{
                label: `Add "${potentialTag}"...`,
                value: potentialTag,
                create: true
              }])
      }
    }

    return filteredOptions.value()
  },

  handleTagsChange: function (newTags) {
    let entered = _.last(newTags)
    if (entered && entered.create) {
      newTags.pop()
      this.createTag(entered.value)
    }
    this.setState({
      tags: newTags,
      changed: true
    })
  },

  // /FIXME -----------------

  createAssessment: function (template, teamId, tags) {
    var data = {
      team: teamId,
      template: template,
      tags: tags
    }
    $.ajax({
      context: this,
      url: '/api/assessments/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      type: 'POST',
      cache: true,
      success: function (newAssessment) {
        browserHistory.push('/assessment/' + newAssessment.id)
      },
      error: function (xhr, status, err) {
        console.log(xhr.status + ' ' + xhr.statusText)
        console.log(xhr.responseText)
        console.log(err)
        var message = 'Launch failed due to unknown reason. Try again later.'
        if (xhr.status === HttpStatus.BAD_REQUEST) {
          if (xhr.responseJSON) {
            if (xhr.responseJSON.template) {
              message = 'Invalid template: ' + xhr.responseJSON.template
            } else if (xhr.responseJSON.teamId) {
              message = 'Invalid teamId: ' + xhr.responseJSON.teamId
            } else if (xhr.responseJSON.tags) {
              message = 'Invalid tags: ' + xhr.responseJSON.tags
            }
          } else {
            message = 'Assessment creation failed: ' + xhr.responseText
          }
        }
        this.showError(message)
      }
    })
  },

  render: function () {
    var tagSelect = (this.state.taggable
      ? <FormGroup controlId='tags'>
        <Col xs={12} sm={3} lg={2}>
          <ControlLabel>Tags</ControlLabel>
        </Col>
        <Col xs={12} sm={9} lg={8}>
          <TagSelect
            ref='tags'
            label='Tags'
            {...this.props}
            value={this.state.tags}
            onChange={this.handleTagsChange}
            filterOptions={this.filterOptions}
          />
        </Col>
      </FormGroup>
      : '')

    return (
      <Form horizontal>
        <Alert bsStyle='danger' className={this.state.formError ? '' : 'hidden'}>
          {this.state.formError}
        </Alert>
        <FormGroup>
          <Col lg={2} xs={12} sm={3}>
            <ControlLabel>Template</ControlLabel>
          </Col>
          <Col lg={8} xs={12} sm={9}>
            <TemplateSelect
              label='Template'
              ref='template'
              {...this.props}
              value={this.state.template}
              onChange={this.changeHandlerTemplate}
            />
          </Col>
        </FormGroup>
        {tagSelect}
        <FormGroup>
          <Col lg={2} xs={12} sm={3} style={{ width: 'auto' }}>
            <Button bsStyle='primary' type='submit' onClick={this.handleSubmit} disabled={!this.state.template || this.state.creatingTag}>Launch</Button>
          </Col>
        </FormGroup>
      </Form>
    )
  }
})

module.exports = AssessmentCreationForm
