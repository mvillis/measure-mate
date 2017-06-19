'use strict'

var PropTypes = require('prop-types')

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
var Button = ReactBootstrap.Button
var TagSelect = require('../common/tagSelect')
var $ = require('jquery')
var _ = require('lodash')
var HttpStatus = require('http-status-codes')

var TeamCreationForm = React.createClass({
  propTypes: {
    initialTeam: PropTypes.object,
    initialTags: PropTypes.array
  },
  getInitialState: function () {
    if (this.props.initialTeam) {
      var team = this.props.initialTeam
      var tags = this.props.initialTags || []
      return {
        teamId: team.id,
        teamName: team.name,
        teamDesc: team.short_desc,
        tags: tags.map(function (tag) {
          return ({
            label: tag.name,
            value: tag.id
          })
        }),
        formError: '',
        creatingTag: false,
        changed: false
      }
    } else {
      return {
        teamId: '',
        teamName: '',
        teamDesc: '',
        tags: [],
        formError: '',
        creatingTag: false,
        changed: false
      }
    }
  },
  handleNameChange: function (e) {
    // This could also be done using ReactLink:
    // http://facebook.github.io/react/docs/two-way-binding-helpers.html
    var value = e.target.value
    this.setState({
      teamName: value,
      changed: true
    })
  },
  handleDescChange: function (e) {
    var value = e.target.value
    this.setState({
      teamDesc: value,
      changed: true
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

      if (this.state.teamId) {
        this.updateTeam(this.state.teamId, teamName, teamDesc, tags)
      } else {
        this.createTeam(teamName, teamDesc, tags)
      }
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
        var tags = this.state.tags
        tags.push({value: newTag.id, label: newTag.name})
        this.setState({tags: _.uniq(tags), creatingTag: false})
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
            _.some(currentValues, {label: potentialTag})
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

  createTeam: function (teamName, teamDesc, tags) {
    var data = {
      name: teamName,
      short_desc: teamDesc, // eslint-disable-line camelcase
      tags: tags
    }
    console.log('new team: ' + JSON.stringify(data))
    $.ajax({
      context: this,
      url: '/api/teams/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      type: 'POST',
      cache: true,
      success: function (newTeam) {
        browserHistory.push('/team/' + newTeam.id)
      },
      error: function (xhr, status, err) {
        console.log(xhr.status + ' ' + xhr.statusText)
        console.log(xhr.responseText)
        console.log(err)
        var message = 'Team creation failed due to unknown reason. Try again later.'
        if (xhr.status === HttpStatus.BAD_REQUEST) {
          if (xhr.responseJSON && xhr.responseJSON.name) {
            message = 'Invalid team name: ' + xhr.responseJSON.name
          } else {
            message = 'Team creation failed: ' + xhr.responseText
          }
        }
        this.showError(message)
      }
    })
  },

  updateTeam: function (teamId, teamName, teamDesc, tags) {
    var data = {
      id: teamId,
      name: teamName,
      short_desc: teamDesc, // eslint-disable-line camelcase
      tags: tags
    }
    $.ajax({
      context: this,
      url: '/api/teams/' + teamId + '/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      type: 'PUT',
      cache: true,
      success: function (newTeam) {
        this.setState({ changed: false })
        browserHistory.push('/team/' + newTeam.id)
      },
      error: function (xhr, status, err) {
        console.log(xhr.status + ' ' + xhr.statusText)
        console.log(xhr.responseText)
        console.log(err)
        var message = 'Team update failed due to unknown reason. Try again later.'
        if (xhr.status === HttpStatus.BAD_REQUEST) {
          if (xhr.responseJSON && xhr.responseJSON.name) {
            message = 'Invalid team name: ' + xhr.responseJSON.name
          } else {
            message = 'Team update failed: ' + xhr.responseText
          }
        }
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
        <FormGroup controlId='teamName'>
          <Col xs={12} sm={3} lg={2}>
            <ControlLabel>Name</ControlLabel>
          </Col>
          <Col xs={12} sm={9} lg={8}>
            <FormControl
              type='text'
              placeholder='Team Name'
              value={this.state.teamName}
              onChange={this.handleNameChange}
            />
            <HelpBlock>The team name must be unique</HelpBlock>
          </Col>
        </FormGroup>
        <FormGroup controlId='teamDesc'>
          <Col xs={12} sm={3} lg={2}>
            <ControlLabel>Description</ControlLabel>
          </Col>
          <Col xs={12} sm={9} lg={8}>
            <FormControl
              type='text'
              placeholder='Team Description'
              ref='teamDesc'
              value={this.state.teamDesc}
              onChange={this.handleDescChange}
            />
            <HelpBlock>The team's description</HelpBlock>
          </Col>
        </FormGroup>
        <FormGroup controlId='tags'>
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
        <FormGroup>
          <Col xs={12} sm={3} lg={2} lgOffset={10} style={{width: 'auto'}}>
            <Button
              bsStyle='primary'
              disabled={creatingTag || !this.state.changed}
              type='submit'
              onClick={this.handleSubmit}>
              {this.state.teamId ? 'Save' : 'Create'}
            </Button>
          </Col>
        </FormGroup>
      </Form>
    )
  }
})

module.exports = TeamCreationForm
