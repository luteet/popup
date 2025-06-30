function Popup(arg) {

	let body = document.body,
		html = document.documentElement,
		saveID = (typeof arg == 'object') ? (arg['saveID']) ? true : false : false,
		popupCheck = true,
		popupCheckClose = true;

	const removeHash = function () {
		let uri = window.location.toString();
		if (uri.indexOf("#") > 0) {
			let clean_uri = uri.substring(0, uri.indexOf("#"));
			window.history.replaceState({}, document.title, clean_uri);
		}
	}

	const open = function (id, initStart) {

		if (popupCheck) {
			popupCheck = false;

			const popup = document.querySelector(id);

			if (popup) {

				if(popup.classList.contains('popup')) {

					popup.style.display = 'flex';

					body.classList.remove('is-popup-active');
					html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
					body.classList.add('is-popup-active');

					if (saveID) history.pushState('', "", id);

					setTimeout(() => {
						if (!initStart) {
							popup.classList.add('is-active');
							setTimeout(() => popupCheck = true, 400)
						} else {
							popup.classList.add('is-transition-none');
							popup.classList.add('is-active');
							popupCheck = true;
						}
					}, 0)
				}

			} else {
				return new Error(`Not found "${id}"`)
			}
		} else setTimeout(() => popupCheck = true, 500);
		
	}

	const close = function (popupClose) {

		if (popupCheckClose) {
			popupCheckClose = false;

			let popup
			if (typeof popupClose === 'string') {
				popup = document.querySelector(popupClose)
			} else {
				popup = popupClose.closest('.popup');
			}

			if (popup.classList.contains('is-transition-none')) popup.classList.remove('is-transition-none')

			setTimeout(() => {

				popup.classList.remove('is-active');

				function closeFunc() {
					const activePopups = document.querySelectorAll('.popup.is-active');

					if (activePopups.length < 1) {
						body.classList.remove('is-popup-active');
						html.style.setProperty('--popup-padding', '0px');
					}

					if (saveID) {
						removeHash();
						if (activePopups[activePopups.length - 1]) {
							history.pushState('', "", "#" + activePopups[activePopups.length - 1].getAttribute('id'));
						}
					}

					popupCheckClose = true;
					popup.style.display = 'none';
				}

				setTimeout(closeFunc, 400)

			}, 0)

		}

	}

	return {

		open: function (id) {
			open(id);
		},

		close: function (popupClose) {
			close(popupClose)
		},

		init: function () {

			let thisTarget
			body.addEventListener('click', function (event) {

				thisTarget = event.target;

				let popupOpen = thisTarget.closest('.open-popup');
				if (popupOpen) {
					event.preventDefault();
					open(popupOpen.getAttribute('href'))
				}

				let popupClose = thisTarget.closest('.close-popup');
				if (popupClose) {
					close(popupClose)
				}

			});

			body.addEventListener('keyup', function (event) {

				if(event.key == "Escape" && document.querySelector('.popup.is-active')) {
					close(document.querySelector('.popup.is-active'));
				}

			});

			window.addEventListener('popstate', function(event) {
				event.preventDefault()

				const currentHash = window.location.hash;
				if (currentHash === '' && document.body.classList.contains("is-popup-active")) {
					close(document.querySelector(".popup.is-active"));
				} else if(currentHash !== '' && !document.body.classList.contains("is-popup-active")) {
					open(currentHash, false, false);
				}
			});

			if (saveID) {
				if (new URL(window.location).hash) {
					open(url.hash, true);
				}
			}
		},

	}
}
