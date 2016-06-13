'use strict'

var React = require('react')
var ReactRouter = require('react-router')
var browserHistory = ReactRouter.browserHistory
var ReactBootstrap = require('react-bootstrap')
var Alert = ReactBootstrap.Alert
var Col = ReactBootstrap.Col
var ControlLabel = ReactBootstrap.ControlLabel
var Form = ReactBootstrap.Form
var FormControl = ReactBootstrap.FormControl
var FormGroup = ReactBootstrap.FormGroup
var HelpBlock = ReactBootstrap.HelpBlock
var TagSelect = require('./tagSelect')
var $ = require('jquery')
var _ = require('lodash')
var HttpStatus = require('http-status-codes')

var TeamCreationForm = React.createClass({
  getInitialState: function () {
    return {
      teamName: '',
      teamDesc: '',
      tags: [],
      formError: '',
      creatingTag: false
    }
  },
  changeHandlerTags: function (val) {
    this.setState({
      tags: val
    })
  },
  handleChange: function () {
    // This could also be done using ReactLink:
    // http://facebook.github.io/react/docs/two-way-binding-helpers.html
    this.setState({
      teamName: this.refs.teamName.getValue(),
      teamDesc: this.refs.teamDesc.getValue()
    })
  },
  handleSubmit: function (e) {
    e.preventDefault()

    if (this.state.teamName && this.state.teamDesc && this.state.tags.length > 0) {
      var teamName = this.state.teamName
      var teamDesc = this.state.teamDesc
      var tags = this.state.tags.map(function (value) {
        return (
          value.value
        )
      })
      this.showError('')
      this.createTeam(teamName, teamDesc, tags)
    } else {
      var message = 'Name, description & tag/s required.'
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
    console.log('creating tag ' + JSON.stringify(data))
    this.setState({creatingTag: true})
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
        console.log('tag "' + newTag.name + '" is id ' + newTag.id)
        var tags = this.state.tags
        tags.push({value: newTag.id, label: newTag.name})
        this.setState({tags: _.uniq(tags), creatingTag: false})
      },
      error: function (xhr, status, err) {
        console.log(xhr.status + ' ' + xhr.statusText)
        console.log(xhr.responseText)
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
              _.some(currentValues, {label: potentialTag})
              ? []
              : [{
                label: `Add \"${potentialTag}\"...`,
                value: potentialTag,
                create: true
              }])
      }
    }

    return filteredOptions.value()
  },

  changeTags: function (newTags) {
    let entered = _.last(newTags)
    if (entered && entered.create) {
      newTags.pop()
      this.createTag(entered.value)
    }
    this.setState({tags: newTags})
  },
  // /FIXME -----------------

  createTeam: function (teamName, teamDesc, tags) {
    var data = {
      name: teamName,
      short_desc: teamDesc, // eslint-disable-line camelcase
      tags: tags
    }
    console.log('creating team ' + JSON.stringify(data))
    $.ajax({
      context: this,
      url: '/api/teams/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      type: 'POST',
      cache: true,
      success: function (newTeam) {
        console.log('created team ' + JSON.stringify(newTeam))
        browserHistory.push('/team/' + newTeam.id)
      },
      error: function (xhr, status, err) {
        var message = 'Team creation failed due to unknown reason. Try again later.'
        this.showError(message)
      }
    })
  },

  render: function () {
    var creatingTag = this.state.creatingTag
    return (
      <Form horizontal>
        <Alert bsStyle='danger' className={this.state.formError ? '' : 'hidden'}>
          {this.state.formError}
        </Alert>
        <FormGroup>
          <Col xs={2}>
            <ControlLabel>Name</ControlLabel>
          </Col>
          <Col xs={10}>
            <FormControl
              type='text'
              placeholder='Team Name'
              ref='teamName'
              value={this.state.teamName}
              onChange={this.handleChange}
            />
            <HelpBlock>The team name must be unique</HelpBlock>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={2}>
            <ControlLabel>Description</ControlLabel>
          </Col>
          <Col xs={10}>
            <FormControl
              type='text'
              placeholder='Team Description'
              ref='teamDesc'
              value={this.state.teamDesc}
              onChange={this.handleChange}
            />
            <HelpBlock>The team's description</HelpBlock>
          </Col>
        </FormGroup>
        <TagSelect
          ref='tags'
          label='Tags'
          {...this.props}
          value={this.state.tags}
          onChange={this.changeTags}
          filterOptions={this.filterOptions}
        />
        <FormGroup>
          <Col xs={2} xs-offset={2}>
            <FormControl className={'btn btn-default btn-primary' + (creatingTag ? ' btn-disabled' : '')}
              type='submit' value='Create' onClick={!creatingTag ? this.handleSubmit : null} />
          </Col>
        </FormGroup>
      </Form>
    )
  }
})

module.exports = TeamCreationForm
