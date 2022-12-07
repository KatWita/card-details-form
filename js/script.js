const nameInput = document.querySelector('#name');
const cardInput = document.querySelector('#card');
const monthInput = document.querySelector('#month');
const yearInput = document.querySelector('#year');
const cvcInput = document.querySelector('#cvc');
const confirmBtn = document.querySelector('.btn-confirm');
const continueBtn = document.querySelector('.btn-continue');
const complete = document.querySelector('.complete');
const form = document.querySelector('.form');

const inputs = [nameInput, cardInput, monthInput, yearInput, cvcInput];

const showError = (input, msg) => {
	const inputBox = input.closest('.form__input-box');
	const errorMsg = inputBox.querySelector('.form__error');

	inputBox.classList.add('error');
	errorMsg.textContent = msg;
};

const clearError = (input) => {
	const inputBox = input.closest('.form__input-box');
	const errorMsg = inputBox.querySelector('.form__error');
	inputBox.classList.remove('error');
	errorMsg.textContent = '';
};

const checkForm = (inputs) => {
	inputs.forEach((input) => {
		if (input.value === '') {
			showError(input, `Can't be blank`);
		} else {
			clearError(input);
		}
	});
};

const checkName = (input) => {
	const re = /\b[^\d\W]+\b/g;

	if (re.test(input.value)) {
		clearError(input);
	} else if (input.value === '') {
		showError(input, `Can't be blank`);
	} else {
		showError(input, 'Please use only letters');
	}
};

const checkNum = (input, min, num) => {
	if (parseInt(input.value) > min) {
		showError(input, `Choose ${num}-${min}!`);
	} else if (input.value === '') {
		showError(input, `Can't be blank`);
	} else {
		clearError(input);
	}
};

const checkLength = (input, min) => {
	if (input.value.length < min && input.value.length > 0) {
		showError(
			input,
			`${input.previousElementSibling.textContent} must have at least ${min} characters.`
		);
	}
};

const handleError = () => {
	const errorYears = document.querySelector('.form__error--years');
	const errorMonth = document.querySelector('.form__error--month');

	if (errorYears.textContent == errorMonth.textContent) {
		errorYears.textContent = '';
	} else if (errorMonth.textContent === '') {
		errorYears.style.left = '-110.15%';
	} else {
		errorYears.style.left = '0';
	}
};

const checkErrors = () => {
	const allInputs = document.querySelectorAll('.form__input-box');
	let errorCount = 0;

	allInputs.forEach((el) => {
		if (el.classList.contains('error')) {
			errorCount++;
		}
	});
	if (errorCount === 0) {
		form.style.display = 'none';
		complete.style.display = 'grid';
	}
};

const formatCardNumber = (card) => {
	return card.toString().replace(/\d{4}(?=.)/g, '$& ');
};

const reloadWindow = () => {
	window.location.reload();
};

// ------------------ LISTENERS ------------------ //
confirmBtn.addEventListener('click', (e) => {
	e.preventDefault();

	checkForm(inputs);
	checkName(nameInput);
	checkNum(monthInput, 12, 1);
	checkNum(yearInput, 24, 0);
	checkLength(nameInput, 4);
	checkLength(cardInput, 19);
	handleError();
	checkErrors();
});

inputs.forEach((input) => {
	input.addEventListener('keyup', (e) => {
		const pressedKey = e.target.value;
		const targetsId = e.target.id;
		const cardInputs = document.querySelectorAll('.card-input');

		cardInputs.forEach((el) => {
			if (targetsId === el.dataset.id) {
				if (el.dataset.id === 'card') {
					el.textContent = formatCardNumber(pressedKey);
				} else if (
					(el.dataset.id === 'month' && pressedKey.length < 2) ||
					(el.dataset.id === 'year' && pressedKey.length < 2) ||
					(el.dataset.id === 'cvc' && pressedKey.length === 2)
				) {
					el.textContent = `0${pressedKey}`;
				} else if (el.dataset.id === 'cvc' && pressedKey.length === 1) {
					el.textContent = `00${pressedKey}`;
				} else {
					el.textContent = pressedKey;
				}

				if (pressedKey.length === 0) {
					el.textContent = input.dataset.default;
				}
			}
		});
	});
});

[cardInput, monthInput, yearInput, cvcInput].forEach((input) => {
	input.addEventListener('input', (e) => {
		e.target.value = e.target.value = e.target.value
			.replace(/[^\dA-Z]/g, '')
			.replace(/(.{4})/g, '$1 ')
			.trim();
	});
});

continueBtn.addEventListener('click', reloadWindow);
