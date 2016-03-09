'use strict'

var React = require('react')

var TeamDetails = require('./teamDetails')
var AssessmentTable = require('../assessment/assessmentTable')

var Team = React.createClass({
  propTypes: {
    params: React.PropTypes.object.isRequired
  },
  render: function () {
    return (
      <div>
        <TeamDetails teamId={this.props.params.id}/>
        <AssessmentTable teamId={this.props.params.id}/>
      </div>
    )
  }
})

module.exports = Team
