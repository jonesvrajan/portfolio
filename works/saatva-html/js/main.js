$(function(){

	$( ".compare-select" ).change(function() {
  		var optionSelected = $("option:selected", this);
  		var currentDisplay = $(optionSelected).attr('href');
  		$('.result .compare-company').fadeOut();
  		$('#' + currentDisplay).fadeIn();
  
	});

	addClass('.saatva-details');
	addClass('#compare-1');
	addClass('#compare-2');
	addClass('#compare-3');
	addClass('#compare-4');
	addClass('#compare-5');

	$('.mattress-size li a').click(function(e) {
		e.preventDefault();
		$('.mattress-size li a').removeClass('active');
		$(this).addClass('active');
	});

	$('.cart-list .show-details').click(function(e){
		e.preventDefault();
		var Stat = $('.item').css('display');
		if(Stat == 'table-row') {
			$('a.show-details').text('Show Details');
		}
		else {
			$('a.show-details').text('Hide Details');
		}		
		$('.cart-list .item').slideToggle();

	});

	if($("#billing-address-chk").is(':checked'))
	    $("#billing-address").hide();  // checked
	else
	    $("#billing-address").show();

	$("#billing-address-chk").change(function(){
		if($("#billing-address-chk").is(':checked'))
	    $("#billing-address").fadeOut();  // checked
			else
	    $("#billing-address").fadeIn();
	});

	$('.interview-list .featured-row').click(function(){
		window.location=$(this).find("a").attr("href"); 
     	return false;
	});

	$('.content-inner .diff').each(function(){
	
		$(this).hover(function(){
			$(this).addClass('active');
			var currentTab = $(this).attr('figure');
			var targetLi = $('.mattress-points').find('li#' + currentTab);
			$('.mattress-points li .ring-img').fadeOut();
			$(targetLi).find('.ring-img').fadeIn();
		},function(){
			$('.content-inner .diff').removeClass('active');
			$('.mattress-points li .ring-img').fadeOut();
		})
	
	});
	
	$('.mattress-points li').each(function(){

		$(this).hover(function(){
			$('.mattress-points li .ring-img').fadeOut();
			$(this).find('.ring-img').fadeIn();
			var currentTab2 = $(this).attr('id');
			var targetLi2 = $('.content-inner').find('#'+currentTab2);
			//$('.content-inner .diff').removeClass('active');
			$(targetLi2).addClass('active');
		},function(){
			$('.content-inner').find('.diff').removeClass('active');
		});

	});



	$('.show-menu').click(function(event) {
		event.preventDefault();

		$(this).next('ul').slideToggle(300);
		$(this).toggleClass('active');

	});

	$('.featured-content p').equalHeights();
	$('.material-list > li > ul').equalHeights();
	oddEven('.am-content-list');

	//Accordion script.

	$('.accordion-title').click(function(e){
		e.preventDefault();
		$(this).toggleClass('active');
		$('.accordion-title').not($(this)).removeClass('active');
		$(this).next('.accordion-desc').slideToggle();
		$('.accordion-desc').not($(this).next()).slideUp();
	});

	$('.accordion-menu').click(function(e){
		e.preventDefault();	
		
		if(false == $(this).next().is(':visible')) {
			$('.feedback-form-ul').slideUp();
			$('.accordion-menu').removeClass('active');
		}
		$(this).next('.feedback-form-ul').slideToggle();
		$(this).toggleClass('active');



	});

});

$(window).resize(function(){

	//location.reload();

	$('.featured-content p').css('height', 'auto');
	$('.featured-content p').equalHeights();
	$('.material-list > li > ul').css('height', 'auto');
	$('.material-list > li > ul').equalHeights();

	var windowWidth = $(window).width();

	if(windowWidth>768) {
		$('.show-menu').next('ul').css('display','block');
	}
	else {
		$('.show-menu').next('ul').css('display','none');
	}

});


$(document).mouseup(function (e) {

	var $targ = $(e.target);
    if ($targ.is('.nav-ul, .show-menu') || $targ.is('.nav-ul li a')) return; 
    if ($(window).width() < 768 ) {

	    $('.nav-ul').hide();
	    $('.show-menu').removeClass('active');	
	    $('body').removeClass('mobility');	
    }
});

function oddEven(Name) {

	$(Name).find('li:odd').addClass('li-odd');
	$(Name).find('li:even').addClass('li-even');
	$(Name).find('tr:odd').addClass('tr-odd');
	$(Name).find('tr:even').addClass('tr-even');
}

function addClass(ulClassname) {
	$(ulClassname).find('li').each(function(i) {
  		$(this).addClass("li-" + (i+1));
	});
}

