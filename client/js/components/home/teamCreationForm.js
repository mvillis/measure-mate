'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Alert = ReactBootstrap.Alert
var Input = ReactBootstrap.Input
var TagSelect = require('./tagSelect')
var $ = require('jquery')

var TeamCreationForm = React.createClass({
  propTypes: {
    initialTags: React.PropTypes.array
  },
  getInitialState: function () {
    return {
      teamName: '',
      teamDesc: '',
      tags: '',
      formError: ''
    }
  },
  componentWillMount: function () {
    this.setState({
      tags: this.props.initialTags
    })
  },
  changeHandlerTags: function (val) {
    this.setState({
      tags: val
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
    alert(JSON.stringify(this.state))
  },

  showError: function (message) {
    this.setState({
      formError: message
    })
  },

  createTeam: function (teamName, teamDesc, tags) {
    var data = {
      name: teamName,
      short_desc: teamDesc, // eslint-disable-line camelcase
      tags: tags
    }
    $.ajax({
      context: this,
      url: '/api/teams/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      type: 'POST',
      cache: true,
      success: function (output) {
        window.location = '/#/team/' + output.id + '/'
      },
      error: function (xhr, status, err) {
        var message = 'Team creation failed due to unknown reason. Try again later.'
        this.showError(message)
      }
    })
  },

  handleChange: function () {
    // This could also be done using ReactLink:
    //     // http://facebook.github.io/react/docs/two-way-binding-helpers.html
    this.setState({
      teamName: this.refs.teamName.getValue(),
      teamDesc: this.refs.teamDesc.getValue()
    })
  },

  render: function () {
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
            onChange={this.changeHandlerTags}
            labelClassName='col-xs-2'
            wrapperClassName='col-xs-10'
          />
        </div>
        <div className='form-group'>
          <Input className='btn btn-default' type='submit' value='Create' onClick={this.handleSubmit} wrapperClassName='col-xs-2 col-xs-offset-2' />
        </div>
      </form>
    )
  }
})

module.exports = TeamCreationForm
