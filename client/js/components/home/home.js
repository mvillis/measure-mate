'use strict'

var React = require('react')
var AssessmentCreationForm = require('./assessmentCreationForm')

var Home = React.createClass({
  render: function () {
    return (
      <div>
        <div className='container-fluid'>
          <div className='jumbotron'>
            <h1>Welcome to Measure Mate!</h1>
            <AssessmentCreationForm />
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Home
