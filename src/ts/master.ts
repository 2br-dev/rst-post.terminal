
import Keyboard from './lib/screen-keyboard';

let kb:Keyboard;
let focusedInput:HTMLInputElement | HTMLTextAreaElement;

// Заполняем список лет
function fillYears()
{
	let currentYear = new Date().getFullYear();
	let min = currentYear - 70;
	let max = currentYear - 14;

	document.querySelectorAll('[name="year"]').forEach(el => {
		
		let parent = $(el).parents('.combo-field').get(0);
		let yearUl = parent.querySelector('ul');

		for(let i = max; i > min; i--)
		{
			if(yearUl)
			{
				let el = document.createElement('li');
				el.classList.add('touchable');
				el.dataset['val'] = i.toString();
				el.innerText = i.toString();
				el.onclick = setYear;
				yearUl.appendChild(el);
			}
		}
	})
}

// Заполняем список дней
function fillDays()
{
	document.querySelectorAll('[name="day"]').forEach(el => {

		let parentElement = el.parentElement;

		// Получаем год
		let selectedYear:number = parseInt((<HTMLInputElement>document.querySelector('[name="year"]')).value);
		let currentYear:number = new Date().getFullYear();
		let year:number = isNaN(selectedYear) ? currentYear : selectedYear;

		// Получаем месяц
		let selectedMonth:number = parseInt((<HTMLInputElement>document.querySelector('[name="month"]')).value);
		let currentMonth:number = new Date().getMonth();
		let month = isNaN(selectedMonth) ? currentMonth : selectedMonth;
		
		// Получаем количество дней в этом месяце
		let daysCount = new Date(year, month, 0).getDate();

		// Получаем выбранный день
		let selectedDay:number = parseInt((<HTMLInputElement>document.querySelector('[name="day"]')).value);
		if(selectedDay > daysCount)
		{
			(<HTMLInputElement>document.querySelector('[name="day"]')).value = daysCount.toString();
			(<HTMLDivElement>parentElement.querySelector('.current')).innerText = daysCount.toString();
		}

		// Очищаем список дней
		let dayUl = el.parentElement?.querySelector('ul');
		dayUl.innerHTML = "";
		
		for(let i:number=1; i<=daysCount; i++)
		{
			let dayEl = document.createElement("li");
			dayEl.classList.add('touchable');
			dayEl.innerText = i.toString();
			dayEl.dataset['val'] = i.toString();
			dayEl.onclick = setDay;
			
			dayUl?.appendChild(dayEl);
		}

		// Восстанавливаем события
		document.querySelectorAll('.touchable').forEach(el => {
			el.addEventListener('touchstart', touchStart);
		});
	
		document.querySelectorAll('.touchable').forEach(el => {
			el.addEventListener('touchend', touchEnd);
		});
	})
}

// Установка дня
function setDay(e:MouseEvent)
{
	let selectedDay = this.dataset['val'];
	let currentEl = this.parentElement.parentElement.querySelector('.current');
	let currentInput = this.parentElement.parentElement.querySelector('[type="hidden"]');

	currentEl.innerText = selectedDay;
	currentInput.value = selectedDay;

	currentEl.classList.add('settled');
	(<HTMLDivElement>this.parentElement.parentElement).classList.remove('hover');
}

// Установка месяца
function setMonth(e:MouseEvent)
{
	let currentEl = this.parentElement.parentElement.querySelector('.current');
	let currentInputEl = (<HTMLInputElement>this.parentElement.parentElement.querySelector('[type="hidden"]'));
	
	let selectedText = this.innerText;
	let selectedValue = this.dataset['val'];

	currentInputEl.value = selectedValue;
	currentEl.classList.add('settled');
	currentEl.innerText = selectedText;

	this.parentElement.parentElement.classList.remove('hover');

	fillDays();
}

// Установка года
function setYear(e:MouseEvent)
{
	let currentContainer = this.parentElement.parentElement.querySelector('.current');
	let yearInput = currentContainer.parentElement.querySelector('[type="hidden"]');

	currentContainer.innerText = this.dataset['val'];
	currentContainer.classList.add('settled');

	yearInput.value = this.dataset['val'];

	(<HTMLDivElement>currentContainer.parentElement).classList.remove('hover');
	fillDays();
}

// Кликабельные элементы – нажатие
function touchStart(e:TouchEvent)
{
	this.classList.add('pressed');
}

// Кликабельные элементы – отпускание
function touchEnd(e:TouchEvent)
{
	this.classList.remove('pressed');
}

// Поворот флипера цены
function priceShowFlip(e:MouseEvent)
{
	let el = e.currentTarget;
	let $parent = $(el).parents('.price-flipper');
	$parent.addClass('counter-shown');
}

