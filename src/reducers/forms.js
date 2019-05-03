
import _ from 'lodash'
import {
  LOAD_METADATA,
  SUBMIT_FORM_PENDING,
  SUBMIT_FORM_SUCCESS,
  SUBMIT_FORM_FAILURE
} from '../config/constants'


export const initialState = {
  productTemplates: null,
  productCategories: null,
  error: false,
  submitting: false,
  submitSuccess: false
}

export default function(state = initialState, action) {
  switch (action.type) {
  case LOAD_METADATA: {
    const { productTemplates, productCategories } = action.payload
    return {
      ...state,
      productTemplates: _.orderBy(productTemplates, ['updatedAt'], ['desc']),
      productCategories: _.orderBy(productCategories, ['updatedAt'], ['desc']),
      isLoading: false,
    }
  }

  case SUBMIT_FORM_PENDING: {
    return {
      ...state,
      submitting: true,
      submitSuccess:  false,
    }
  }

  case SUBMIT_FORM_SUCCESS: {
    return {
      ...state,
      submitting: false,
      submitSuccess:  true
    }
  }

  case SUBMIT_FORM_FAILURE: {
    return {
      ...state,
      submitting: false,
      submitSuccess:  false,
      error:  _.get(action.payload, 'response.data.message')
    }
  }
  default: return state
  }
}
