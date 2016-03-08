'use strict'

var React = require('react')
var TagSelect = require('./tagSelect')
var TemplateSelect = require('./templateSelect')
var $ = require('jquery')

var AssessmentCreationForm = React.createClass({
  getInitialState: function () {
    return {
      template: '',
      tags: ''
    }
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
      this.createAssessment(template, tags)
    } else {
      var message = 'Template &amp; tag/s required.'
      this.showError(message)
    }
  },

  showError: function (message) {
    document.getElementById('form-error').innerHTML = message
    document.getElementById('form-error').className =
    document.getElementById('form-error').className.replace(/(?:^|\s)hidden(?!\S)/g, '')
  },

  createAssessment: function (template, tags) {
    $.ajax({
      context: this,
      url: '/api/assessments/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: '{"template":' + template + ',"tags":[' + tags + ']}',
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
          <div className='col-md-1'>
            <input className='btn btn-default' type='submit' value='Launch' onClick={this.handleSubmit} aria-describedby='helpBlock'/>
          </div>
          <div className='col-md-11'>
            <div id='form-error' className='text-danger v-cent hidden'/>
          </div>
        </div>
      </form>
    )
  }
})

module.exports = AssessmentCreationForm
