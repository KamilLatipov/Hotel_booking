const dropdowns = document.getElementsByClassName('dropdown');
Array.from(dropdowns).forEach((dropdown) => {
  initDropdown(dropdown);
});

function initDropdown(dropdown) {
  const inputField = dropdown.getElementsByClassName('dropdown__input-field');
  const inputFieldValues = inputField[0].getAttribute('data-input-field').split(';');
  const inputFieldPlaceholder = inputField[0].getAttribute('data-placeholder');
  const dropdownMenu = dropdown.getElementsByClassName('dropdown__menu');
  const dropdownParams = dropdown.getElementsByClassName('dropdown__parameter');
  const clearButton = dropdown.getElementsByClassName('dropdown__button-clr');
  const paramValues = [];
  const inputItems = {
    paramValues,
    inputFieldPlaceholder,
    inputFieldValues,
    inputField: inputField[0],
    clearButton: clearButton[0],
  };
  Array.from(dropdownParams).forEach((dropdownParam, index) => {
    inputItems.paramValues[index] = initDropdownParams(inputItems, dropdownParam);
    initAmountChangeButtons(index, inputItems, dropdownParam);
  });
  fillInputField(inputItems);

  window.addEventListener('click', handleOutsideDropdownClick);
  inputField[0].addEventListener('click', handleInputFieldClick);
  if (clearButton[0]) clearButton[0].addEventListener('click', handleClearButtonClick);

  function handleOutsideDropdownClick(event) {
    if (checkClickedOutsideDropdown(event, dropdown, dropdownMenu[0])) {
      inputField[0].classList.toggle('dropdown__input-field--active');
      dropdownMenu[0].classList.add('dropdown__menu--hidden');
    }
  }

  function handleInputFieldClick() {
    inputField[0].classList.toggle('dropdown__input-field--active');
    dropdownMenu[0].classList.toggle('dropdown__menu--hidden');
  }

  function handleClearButtonClick(event) {
    event.preventDefault();
    clearButton[0].classList.add('dropdown__button-clr--hidden');
    inputItems.paramValues.forEach((paramValue, index) => {
      paramValues[index] = 0;
    });
    clearParamInnerHtml(dropdownParams);
    fillInputField(inputItems);
  }
}

function checkClickedOutsideDropdown(event, dropdown, dropdownMenu) {
  return (!dropdown.contains(event.target) && !dropdownMenu.classList.contains('dropdown__menu--hidden'));
}

function initDropdownParams(inputItems, dropdownParam) {
  return (parseInt(getParamValue(dropdownParam), 10));
}

function clearParamInnerHtml(dropdownParams) {
  let dropdownParamValue = HTMLElement;
  let minusButton = HTMLElement;
  Array.from(dropdownParams).forEach((dropdownParam) => {
    dropdownParamValue = dropdownParam.getElementsByClassName('dropdown__num-value');
    minusButton = dropdownParam.getElementsByClassName('dropdown__minus-btn');
    dropdownParamValue[0].innerHTML = 0;
    changeMinusButtonAvailability(minusButton[0], false);
  });
}

function fillInputField({
  paramValues, inputFieldPlaceholder, inputFieldValues, inputField, clearButton,
}) {
  if (!checkTotalAmountIsZero(paramValues)) {
    inputField.placeholder = inputFieldPlaceholder;
    if (clearButton) clearButton.classList.add('dropdown__button-clr--hidden');
  } else {
    inputField.placeholder = getInputField(paramValues, inputFieldValues);
    if (clearButton && clearButton.classList.contains('dropdown__button-clr--hidden')) {
      clearButton.classList.remove('dropdown__button-clr--hidden');
    }
  }
}

function getParamValue(dropdownParam) {
  const paramNumValueElem = dropdownParam.getElementsByClassName('dropdown__num-value');
  const value = paramNumValueElem[0].innerHTML;

  return (value);
}

function checkTotalAmountIsZero(paramValues) {
  let count = 0;

  paramValues.forEach((value) => {
    count += parseInt(value, 10);
  });

  return (count);
}

