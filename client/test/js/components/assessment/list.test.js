'use strict'

var React = require('react')
var Table = React.Table
var expect = require('chai').expect
var shallow = require('enzyme').shallow
var AssessmentList = require('../../../../js/components/assessment/assessmentList')

var mockedAssessments = [
  {
    id: 1,
    created: '2016-01-12T01:45:14.525000Z',
    template: { name: 'LAMA' },
    status: 'TODO',
    team: { id: 1, name: 'Test team' }
  },
  {
    id: 2,
    created: '2016-01-12T01:45:14.525000Z',
    template: { name: 'DevOps' },
    status: 'DONE',
    team: { id: 2, name: 'Test team 2' }
  }
]

var mockedAssessmentTags = {
  1: [],
  2: [ { id: 1, name: 'test' }, { id: 2, name: 'foo' } ]
}

describe('AssessmentList Component', function () {
  it('contains a table', function () {
    expect(shallow(<AssessmentList showTeams assessments={mockedAssessments} assessmentTags={mockedAssessmentTags} />)
      .contains(<Table />))
      .to
      .equal(true)
  })
})
