"use strict";

var React = require('react');
var Select = require('react-select');
var $ = require('jquery');

var TemplateSelect = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  },
  displayName: 'TemplateSelect',

  loadOptions: function loadOptions(input, callback) {
      setTimeout(function() {
          $.ajax({
            url: "/api/templates/",
            dataType: 'json',
            cache: true,
            success: function(output) {
              var options = output.map(function (item) {
                return (
                  { value: item.id, label: item.name }
                );
              });
              callback(null, {
                  options: options,
                  complete: false
              });
            },
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }
          });
      }, 500);
  },

  render: function render() {
    return (
      <div>
        <label>{this.props.label}</label>
        <div>
          <Select.Async delimeter=','
          multi={false}
          loadOptions={this.loadOptions}
          {...this.props}
          allowCreate={false}
          name='tags'
          placeholder='Type to filter templates'
          />
        </div>
        <div className='hint'>
          Each template includes a unique set of attributes to measure.
        </div>
      </div>
    )
  }
});

module.exports = TemplateSelect;
