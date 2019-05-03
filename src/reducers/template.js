
import _ from 'lodash'
import {
  LOAD_TEMPLATE_PENDING,
  LOAD_TEMPLATE_SUCCESS,
  LOAD_TEMPLATE_FAILURE
} from '../config/constants'


export const initialState = {
  template: null,
  isLoading: false,
  error: false,
}

export default function(state = initialState, action) {
  switch (action.type) {
  case LOAD_TEMPLATE_PENDING:
    return {
      ...state,
      isLoading: true
    }
  case LOAD_TEMPLATE_SUCCESS: {
    const template = action.payload
    return {
      ...state,
      template,
      isLoading: false,
    }
  }
  case LOAD_TEMPLATE_FAILURE: {
    return {
      ...state,
      isLoading: false,
      error: _.get(action.payload, 'response.data.message')
    }
  }
  default: return state
  }
}
