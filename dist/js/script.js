window.addEventListener('DOMContentLoaded', () => {
	// Menu

	const menu = document.querySelector('.header__menu'),
		menuItem = document.querySelectorAll('.header__menu-item'),
		humburger = document.querySelector('.humburger');

	humburger.addEventListener('click', () => {
		humburger.classList.toggle('humburger_active');
		menu.classList.toggle('header__menu_active');
	});


	menuItem.forEach(item => {
		item.addEventListener('click', () => {
			humburger.classList.toggle('humburger_active');
			menu.classList.toggle('header__menu_active');
		});
	});

	const sumInput = document.querySelector('.calc__input--sum'),
		timeInput = document.querySelector('.calc__input--time'),
		payt = document.querySelector('.calc__pt'),
		rangeTimeInput = document.querySelector('.range__input--time'),
		rangeSumInput = document.querySelector('.range__input--sum'),
		dateText = document.querySelector('.calc__input-text-right--date');



	// range + calc

	// маска
	function prettify(num) {
		var n = num.toString();
		return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
	}

	function getPayment(sum, period, rate) {
		// *
		// * sum - сумма кредита
		// * period - срок в годах
		// * rate - годовая ставка в процентах
		// * payt - поле, куда будет вывобиться платеж
		let i,
			koef;

		// ставка в месяц
		i = (rate / 12) / 100;

		// коэффициент аннуитета
		koef = (i * (Math.pow(1 + i, period * 12))) / (Math.pow(1 + i, period * 12) - 1);

		// итог
		payt.textContent = (sum * koef).toFixed().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
	}

	function range(input, progress, content) {
		const input$ = document.querySelector(input);
		const progress$ = document.querySelector(progress);
		if (input$) {
			const val = input$.value;
			const min = input$.getAttribute('min');
			const max = input$.getAttribute('max');
			const step = input$.getAttribute('step');
			const position =  100 / (max - step) * (val - step);
			updateRangePosition(progress$, position);

			input$.addEventListener('input', () => {
				const val = input$.value;
				const min = input$.getAttribute('min');
				const max = input$.getAttribute('max');
				const step = input$.getAttribute('step');
				const position =  100 / (max - step) * (val - step);
				updateRangePosition(progress$, position);
				content.value = prettify(val);
			});
		}
	}

	function updateRangePosition(progress$, position) {
		if (progress$) {
			progress$.style.width = `${position}%`;
		}
	}

	function calc() {
		let sum = +sumInput.value.replace(/\D/g, ''),
			period = +timeInput.value.replace(/\D/g, '');

		getPayment(sum, period, 6);
	}



	function checkSymbols(input, event, maxValue) {
		input.addEventListener(event, () => {
			if (maxValue) {
				if (input.value[0] == 0) {
					input.value = input.value.replace(/./g, '');
				}

				input.value = input.value.replace(/\D/g, '');

				input.value = prettify(input.value);

				if (+input.value.replace(/\D/g, '') > maxValue) {
					input.value = prettify(maxValue);
				}
			}
			if ((+sumInput.value.replace(/\D/g, '') >= 300000 && +sumInput.value.replace(/\D/g, '') <= 20000000) && (+timeInput.value.replace(/\D/g, '') >= 1 && +timeInput.value.replace(/\D/g, '') <= 10)) {
				calc();
			} else {
				payt.textContent = '0';
			}

			switch (timeInput.value) {
				case '1':
					dateText.textContent = 'год';
					break;

				case '2':
				case '3':
				case '4':
					dateText.textContent = 'года';
					break;
				default:
					dateText.textContent = 'лет';
			}
		});
	}

	range('.range__input--sum', '.range__track--sum', sumInput);
	range('.range__input--time', '.range__track--time', timeInput);
	checkSymbols(sumInput, 'input', 20000000);
	checkSymbols(timeInput, 'input', 10);
	checkSymbols(rangeSumInput, 'change');
	checkSymbols(rangeTimeInput, 'change');

	// Slider

	const sliders = (slides) => {
		let slideIndex = 1;
		const items = document.querySelectorAll(slides);


		function showSlides(n) {
			if (n > items.length) {
				slideIndex = 1;
			}

			if (n < 1) {
				slideIndex = items.length;
			}

			items.forEach(item => {
				item.style.display = 'none';
			});

			items[slideIndex - 1].style.display = 'block';
		}

		showSlides(slideIndex);

		function plusSlides(n) {
			showSlides(slideIndex += n);
		}


		try {
			let initialPoint;
			let finalPoint;
			items.forEach((item) => {
				item.addEventListener('touchstart', (e) => {
					e.preventDefault();
					e.stopPropagation();
					initialPoint = e.changedTouches[0];
				}, false);
			});
			items.forEach(item => {
				item.addEventListener('touchend', (e) => {
					e.preventDefault();
					e.stopPropagation();
					finalPoint = e.changedTouches[0];
					let xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
					let yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
					if (xAbs > 20 || yAbs > 20) {
						if (xAbs > yAbs) {
							if (finalPoint.pageX < initialPoint.pageX) {
								plusSlides(-1);
							} else {
								plusSlides(1);
							}
						}
					}
				}, false);
			});

		} catch (e) { }
	};

	// sliders('.about__inner-image-mobile');
	// sliders('.reviews__item-mobile');

	function accord(headers, activeClass, paddingBottom) {


		const headers_ = document.querySelectorAll(headers);

		headers_.forEach(item => {
			item.addEventListener('click', () => {
				item.parentElement.classList.toggle(activeClass);
				if (item.parentElement.classList.contains(activeClass)) {
					item.nextElementSibling.style.cssText = `max-height: ${item.nextElementSibling.scrollHeight + paddingBottom}px; padding-bottom: ${paddingBottom}px;`;
				} else {
					item.nextElementSibling.style.cssText = `max-height: 0px; padding-bottom: 0px;`;
				}
			});
		});
	}

	accord('.faq__item__header', 'faq__item--active', 20);

});
