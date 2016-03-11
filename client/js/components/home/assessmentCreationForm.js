'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Alert = ReactBootstrap.Alert
var TagSelect = require('./tagSelect')
var TemplateSelect = require('./templateSelect')
var $ = require('jquery')

var AssessmentCreationForm = React.createClass({
  propTypes: {
    initialTags: React.PropTypes.array,
    team: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      template: '',
      tags: '',
      formError: ''
    }
  },
  componentWillMount: function () {
    this.setState({
      tags: this.props.initialTags
    })
  },
  changeHandlerTemplate: function (val) {
    this.setState({
      template: val.value
    })
  },
  changeHandlerTags: function (val) {
    this.setState({
      tags: val
    })
  },
  handleSubmit: function (e) {
    e.preventDefault()
    if (this.state.template && this.state.tags) {
      var template = this.state.template
      var tags = this.state.tags.map(function (value) {
        return (
          value.value
        )
      })
      var teamId = this.props.team ? this.props.team.id : ''
      this.createAssessment(template, tags, teamId)
    } else {
      var message = 'Template & tag/s required.'
      this.showError(message)
    }
  },

  showError: function (message) {
    this.setState({
      formError: message
    })
  },

  createAssessment: function (template, tags, teamId) {
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
      success: function (output) {
        window.location = '/#/assessment/' + output.id + '/'
      },
      error: function (xhr, status, err) {
        var message = 'Launch failed due to unknown reason. Try again later.'
        this.showError(message)
      }
    })
  },

  render: function () {
    return (
      <form className='form-horizontal'>
        <Alert bsStyle='danger' className={this.state.formError ? '' : 'hidden'}>
          {this.state.formError}
        </Alert>
        <div className='form-group'>
          <TemplateSelect
            label='Template'
            ref='template'
            {...this.props}
            value={this.state.template}
            onChange={this.changeHandlerTemplate}
          />
        </div>
        <div className='form-group'>
          <TagSelect
            label='Tags'
            ref='tags'
            {...this.props}
            value={this.state.tags}
            onChange={this.changeHandlerTags}
          />
        </div>
        <div className='form-group'>
          <input className='btn btn-default' type='submit' value='Launch' onClick={this.handleSubmit}/>
        </div>
      </form>
    )
  }
})

module.exports = AssessmentCreationForm
