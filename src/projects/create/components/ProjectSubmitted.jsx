import React from 'react'
import PT from 'prop-types'

require('./ProjectSubmitted.scss')

class ProjectSubmitted extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="ProjectSubmitted flex column middle center tc-ui">
        <div className="container flex column middle center">
          <div className="title">Form successfully submitted</div>
        </div>
      </div>
    )
  }
}

ProjectSubmitted.defaultProps = {
  vm: {},
  params: {},
}

ProjectSubmitted.propTypes = {
  vm: PT.any,
  params: PT.any,
}

export default ProjectSubmitted
