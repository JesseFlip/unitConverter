const convertBtn = document.getElementById('convert-btn')

let userInput = document.getElementById('user-input')
let lengthPEl = document.getElementById('length-p')
let volumePEl = document.getElementById('volume-p')
let massPEl = document.getElementById('mass-p')
let inputValue = userInput.value

convertBtn.addEventListener('click', function () {
    lengthPEl.textContent = userInput.value + " meters = " +(userInput.value / 0.3048).toFixed(3) + " feet | " + userInput.value + " feet = " + (userInput.value * 0.3048).toFixed(3) + " meters"
    volumePEl.textContent = userInput.value + " liters = " +(userInput.value * 0.264172).toFixed(3) + " gallons | " + userInput.value + " gallons = " + (userInput.value / 0.264172).toFixed(3) + " liters"
    massPEl.textContent = userInput.value + " kilos = " +(userInput.value / 0.45359237).toFixed(3) + " pounds | " + userInput.value + " pounds = " + (userInput.value * 0.45359237).toFixed(3) + " kilos"
})