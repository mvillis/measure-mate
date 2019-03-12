/* eslint-env jasmine */
'use strict'

var React = require('react')
var expect = require('chai').expect
var shallow = require('enzyme').shallow
var Intro = require('../../../../js/components/assessment/intro')

var mockedParams = { 'assessmentId': 1 }
var mockedTemplate = { 'attributes': [{ 'id': 1 }] }

describe('Intro Component', function () {
  it('contains welcome text', function () {
    expect(shallow(<Intro params={mockedParams} template={mockedTemplate} />)
      .contains(<h1>Welcome</h1>))
      .to
      .equal(true)
  })
})
