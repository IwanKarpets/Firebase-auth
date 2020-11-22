import './style.css'
import { createModal, isValid } from './util'
import { Question } from './question'
import { authWithEmailAndPassword, getAuthForm } from './auth'

const form = document.getElementById('form')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')
const modalBtn = document.getElementById('modal-btn')

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', ()=>{
    submitBtn.disabled = !isValid(input.value)
})

function submitHandler(e){
    e.preventDefault()
    if(isValid(input.value)){
        const question={
            text: input.value.trim(),
            date: new Date().toJSON()
        }
        submitBtn.disabled=true;
        Question.create(question ).then(()=>{
            input.value=''
            input.className=''
            submitBtn.disabled = false
        })
    }
}


function openModal(){
    createModal('Авторизация', getAuthForm())
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once:true})
}

function authFormHandler(e){
    e.preventDefault()

    const btn = e.target.querySelector('button')
    const email = e.target.querySelector('#email').value;
    const password = e.target.querySelector('#password').value;
    
    btn.disabled = true
    authWithEmailAndPassword(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(()=>btn.disabled=false)
}


function renderModalAfterAuth(content){
    if(typeof content === 'string'){
        createModal('Ошибка', content)
    }
    else{
        createModal('Список вопросов', Question.listToHTML(content))
    }
}