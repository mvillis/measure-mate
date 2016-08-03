'use strict'

require('../../jsdom.setup.js')

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Button = ReactBootstrap.Button
var expect = require('chai').expect
var shallow = require('enzyme').shallow
var FinaliseAssessment = require('../../../../js/components/assessment/finaliseAssessment')

var noop = function () { }

describe('Finalise Assessment Component', function () {
  it('directs to the summary page', function () {
    let mockedAssessment = {'id': 1, 'status': 'TODO'}

    const wrapper = shallow(
      <FinaliseAssessment isSummaryTab={false} assessment={mockedAssessment} markAssessmentDone={noop} />
    )
    console.log(wrapper.html())
    expect(wrapper.find(Button).html())
      .to.contain('Summary')
  })

  it('allows lock in on summary tab', function () {
    let mockedAssessment = {'id': 1, 'status': 'TODO'}

    const wrapper = shallow(
      <FinaliseAssessment isSummaryTab assessment={mockedAssessment} markAssessmentDone={noop} />
    )
    expect(wrapper.find(Button).last().html())
      .to.contain('Lock It In')
  })

  it('knows the assessment is read only', function () {
    let mockedAssessment = {'id': 1, 'status': 'DONE'}

    const wrapper = shallow(
      <FinaliseAssessment isSummaryTab={false} assessment={mockedAssessment} markAssessmentDone={noop} />
    )
    expect(wrapper.find({header: 'All Locked In!'}))
      .to.have.length(1)
  })

  it('knows the assessment is read only on summary tab', function () {
    let mockedAssessment = {'id': 1, 'status': 'DONE'}

    const wrapper = shallow(
      <FinaliseAssessment isSummaryTab assessment={mockedAssessment} markAssessmentDone={noop} />
    )
    expect(wrapper.find({header: 'All Locked In!'}))
      .to.have.length(1)
  })
})
