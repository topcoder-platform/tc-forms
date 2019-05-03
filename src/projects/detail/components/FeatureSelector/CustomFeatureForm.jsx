import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import Panel from '../../../../components/Panel/Panel'
import DeleteFeatureModal from './DeleteFeatureModal'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
const Formsy = FormsyForm.Formsy
import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'
import IconUIPencil from  '../../../../assets/icons/icon-ui-pencil.svg'
import IconUITrashSimple from  '../../../../assets/icons/icon-ui-trash-simple.svg'


require('./FeatureForm.scss')

class CustomFeatureForm extends Component {

  constructor(props) {
    super(props)
    this.toggleFeature = this.toggleFeature.bind(this)
    this.state = { showDeleteModal : false, editMode : false }
    this.onSave = this.onSave.bind(this)
    this.editFeature = this.editFeature.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onDeleteIntent = this.onDeleteIntent.bind(this)
    this.onCancelDelete = this.onCancelDelete.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.featureData,
      isAdded: !!nextProps.featureData,
      isActive: !!nextProps.featureData && !nextProps.featureData.disabled,
      showDeleteModal: false
    })
  }

  toggleFeature() {
    const { toggleFeature, isEdittable } = this.props
    if (isEdittable) {
      toggleFeature(this.state.data.id, !!this.state.isActive)
    }
  }

  editFeature() {
    this.setState({
      editMode : true
    })
  }

  onDelete(data) {
    this.props.removeFeature(data.id)
  }

  onDeleteIntent() {
    this.setState({ showDeleteModal : true})
  }

  onCancelDelete() {
    this.setState({ showDeleteModal : false})
  }

  onSave(data) {
    const { featureData } = this.props
    this.props.addFeature(_.merge({
      id: data.title.toLowerCase().replace(/\s/g, '_'),
      categoryId: 'custom',
      notes: ''
    }, featureData, { title : data.title.trim() }))
    // assumes addFeature to be a synchronous call, otherwise it could lead to inconsistent UI state 
    // e.g. if async addFeature fails, it would close the edit mode
    // this call is needed here because debounce call (for notes change) is closing the edit mode if
    // we do set the editMode in componentWillReceiveProps method
    this.setState({ editMode : false })
  }

  onChange(data){
    const { featureData } = this.props
    // following check is needed to prevent adding the feature again after removing
    // because forms' onChange event gets fire with only form data when we lose focus from the form
    // alternative to this check is to put the change handler on textarea instead of form
    if (featureData) {// feature is already added
      // trim the notes (as of now only notes field is auto updated)
      data.notes = data.notes.trim()
      this.props.updateFeature(_.merge({}, featureData, data))
    }
  }

  render() {
    const { isEdittable, onCancel } = this.props
    const { data, isAdded, editMode, isActive, showDeleteModal } = this.state
    // const _debouncedOnChange = _.debounce(this.onChange, 2000, { trailing: true, maxWait: 10000 })
    const formClasses = cn('feature-form', {
      'modal-active': showDeleteModal
    })
    return (
      <Panel className={ formClasses }>
        { (isAdded && !editMode) &&
          <div className="feature-title-row">
            <span className="title">{ _.get(data, 'title', 'Define a new feature')}</span>
            <div className="feature-actions">
              { isAdded &&
                  <SwitchButton
                    disabled={!isEdittable}
                    onChange={ this.toggleFeature }
                    name="featue-active"
                    checked={isActive ? 'checked' : null }
                    label="Enable Feature"
                  />
              }
              <div className="separator"/>
              <button className="clean feature-edit-action" onClick={ this.editFeature }><IconUIPencil /></button>
              <button className="clean feature-delete-action" onClick={ this.onDeleteIntent }><IconUITrashSimple /></button>
            </div>
          </div>
        }
        <div className="feature-form-content">
          <Formsy.Form className="custom-feature-form" disabled={!isEdittable} onChange={ this.onChange } onValidSubmit={ this.onSave }>
            { (!isAdded || editMode)  &&
              <TCFormFields.TextInput
                name="title"
                label="Feature name"
                validations="isRequired" required
                validationError="Feature name is required"
                wrapperClass="row"
                maxLength={40}
                value={ _.get(data, 'title', '') }
              />
            }
            { (isActive && !editMode) ?
              <TCFormFields.Textarea
                name="notes"
                label="Feature Notes"
                wrapperClass="feature-notes"
                value={ _.get(data, 'notes', '') }
              />
              : null
            }
            <div className="feature-form-actions">
              { (!isAdded || editMode) && <button type="button" className="tc-btn tc-btn-default tc-btn-md" onClick={ onCancel }>Cancel</button> }
              { (!isAdded || editMode) && <button type="submit" className="tc-btn tc-btn-primary tc-btn-md" disabled={!isEdittable}>Save Feature</button> }
            </div>
          </Formsy.Form>
        </div>
        <div className="modal-overlay" />
        { showDeleteModal &&
          <div className="delete-feature-modal">
            <DeleteFeatureModal
              feature={ data }
              onCancel={ this.onCancelDelete }
              onConfirm={ this.onDelete }
            />
          </div>
        }
      </Panel>
    )
  }
}

CustomFeatureForm.PropTypes = {
  isEdittable: PropTypes.bool.isRequired,
  featureData: PropTypes.object.isRequired,
  updateFeature: PropTypes.func.isRequired,
  removeFeature: PropTypes.func.isRequired,
  addFeature: PropTypes.func.isRequired
}

export default CustomFeatureForm
