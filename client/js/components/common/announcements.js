'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Accordion = ReactBootstrap.Accordion
var Panel = ReactBootstrap.Panel

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
      announcements: [],
      loaded: false
    }
  },
  componentDidMount: function () {
    this.loadAnnouncementsFromServer()
  },
  render: function () {
    return (
      <Accordion>
        { this.state.announcments.map(function (announcement) {
          <Panel header={announcement.title} key={announcement.id}>{announcement.content}</Panel>
	})}
      </Accordion>
    )
  }
})

module.exports = Accordion
