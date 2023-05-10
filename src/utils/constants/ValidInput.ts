export const validRegex = /^[a-zA-Z0-9\-_ ]*$/i

export const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

export const validZip = /^\d{5}(?:[-\s]\d{4})?$/i

export const validNumberSimple = /^\+?[1-9][0-9]{7,14}$/

export const validNumberComplex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/ 