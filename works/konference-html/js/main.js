$(function(){


  $('.input-check').uniform();

  $('.show-menu').click(function(event) {
    event.preventDefault();

    $('.global-menu').slideToggle(500);
    $(this).toggleClass('active');
  });

  var windowWidth = $(window).width();

  if(windowWidth<768) {

    $('.global-menu').before('<div class="clear"></div>');
  
  }

});

$(window).load(function(){
  equalHeight($(".speaker-list li"));
});

$(window).resize(function(){
  $(".speaker-list li").css('height', '');
  equalHeight($(".speaker-list li"));

  var windowWidth = $(window).width();

  if(windowWidth>768) {
    $('.global-menu').css('display','block');
    $('header .clear').remove();
  }
  else {
    $('.global-menu').css('display','none');
    $('header .clear').remove();
    $('.global-menu').before('<div class="clear"></div>');
  }

});





  //$(".offer-tab-content .offer-item > li").css('height', '');
  //equalHeight($(".offer-tab-content .offer-item > li"));
  

function equalHeight(group) {
   tallest = 0;
   group.each(function() {
      thisHeight = $(this).height();
      if(thisHeight > tallest) {
         tallest = thisHeight;
      }
   });
   group.height(tallest);
}