// Добавление элемента в корзину
function increaseCount(e:MouseEvent)
{
	let el = e.currentTarget;
	let $parent = $(el).parents('.price-flipper');

	let input = <HTMLInputElement>$parent.find('input[type="number"]').get(0);
	let value = parseInt(input.value);
	
	value ++;

	input.value = value.toString();
}

// Удаление элемента из корзины (-1)
function decreaseCount(e:MouseEvent)
{
	let el = e.currentTarget;
	let $parent = $(el).parents('.price-flipper');

	let input = <HTMLInputElement>$parent.find('input[type="number"]').get(0);
	let value = parseInt(input.value);
	
	value --;

	if( value >= 1 ){
		input.value = value.toString();
	}else{
		$parent.removeClass('counter-shown');
	}

}

(() => {
	
	fillYears(); //Заполняем годы
	fillDays(); //Заполняем дни

	kb = new Keyboard(); //Создание клавиатуры

	// Клавиатура – отработка нажатия
	kb.onKeyPress = char => {
	
		focusedInput.focus();
	
		if (char)
		{
			let cursor = focusedInput.selectionStart;
			let start = focusedInput.value.substring(0, cursor);
			let end = focusedInput.value.substring(cursor);
			let final = start + char + end;
			focusedInput.value = final;
			focusedInput.selectionStart = cursor + 1;
			focusedInput.selectionEnd = cursor + 1;
		}
	
	}
	
	// Клавиатура – отработка удаления символа
	kb.onErase = () => {
		let cursor = focusedInput.selectionStart;
		let start = focusedInput.value.substring(0, cursor - 1);
		let end = focusedInput.value.substring(cursor);
		let final = start + end;
		focusedInput.value = final;
		focusedInput.selectionStart = cursor - 1;
		focusedInput.selectionEnd = cursor - 1;
	}

	document.querySelectorAll('.touchable').forEach(el => {
		el.addEventListener('touchstart', touchStart);
	});

	document.querySelectorAll('.touchable').forEach(el => {
		el.addEventListener('touchend', touchEnd);
	});

	document.querySelectorAll('.price-flip-trigger').forEach(el => {
		el.addEventListener('click', priceShowFlip);
	});

	// Увеличение количества в карточке
	document.querySelectorAll('.price-increase').forEach(el => {
		el.addEventListener('click', increaseCount);
	});

	// Уменьшение количества в карточке
	document.querySelectorAll('.price-decrease').forEach(el => {
		el.addEventListener('click', decreaseCount);
	});

	// Вызов экранной клавиатуры
	document.querySelectorAll('input[type="text"]').forEach(element => {

		element.addEventListener("focus", evt => {

			focusedInput = <HTMLInputElement>evt.currentTarget;
			kb.onOpenEnd = () => {
				focusedInput.focus();
			}
			kb.open();
		});
	});

	// Вызов экранной клавиатуры
	document.querySelectorAll('textarea').forEach(element => {

		element.addEventListener("focus", evt => {

			focusedInput = <HTMLTextAreaElement>evt.currentTarget;
			kb.onOpenEnd = () => {
				focusedInput.focus();
			}
			kb.open();
		});
	});

	// Закрытие клавиатуры при тапе мимо
	document.onclick = e => {
		let path = e.composedPath();
		
		let filter = path.filter(el => {
			if((<HTMLElement>el).tagName == "INPUT" || (<HTMLElement>el).tagName == "TEXTAREA")
			{
				return el;
			}else{
				if((<HTMLDivElement>el).classList)
				{
					return (<HTMLDivElement>el).classList.contains('key') || (<HTMLDivElement>el).classList.contains('screen-keyboard');
				}else{
					return null;
				}
			}
		});

		let comboboxFilter = path.filter(el => {

			if((<HTMLElement>el).classList)
			{
				return (<HTMLElement>el).classList.contains('combo-field');
			}
		})

		if(!filter.length)
		{
			kb.close();
		}

		if(!comboboxFilter.length)
		{
			document.querySelectorAll('.combo-field').forEach(el => {
				el.classList.remove('hover');
			})
		}
	}

	// Раскрытие выпадающего списка
	document.querySelectorAll('.combo-field .current').forEach(el => {
		(<HTMLDivElement>el).onclick = (e:MouseEvent) => {

			document.querySelectorAll('.combo-field.hover').forEach(el => {
				el.classList.remove('hover');
			})

			let field = (<HTMLDivElement>e.currentTarget).parentElement;
			field?.classList.add('hover');
		}
	});

	// Установка выбранного элемента выпадающего списка
	document.querySelectorAll('.combo-field.month li').forEach(el => {
		el.addEventListener('click', setMonth)
	});

	// Предотвращение контекстного меню
	document.addEventListener("contextmenu", (e) => {e.preventDefault()});
})();