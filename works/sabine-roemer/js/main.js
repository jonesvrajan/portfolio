$(document).ready(function(){

	var windowWidth = $(window).width();
	var mediaTablet = 768;

	$('.carousel').carousel();
	
	$('#navbar > .nav').css('height', '' );
	
	widthSettingSubmenu();

	$(window).resize(function() {

		$('#navbar > .nav').css('height', '' );

		widthSettingSubmenu();

		
	});

	$(window).load(function(){

		$('body').css('opacity', '1');

	});

	$('#story-button').click(function(event){
		event.preventDefault();
		$(this).toggleClass('active');
		$('.story-page').toggleClass('next-story');
	});

	$('.read-more-link').click(function(event){
		event.preventDefault();
		$('.more-content').slideDown();
		$(this).hide();
	});

	$('.close-content').click(function(event){
		event.preventDefault();
		$('.more-content').slideUp();
		$('.read-more-link').show();
	});


});

function widthSettingSubmenu () {

	var mainMenuWidth = $('#navbar .navbar-nav').width();

	var subMenuHeight = $('.sub-menu').height();

	var menuHeight = $('#navbar > .nav').height();

	$('.sub-menu').css('width', mainMenuWidth);

	$('#navbar > .nav').css('height', menuHeight + subMenuHeight);
	
}