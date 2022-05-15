var i;

// hamburger menu header--fullscreen

const header = document.querySelector('.header');
const body = document.querySelector('body');

header.addEventListener('click', function (e) {
	const hamburger = e.target.closest('.hamburger-menu');
	if (hamburger && e.target.closest('.header--fullscreen')) {
		header.classList.remove('header--fullscreen');
		body.style.overflow = 'inherit';
	}
	else if (hamburger && e.target.closest('.hamburger-menu')) {
		header.classList.add('header--fullscreen');
		body.style.overflow = 'hidden';
	}
});

//burgers-composition-close-btn
const hoverClose = document.querySelector('.composition__close-btn');
const hoverOpen = document.querySelector('.burger-card__composition--item');

hoverClose.addEventListener('click', function (e) {
	e.preventDefault();
	document.querySelector('.burger-card__composition--hover').style.display = 'none';
});

if (screen.width < 769) {
	hoverOpen.addEventListener('click', function (e) {
		e.preventDefault();
		document.querySelector('.burger-card__composition--hover').style.display = 'block';
	});
}

//overlay reviews
const reviewButton = document.querySelectorAll('.reviews__btn');
const template = document.querySelector('#reviewsPopup').innerHTML;

for (i = 0; i < reviewButton.length; i++) {
	reviewButton[i].addEventListener("click", function (e) {
		let reviewsTitle = e.path[2].querySelector('.reviews__title').innerHTML;
		let reviewsText = e.path[2].querySelector('.reviews__text').innerHTML;
		let successOverlay = createOverlay(reviewsTitle, reviewsText);
		document.querySelector(".reviews").append(successOverlay);
	});
}

function createOverlay(title, text) {
	// как создавать шаблон без лишнего дива?
	const newElement = document.createElement('div');
	newElement.innerHTML = template;

	const closeOverlay = newElement.querySelector('.overlay__close-btn');
	const closeOverlayBg = newElement.querySelector('.overlay');

	closeOverlayBg.addEventListener('click', function (e) {
		if (e.target === closeOverlayBg) {
			closeOverlay.click();
		}
	});
	closeOverlay.addEventListener('click', function (e) {
		e.preventDefault();
		document.querySelector('.reviews').removeChild(newElement);
	})

	newElement.querySelector('.reviews__overlay--title').innerHTML = title;
	newElement.querySelector('.reviews__overlay--text').innerHTML = text;

	return newElement;
}

//accordeon

const itemVertAccordeon = document.querySelectorAll('.vertical-accordeon__item');
for (i = 0; i < itemVertAccordeon.length; i++) {
	itemVertAccordeon[i].addEventListener('click', function (e) {
		e.preventDefault();
		if (e.target.closest('.vertical-accordeon__item').classList.contains('vertical-accordeon__item--active')) {
			e.target.closest('.vertical-accordeon__item').classList.remove('vertical-accordeon__item--active');
		} else {
			for (let j = 0; j < itemVertAccordeon.length; j++) {
				itemVertAccordeon[j].classList.remove('vertical-accordeon__item--active');
			}
			e.target.closest('.vertical-accordeon__item').classList.add('vertical-accordeon__item--active');
		}
	});
}

//team-accordeon
const itemTeamAccordeon = document.querySelectorAll('.staff__item');
for (i = 0; i < itemTeamAccordeon.length; i++) {
	itemTeamAccordeon[i].addEventListener('click', function (e) {
		if (e.target.closest('.staff__item').classList.contains('staff__active')) {
			e.target.closest('.staff__item').classList.remove('staff__active');
		} else {
			for (let j = 0; j < itemTeamAccordeon.length; j++) {
				itemTeamAccordeon[j].classList.remove('staff__active');
			}
			e.target.closest('.staff__item').classList.add('staff__active');
		}
	});
}

// slider
// не сделаны буллеты снизу
let sliderContainer = document.querySelector('.slider-container__list');
let sliderCarousel = document.querySelector('.slider-container__items');
let sliderItem = document.querySelectorAll('.slider-container__item');
let contentWidth = document.querySelector('.slider-container__list').clientWidth;
let sliderLeft = document.querySelector('#slider-left');
let sliderRight = document.querySelector('#slider-right');

const minRight = 0;
const maxRight = contentWidth * sliderItem.length;
const step = contentWidth;
let currentRight = 0;

for (i = 0; i < sliderItem.length; i++) {
	sliderItem[i].style.minWidth = contentWidth + "px";
}

sliderLeft.addEventListener('click', e => {
	e.preventDefault();
	if (Math.abs(currentRight) > minRight) {
		currentRight += step;
		sliderCarousel.style.transform = `translateX(${currentRight}px)`;
	} else {
		sliderCarousel.style.transform = `translateX(-${maxRight - step}px)`;
		currentRight = -(maxRight - step);
	}
});

sliderRight.addEventListener('click', e => {
	e.preventDefault();
	if (Math.abs(currentRight) < (maxRight - step)) {
		currentRight -= step;
		sliderCarousel.style.transform = `translateX(${currentRight}px)`;
	} else {
		sliderCarousel.style.transform = `translateX(0px)`;
		currentRight = 0;
	}
});

//form popup вытаскиваем шаблон попапа и закидываем в форму
const templateForm = document.querySelector('#formPopup').innerHTML;
const sendButton = document.querySelector('#sendBtn');
const sendForm = document.querySelector('.form__elem');

let dataForm;
let textFormPopup;
let textFormPopupError = 'Вы не ввели... ';

sendButton.addEventListener('click', (e) => {
	e.preventDefault();

	if (!validateForm(sendForm)) {
		createFormOverlay(textFormPopup);
		textFormPopup = '';
	} else {
		let formData = createData();
		const xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail')
		xhr.responseType = 'json';
		xhr.send(formData);
		xhr.addEventListener('load', function () {
			if (xhr.response.status === 1) {
				textFormPopup = xhr.response.message;
				createFormOverlay(textFormPopup);
			} else {
				textFormPopup = xhr.response.message;
				createFormOverlay(textFormPopup);
			}
		});
		textFormPopup = '';
	}
});

