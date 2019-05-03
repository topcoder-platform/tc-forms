import _ from 'lodash'
import Cookies from 'js-cookie'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { renderComponent, branch, compose, withProps } from 'recompose'
import { submit } from '../actions/forms'
import { loadMetadata } from '../actions/forms'
import { loadTemplate } from '../actions/template'
import CoderBot from '../components/CoderBot/CoderBot'
import spinnerWhileLoading from '../components/LoadingSpinner'
import ProjectWizard from '../projects/create/components/ProjectWizard'
import WizardWrapper from '../components/WizardWrapper'
import { ViewTypes } from 'appirio-tech-react-components/components/Wizard/Wizard'
import './CreateContainer.scss'
import ProjectTypeIcon from '../components/ProjectTypeIcon'

import {
  LS_INCOMPLETE_PROJECT,
  LS_INCOMPLETE_WIZARD,
  GA_CLIENT_ID,
  GA_CLICK_ID,
} from '../config/constants'

const page404 = compose(
  withProps({code:404})
)
// this handles showing error page when there is an error in loading the page
const showCoderBotIfError = (hasError) =>
  branch(
    hasError,
    renderComponent(page404(CoderBot)),
    t => t
  )
const errorHandler = showCoderBotIfError(props => props.error || props.forms.error || props.template.error )

// This handles showing a spinner while the state is being loaded async
const spinner = spinnerWhileLoading(props =>
  !props.forms.isLoading &&
  !props.template.isLoading &&
  props.template.template !== null
)

const enhance = compose(errorHandler, spinner)

const CreateView = (props) => {
  return (
    <div styleName="create-container">
      <ProjectWizard {...props}/>
    </div>
  )
}
const EnhancedCreateView = enhance(CreateView)

class CreateContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isProjectDirty: false,
      wizardStep: 0,
      updatedProject: {},
      projectType: {},
    }
    this.createProject = this.createProject.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.prepareProjectForCreation = this.prepareProjectForCreation.bind(this)
    this.createContainerView = this.createContainerView.bind(this)

  }

  componentWillReceiveProps(nextProps) {
    const nextProjectId = _.get(nextProps, 'project.id', null)
    const { template: { template }} = nextProps
    this.setState({ projectType: template })

    if (!nextProps.forms.error && !nextProps.forms.submitting && nextProps.forms.submitSuccess ) {
      // update state
      this.setState({
        projectId: nextProjectId,
        isProjectDirty: false
      }, () => {
        // go to submitted state
        console.log('go to submitted state')
        window.localStorage.removeItem(LS_INCOMPLETE_PROJECT)
        window.localStorage.removeItem(LS_INCOMPLETE_WIZARD)
      })

    }

    // when route is changed, save incomplete project
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.onLeave()
    }
  }

  componentWillMount() {
    const { template, match, forms} = this.props
    if(!forms.productTemplates || !forms.productCategories) {
      this.props.loadMetadata()
    }

    if (!template.template && !template.isLoading) {
      this.props.loadTemplate(match.params.templateId)
    }
  }

  componentDidMount() {
    // sets window unload hook save incomplete project
    window.addEventListener('beforeunload', this.onLeave)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLeave)
    // when we leave component, save incomplete project
    this.onLeave()
  }

  // stores the incomplete project in local storage
  onLeave(e) {// eslint-disable-line no-unused-vars
    const { wizardStep, isProjectDirty } = this.state
    const { template: { template }} = this.props

    if (wizardStep === ProjectWizard.Steps.WZ_STEP_FILL_PROJ_DETAILS && isProjectDirty) {// Project Details step
      this.prepareProjectForCreation(this.state.updatedProject, template)
      console.log('saving incomplete project', this.state.updatedProject)
      window.localStorage.setItem(LS_INCOMPLETE_PROJECT, JSON.stringify(this.state.updatedProject))
    }
    // commenting alerts for the page unload and route change hooks as discussed
    // https://github.com/appirio-tech/connect-app/issues/1037#issuecomment-324732052

    // if (isProjectDirty && !creatingProject) {
    //   return e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
    // }
  }

  /**
   * Helper method to add additional details required to create project
   *
   * @param {Object} project project data captured from user
   * @param {Object} projectTemplate project template to be used
   */
  prepareProjectForCreation(project, projectTemplate) {
    const gaClickId  = Cookies.get(GA_CLICK_ID)
    const gaClientId = Cookies.get(GA_CLIENT_ID)
    if(gaClientId || gaClickId) {
      const googleAnalytics = {}
      if (gaClickId !== 'null') {
        googleAnalytics[GA_CLICK_ID]  = gaClickId
      }
      if (gaClientId !== 'null') {
        googleAnalytics[GA_CLIENT_ID] = gaClientId
      }
      _.set(project, 'details.utm.google', googleAnalytics)
    }
    if (projectTemplate) {
      project.version = 'v3'
      project.templateId = projectTemplate.id
      project.type = projectTemplate.category
    }
  }

  /**
   * Creates new project if user is already logged in, otherwise, redirects user for registration/login.
   */
  createProject(project) {
    const { template: { template }} = this.props

    this.setState({ creatingProject: true }, () => {
      this.prepareProjectForCreation(project, template)
      this.props.submit(template.submitURL, project)
    })
  }

  createContainerView() {
    const { template, forms } = this.props

    return (
      <EnhancedCreateView
        {...this.props}
        createProject={ this.createProject }
        template={ template }
        processing={ forms.submitting }
        createdProject={ forms.submitSuccess }
        projectId={ this.state.projectId }
        onProjectUpdate={ (updatedProject, dirty=true) => {
          // const projectType = _.get(this.state.updatedProject, 'type', null)
          const prevProduct = _.get(this.state.updatedProject, 'templateId', null)
          const product = _.get(updatedProject, 'templateId', null)
          // compares updated product with previous product to know if user has updated the product
          if (prevProduct !== product) {
            if (product) {
              // intentionally commented because now it should not be require as we handling all URL changes in onStepChange
              // earlier we were not getting updated project in onStepChange handler, hence it was required here
              // still leaving it here for next few release, in case we find any issue because of commenting this line
              // this.props.history.push(NEW_PROJECT_PATH + '/' + product + window.location.search)
            }
          }
          this.setState({
            isProjectDirty: dirty,
            updatedProject
          })
        }
        }
      />
    )
  }

  render() {
    const { wizardStep, projectType } = this.state
    let type = 'unknown'
    if (wizardStep <= ProjectWizard.Steps.WZ_STEP_FILL_PROJ_DETAILS) {
      type = ViewTypes.definedScope
    } else if (wizardStep === ProjectWizard.Steps.WZ_STEP_PROJECT_SUBMITTED) {
      type = ViewTypes.projectSubmitted
    }

    if (projectType && projectType.icon) {
      projectType.iconUI = <ProjectTypeIcon type={projectType.icon} />
    }

    return (
      <WizardWrapper className="WizardCreateProject" type={type}>
        { this.createContainerView() }
      </WizardWrapper>
    )
  }


}

CreateContainer.propTypes = {

}

CreateContainer.defaultProps = {
}

const mapStateToProps = ({ forms, template }) => ({
  forms,
  template,
  processing: forms.submitting
})

const actionCreators = {
  submit,
  loadMetadata,
  loadTemplate,
}

export default withRouter(connect(mapStateToProps, actionCreators)(CreateContainer))
