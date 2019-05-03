import React from 'react'
import PT from 'prop-types'
import './ProjectProgress.scss'

const ProjectProgress = (props) => {
  return (
    <div styleName={'project-progress '
      + (props.theme ? props.theme : '')
      + (props.isCompleted ? ' completed' : '')
      + (props.inProgress ? ' in-progress' : '')
    }
    >
      <span styleName="dot" />
      <div styleName="filled" style={{ width: props.progressPercent + '%' }} />
      <div styleName="label-layer">
        <div styleName="days">{props.labelDayStatus}</div>
        <div styleName="group-right">
          {!!props.labelSpent && <span styleName="spent">{props.labelSpent}</span>}
          {(!!props.labelStatus || !!props.labelSpent) && <span styleName="status hide-sm">{props.labelStatus}</span>}
          {props.children}
        </div>
      </div>
    </div>
  )
}

ProjectProgress.propTypes = {
  progressPercent: PT.number,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool
}

export default ProjectProgress
