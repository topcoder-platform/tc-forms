import _ from 'lodash'
import { unflatten } from 'flat'
import qs from 'query-string'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Wizard from '../../../components/Wizard'
import IncompleteProjectConfirmation from './IncompleteProjectConfirmation'
import FillProjectDetails from './FillProjectDetails'
import ProjectSubmitted from './ProjectSubmitted'

import update from 'react-addons-update'
import { LS_INCOMPLETE_PROJECT, PROJECT_REF_CODE_MAX_LENGTH, LS_INCOMPLETE_WIZARD } from '../../../config/constants'
import './ProjectWizard.scss'

const WZ_STEP_INCOMP_PROJ_CONF = 0
const WZ_STEP_FILL_PROJ_DETAILS = 1
const WZ_STEP_ERROR_CREATING_PROJ = 2
const WZ_STEP_PROJECT_SUBMITTED = 3

class ProjectWizard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      wizardStep: WZ_STEP_FILL_PROJ_DETAILS,
      project: { details: {} },
      dirtyProject: { details: {} },
      isProjectDirty: false
    }

    this.updateProjectRef = this.updateProjectRef.bind(this)
    this.updateProjectTemplate = this.updateProjectTemplate.bind(this)
    this.handleProjectChange = this.handleProjectChange.bind(this)
    this.loadIncompleteProject = this.loadIncompleteProject.bind(this)
    this.removeIncompleteProject = this.removeIncompleteProject.bind(this)
    this.handleOnCreateProject = this.handleOnCreateProject.bind(this)
    this.handleStepChange = this.handleStepChange.bind(this)
  }

  componentDidMount() {
    const { onStepChange, createdProject } = this.props
    const params = this.props.match.params
    // load incomplete project from local storage
    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    let wizardStep = WZ_STEP_FILL_PROJ_DETAILS
    if ((params && params.status === 'submitted') || createdProject) {
      const wizardStep = WZ_STEP_PROJECT_SUBMITTED
      const updateQuery = {}
      this.setState({
        project: update(this.state.project, updateQuery),
        dirtyProject: update(this.state.dirtyProject, updateQuery),
        wizardStep,
        isProjectDirty: false
      }, () => {
        typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.project)
      })
    } else if (incompleteProjectStr) {
      const incompleteProject = JSON.parse(incompleteProjectStr)
      const incompleteProjectTemplateId = _.get(incompleteProject, 'templateId')
      // Use incomplete project only if template ids match
      if (params && params.templateId === `${incompleteProjectTemplateId}`) {
        wizardStep = WZ_STEP_INCOMP_PROJ_CONF
        this.setState({
          wizardStep,
        }, () => {
          typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.project)
        })
      } else {
        this.removeIncompleteProject()
      }
    } else {
      // if there is no incomplete project in the local storage, load the wizard with appropriate step
      const updateQuery = {}
      const wizardStep = WZ_STEP_FILL_PROJ_DETAILS

      // retrieve refCode from query param
      // TODO give warning after truncating
      const refCode = _.get(qs.parse(window.location.search), 'refCode', '').trim().substr(0, PROJECT_REF_CODE_MAX_LENGTH)
      if (refCode.trim().length > 0) {
        // if refCode exists, update the updateQuery to set that refCode
        if (_.get(updateQuery, 'details')) {
          updateQuery['details']['utm'] = { $set : { code : refCode }}
        } else {
          updateQuery['details'] = { utm : { $set : { code : refCode }}}
        }
      }
      this.setState({
        project: update(this.state.project, updateQuery),
        dirtyProject: update(this.state.dirtyProject, updateQuery),
        wizardStep,
        isProjectDirty: false
      }, () => {
        typeof onStepChange === 'function' && onStepChange(this.state.wizardStep)
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { onStepChange, createdProject } = nextProps
    // redirect user to project details form, if we already have type and project available
    const updateQuery = {}
    let wizardStep

    if (createdProject) {
      wizardStep = WZ_STEP_PROJECT_SUBMITTED
    }
    // if wizard step deduced above and stored in state are not the same, update the state
    if (wizardStep && this.state.wizardStep !== wizardStep) {
      this.setState({
        project: update(this.state.project, updateQuery),
        dirtyProject: update(this.state.dirtyProject, updateQuery),
        wizardStep
      }, () => {
        typeof onStepChange === 'function' && onStepChange(this.state.wizardStep)
      })
    }
  }

  /**
   * Loads incomplete project from the local storage and populates the state from that project.
   * It also moves the wizard to the project details step if there exists an incomplete project.
   */
  loadIncompleteProject() {
    const { onStepChange, onProjectUpdate } = this.props
    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    if(incompleteProjectStr) {
      const incompleteProject = JSON.parse(incompleteProjectStr)
      this.setState({
        project: update(this.state.project, { $merge : incompleteProject }),
        dirtyProject: update(this.state.dirtyProject, { $merge : incompleteProject }),
        wizardStep: WZ_STEP_FILL_PROJ_DETAILS
      }, () => {
        typeof onProjectUpdate === 'function' && onProjectUpdate(this.state.dirtyProject, false)
        typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.dirtyProject)
      })
    }
  }

  getRefCodeFromURL() {
    return _.get(qs.parse(window.location.search), 'refCode', '').trim().substr(0, PROJECT_REF_CODE_MAX_LENGTH)
  }

  /**
   * Removed incomplete project from the local storage and resets the state. Also, moves wizard to the first step.
   */
  removeIncompleteProject() {
    const { onStepChange } = this.props
    // remove incomplete project from local storage
    window.localStorage.removeItem(LS_INCOMPLETE_PROJECT)
    window.localStorage.removeItem(LS_INCOMPLETE_WIZARD)
    // following code assumes that componentDidMount has already updated state with correct project
    const projectType = _.get(this.state.project, 'type')
    const projectTemplateId = _.get(this.state.project, 'templateId')
    let wizardStep = WZ_STEP_FILL_PROJ_DETAILS
    let project = null
    if (projectTemplateId) {
      project = { type: projectType, templateId: projectTemplateId }
      wizardStep = WZ_STEP_FILL_PROJ_DETAILS
    }
    const refCode = this.getRefCodeFromURL()
    if (refCode) {
      project.details.utm = { code : refCode}
    }
    this.setState({
      project: _.merge({}, project),
      dirtyProject: _.merge({}, project),
      wizardStep
    }, () => {
      typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.project)
    })
  }

  updateProjectRef(projectRef) {
    const details = _.get(this.state.project, 'details.utm.code')
    let updateQuery = { details: { utm : { code : {$set : projectRef }}}}
    if (!details) {
      updateQuery = { details: { $set : { utm : { code : projectRef }}}}
    }
    this.setState({
      project: update(this.state.project, updateQuery),
      dirtyProject: update(this.state.project, updateQuery)
    })
  }

  updateProjectTemplate(projectTemplate) {
    window.scrollTo(0, 0)
    const { onStepChange, onProjectUpdate } = this.props
    const updateQuery = {}
    if (projectTemplate) {
      updateQuery.type = { $set : projectTemplate.category }
      updateQuery.templateId = { $set: projectTemplate.id }
    }
    this.setState({
      project: update(this.state.project, updateQuery),
      dirtyProject: update(this.state.project, updateQuery),
      wizardStep: WZ_STEP_FILL_PROJ_DETAILS,
    }, () => {
      typeof onProjectUpdate === 'function' && onProjectUpdate(this.state.dirtyProject, false)
      typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.dirtyProject)
    })
  }

  handleProjectChange(change) {
    const { onProjectUpdate } = this.props
    this.setState({
      // update only dirtyProject when Form changes the model
      dirtyProject: _.mergeWith({}, this.state.dirtyProject, unflatten(change),
        // customizer to override array value with changed values
        (objValue, srcValue, key) => {// eslint-disable-line no-unused-vars
          if (_.isArray(srcValue)) {
            return srcValue// srcValue contains the changed values from action payload
          }
        }
      ),
      isProjectDirty: true
    }, () => {
      typeof onProjectUpdate === 'function' && onProjectUpdate(this.state.dirtyProject)
    })
  }

  handleOnCreateProject(model) {
    // add templateId and type to the saved project form
    _.set(model, 'templateId', _.get(this.state.dirtyProject, 'templateId'))
    _.set(model, 'type', _.get(this.state.dirtyProject, 'type'))
    this.props.createProject(model)
  }

  handleStepChange(wizardStep) {
    this.setState({
      wizardStep
    })
  }

  render() {
    const { processing, showModal, forms, template:{template} } = this.props
    const { project, dirtyProject, wizardStep } = this.state


    return (
      <Wizard
        showModal={showModal}
        className="ProjectWizard"
        onStepChange={ this.handleStepChange }
        step={wizardStep}
      >
        <IncompleteProjectConfirmation
          loadIncompleteProject={ this.loadIncompleteProject }
          removeIncompleteProject={ this.removeIncompleteProject }
        />
        <FillProjectDetails
          project={ project }
          projectTemplate={ template }
          productTemplates={forms.productTemplates}
          productCategories={forms.productCategories}
          dirtyProject={ dirtyProject }
          processing={ processing}
          onCreateProject={ this.handleOnCreateProject }
          onProjectChange={ this.handleProjectChange }
          submitBtnText="Continue"
        />
        <div />
        <ProjectSubmitted />
      </Wizard>
    )
  }
}

ProjectWizard.propTypes = {
  /**
   * Callback to create project. Called when the wizard finishes its last step.
   */
  createProject: PropTypes.func.isRequired,
  /**
   * Callback called on every step change in the wizard.
   */
  onStepChange: PropTypes.func,
  /**
   * Callback called for every change in project details.
   */
  onProjectUpdate: PropTypes.func,
  /**
   * Flag which indicates that a project creation is in progress.
   */
  processing: PropTypes.bool.isRequired,
  /**
   * templates
   */
  forms: PropTypes.object.isRequired,
  /**
     * template
     */
  template: PropTypes.object.isRequired,
}


ProjectWizard.Steps = {
  WZ_STEP_INCOMP_PROJ_CONF,
  WZ_STEP_FILL_PROJ_DETAILS,
  WZ_STEP_ERROR_CREATING_PROJ,
  WZ_STEP_PROJECT_SUBMITTED
}

export default withRouter(ProjectWizard)
