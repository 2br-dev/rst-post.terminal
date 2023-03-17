
import Keyboard from './lib/screen-keyboard';

let kb:Keyboard;
let focusedInput:HTMLInputElement | HTMLTextAreaElement;
let touched:boolean = false;
let touchX:number;
let touchY:number;
let startX:number;
let startY:number;

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

		let monthElement = <HTMLInputElement>document.querySelector('[name="month"]');
        let yearElement = <HTMLInputElement>document.querySelector('[name="year"]');

        if(monthElement.value == "" && yearElement.value==""){
            daysCount = 31;
        }

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
			let dayVal = i.toString();
			if(i<10){
                dayEl.dataset['val'] = '0'+dayVal;
            }else{
                dayEl.dataset['val'] = dayVal;
            }
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

    let monthValue = (<HTMLInputElement>document.querySelector('[name="month"]')).value;
    let yearValue = (<HTMLInputElement>document.querySelector('[name="year"]')).value;

    let elDateOfBirth = (<HTMLInputElement>document.querySelector('[name="userfields_arr[dateofbirth]"]'));

    if(monthValue != "" && yearValue != ""){
        elDateOfBirth.value = yearValue+'-'+monthValue+'-'+selectedDay;
    }else{
        elDateOfBirth.value = "";
    }

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

	let dayValue = (<HTMLInputElement>document.querySelector('[name="day"]')).value;
	let yearValue = (<HTMLInputElement>document.querySelector('[name="year"]')).value;

    let elDateOfBirth = (<HTMLInputElement>document.querySelector('[name="userfields_arr[dateofbirth]"]'));

	if(dayValue != "" && yearValue != ""){
        elDateOfBirth.value = yearValue+'-'+selectedValue+'-'+dayValue;
    }else{
        elDateOfBirth.value = "";
    }

	// currentInputEl.value = selectedValue;
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
	let selectedYear = this.dataset['val'];

    let monthValue = (<HTMLInputElement>document.querySelector('[name="month"]')).value;
    let dayValue = (<HTMLInputElement>document.querySelector('[name="day"]')).value;

    let elDateOfBirth = (<HTMLInputElement>document.querySelector('[name="userfields_arr[dateofbirth]"]'));

    if(monthValue != "" && dayValue != ""){
        elDateOfBirth.value = selectedYear+'-'+monthValue+'-'+dayValue;
    }else{
        elDateOfBirth.value = "";
    }

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
// function increaseCount(e:MouseEvent)
// {
// 	let el = e.currentTarget;
// 	let $parent = $(el).parents('.price-flipper');
//
// 	let input = <HTMLInputElement>$parent.find('input[type="number"]').get(0);
// 	let value = parseInt(input.value);
//
// 	value ++;
//
// 	input.value = value.toString();
// }

// Удаление элемента из корзины (-1)
// function decreaseCount(e:MouseEvent)
// {
// 	let el = e.currentTarget;
// 	let $parent = $(el).parents('.price-flipper');
//
// 	let input = <HTMLInputElement>$parent.find('input[type="number"]').get(0);
// 	let value = parseInt(input.value);
//
// 	value --;
//
// 	if( value >= 1 ){
// 		input.value = value.toString();
// 	}else{
// 		$parent.removeClass('counter-shown');
// 	}
//
// }

// Переключение экрана
function switchScreen(screen:number)
{

	let stepContainer = <HTMLDivElement>document.querySelector("[data-step]");

	let step1_text = "Каталог";
	let step1_link = "./catalog.html"
	let step1_header = "Корзина";
	
	let step2_text = "Корзина";
	let step2_link = "#!";
	let step2_header = "Оформление заказа";


	let backButton = <HTMLLinkElement>document.querySelector("#back-button");
	let backButton_text = <HTMLSpanElement>backButton.querySelector(".button-text");
	let header = <HTMLHeadingElement>document.querySelector('#cart-title');

	stepContainer.dataset['step'] = screen.toString();
	
	if( screen > 1 ){
		backButton_text.innerText = step2_text;
		backButton.href = step2_link;
		header.textContent = step2_header;
	}else{
		backButton_text.innerText = step1_text;
		backButton.href = step1_link;
		header.textContent = step1_header;
	}
}


