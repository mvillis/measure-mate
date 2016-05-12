'use strict'

var React = require('react')
var ReactRouter = require('react-router')
var browserHistory = ReactRouter.browserHistory
var ReactBootstrap = require('react-bootstrap')
var Alert = ReactBootstrap.Alert
var Input = ReactBootstrap.Input
var TagSelect = require('./tagSelect')
var $ = require('jquery')
var _ = require('lodash')

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
        var message = 'Tag creation failed due to unknown reason. Try again later.'
        this.showError(message)
      }
    })
  },

  // FIXME Temporary until react-select fixes allowCreate={true}
  filterOptions: function (options, filter, currentValues) {
    // ditch existing values
    var filteredOptions = _(options)
        .difference(currentValues)

    if (filter) {
      // only the values matching the typed string
      filteredOptions = filteredOptions
        .filter((o) => RegExp(filter, 'ig').test(o.label))

      // if the typed string doesn't exactly match an existing tag...
      if (!filteredOptions.find((o) => o.label === filter)) {
        // ... add the option to create the tag
        filteredOptions = filteredOptions
          .concat(_.some(currentValues, {label: filter}) ? [] : [{label: `Add \"${filter}\"...`, value: filter, create: true}])
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
      <form className='form-horizontal'>
        <Alert bsStyle='danger' className={this.state.formError ? '' : 'hidden'}>
          {this.state.formError}
        </Alert>
        <Input
          type='text'
          label='Name'
          ref='teamName'
          value={this.state.teamName}
          onChange={this.handleChange}
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'
          help='The team name must be unique'
        />
        <Input
          type='text'
          label='Description'
          ref='teamDesc'
          value={this.state.teamDesc}
          onChange={this.handleChange}
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'
          help="The team's description"
        />
        <div className='form-group'>
          <TagSelect
            label='Tags'
            ref='tags'
            {...this.props}
            value={this.state.tags}
            onChange={this.changeTags}
            filterOptions={this.filterOptions}
            labelClassName='col-xs-2'
            wrapperClassName='col-xs-10'
          />
        </div>
        <div className='form-group'>
          <div className='col-xs-2 col-xs-offset-2'>
            <input className={'btn btn-default btn-primary' + (creatingTag ? ' btn-disabled' : '')}
              type='submit' value='Create' onClick={!creatingTag ? this.handleSubmit : null} />
          </div>
        </div>
      </form>
    )
  }
})

module.exports = TeamCreationForm
