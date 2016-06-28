(function($) {

	$.support.cors = true;

	$(function() {

		//	back to Home scroll

		$(window).scroll(function () {if ($(this).scrollTop() > 0) {$('#scroller').fadeIn();} else {$('#scroller').fadeOut();}});
		$('#scroller').click(function () {$('body,html').animate({scrollTop: 0}, 2000); return false;});

		//	jCARUSEL controls

		$('.jcarousel').jcarousel({
			animation: 'slow',
			wrap: 'circular'
		})
			.jcarouselAutoscroll({
			interval: 2000,
			target: '+=1',
			autostart: true
		});
		$('.arrows__prev')
			.jcarouselControl({
			target: '-=1'
		});
		$('.arrows__next')
			.jcarouselControl({
			target: '+=1'
		});
		$('.about__steps').hover(
			function(){
				$('.jcarousel').jcarouselAutoscroll('stop');
			},
			function(){
				$('.jcarousel').jcarouselAutoscroll('start')
			}
		);

		//	partners data generation

		var partnersList = $('#partners__list').html();
		var content = tmpl(partnersList, partners);
		$('.partners__wrap').append(content);


		//	partners slider

		var opened = false;

		function showMorePartners(e) {
			e.preventDefault();
			var $partners = $('.partners__list-hidden');
			if (opened) {

				opened = false;

				$partners.slideUp();
				$('.partners__button').html('See other partners');

			} else {
				opened = true;
				$partners.slideDown();
				$('.partners__button').html('Collapse');
			}
		}
		$('.partners__button').on("click", showMorePartners);


		// fancybox init
		$('.fancybox').fancybox();



		//	 smooth scrolling

		$('a[href^="#"]').bind('click.smoothscroll',function (e) {
			e.preventDefault();

			var target = this.hash,
				$target = $(target);

			$('html, body').stop().animate({
				'scrollTop': $target.offset().top
			}, 2000, 'swing', function () {
				window.location.hash = target;
			});
		});

		//	picture ajax request
		var img = {
			photos: [
			],
			word: [ ""
			],
			firstInit: true
		};

		var firstLoad = true;
		var discoverIdeas = document.querySelector('.discover__input');

		function getPic() {
				img.photos = [];

				var requestStr = 'https://pixabay.com/api/?key=2274518-319e8a01ddf6f389d5b69e89d&q='+ img.word[0] + '&image_type=photo&per_page=50';

				function firstLoadData(data) {
						img.word = [];
						firstLoad = false;
						var i = 0;
						while(i < 7) {
							function getRandom(min, max) {
							  return Math.random() * (max - min) + min;
							}
							var random = Math.round(getRandom(0, 49));
							img.photos.push(data.hits[random].webformatURL);
							img.word.push(data.hits[random].tags);
							i++;
						}
							render();
							initIsotope();
					}
					function searchData(data) {
						img.word = [];	
						img.word[0] = discoverIdeas.value;
						var i = 0;
						while(i < 7) {
							function getRandom(min, max) {
							  return Math.random() * (max - min) + min;
							}
							random = Math.round(getRandom(0, 49));
							img.photos.push(data.hits[random].webformatURL);
							img.word.push(img.word[0]);
							i++;
						}
							render();
							initIsotope();
							discoverIdeas.value = '';
					}
				var request = $.ajax({
					url: requestStr
				});
				if (firstLoad) {
					request.done(firstLoadData);
				} else {
				request.done(searchData);
				}
		}
		function initIsotope() {
			var elem = document.querySelector('.ideas__data');
			var isotopeInst = new Isotope( elem, {
				itemSelector: '.ideas__item',
				layoutMode: 'masonry',
				transitionDuration: '1.6s',
				masonry: {
					gutter: 20
				}
			});
		}
		function render() {
			var ideasList = $('#picture-template').html();
			var ideasContent = tmpl(ideasList,  {
						img: img
					});
			var element = document.querySelector('.ideas__data');
			element.innerHTML = ideasContent;

		}
		function firstInit() {
			getPic();
		}
		firstInit();

		//	search img button
		$('.discover__search').submit(function(e) {
			e.preventDefault();
			img.word[0] = discoverIdeas.value;
			getPic();
		});


	});

})(jQuery);
