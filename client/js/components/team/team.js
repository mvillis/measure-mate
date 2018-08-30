'use strict'

var PropTypes = require('prop-types')

var React = require('react')

var createReactClass = require('create-react-class')

var Loader = require('react-loader')
var ReactBootstrap = require('react-bootstrap')
var Panel = ReactBootstrap.Panel
var Row = ReactBootstrap.Row
var Col = ReactBootstrap.Col

var $ = require('jquery')

var TeamCreationForm = require('./teamCreationForm')
var AssessmentTable = require('../assessment/assessmentTable')
var AssessmentCreationForm = require('../assessment/assessmentCreationForm')

var Team = createReactClass({
  displayName: 'Team',

  propTypes: {
    params: PropTypes.object
  },

  loadTagsFromServer: function () {
    var teamId = parseInt(this.props.params.teamId, 10)
    var url = '/api/tags/?team__id=' + teamId
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ tags: data, loadedTags: true, loaded: this.state.loadedTeam })
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(url, status, err.toString())
      }
    })
  },

  loadTeamFromServer: function () {
    var teamId = parseInt(this.props.params.teamId, 10)
    var url = '/api/teams/' + teamId + '/'
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ team: data, loadedTeam: true, loaded: this.state.loadedTags })
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(url, status, err.toString())
      }
    })
  },

  getInitialState: function () {
    return {
      team: {},
      tags: [],
      loadedTags: false,
      loadedTeam: false,
      loaded: false
    }
  },

  componentDidMount: function () {
    this.loadTeamFromServer()
    this.loadTagsFromServer()
  },

  render: function () {
    var teamId = parseInt(this.props.params.teamId, 10)
    return (
      <div>
        <Row>
          <Col xs={12} sm={6}>
            <Panel header='Team' bsStyle='primary'>
              <Loader loaded={this.state.loaded}>
                <TeamCreationForm initialTeam={this.state.team} initialTags={this.state.tags} />
              </Loader>
            </Panel>
          </Col>
          <Col xs={12} sm={6}>
            <Panel header='Create Assessment' bsStyle='info'>
              <AssessmentCreationForm teamId={teamId} />
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Panel header='Assessments' bsStyle='info'>
              <AssessmentTable teamId={teamId} />
            </Panel>
          </Col>
        </Row>
      </div>
    )
  }
})

module.exports = Team
