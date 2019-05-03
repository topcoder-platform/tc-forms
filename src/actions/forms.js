/**
 * Project and product templates actions
 */

import {
  LOAD_METADATA,
  SUBMIT_FORM,
} from '../config/constants'
import {
  submitForm
} from '../api/forms'
import metadataJSON from '../data/metadata'

// Load metadata
export function loadMetadata() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_METADATA,
      payload: metadataJSON
    })
  }
}

// Submit form
export function submit(submitURL, data) {
  return (dispatch) => {
    return dispatch({
      type: SUBMIT_FORM,
      payload: submitForm(submitURL, data)
    })
  }
}
