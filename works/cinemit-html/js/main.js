$(function(){
	
	// Crossbrowser input placeholder script
	
	var $inputText = $('.query-input input, .query-input textarea');
	$inputText.each(function(){
	  if(!$(this).val()){
		$(this).parent().find('label').show();
		//$(this).parent().css({backgroundPosition:'0 0'});
	  }else{
		$(this).parent().find('label').hide();
		//$(this).parent().css({backgroundPosition:'0 bottom'});
	  }
	});
	$inputText.focus(function(){
	  if(!$(this).val()){
		$(this).parent().find('label').css({'opacity':'0.4'});
		//$(this).parent().css({backgroundPosition:'0 bottom'});
	  }
	});
	$inputText.keydown(function(){
	  if(!$(this).val()){
		$(this).parent().find('label').hide();
		//$(this).parent().css({backgroundPosition:'0 bottom'});
	  }
	});
	$inputText.blur(function(){
	  if(!$(this).val()){
		$(this).parent().find('label').show().css({'opacity':'1'});
		//$(this).parent().css({backgroundPosition:'0 0'});
	  }
	});

	//Drop down Init

	$('#a-select').selectBoxIt({ defaultText: "Newyork, NY" });
	$('#city-select-2').selectBoxIt({ defaultText: "Choose a city" });
	$('#city-select').selectBoxIt({ defaultText: "Choose your city" });

	//Form select
	$('#metro').selectBoxIt({ defaultText: "Newyork" });
	$('#month').selectBoxIt({ defaultText: "Jan" });
	$('#day').selectBoxIt({ defaultText: "01" });
	$('#year').selectBoxIt({ defaultText: "2013" });
	$('#gender').selectBoxIt({ defaultText: "Male" });
	$('#income').selectBoxIt({ defaultText: "$0 - $25000" });
	$('#industry').selectBoxIt({ defaultText: "Arts/Education" });


	//Nano scroll Init

	$(".nano").nanoScroller();
	$('#account-info').on('click', function(){
		$(this).toggleClass('active');
		$('.account-info').slideToggle();
	});


	$(document).mouseup(function (e) {

	    var $targ = $(e.target);
	    // if we are the link or the box, exit early
	    if ($targ.is('#account-info') || $targ.is('.account-info')) return; 
	    // if we have a parent who is either, also exit early
	    if ($targ.closest('.account-info,#account-info').length) return;

	    // hide the box, unselect the link
	    $("#account-info").removeClass("selected");
	    $(".account-info").slideUp('slow');
	
	});

	//Tabs Init

	$( "#tabs" ).tabs();
	$( "#tab-2" ).tabs();

	centering('#login-form');

	$('.close-pop').on('click', function(){
		$('.login-popup').fadeOut();
	})

});


$(window).load(function(){

	//Flexslider init 

	$('#side-carousel').flexslider({
		animation: "slide",
		controlNav: "thumbnails",
		start: function(slider){
			$('body').removeClass('loading');
	}

	});

	 $('#carousel-slider').flexslider({
	    animation: "slide",
	    animationLoop: true,
	    itemWidth: 197,
	    itemMargin: 5,
	    controlNav: false,
	 });

});

$(window).resize(function() {

	$('#side-carousel').flexslider({
		animation: "slide",
		controlNav: "thumbnails",
		start: function(slider){
			$('body').removeClass('loading');
	}

	});

	$('#carousel-slider').flexslider({
	    animation: "slide",
	    animationLoop: true,
	    itemWidth: 210,
	    itemMargin: 5,
	    controlNav: false,
	 });

	$('#a-select').selectBoxIt({ defaultText: "Newyork, NY" });
	$('#city-select-2').selectBoxIt({ defaultText: "Choose a city" });
	$('#city-select').selectBoxIt({ defaultText: "Choose your city" });

	centering('#login-form');

});

function centering(element) {
	var elemWidth = $(element).width();
	var elemHeight = $(element).height();
	var wWidth = $(window).width();
	var wHeight = $(window).height();

	$(element).css({
		//'top': (wHeight/2) - (elemHeight/2), 
		'left' :  (wWidth/2) - (elemWidth/2)
	})
}

