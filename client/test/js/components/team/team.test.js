/* eslint-env jasmine */
'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Panel = ReactBootstrap.Panel
var expect = require('chai').expect
var shallow = require('enzyme').shallow
var Team = require('../../../../js/components/team/team')

var mockedParams = {'teamId': 1}

describe('Team Page Component', function () {
  it('contains team details', function () {
    const wrapper = shallow(<Team params={mockedParams} />)

    expect(wrapper.find(Panel))
      .to
      .have
      .length(3)

    expect(wrapper.find({header: 'Team'}))
      .to
      .have
      .length(1)

    expect(wrapper.find({header: 'Create Assessment'}))
      .to
      .have
      .length(1)

    expect(wrapper.find({header: 'Assessments'}))
      .to
      .have
      .length(1)
  })
})
