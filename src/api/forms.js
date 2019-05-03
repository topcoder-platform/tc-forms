/**
 * Forms API service
 */
import axios from 'axios'
import { FORMS_API_URL } from '../config/constants'

/**
 * Submit form data
 * @param submitURL URL for form submission
 * @param data The form data
 * @returns {Promise} response body
 */
export function submitForm(submitURL, data) {
  return axios.post(`${submitURL}`, data)
    .then(resp => resp.data)
}


