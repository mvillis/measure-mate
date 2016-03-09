'use strict'

var React = require('react')

var Loader = require('react-loader')
var ReactBootstrap = require('react-bootstrap')
var Panel = ReactBootstrap.Panel

var $ = require('jquery')

var TeamDetails = require('./teamDetails')
var AssessmentTable = require('../assessment/assessmentTable')
var AssessmentCreationForm = require('../home/assessmentCreationForm')

var Team = React.createClass({
  propTypes: {
    params: React.PropTypes.object.isRequired
  },
  loadTeamFromServer: function () {
    var url = '/api/teams/' + this.props.params.id + '/'
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({team: data, loaded: true})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(url, status, err.toString())
      }
    })
  },
  getInitialState: function () {
    return {
      team: {},
      loaded: false
    }
  },
  componentDidMount: function () {
    this.loadTeamFromServer()
  },
  render: function () {
    var initialTags = this.state.loaded ? this.state.team.tags.map(function (value) {
      return (
        { value: value.id, label: value.name }
      )
    }) : []

    return (
      <div>
        <div className='row'>
          <Loader loaded={this.state.loaded}>
            <div className='col-sm-6'>
              <Panel header='Team'>
                <TeamDetails team={this.state.team}/>
              </Panel>
            </div>
            <div className='col-sm-6 xpush-right'>
              <Panel header='Create Assessment'>
                <div className='container-fluid'>
                  <AssessmentCreationForm team={this.state.team} initialTags={initialTags}/>
                </div>
              </Panel>
            </div>
          </Loader>
        </div>
        <div className='row'>
          <Panel header='Assessments'>
            <AssessmentTable teamId={this.props.params.id}/>
          </Panel>
        </div>
      </div>
    )
  }
})

module.exports = Team
