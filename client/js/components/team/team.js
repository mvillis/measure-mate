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
          <div className='col-sm-6'>
            <Panel header='Team' bsStyle='primary'>
              <Loader scale={0.25} top={10} loaded={this.state.loaded}>
                <TeamDetails team={this.state.team}/>
              </Loader>
            </Panel>
          </div>
          <div className='col-sm-6 push-right'>
            <Panel header='Create Assessment' bsStyle='info'>
              <Loader scale={0.25} top={10} loaded={this.state.loaded}>
                <div className='container-fluid'>
                  <AssessmentCreationForm team={this.state.team} initialTags={initialTags}/>
                </div>
              </Loader>
            </Panel>
          </div>
        </div>
        <div className='row'>
          <div className='container-fluid'>
            <Panel header='Assessments' bsStyle='info'>
              <AssessmentTable teamId={this.props.params.id}/>
            </Panel>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Team