document.addEventListener("DOMContentLoaded", function(event) {
	
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
	// document.querySelectorAll('.price-increase').forEach(el => {
	// 	el.addEventListener('click', increaseCount);
	// });
    //
	// // Уменьшение количества в карточке
	// document.querySelectorAll('.price-decrease').forEach(el => {
	// 	el.addEventListener('click', decreaseCount);
	// });

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

	// Переход на предыдущий экран
	// document.querySelector('#back-button')?.addEventListener('click', (evt:MouseEvent) => {
    //
	// 	let stepContainer = <HTMLDivElement>document.querySelector("[data-step]");
	// 	let currentStep = parseInt(stepContainer.dataset['step']);
    //
	// 	if(currentStep > 1)
	// 	{
	// 		evt.preventDefault();
	// 		switchScreen(1);
	// 	}
	// });

	// Переход на следующий экран
	// document.querySelector('#next-button')?.addEventListener('click', (evt:MouseEvent) => {
	// 	evt.preventDefault();
	// 	let stepContainer = <HTMLDivElement>document.querySelector("[data-step]");
	// 	// stepContainer.dataset['step'] = "2";
	// 	switchScreen(2);
	// })

	// Предотвращение контекстного меню
	document.addEventListener("contextmenu", (e) => {e.preventDefault()});

	// :::::::::::::::::::: Програмный скрол :::::::::::::::::::::::
	document.querySelectorAll('.overflow').forEach((overflow:HTMLElement) => {

		overflow.addEventListener('mousedown', (e:MouseEvent) => {
			touched = true;
			touchX = e.clientX;
			startX = e.clientX;
			touchY = e.clientY;
			startY = e.clientY;
		});
	});

	document.querySelectorAll('.overflow').forEach((overflow:HTMLElement) => {

		overflow.addEventListener('mousemove', (e:MouseEvent) => {
			if(touched){
				let el = e.currentTarget;
				(<HTMLElement>el).scrollTop -= (e.movementY * 2);
				(<HTMLElement>el).scrollLeft -= (e.movementX * 2);
				touchX = e.clientX;
				touchY = e.clientY;
			}
		});
	});

	document.querySelectorAll('.overflow').forEach((overflow:HTMLElement) => {

		overflow.addEventListener('mouseup', (e:MouseEvent) => {
			touched=false;
			setTimeout(() => {
				touchX = undefined;
				touchY = undefined;
				startX = undefined;
				startY = undefined;
			}, 80);
		});
	});

	document.querySelectorAll('.overflow').forEach((overflow:HTMLElement) => {

		overflow.addEventListener('mouseleave', (e:MouseEvent) => {
			touched=false;
			setTimeout(() => {
				touchX = undefined;
				touchY = undefined;
				startX = undefined;
				startY = undefined;
			}, 80);
		});
	});

	document.querySelectorAll('a').forEach((a:HTMLElement) => {

		a.addEventListener('click', (e:MouseEvent) => {
			if(startX != touchX || startY != touchY){
				e.preventDefault();
				e.stopImmediatePropagation();
			}
		});
	});
});

if(document.querySelectorAll(".rs-checkout_form").length){
    (<HTMLFormElement>document.querySelector(".rs-checkout_form")).onsubmit = () => {
        setTimeout(()=>{
            fillDays();
            fillYears();
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
            // :::::::::::::::::::: Програмный скрол :::::::::::::::::::::::
            document.querySelectorAll('.overflow').forEach((overflow:HTMLElement) => {

                overflow.addEventListener('mousedown', (e:MouseEvent) => {
                    touched = true;
                    touchX = e.clientX;
                    startX = e.clientX;
                    touchY = e.clientY;
                    startY = e.clientY;
                });
            });

            document.querySelectorAll('.overflow').forEach((overflow:HTMLElement) => {

                overflow.addEventListener('mousemove', (e:MouseEvent) => {
                    if(touched){
                        let el = e.currentTarget;
                        (<HTMLElement>el).scrollTop -= (e.movementY * 2);
                        (<HTMLElement>el).scrollLeft -= (e.movementX * 2);
                        touchX = e.clientX;
                        touchY = e.clientY;
                    }
                });
            });

            document.querySelectorAll('.overflow').forEach((overflow:HTMLElement) => {

                overflow.addEventListener('mouseup', (e:MouseEvent) => {
                    touched=false;
                    setTimeout(() => {
                        touchX = undefined;
                        touchY = undefined;
                        startX = undefined;
                        startY = undefined;
                    }, 80);
                });
            });

            document.querySelectorAll('.overflow').forEach((overflow:HTMLElement) => {

                overflow.addEventListener('mouseleave', (e:MouseEvent) => {
                    touched=false;
                    setTimeout(() => {
                        touchX = undefined;
                        touchY = undefined;
                        startX = undefined;
                        startY = undefined;
                    }, 80);
                });
            });

        }, 800);
    }
}
if(document.querySelectorAll(".rs-amount").length) {
    (<HTMLInputElement>document.querySelector(".rs-amount")).onchange = () => {
        setTimeout(() => {
            // :::::::::::::::::::: Програмный скрол :::::::::::::::::::::::
            document.querySelectorAll('.overflow').forEach((overflow: HTMLElement) => {

                overflow.addEventListener('mousedown', (e: MouseEvent) => {
                    touched = true;
                    touchX = e.clientX;
                    startX = e.clientX;
                    touchY = e.clientY;
                    startY = e.clientY;
                });
            });

            document.querySelectorAll('.overflow').forEach((overflow: HTMLElement) => {

                overflow.addEventListener('mousemove', (e: MouseEvent) => {
                    if (touched) {
                        let el = e.currentTarget;
                        (<HTMLElement>el).scrollTop -= (e.movementY * 2);
                        (<HTMLElement>el).scrollLeft -= (e.movementX * 2);
                        touchX = e.clientX;
                        touchY = e.clientY;
                    }
                });
            });

            document.querySelectorAll('.overflow').forEach((overflow: HTMLElement) => {

                overflow.addEventListener('mouseup', (e: MouseEvent) => {
                    touched = false;
                    setTimeout(() => {
                        touchX = undefined;
                        touchY = undefined;
                        startX = undefined;
                        startY = undefined;
                    }, 80);
                });
            });

            document.querySelectorAll('.overflow').forEach((overflow: HTMLElement) => {

                overflow.addEventListener('mouseleave', (e: MouseEvent) => {
                    touched = false;
                    setTimeout(() => {
                        touchX = undefined;
                        touchY = undefined;
                        startX = undefined;
                        startY = undefined;
                    }, 80);
                });
            });

        }, 800);
    }
}
