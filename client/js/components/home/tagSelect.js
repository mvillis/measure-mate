'use strict'

var React = require('react')
var Select = require('react-select')
var $ = require('jquery')

var TagSelect = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
    onChange: React.PropTypes.func.isRequired
  },
  displayName: 'TagSelect',

  loadOptions: function loadOptions (input, callback) {
    setTimeout(function () {
      $.ajax({
        url: '/api/tags?search=' + input,
        dataType: 'json',
        cache: false,
        success: function (data) {
          var options = data.map(function (item) {
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
          <Select.Async {...this.props} delimeter=','
            multi loadOptions={this.loadOptions}
            allowCreate
            name='tags'
            placeholder='Type to find existing tags or create new ones'
          />
        </div>
        <div className='col-xs-10 col-xs-offset-2 help-block'>
          Tags are used to drive reporting. Use them to uniquely identify your area as well as group areas together.
        </div>
      </div>
    )
  }
})

module.exports = TagSelect
