'use strict'

var React = require('react')
var expect = require('chai').expect
var enzyme = require('enzyme')
var render = enzyme.render
var Home = require('../../../../js/components/home/home')

describe('Home Page Component', function () {
  it('contains slogan text', function () {
    const wrapper = render(<Home/>)
    expect(wrapper.find('.logo-slogan-text').text())
    .to
    .contain('A tool to track maturity assessments for your team')
  })
})
