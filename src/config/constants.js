// Metadata

export const LOAD_METADATA = 'LOAD_METADATA'

// Template

export const LOAD_TEMPLATE = 'LOAD_TEMPLATE'
export const LOAD_TEMPLATE_PENDING = 'LOAD_TEMPLATE_PENDING'
export const LOAD_TEMPLATE_SUCCESS = 'LOAD_TEMPLATE_SUCCESS'
export const LOAD_TEMPLATE_FAILURE = 'LOAD_TEMPLATE_FAILURE'


// Form submit
export const SUBMIT_FORM = 'SUBMIT_FORM'
export const SUBMIT_FORM_PENDING = 'SUBMIT_FORM_PENDING'
export const SUBMIT_FORM_SUCCESS = 'SUBMIT_FORM_SUCCESS'
export const SUBMIT_FORM_FAILURE = 'SUBMIT_FORM_FAILURE'


export const SEGMENT_KEY = process.env.CONNECT_SEGMENT_KEY
/*
 * URLs
 */
export const FORMS_API_URL = process.env.FORMS_API_URL

export const DOMAIN = process.env.domain || 'topcoder.com'

export const CONNECT_DOMAIN = `connect.${DOMAIN}`


export const PROJECT_NAME_MAX_LENGTH = 255
export const PROJECT_REF_CODE_MAX_LENGTH = 32
export const BUSINESS_UNIT_MAX_LENGTH = 20
export const COST_CENTRE_MAX_LENGTH = 20

export const PROJECT_MAX_COLORS = 5



export const LS_INCOMPLETE_PROJECT = 'incompleteProject'
export const LS_INCOMPLETE_WIZARD = 'incompleteWizard'


export const NEW_PROJECT_PATH = '/forms'

// Analytics constants
export const GA_CLICK_ID  = '_gclid'
export const GA_CLIENT_ID = '_gacid'

// 60px of primary toolbar height + 50px of secondary toolbar height + 10px to make some margin
export const SCROLL_TO_MARGIN = 60 + 50 + 10
export const SCROLL_TO_DURATION = 500 // ms


// Screen breakpoints
export const SCREEN_BREAKPOINT_LG = 1360
export const SCREEN_BREAKPOINT_RG = 992
export const SCREEN_BREAKPOINT_MD = 768
export const SCREEN_BREAKPOINT_SM = 640
export const SCREEN_BREAKPOINT_XS = 320

