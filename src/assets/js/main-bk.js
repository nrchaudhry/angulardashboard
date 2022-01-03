$(document).ready(function () {
	"use strict";

	/*==============================
	Header
	==============================*/
	$(window).on('scroll', function () {
		if ($(this).scrollTop() > 0){
			$('.header').addClass("header--active");
		} else {
			$('.header').removeClass("header--active");
		}
	});

	/*==============================
	Mobile navigation
	==============================*/
	$('.header__menu').on('click', function() {
		$(this).toggleClass('header__menu--active');
		$('.header__nav').toggleClass('header__nav--active');
		$('.header__btns').toggleClass('header__btns--active');
	});

	/*==============================
	Partners slider
	==============================*/
	$('.partners__slider').owlCarousel({
		mouseDrag: false,
		dots: false,
		loop: true,
		autoplay: true,
		autoplayTimeout: 5000,
		smartSpeed: 500,
		responsive : {
			0 : {
				items: 2,
				margin: 20
			},
			576 : {
				items: 3,
				margin: 20
			},
			768 : {
				items: 4,
				margin: 20
			},
			992 : {
				items: 5,
				margin: 25
			},
			1200 : {
				items: 6,
				margin: 30
			}
		}
	});

	/*==============================
	Testimonial slider
	==============================*/
	$('.testimonial-slider').owlCarousel({
		mouseDrag: false,
		dots: true,
		loop: true,
		autoplay: true,
		autoplayTimeout: 5000,
		smartSpeed: 500,
		margin: 0,
		responsive : {
			0 : {
				items: 1,
				margin: 15,
			},
			576 : {
				items: 1,
				margin: 0,
			},
			992 : {
				items: 2,
			},
			1200 : {
				items: 3,
			}
		}
	});

	/*==============================
	Section background img
	==============================*/
	$('.section--bg').each(function(){
		if ($(this).attr('data-bg')){
			$(this).css({
				'background': 'url(' + $(this).data('bg') + ')',
				'background-position': 'center center',
				'background-repeat': 'no-repeat',
				'background-size': 'cover'
			});
		}
	});

	/*==============================
	Smooth scroll
	==============================*/
	var scroll = new SmoothScroll('[data-scroll]', {
		ignore: '[data-scroll-ignore]',
		header: '.header',
		speed: 600,
		offset: 0,
		easing: 'easeInOutCubic',
	});

	/*==============================
	Modal
	==============================*/
	$('.section__video').magnificPopup({
		removalDelay: 200,
		type: 'iframe',
		preloader: false,
		mainClass: 'mfp-fade',
	});
});