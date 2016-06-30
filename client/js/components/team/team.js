'use strict'

var React = require('react')

var Loader = require('react-loader')
var ReactBootstrap = require('react-bootstrap')
var Panel = ReactBootstrap.Panel
var Row = ReactBootstrap.Row
var Col = ReactBootstrap.Col

var $ = require('jquery')

var TeamDetails = require('./teamDetails')
var AssessmentTable = require('../assessment/assessmentTable')
var AssessmentCreationForm = require('../home/assessmentCreationForm')

var Team = React.createClass({
  propTypes: {
    params: React.PropTypes.object
  },

  loadTeamFromServer: function () {
    var teamId = parseInt(this.props.params.teamId, 10)
    var url = '/api/teams/' + teamId + '/'
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
    var teamId = parseInt(this.props.params.teamId, 10)
    return (
      <div>
        <Row>
          <Col xs={12} sm={6}>          
            <Panel header='Team' bsStyle='primary'>
              <Loader scale={0.25} top='10' loaded={this.state.loaded}>
                <TeamDetails team={this.state.team} />
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
