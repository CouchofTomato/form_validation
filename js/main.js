'use strict'

const validations = {
    email: {
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
    email_confirmation: {
        matches: "email"
    },
    country: {
        required: true
    },
    postcode: {
        required: true
    },
    password: {
        minlength: 6,
        maxlength: 12,
        required: true
    },
    password_confirmation: {
        matches: "password"
    }
}

function pattern(input, e) {
    let matcher = input.test(e)
    if(matcher) {
        return
    } else {
        return {
            msg: "is not valid"
        }
    }
}

function required(input, e) {
    if (e.length > 0) {
        return
    } else {
        return {
            msg: "this field is required"
        }
    }
}

function minlength(input, e) {
    let value = e.length
    if (value >= input) {
        return
    } else {
        return {
            msg: "this field needs to be at least " + input + " characters long"
        }
    }
}

function maxlength(input, e) {
    let value = e.length
    if (value <= input) {
        return
    } else {
        return {
            msg: "this field needs to be less than " + input + " characters long"
        }
    }
}

function matches(input, e) {
    let otherEl = document.getElementById(input).value
    if (e === otherEl) {
        return
    } else {
        return {
            msg: "does not match " + input
        }
    }
    
}

const addResponse = (responses, input) => {
    let inputEl = document.getElementById(input)
    inputEl.classList.add('input-error')
    let errorEl = inputEl.nextElementSibling
    if (!errorEl.classList.contains('errors')) {
        let nextEl = inputEl.nextElementSibling
        errorEl = document.createElement('div')
        errorEl.classList.add('errors')
        nextEl.parentNode.insertBefore(errorEl, nextEl)
    }
    errorEl.innerHTML = ''
    responses.forEach(response => {
        let newDiv = document.createElement('div')
        newDiv.innerHTML = response.msg
        newDiv.classList.add('error')
        errorEl.appendChild(newDiv)
    })
}

const removeErrorDiv = (input) => {
    let el = document.getElementById(input)
    el.classList.remove('input-error')
    let nextEl = el.nextElementSibling
    if (nextEl.classList.contains('errors')) {
        nextEl.parentNode.removeChild(nextEl)
    }
}

const validators = (input, value) => {
    let keys = Object.keys(validations[input])
    let errorMessages = []
    keys.forEach(key => {
        let fn = window[key]
        let response = fn(validations[input][key], value)
        if (response) {
            errorMessages.push(response)
        }
    })
    if (errorMessages.length > 0) {
        addResponse(errorMessages, input)
    } else {
        removeErrorDiv(input)
    }
    return errorMessages
}

const validate = (e) => {
    let input = e.target.name
    if (!input) return
    validators(input, e.target.value)
}

const validateAll = (e) => {
    let errors = document.getElementsByClassName('errors')
    let errorsArray = []
    if (errors) {
        e.preventDefault()
        let inputs = document.getElementsByTagName('input')
        inputs = Array.from(inputs)
        inputs.forEach(input => {
            if (input.id === "submit") return
            let el = document.getElementById(input.id).value
            let theInput = input.id
            errorsArray.push(validators(theInput, el))
        })
    }
    errors = document.getElementsByClassName('errors')
    if(errors.length === 0) {
        let el = document.getElementById('container')
        let div = document.createElement('div')
        div.innerHTML = "Well done. This form is rocking"
        div.classList.add('success')
        el.appendChild(div)
    }
    
}

document.addEventListener('blur', validate, true)
let submitButton = document.getElementById('submit')
submitButton.addEventListener('click', validateAll, false)