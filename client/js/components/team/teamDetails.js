'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Form = ReactBootstrap.Form
var FormGroup = ReactBootstrap.FormGroup
var ControlLabel = ReactBootstrap.ControlLabel
var Col = ReactBootstrap.Col

var TagList = require('../assessment/tagList')

var TeamDetails = React.createClass({
  propTypes: {
    team: React.PropTypes.object.isRequired
  },
  render: function () {
    return (
      <Form horizontal>
        <FormGroup>
          <Col lg={2} xs={12} sm={3}>
            <ControlLabel>Name</ControlLabel>
          </Col>
          <Col lg={8} xs={12} sm={9}>
            {this.props.team.name}
          </Col>
        </FormGroup>
        <FormGroup>
          <Col lg={2} xs={12} sm={3}>
            <ControlLabel>Description</ControlLabel>
          </Col>
          <Col lg={8} xs={12} sm={9}>
            {this.props.team.short_desc}
          </Col>
        </FormGroup>
        <FormGroup>
          <Col lg={2} xs={12} sm={3}>
            <ControlLabel>Tags</ControlLabel>
          </Col>
          <Col lg={8} xs={12} sm={9}>
            <TagList tags={this.props.team.tags} />
          </Col>
        </FormGroup>
      </Form>
    )
  }
})

module.exports = TeamDetails
