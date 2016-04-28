'use strict'

var React = require('react')
var expect = require('chai').expect
var shallow = require('enzyme').shallow
var Intro = require('../../../../js/components/assessment/intro')

var mocked_params = {'assessmentId': 1}
var mocked_template = {'attributes': [{'id': 1}]}

describe('Intro Component', function () {
  it('contains welcome text', function () {
    expect(shallow(<Intro params={mocked_params} template={mocked_template} />)
    .contains(<h1>Welcome</h1>))
    .to
    .equal(true)
  })
})