function getInputField(paramValues, inputFieldValues) {
  let inputField = '';
  let sumAmount = 0;
  let suitableTextForm = '';
  let isComma = '';
  let i = 0;
  if (inputFieldValues.length < paramValues.length) {
    for (; i < paramValues.length - 1; i += 1) {
      sumAmount += parseInt(paramValues[i], 10);
    }
    suitableTextForm = findSuitableTextForm(inputFieldValues[0], sumAmount);
    inputField += suitableTextForm;
    if (paramValues[i] !== 0 && inputField !== '') {
      inputField += ', ';
    }
    suitableTextForm = findSuitableTextForm(inputFieldValues[1], paramValues[i]);
    inputField += suitableTextForm;
  } else {
    for (i = 0; i < paramValues.length; i += 1) {
      if (paramValues[i] !== 0 && inputField !== '') {
        isComma = ', ';
      } else {
        isComma = '';
      }
      suitableTextForm = findSuitableTextForm(inputFieldValues[i], paramValues[i]);
      inputField += isComma;
      inputField += suitableTextForm;
    }
  }
  inputField = limitInputFieldLength(inputField);
  return (inputField);
}

function findSuitableTextForm(textForms, paramValue) {
  const textFormsArr = textForms.split(',');
  const paramValueInt = parseInt(paramValue, 10);
  if (paramValueInt === 0) {
    return ('');
  }
  if (paramValueInt > 20) {
    return (`${paramValueInt} ${getSuitableForm(paramValueInt % 10, textFormsArr)}`);
  }

  return (`${paramValueInt} ${getSuitableForm(paramValueInt, textFormsArr)}`);
}

function getSuitableForm(paramValue, [firstForm, secondForm, thirdForm]) {
  let suitableTextForm = '';
  switch (paramValue) {
    case 1:
      suitableTextForm = firstForm;
      break;
    case 2:
    case 3:
    case 4:
      suitableTextForm = secondForm;
      break;
    default:
      suitableTextForm = thirdForm;
  }
  return (suitableTextForm);
}

function limitInputFieldLength(inputField) {
  let editedText = '';
  if (inputField.length > 23) {
    editedText = inputField.slice(0, 20);
    editedText += '...';
    return (editedText);
  }

  return (inputField);
}

function initAmountChangeButtons(index, inputItems, dropdownParam) {
  const minusButton = dropdownParam.getElementsByClassName('dropdown__minus-btn');
  const plusButton = dropdownParam.getElementsByClassName('dropdown__plus-btn');
  const paramNumValueElem = dropdownParam.getElementsByClassName('dropdown__num-value');

  if (inputItems.paramValues[index] === 0) {
    changeMinusButtonAvailability(minusButton[0], false);
  }
  minusButton[0].addEventListener('click', handleMinusButtonClick);
  plusButton[0].addEventListener('click', handlePlusButtonClick);

  function handleMinusButtonClick() {
    inputItems.paramValues[index] = parseInt(inputItems.paramValues[index], 10) - 1;
    if (inputItems.paramValues[index] <= 0) {
      inputItems.paramValues[index] = 0;
      changeMinusButtonAvailability(minusButton[0], false);
    }
    paramNumValueElem[0].innerHTML = inputItems.paramValues[index];
    fillInputField(inputItems);
  }
  function handlePlusButtonClick() {
    if (inputItems.paramValues[index] >= 0) {
      changeMinusButtonAvailability(minusButton[0], true);
    }
    inputItems.paramValues[index] = parseInt(inputItems.paramValues[index], 10) + 1;
    paramNumValueElem[0].innerHTML = inputItems.paramValues[index];
    fillInputField(inputItems);
  }
}

function changeMinusButtonAvailability(minusButton, isAvailable) {
  if (isAvailable) {
    minusButton.classList.remove('dropdown__small-btn--disabled');
  } else {
    minusButton.classList.add('dropdown__small-btn--disabled');
  }
}
