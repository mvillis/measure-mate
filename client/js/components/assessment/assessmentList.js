'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer
var Moment = require('moment')
var Table = ReactBootstrap.Table
var TagList = require('./tagList')

var AssessmentList = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  render: function () {
    return (
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Created Date</th>
            <th>Template</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {this.props.data.map(function (assessment, i) {
            var prettyCreated = Moment(assessment.created).format('DD/MM/YYYY')
            var relativeCreated = Moment(assessment.created).fromNow()
            return (
              <LinkContainer key={assessment.id} to={{pathname: '/assessment/' + assessment.id}}>
                <tr className='clickable-row' >
                  <td><a href={'/assessment/' + assessment.id + '/'}>{assessment.id}</a></td>
                  <td>{prettyCreated} <small>({relativeCreated})</small></td>
                  <td>{assessment.template.name}</td>
                  <td className='wrap'><TagList tags={assessment.tags}/></td>
                </tr>
              </LinkContainer>
            )
          }, this)}
        </tbody>
      </Table>
    )
  }
})

module.exports = AssessmentList
