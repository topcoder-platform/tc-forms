import React from 'react'
import PT from 'prop-types'
import './WizardWrapper.scss'

function WizardWrapper(props) {
  return (
    <div styleName="WizardWrapper" className={`WizardWrapper ${props.className}`}>
      <div styleName="content">
        {props.children}
      </div>
    </div>
  )
}

WizardWrapper.propTypes = {
  children: PT.node.isRequired,
}

export default WizardWrapper