function createFormOverlay(text) {
	const newElement = document.createElement('div');
	newElement.innerHTML = templateForm;

	const closeOverlay = newElement.querySelector('.btn--overlay');
	const closeOverlayBg = newElement.querySelector('.overlay');

	closeOverlayBg.addEventListener('click', function (e) {
		if (e.target === closeOverlayBg) {
			closeOverlay.click();
		}
	});
	closeOverlay.addEventListener('click', function (e) {
		e.preventDefault();
		document.querySelector('.order').removeChild(newElement);
	})

	newElement.querySelector('.reviews__overlay--text').innerHTML = text;

	document.querySelector(".order").append(newElement);
}

function validateForm(form) {
	let valid = true;

	if (!validateField(form.elements.comment)) {
		valid = false;
		textFormPopup = textFormPopupError + "Комментарий!";
	}

	if (!validateField(form.elements.phone)) {
		valid = false;
		textFormPopup = textFormPopupError + "Телефон!";
	}

	if (!validateField(form.elements.name)) {
		valid = false;
		textFormPopup = textFormPopupError + "Имя!";
	}

	return valid;
}

function validateField(field) {
	return field.checkValidity();
}

function createData() {
	let formData = new FormData(sendForm);

	formData.append("name", sendForm.elements.name.value);
	formData.append("phone", sendForm.elements.phone.value);
	formData.append("comment", sendForm.elements.comment.value);
	formData.append("to", "vasy@liy.com");

	return formData;
	// почему не сработал stringify?
	// dataForm = {
	// 	"name": sendForm.elements.name.value,
	// 	"phone": sendForm.elements.phone.value,
	// 	"comment": "vasy@liy.com",
	// 	"to": "vasy@liy.com"
	// }
	// return JSON.stringify(dataForm);
};;(function() {
	ymaps.ready(init);

	var placemarks = [
			{
					latitude: 59.97,
					longitude: 30.31,
					hintContent: '<div class="map__hint">ул. Литераторов, д. 19</div>'
			},
			{
					latitude: 59.94,
					longitude: 30.25,
					hintContent: '<div class="map__hint">Малый проспект В О, д 64</div>'
			},
			{
					latitude: 59.93,
					longitude: 30.34,
					hintContent: '<div class="map__hint">наб. реки Фонтанки, д. 56</div>'
			}
	],
			geoObjects= [];

	function init() {
			var map = new ymaps.Map('map', {
					center: [59.94, 30.32],
					zoom: 12,
					controls: ['zoomControl'],
					behaviors: ['drag']
			});

			for (var i = 0; i < placemarks.length; i++) {
							geoObjects[i] = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude],
							{
									hintContent: placemarks[i].hintContent
							},
							{
									iconLayout: 'default#image',
									iconImageHref: './../img/icons/map-marker.svg',
									iconImageSize: [46, 57],
									iconImageOffset: [-23, -57]
							});
			}

			var clusterer = new ymaps.Clusterer({
					clusterIcons: [
							{
									href: './../img/content/1st_screen_hero/main_burger.png',
									size: [100, 100],
									offset: [-50, -50]
							}
					],
					clusterIconContentLayout: null
			});

			map.geoObjects.add(clusterer);
			clusterer.add(geoObjects);
	}

})();;(function () {
	let tag = document.createElement('script');
	let playButton = document.querySelector('.videocontent__play-btn');
	let pauseButton = document.querySelector('.videocontent__pause-btn');
	let playButtonControls = document.querySelector('.controls__play');
	let pauseButtonControls = document.querySelector('.controls__pause');
	let hideControls = document.querySelector('.videocontent__controls');
	let volumeInput = document.querySelector('.controls__volume-level')
	let volumeButton = document.querySelector('.controls__volume');
	let currentTimeElem = document.querySelector('.controls__timeline-current');
	let totalTimeElem = document.querySelector('.controls__timeline-total');
	let speedButton = document.querySelector('.controls__speed-btn');
	let timeline = document.querySelector('.controls__timeline');

	let player;
	onYouTubeIframeAPIReady = () => {
		player = new YT.Player('videocontent__iframe', {
			videoId: 'Wdc8IuU7foE',
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange
			},
			playerVars: {
				controls: 0,
				disablekb: 0,
				showinfo: 0,
				rel: 0,
				autoplay: 0,
				modestbranding: 0,
				playsinline: 1,
				fs: 0
			}
		});
	}

	onPlayerReady = () => {
		playPauseVideoOnPlayerReady();
		setTotalTime();
		setTimelineParams();
	}

	onPlayerStateChange = () => {
		playPauseVideoOnPlayerStateChange();
		setVolume();
		muteVolume();
		setInterval(setCurrentTime, 500);
		changeSpeed();
		changeTime();
	}

	playPauseVideoOnPlayerReady = () => {
		playButton.addEventListener('click', togglePlay);
		playButtonControls.addEventListener('click', togglePlay);
	}


	playPauseVideoOnPlayerStateChange = () => {
		if (player.getPlayerState() == 2) {
			togglePause();
		}

		if (player.getPlayerState() == 0) {
			toggleStop();
		}

		pauseButton.addEventListener('click', () => {
			togglePause();
		});

		pauseButtonControls.addEventListener('click', () => {
			togglePause();
		});
	}

	
	//play pause
	togglePlay = () => {
		playButton.classList.add('videocontent__play-btn--active');
		pauseButton.classList.add('videocontent__pause-btn--active');
		pauseButtonControls.classList.add('controls__pause--active');
		playButtonControls.classList.remove('controls__play--active');
		hideControls.classList.remove('videocontent__controls--paused');
		player.playVideo();
	}

	togglePause = () => {
		playButton.classList.remove('videocontent__play-btn--active');
		pauseButton.classList.remove('videocontent__pause-btn--active');
		pauseButtonControls.classList.remove('controls__pause--active');
		playButtonControls.classList.add('controls__play--active');
		hideControls.classList.add('videocontent__controls--paused');
		player.pauseVideo();
	}

	toggleStop = () => {
		playButton.classList.remove('videocontent__play-btn--active');
		pauseButton.classList.remove('videocontent__pause-btn--active');
		pauseButtonControls.classList.remove('controls__pause--active');
		playButtonControls.classList.add('controls__play--active');
		player.stopVideo();
	}

	//volume
	muteVolume = () => {
		volumeButton.addEventListener('click', () =>{
			if (player.isMuted()) {
				player.unMute();
				volumeButton.classList.remove('controls__volume--muted');
				player.setVolume(50);
				volumeInput.value = 50;
			} else 
			{
				player.mute();
				volumeButton.classList.add('controls__volume--muted');
			}
		});
	}

	setVolume = () => {
		player.setVolume(volumeInput.value);
		volumeInput.addEventListener('input', (e) => {
			player.setVolume(e.target.value);
			if(e.target.value == 0) {
				volumeButton.classList.add('controls__volume--muted');
				player.mute();
			} else {
				volumeButton.classList.remove('controls__volume--muted');
				player.unMute();
			}
		})
	}

	//duration
	setTotalTime = () => {
		totalTimeElem.innerHTML = formatDurtion(player.getDuration());
	}

	setCurrentTime = () => {
		currentTimeElem.innerHTML = formatDurtion(player.getCurrentTime());
		timeline.value = player.getCurrentTime();
	}

	formatDurtion = (time) => {
		const seconds = Math.floor(time % 60);
		const minutes = Math.floor(time / 60) % 60 ;
		if (minutes == 0 && seconds < 10) {
			return ('0:0'+`${seconds}`);
		} else if (minutes == 0) {
			return ('0:'+`${seconds}`);
		} else {
			return (`${minutes}`+':'+`${seconds}`);
		}
	}


	changeSpeed = () => {
		speedButton.addEventListener('click', changeSpeedValue);
	}

	changeSpeedValue = () => {
		if (player.getPlaybackRate() == 1) {
			player.setPlaybackRate(2);
			speedButton.innerHTML = "2x";
		} else {
			player.setPlaybackRate(1);
			speedButton.innerHTML = "1x";
		}
	}


	//timeline
	setTimelineParams = () => {
		timeline.setAttribute('min', 0);
		timeline.setAttribute('max', player.getDuration());
	}

	changeTime = () => {
		timeline.addEventListener('input', (e) => {
			player.seekTo(e.target.value);
			togglePlay();
		});
	}
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzY3JpcHRzL21hcC5qcyIsInNjcmlwdHMvdmlkZW9wbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVDbFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaTtcclxuXHJcbi8vIGhhbWJ1cmdlciBtZW51IGhlYWRlci0tZnVsbHNjcmVlblxyXG5cclxuY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpO1xyXG5jb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cclxuaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRjb25zdCBoYW1idXJnZXIgPSBlLnRhcmdldC5jbG9zZXN0KCcuaGFtYnVyZ2VyLW1lbnUnKTtcclxuXHRpZiAoaGFtYnVyZ2VyICYmIGUudGFyZ2V0LmNsb3Nlc3QoJy5oZWFkZXItLWZ1bGxzY3JlZW4nKSkge1xyXG5cdFx0aGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlci0tZnVsbHNjcmVlbicpO1xyXG5cdFx0Ym9keS5zdHlsZS5vdmVyZmxvdyA9ICdpbmhlcml0JztcclxuXHR9XHJcblx0ZWxzZSBpZiAoaGFtYnVyZ2VyICYmIGUudGFyZ2V0LmNsb3Nlc3QoJy5oYW1idXJnZXItbWVudScpKSB7XHJcblx0XHRoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLS1mdWxsc2NyZWVuJyk7XHJcblx0XHRib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblx0fVxyXG59KTtcclxuXHJcbi8vYnVyZ2Vycy1jb21wb3NpdGlvbi1jbG9zZS1idG5cclxuY29uc3QgaG92ZXJDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21wb3NpdGlvbl9fY2xvc2UtYnRuJyk7XHJcbmNvbnN0IGhvdmVyT3BlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXItY2FyZF9fY29tcG9zaXRpb24tLWl0ZW0nKTtcclxuXHJcbmhvdmVyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnVyZ2VyLWNhcmRfX2NvbXBvc2l0aW9uLS1ob3ZlcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbn0pO1xyXG5cclxuaWYgKHNjcmVlbi53aWR0aCA8IDc2OSkge1xyXG5cdGhvdmVyT3Blbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnVyZ2VyLWNhcmRfX2NvbXBvc2l0aW9uLS1ob3ZlcicpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vL292ZXJsYXkgcmV2aWV3c1xyXG5jb25zdCByZXZpZXdCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmV2aWV3c19fYnRuJyk7XHJcbmNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jldmlld3NQb3B1cCcpLmlubmVySFRNTDtcclxuXHJcbmZvciAoaSA9IDA7IGkgPCByZXZpZXdCdXR0b24ubGVuZ3RoOyBpKyspIHtcclxuXHRyZXZpZXdCdXR0b25baV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRsZXQgcmV2aWV3c1RpdGxlID0gZS5wYXRoWzJdLnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX190aXRsZScpLmlubmVySFRNTDtcclxuXHRcdGxldCByZXZpZXdzVGV4dCA9IGUucGF0aFsyXS5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fdGV4dCcpLmlubmVySFRNTDtcclxuXHRcdGxldCBzdWNjZXNzT3ZlcmxheSA9IGNyZWF0ZU92ZXJsYXkocmV2aWV3c1RpdGxlLCByZXZpZXdzVGV4dCk7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJldmlld3NcIikuYXBwZW5kKHN1Y2Nlc3NPdmVybGF5KTtcclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlT3ZlcmxheSh0aXRsZSwgdGV4dCkge1xyXG5cdC8vINC60LDQuiDRgdC+0LfQtNCw0LLQsNGC0Ywg0YjQsNCx0LvQvtC9INCx0LXQtyDQu9C40YjQvdC10LPQviDQtNC40LLQsD9cclxuXHRjb25zdCBuZXdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0bmV3RWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcclxuXHJcblx0Y29uc3QgY2xvc2VPdmVybGF5ID0gbmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheV9fY2xvc2UtYnRuJyk7XHJcblx0Y29uc3QgY2xvc2VPdmVybGF5QmcgPSBuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdmVybGF5Jyk7XHJcblxyXG5cdGNsb3NlT3ZlcmxheUJnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLnRhcmdldCA9PT0gY2xvc2VPdmVybGF5QmcpIHtcclxuXHRcdFx0Y2xvc2VPdmVybGF5LmNsaWNrKCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0Y2xvc2VPdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzJykucmVtb3ZlQ2hpbGQobmV3RWxlbWVudCk7XHJcblx0fSlcclxuXHJcblx0bmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fb3ZlcmxheS0tdGl0bGUnKS5pbm5lckhUTUwgPSB0aXRsZTtcclxuXHRuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX19vdmVybGF5LS10ZXh0JykuaW5uZXJIVE1MID0gdGV4dDtcclxuXHJcblx0cmV0dXJuIG5ld0VsZW1lbnQ7XHJcbn1cclxuXHJcbi8vYWNjb3JkZW9uXHJcblxyXG5jb25zdCBpdGVtVmVydEFjY29yZGVvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy52ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0nKTtcclxuZm9yIChpID0gMDsgaSA8IGl0ZW1WZXJ0QWNjb3JkZW9uLmxlbmd0aDsgaSsrKSB7XHJcblx0aXRlbVZlcnRBY2NvcmRlb25baV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0aWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy52ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0nKS5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsLWFjY29yZGVvbl9faXRlbS0tYWN0aXZlJykpIHtcclxuXHRcdFx0ZS50YXJnZXQuY2xvc2VzdCgnLnZlcnRpY2FsLWFjY29yZGVvbl9faXRlbScpLmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsLWFjY29yZGVvbl9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGl0ZW1WZXJ0QWNjb3JkZW9uLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0aXRlbVZlcnRBY2NvcmRlb25bal0uY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwtYWNjb3JkZW9uX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlLnRhcmdldC5jbG9zZXN0KCcudmVydGljYWwtYWNjb3JkZW9uX19pdGVtJykuY2xhc3NMaXN0LmFkZCgndmVydGljYWwtYWNjb3JkZW9uX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuLy90ZWFtLWFjY29yZGVvblxyXG5jb25zdCBpdGVtVGVhbUFjY29yZGVvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGFmZl9faXRlbScpO1xyXG5mb3IgKGkgPSAwOyBpIDwgaXRlbVRlYW1BY2NvcmRlb24ubGVuZ3RoOyBpKyspIHtcclxuXHRpdGVtVGVhbUFjY29yZGVvbltpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS50YXJnZXQuY2xvc2VzdCgnLnN0YWZmX19pdGVtJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdGFmZl9fYWN0aXZlJykpIHtcclxuXHRcdFx0ZS50YXJnZXQuY2xvc2VzdCgnLnN0YWZmX19pdGVtJykuY2xhc3NMaXN0LnJlbW92ZSgnc3RhZmZfX2FjdGl2ZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBpdGVtVGVhbUFjY29yZGVvbi5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGl0ZW1UZWFtQWNjb3JkZW9uW2pdLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YWZmX19hY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlLnRhcmdldC5jbG9zZXN0KCcuc3RhZmZfX2l0ZW0nKS5jbGFzc0xpc3QuYWRkKCdzdGFmZl9fYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbi8vIHNsaWRlclxyXG4vLyDQvdC1INGB0LTQtdC70LDQvdGLINCx0YPQu9C70LXRgtGLINGB0L3QuNC30YNcclxubGV0IHNsaWRlckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItY29udGFpbmVyX19saXN0Jyk7XHJcbmxldCBzbGlkZXJDYXJvdXNlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItY29udGFpbmVyX19pdGVtcycpO1xyXG5sZXQgc2xpZGVySXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXItY29udGFpbmVyX19pdGVtJyk7XHJcbmxldCBjb250ZW50V2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyLWNvbnRhaW5lcl9fbGlzdCcpLmNsaWVudFdpZHRoO1xyXG5sZXQgc2xpZGVyTGVmdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXItbGVmdCcpO1xyXG5sZXQgc2xpZGVyUmlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyLXJpZ2h0Jyk7XHJcblxyXG5jb25zdCBtaW5SaWdodCA9IDA7XHJcbmNvbnN0IG1heFJpZ2h0ID0gY29udGVudFdpZHRoICogc2xpZGVySXRlbS5sZW5ndGg7XHJcbmNvbnN0IHN0ZXAgPSBjb250ZW50V2lkdGg7XHJcbmxldCBjdXJyZW50UmlnaHQgPSAwO1xyXG5cclxuZm9yIChpID0gMDsgaSA8IHNsaWRlckl0ZW0ubGVuZ3RoOyBpKyspIHtcclxuXHRzbGlkZXJJdGVtW2ldLnN0eWxlLm1pbldpZHRoID0gY29udGVudFdpZHRoICsgXCJweFwiO1xyXG59XHJcblxyXG5zbGlkZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGlmIChNYXRoLmFicyhjdXJyZW50UmlnaHQpID4gbWluUmlnaHQpIHtcclxuXHRcdGN1cnJlbnRSaWdodCArPSBzdGVwO1xyXG5cdFx0c2xpZGVyQ2Fyb3VzZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtjdXJyZW50UmlnaHR9cHgpYDtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c2xpZGVyQ2Fyb3VzZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoLSR7bWF4UmlnaHQgLSBzdGVwfXB4KWA7XHJcblx0XHRjdXJyZW50UmlnaHQgPSAtKG1heFJpZ2h0IC0gc3RlcCk7XHJcblx0fVxyXG59KTtcclxuXHJcbnNsaWRlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGlmIChNYXRoLmFicyhjdXJyZW50UmlnaHQpIDwgKG1heFJpZ2h0IC0gc3RlcCkpIHtcclxuXHRcdGN1cnJlbnRSaWdodCAtPSBzdGVwO1xyXG5cdFx0c2xpZGVyQ2Fyb3VzZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtjdXJyZW50UmlnaHR9cHgpYDtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c2xpZGVyQ2Fyb3VzZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoMHB4KWA7XHJcblx0XHRjdXJyZW50UmlnaHQgPSAwO1xyXG5cdH1cclxufSk7XHJcblxyXG4vL2Zvcm0gcG9wdXAg0LLRi9GC0LDRgdC60LjQstCw0LXQvCDRiNCw0LHQu9C+0L0g0L/QvtC/0LDQv9CwINC4INC30LDQutC40LTRi9Cy0LDQtdC8INCyINGE0L7RgNC80YNcclxuY29uc3QgdGVtcGxhdGVGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Zvcm1Qb3B1cCcpLmlubmVySFRNTDtcclxuY29uc3Qgc2VuZEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZW5kQnRuJyk7XHJcbmNvbnN0IHNlbmRGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2VsZW0nKTtcclxuXHJcbmxldCBkYXRhRm9ybTtcclxubGV0IHRleHRGb3JtUG9wdXA7XHJcbmxldCB0ZXh0Rm9ybVBvcHVwRXJyb3IgPSAn0JLRiyDQvdC1INCy0LLQtdC70LguLi4gJztcclxuXHJcbnNlbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0aWYgKCF2YWxpZGF0ZUZvcm0oc2VuZEZvcm0pKSB7XHJcblx0XHRjcmVhdGVGb3JtT3ZlcmxheSh0ZXh0Rm9ybVBvcHVwKTtcclxuXHRcdHRleHRGb3JtUG9wdXAgPSAnJztcclxuXHR9IGVsc2Uge1xyXG5cdFx0bGV0IGZvcm1EYXRhID0gY3JlYXRlRGF0YSgpO1xyXG5cdFx0Y29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHR4aHIub3BlbignUE9TVCcsICdodHRwczovL3dlYmRldi1hcGkubG9mdHNjaG9vbC5jb20vc2VuZG1haWwnKVxyXG5cdFx0eGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcclxuXHRcdHhoci5zZW5kKGZvcm1EYXRhKTtcclxuXHRcdHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoeGhyLnJlc3BvbnNlLnN0YXR1cyA9PT0gMSkge1xyXG5cdFx0XHRcdHRleHRGb3JtUG9wdXAgPSB4aHIucmVzcG9uc2UubWVzc2FnZTtcclxuXHRcdFx0XHRjcmVhdGVGb3JtT3ZlcmxheSh0ZXh0Rm9ybVBvcHVwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ZXh0Rm9ybVBvcHVwID0geGhyLnJlc3BvbnNlLm1lc3NhZ2U7XHJcblx0XHRcdFx0Y3JlYXRlRm9ybU92ZXJsYXkodGV4dEZvcm1Qb3B1cCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0dGV4dEZvcm1Qb3B1cCA9ICcnO1xyXG5cdH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtT3ZlcmxheSh0ZXh0KSB7XHJcblx0Y29uc3QgbmV3RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdG5ld0VsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGVGb3JtO1xyXG5cclxuXHRjb25zdCBjbG9zZU92ZXJsYXkgPSBuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tLW92ZXJsYXknKTtcclxuXHRjb25zdCBjbG9zZU92ZXJsYXlCZyA9IG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLm92ZXJsYXknKTtcclxuXHJcblx0Y2xvc2VPdmVybGF5QmcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUudGFyZ2V0ID09PSBjbG9zZU92ZXJsYXlCZykge1xyXG5cdFx0XHRjbG9zZU92ZXJsYXkuY2xpY2soKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRjbG9zZU92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm9yZGVyJykucmVtb3ZlQ2hpbGQobmV3RWxlbWVudCk7XHJcblx0fSlcclxuXHJcblx0bmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fb3ZlcmxheS0tdGV4dCcpLmlubmVySFRNTCA9IHRleHQ7XHJcblxyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIub3JkZXJcIikuYXBwZW5kKG5ld0VsZW1lbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZUZvcm0oZm9ybSkge1xyXG5cdGxldCB2YWxpZCA9IHRydWU7XHJcblxyXG5cdGlmICghdmFsaWRhdGVGaWVsZChmb3JtLmVsZW1lbnRzLmNvbW1lbnQpKSB7XHJcblx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0dGV4dEZvcm1Qb3B1cCA9IHRleHRGb3JtUG9wdXBFcnJvciArIFwi0JrQvtC80LzQtdC90YLQsNGA0LjQuSFcIjtcclxuXHR9XHJcblxyXG5cdGlmICghdmFsaWRhdGVGaWVsZChmb3JtLmVsZW1lbnRzLnBob25lKSkge1xyXG5cdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdHRleHRGb3JtUG9wdXAgPSB0ZXh0Rm9ybVBvcHVwRXJyb3IgKyBcItCi0LXQu9C10YTQvtC9IVwiO1xyXG5cdH1cclxuXHJcblx0aWYgKCF2YWxpZGF0ZUZpZWxkKGZvcm0uZWxlbWVudHMubmFtZSkpIHtcclxuXHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHR0ZXh0Rm9ybVBvcHVwID0gdGV4dEZvcm1Qb3B1cEVycm9yICsgXCLQmNC80Y8hXCI7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdmFsaWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlRmllbGQoZmllbGQpIHtcclxuXHRyZXR1cm4gZmllbGQuY2hlY2tWYWxpZGl0eSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVEYXRhKCkge1xyXG5cdGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShzZW5kRm9ybSk7XHJcblxyXG5cdGZvcm1EYXRhLmFwcGVuZChcIm5hbWVcIiwgc2VuZEZvcm0uZWxlbWVudHMubmFtZS52YWx1ZSk7XHJcblx0Zm9ybURhdGEuYXBwZW5kKFwicGhvbmVcIiwgc2VuZEZvcm0uZWxlbWVudHMucGhvbmUudmFsdWUpO1xyXG5cdGZvcm1EYXRhLmFwcGVuZChcImNvbW1lbnRcIiwgc2VuZEZvcm0uZWxlbWVudHMuY29tbWVudC52YWx1ZSk7XHJcblx0Zm9ybURhdGEuYXBwZW5kKFwidG9cIiwgXCJ2YXN5QGxpeS5jb21cIik7XHJcblxyXG5cdHJldHVybiBmb3JtRGF0YTtcclxuXHQvLyDQv9C+0YfQtdC80YMg0L3QtSDRgdGA0LDQsdC+0YLQsNC7IHN0cmluZ2lmeT9cclxuXHQvLyBkYXRhRm9ybSA9IHtcclxuXHQvLyBcdFwibmFtZVwiOiBzZW5kRm9ybS5lbGVtZW50cy5uYW1lLnZhbHVlLFxyXG5cdC8vIFx0XCJwaG9uZVwiOiBzZW5kRm9ybS5lbGVtZW50cy5waG9uZS52YWx1ZSxcclxuXHQvLyBcdFwiY29tbWVudFwiOiBcInZhc3lAbGl5LmNvbVwiLFxyXG5cdC8vIFx0XCJ0b1wiOiBcInZhc3lAbGl5LmNvbVwiXHJcblx0Ly8gfVxyXG5cdC8vIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhRm9ybSk7XHJcbn0iLCI7KGZ1bmN0aW9uKCkge1xyXG5cdHltYXBzLnJlYWR5KGluaXQpO1xyXG5cclxuXHR2YXIgcGxhY2VtYXJrcyA9IFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdFx0bGF0aXR1ZGU6IDU5Ljk3LFxyXG5cdFx0XHRcdFx0bG9uZ2l0dWRlOiAzMC4zMSxcclxuXHRcdFx0XHRcdGhpbnRDb250ZW50OiAnPGRpdiBjbGFzcz1cIm1hcF9faGludFwiPtGD0LsuINCb0LjRgtC10YDQsNGC0L7RgNC+0LIsINC0LiAxOTwvZGl2PidcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdFx0bGF0aXR1ZGU6IDU5Ljk0LFxyXG5cdFx0XHRcdFx0bG9uZ2l0dWRlOiAzMC4yNSxcclxuXHRcdFx0XHRcdGhpbnRDb250ZW50OiAnPGRpdiBjbGFzcz1cIm1hcF9faGludFwiPtCc0LDQu9GL0Lkg0L/RgNC+0YHQv9C10LrRgiDQkiDQniwg0LQgNjQ8L2Rpdj4nXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRcdGxhdGl0dWRlOiA1OS45MyxcclxuXHRcdFx0XHRcdGxvbmdpdHVkZTogMzAuMzQsXHJcblx0XHRcdFx0XHRoaW50Q29udGVudDogJzxkaXYgY2xhc3M9XCJtYXBfX2hpbnRcIj7QvdCw0LEuINGA0LXQutC4INCk0L7QvdGC0LDQvdC60LgsINC0LiA1NjwvZGl2PidcclxuXHRcdFx0fVxyXG5cdF0sXHJcblx0XHRcdGdlb09iamVjdHM9IFtdO1xyXG5cclxuXHRmdW5jdGlvbiBpbml0KCkge1xyXG5cdFx0XHR2YXIgbWFwID0gbmV3IHltYXBzLk1hcCgnbWFwJywge1xyXG5cdFx0XHRcdFx0Y2VudGVyOiBbNTkuOTQsIDMwLjMyXSxcclxuXHRcdFx0XHRcdHpvb206IDEyLFxyXG5cdFx0XHRcdFx0Y29udHJvbHM6IFsnem9vbUNvbnRyb2wnXSxcclxuXHRcdFx0XHRcdGJlaGF2aW9yczogWydkcmFnJ11cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBsYWNlbWFya3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRnZW9PYmplY3RzW2ldID0gbmV3IHltYXBzLlBsYWNlbWFyayhbcGxhY2VtYXJrc1tpXS5sYXRpdHVkZSwgcGxhY2VtYXJrc1tpXS5sb25naXR1ZGVdLFxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aGludENvbnRlbnQ6IHBsYWNlbWFya3NbaV0uaGludENvbnRlbnRcclxuXHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbkxheW91dDogJ2RlZmF1bHQjaW1hZ2UnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpY29uSW1hZ2VIcmVmOiAnLi8uLi9pbWcvaWNvbnMvbWFwLW1hcmtlci5zdmcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpY29uSW1hZ2VTaXplOiBbNDYsIDU3XSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbkltYWdlT2Zmc2V0OiBbLTIzLCAtNTddXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBjbHVzdGVyZXIgPSBuZXcgeW1hcHMuQ2x1c3RlcmVyKHtcclxuXHRcdFx0XHRcdGNsdXN0ZXJJY29uczogW1xyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aHJlZjogJy4vLi4vaW1nL2NvbnRlbnQvMXN0X3NjcmVlbl9oZXJvL21haW5fYnVyZ2VyLnBuZycsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHNpemU6IFsxMDAsIDEwMF0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdG9mZnNldDogWy01MCwgLTUwXVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRjbHVzdGVySWNvbkNvbnRlbnRMYXlvdXQ6IG51bGxcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRtYXAuZ2VvT2JqZWN0cy5hZGQoY2x1c3RlcmVyKTtcclxuXHRcdFx0Y2x1c3RlcmVyLmFkZChnZW9PYmplY3RzKTtcclxuXHR9XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0bGV0IHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG5cdGxldCBwbGF5QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvY29udGVudF9fcGxheS1idG4nKTtcclxuXHRsZXQgcGF1c2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9jb250ZW50X19wYXVzZS1idG4nKTtcclxuXHRsZXQgcGxheUJ1dHRvbkNvbnRyb2xzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzX19wbGF5Jyk7XHJcblx0bGV0IHBhdXNlQnV0dG9uQ29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3BhdXNlJyk7XHJcblx0bGV0IGhpZGVDb250cm9scyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb2NvbnRlbnRfX2NvbnRyb2xzJyk7XHJcblx0bGV0IHZvbHVtZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzX192b2x1bWUtbGV2ZWwnKVxyXG5cdGxldCB2b2x1bWVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3ZvbHVtZScpO1xyXG5cdGxldCBjdXJyZW50VGltZUVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3RpbWVsaW5lLWN1cnJlbnQnKTtcclxuXHRsZXQgdG90YWxUaW1lRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sc19fdGltZWxpbmUtdG90YWwnKTtcclxuXHRsZXQgc3BlZWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3NwZWVkLWJ0bicpO1xyXG5cdGxldCB0aW1lbGluZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sc19fdGltZWxpbmUnKTtcclxuXHJcblx0bGV0IHBsYXllcjtcclxuXHRvbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9ICgpID0+IHtcclxuXHRcdHBsYXllciA9IG5ldyBZVC5QbGF5ZXIoJ3ZpZGVvY29udGVudF9faWZyYW1lJywge1xyXG5cdFx0XHR2aWRlb0lkOiAnV2RjOEl1VTdmb0UnLFxyXG5cdFx0XHRldmVudHM6IHtcclxuXHRcdFx0XHRvblJlYWR5OiBvblBsYXllclJlYWR5LFxyXG5cdFx0XHRcdG9uU3RhdGVDaGFuZ2U6IG9uUGxheWVyU3RhdGVDaGFuZ2VcclxuXHRcdFx0fSxcclxuXHRcdFx0cGxheWVyVmFyczoge1xyXG5cdFx0XHRcdGNvbnRyb2xzOiAwLFxyXG5cdFx0XHRcdGRpc2FibGVrYjogMCxcclxuXHRcdFx0XHRzaG93aW5mbzogMCxcclxuXHRcdFx0XHRyZWw6IDAsXHJcblx0XHRcdFx0YXV0b3BsYXk6IDAsXHJcblx0XHRcdFx0bW9kZXN0YnJhbmRpbmc6IDAsXHJcblx0XHRcdFx0cGxheXNpbmxpbmU6IDEsXHJcblx0XHRcdFx0ZnM6IDBcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRvblBsYXllclJlYWR5ID0gKCkgPT4ge1xyXG5cdFx0cGxheVBhdXNlVmlkZW9PblBsYXllclJlYWR5KCk7XHJcblx0XHRzZXRUb3RhbFRpbWUoKTtcclxuXHRcdHNldFRpbWVsaW5lUGFyYW1zKCk7XHJcblx0fVxyXG5cclxuXHRvblBsYXllclN0YXRlQ2hhbmdlID0gKCkgPT4ge1xyXG5cdFx0cGxheVBhdXNlVmlkZW9PblBsYXllclN0YXRlQ2hhbmdlKCk7XHJcblx0XHRzZXRWb2x1bWUoKTtcclxuXHRcdG11dGVWb2x1bWUoKTtcclxuXHRcdHNldEludGVydmFsKHNldEN1cnJlbnRUaW1lLCA1MDApO1xyXG5cdFx0Y2hhbmdlU3BlZWQoKTtcclxuXHRcdGNoYW5nZVRpbWUoKTtcclxuXHR9XHJcblxyXG5cdHBsYXlQYXVzZVZpZGVvT25QbGF5ZXJSZWFkeSA9ICgpID0+IHtcclxuXHRcdHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVQbGF5KTtcclxuXHRcdHBsYXlCdXR0b25Db250cm9scy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZVBsYXkpO1xyXG5cdH1cclxuXHJcblxyXG5cdHBsYXlQYXVzZVZpZGVvT25QbGF5ZXJTdGF0ZUNoYW5nZSA9ICgpID0+IHtcclxuXHRcdGlmIChwbGF5ZXIuZ2V0UGxheWVyU3RhdGUoKSA9PSAyKSB7XHJcblx0XHRcdHRvZ2dsZVBhdXNlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBsYXllci5nZXRQbGF5ZXJTdGF0ZSgpID09IDApIHtcclxuXHRcdFx0dG9nZ2xlU3RvcCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBhdXNlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHR0b2dnbGVQYXVzZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cGF1c2VCdXR0b25Db250cm9scy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdFx0dG9nZ2xlUGF1c2UoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0XHJcblx0Ly9wbGF5IHBhdXNlXHJcblx0dG9nZ2xlUGxheSA9ICgpID0+IHtcclxuXHRcdHBsYXlCdXR0b24uY2xhc3NMaXN0LmFkZCgndmlkZW9jb250ZW50X19wbGF5LWJ0bi0tYWN0aXZlJyk7XHJcblx0XHRwYXVzZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd2aWRlb2NvbnRlbnRfX3BhdXNlLWJ0bi0tYWN0aXZlJyk7XHJcblx0XHRwYXVzZUJ1dHRvbkNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzX19wYXVzZS0tYWN0aXZlJyk7XHJcblx0XHRwbGF5QnV0dG9uQ29udHJvbHMuY2xhc3NMaXN0LnJlbW92ZSgnY29udHJvbHNfX3BsYXktLWFjdGl2ZScpO1xyXG5cdFx0aGlkZUNvbnRyb2xzLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fY29udHJvbHMtLXBhdXNlZCcpO1xyXG5cdFx0cGxheWVyLnBsYXlWaWRlbygpO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlUGF1c2UgPSAoKSA9PiB7XHJcblx0XHRwbGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fcGxheS1idG4tLWFjdGl2ZScpO1xyXG5cdFx0cGF1c2VCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9jb250ZW50X19wYXVzZS1idG4tLWFjdGl2ZScpO1xyXG5cdFx0cGF1c2VCdXR0b25Db250cm9scy5jbGFzc0xpc3QucmVtb3ZlKCdjb250cm9sc19fcGF1c2UtLWFjdGl2ZScpO1xyXG5cdFx0cGxheUJ1dHRvbkNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzX19wbGF5LS1hY3RpdmUnKTtcclxuXHRcdGhpZGVDb250cm9scy5jbGFzc0xpc3QuYWRkKCd2aWRlb2NvbnRlbnRfX2NvbnRyb2xzLS1wYXVzZWQnKTtcclxuXHRcdHBsYXllci5wYXVzZVZpZGVvKCk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGVTdG9wID0gKCkgPT4ge1xyXG5cdFx0cGxheUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCd2aWRlb2NvbnRlbnRfX3BsYXktYnRuLS1hY3RpdmUnKTtcclxuXHRcdHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fcGF1c2UtYnRuLS1hY3RpdmUnKTtcclxuXHRcdHBhdXNlQnV0dG9uQ29udHJvbHMuY2xhc3NMaXN0LnJlbW92ZSgnY29udHJvbHNfX3BhdXNlLS1hY3RpdmUnKTtcclxuXHRcdHBsYXlCdXR0b25Db250cm9scy5jbGFzc0xpc3QuYWRkKCdjb250cm9sc19fcGxheS0tYWN0aXZlJyk7XHJcblx0XHRwbGF5ZXIuc3RvcFZpZGVvKCk7XHJcblx0fVxyXG5cclxuXHQvL3ZvbHVtZVxyXG5cdG11dGVWb2x1bWUgPSAoKSA9PiB7XHJcblx0XHR2b2x1bWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PntcclxuXHRcdFx0aWYgKHBsYXllci5pc011dGVkKCkpIHtcclxuXHRcdFx0XHRwbGF5ZXIudW5NdXRlKCk7XHJcblx0XHRcdFx0dm9sdW1lQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbnRyb2xzX192b2x1bWUtLW11dGVkJyk7XHJcblx0XHRcdFx0cGxheWVyLnNldFZvbHVtZSg1MCk7XHJcblx0XHRcdFx0dm9sdW1lSW5wdXQudmFsdWUgPSA1MDtcclxuXHRcdFx0fSBlbHNlIFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cGxheWVyLm11dGUoKTtcclxuXHRcdFx0XHR2b2x1bWVCdXR0b24uY2xhc3NMaXN0LmFkZCgnY29udHJvbHNfX3ZvbHVtZS0tbXV0ZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZXRWb2x1bWUgPSAoKSA9PiB7XHJcblx0XHRwbGF5ZXIuc2V0Vm9sdW1lKHZvbHVtZUlucHV0LnZhbHVlKTtcclxuXHRcdHZvbHVtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcclxuXHRcdFx0cGxheWVyLnNldFZvbHVtZShlLnRhcmdldC52YWx1ZSk7XHJcblx0XHRcdGlmKGUudGFyZ2V0LnZhbHVlID09IDApIHtcclxuXHRcdFx0XHR2b2x1bWVCdXR0b24uY2xhc3NMaXN0LmFkZCgnY29udHJvbHNfX3ZvbHVtZS0tbXV0ZWQnKTtcclxuXHRcdFx0XHRwbGF5ZXIubXV0ZSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZvbHVtZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdjb250cm9sc19fdm9sdW1lLS1tdXRlZCcpO1xyXG5cdFx0XHRcdHBsYXllci51bk11dGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdC8vZHVyYXRpb25cclxuXHRzZXRUb3RhbFRpbWUgPSAoKSA9PiB7XHJcblx0XHR0b3RhbFRpbWVFbGVtLmlubmVySFRNTCA9IGZvcm1hdER1cnRpb24ocGxheWVyLmdldER1cmF0aW9uKCkpO1xyXG5cdH1cclxuXHJcblx0c2V0Q3VycmVudFRpbWUgPSAoKSA9PiB7XHJcblx0XHRjdXJyZW50VGltZUVsZW0uaW5uZXJIVE1MID0gZm9ybWF0RHVydGlvbihwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKSk7XHJcblx0XHR0aW1lbGluZS52YWx1ZSA9IHBsYXllci5nZXRDdXJyZW50VGltZSgpO1xyXG5cdH1cclxuXHJcblx0Zm9ybWF0RHVydGlvbiA9ICh0aW1lKSA9PiB7XHJcblx0XHRjb25zdCBzZWNvbmRzID0gTWF0aC5mbG9vcih0aW1lICUgNjApO1xyXG5cdFx0Y29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IodGltZSAvIDYwKSAlIDYwIDtcclxuXHRcdGlmIChtaW51dGVzID09IDAgJiYgc2Vjb25kcyA8IDEwKSB7XHJcblx0XHRcdHJldHVybiAoJzA6MCcrYCR7c2Vjb25kc31gKTtcclxuXHRcdH0gZWxzZSBpZiAobWludXRlcyA9PSAwKSB7XHJcblx0XHRcdHJldHVybiAoJzA6JytgJHtzZWNvbmRzfWApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIChgJHttaW51dGVzfWArJzonK2Ake3NlY29uZHN9YCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Y2hhbmdlU3BlZWQgPSAoKSA9PiB7XHJcblx0XHRzcGVlZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNoYW5nZVNwZWVkVmFsdWUpO1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlU3BlZWRWYWx1ZSA9ICgpID0+IHtcclxuXHRcdGlmIChwbGF5ZXIuZ2V0UGxheWJhY2tSYXRlKCkgPT0gMSkge1xyXG5cdFx0XHRwbGF5ZXIuc2V0UGxheWJhY2tSYXRlKDIpO1xyXG5cdFx0XHRzcGVlZEJ1dHRvbi5pbm5lckhUTUwgPSBcIjJ4XCI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwbGF5ZXIuc2V0UGxheWJhY2tSYXRlKDEpO1xyXG5cdFx0XHRzcGVlZEJ1dHRvbi5pbm5lckhUTUwgPSBcIjF4XCI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Ly90aW1lbGluZVxyXG5cdHNldFRpbWVsaW5lUGFyYW1zID0gKCkgPT4ge1xyXG5cdFx0dGltZWxpbmUuc2V0QXR0cmlidXRlKCdtaW4nLCAwKTtcclxuXHRcdHRpbWVsaW5lLnNldEF0dHJpYnV0ZSgnbWF4JywgcGxheWVyLmdldER1cmF0aW9uKCkpO1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlVGltZSA9ICgpID0+IHtcclxuXHRcdHRpbWVsaW5lLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcclxuXHRcdFx0cGxheWVyLnNlZWtUbyhlLnRhcmdldC52YWx1ZSk7XHJcblx0XHRcdHRvZ2dsZVBsYXkoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufSkoKTsiXX0=
