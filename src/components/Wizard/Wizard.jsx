import React from 'react'
import PT from 'prop-types'
import './Wizard.scss'

function Wizard(props) {
  const { step } = props
  return (
    <div className={`Wizard ${props.className} ${props.className}-step-${step}`}>
      <div className="content">
        {props.children[step]}
      </div>
    </div>
  )
}

Wizard.proptTypes = {
  children: PT.node.isRequired,
  step: PT.number.isRequired,
}

export default Wizard
