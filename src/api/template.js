/**
 * Template api service
 */
import axios from 'axios'
import {FORMS_API_URL} from '../config/constants'

/**
 * Get template
 *
 * @return {Promise} template
 */
export function getTemplate(id) {
  return axios.get(`${FORMS_API_URL}/template/${id}`)
    .then(resp => resp.data)
}
