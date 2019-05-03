/**
 * Project template actions
 */
import {
  LOAD_TEMPLATE,
} from '../config/constants'
import {
  getTemplate,
} from '../api/template'

//Load project template
export function loadTemplate(templateId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_TEMPLATE,
      payload: getTemplate(templateId)
    })
  }
}
