'use strict'

var React = require('react')
var Select = require('react-select')
var ReactBootstrap = require('react-bootstrap')
var HelpBlock = ReactBootstrap.HelpBlock
var $ = require('jquery')

var TemplateSelect = React.createClass({
  propTypes: {
    value: React.PropTypes.any,
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
        <Select.Async delimeter=','
          multi={false}
          loadOptions={this.loadOptions}
          {...this.props}
          allowCreate={false}
          name='tags'
          placeholder='Type to filter templates'
          />
        <HelpBlock>Each template includes a unique set of attributes to measure.</HelpBlock>
      </div>
    )
  }
})

module.exports = TemplateSelect
