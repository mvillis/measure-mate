'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Accordion = ReactBootstrap.Accordion
var Panel = ReactBootstrap.Panel
var ReactMarkdown = require('react-markdown')

var $ = require('jquery')

var Announcements = React.createClass({
  loadAnnouncementsFromServer: function () {
    var url = '/api/announcements/?enabled=True'
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({
          announcements: data
        })
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(url, status, err.toString())
      }
    })
  },
  getInitialState: function () {
    return {
      announcements: []
    }
  },
  componentDidMount: function () {
    this.loadAnnouncementsFromServer()
  },
  render: function () {
    return (
      <Accordion>
        { this.state.announcements.map(function (announcement) {
          return <Panel bsStyle={announcement.style} header={announcement.title} key={announcement.id}>
            <ReactMarkdown escapeHtml source={announcement.content} />
          </Panel>
        })}
      </Accordion>
    )
  }
})

module.exports = Announcements
