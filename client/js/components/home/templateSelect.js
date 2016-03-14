'use strict'

var React = require('react')
var Select = require('react-select')
var $ = require('jquery')

var TemplateSelect = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
    onChange: React.PropTypes.func.isRequired
  },
  displayName: 'TemplateSelect',

  loadOptions: function loadOptions (input, callback) {
    setTimeout(function () {
      $.ajax({
        url: '/api/templates/',
        dataType: 'json',
        cache: true,
        success: function (output) {
          var options = output.map(function (item) {
            return (
              { value: item.id, label: item.name }
            )
          })
          callback(null, {
            options: options,
            complete: false
          })
        },
        error: function (xhr, status, err) {
          console.error(window.location, status, err.toString())
        }
      })
    }, 500)
  },

  render: function render () {
    return (
      <div>
        <label className='control-label col-xs-2'>{this.props.label}</label>
        <div className='col-xs-10'>
          <Select.Async delimeter=','
            multi={false}
            loadOptions={this.loadOptions}
            {...this.props}
            allowCreate={false}
            name='tags'
            placeholder='Type to filter templates'
            />
        </div>
        <div className='col-xs-10 col-xs-offset-2 help-block'>
          Each template includes a unique set of attributes to measure.
        </div>
      </div>
    )
  }
})

module.exports = TemplateSelect
