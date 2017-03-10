/* eslint-env jasmine */
'use strict'

var React = require('react')
var ReactBootrap = require('react-bootstrap')
var Modal = ReactBootrap.Modal
var expect = require('chai').expect
var shallow = require('enzyme').shallow
var AppAlert = require('../../../../js/components/common/appAlert')

describe('AppAlert Component', function () {
  const handleHideFunc = function () {
    // console.log('handleHideFunc() called')
  }
  const showAlert = true
  const wrapper = shallow(
    <AppAlert showAlert={showAlert} alertType='alert type alpha' alertDetail='alert detail alpha beta gamma' handleHide={handleHideFunc} />
  )

  it('contains modal header', function () {
    expect(wrapper.find(Modal.Header))
      .to
      .have
      .length(1)
  })

  it('contains alert title text', function () {
    expect(wrapper.find(Modal.Title).render().text())
      .to
      .contain('alert type alpha')
  })

  it('contains alert detail text', function () {
    expect(wrapper.find(Modal.Body).render().text())
      .to
      .contain('alert detail alpha beta gamma')
  })
})
