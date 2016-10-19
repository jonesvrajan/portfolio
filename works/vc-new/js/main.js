$(function(){


  $('.sort-options .sort-option-list li a').click(function(e){
    e.preventDefault();
    var selectedText = $(this).text();
    $(this).closest('.sort-options').find('> a').text(selectedText).append('<i class="icon-sort"></i>');
  });

  var windowWidth = $(window).width();

  if($('.datepicker').length>0) {
    $('.datepicker').datepicker({
      changeYear: true,
      yearRange: "-1:+2",
    });
  }

  if($('.autocomplete').length>0) {
    autocomplete();
  }
  
  $('.calendar-icon').click(function(){
    $(this).prev('input').focus();
  });
  
  if(windowWidth>801) {
    equalHeight($(".user-preference-list > li"));

  };

   if(windowWidth>480) {
    equalHeight($(".team-list > li"));
    equalHeight($(".special-offer-wrapper .special-offer-wrap-item"));
   }

  if(windowWidth<801) {
      $('#swap-content').remove().appendTo('#mobile-content');
    } else {
      $('#swap-content').remove().appendTo('#screen-content');
    }


  //$( "#datepicker" ).datepicker();

  $('#profile-select').uniform();
  

  //$('.top-panel.mobile-menu .left-menu').css('display' ,'none');

  $('.view-all-wrap a').click(function(e){
    e.preventDefault();
    $(this).toggleClass('active');
    $('.merchant-latest-news .appended').slideToggle();
  });

  $('#category-select, #merchant-select').uniform();

  /*$('.show-menu-left').click(function(){
    $('.top-panel.mobile-menu .left-menu').css('display' ,'block');
  });*/

  $.slidebars({
      disableOver: 800, // integer or false
  });

    //equalHeight($(".offer-tab-content .offer-item > li"));

    $('#horizontalTab').easyResponsiveTabs({
      type: 'default', //Types: default, vertical, accordion           
      width: 'auto', //auto or any width like 600px
      fit: true,   // 100% fit in a container
    });

    $('#horizontalTab-2').easyResponsiveTabs({
      type: 'default', //Types: default, vertical, accordion           
      width: 'auto', //auto or any width like 600px
      fit: true,   // 100% fit in a container
    });


    if(windowWidth<1050) {
      $('.category').click(function(e){
        e.preventDefault();
        $('.global-menu').find('.menu-item').slideToggle('slow');
      })
    }

    $('.search-icon').click(function(e){
      e.preventDefault();
      $('.search-panel').toggle();
    });

    $('#store-dropdown').click(function(event){
      event.preventDefault();
    });

    $('#store-dropdown').hover(
      function() {
        $( this ).find('.sortby-site').slideDown();
      }, function() {
        $( this ).find('.sortby-site').slideUp();
      }
      );

    $('.top-panel .has-sub-menu').click(function(){
      $(this).next('ul').slideToggle();
      $(this).toggleClass('active');
    });

    $('.top-panel .has-sub-menu').hover(
      function() {
        $( this ).find('.sub-menu').slideDown();
      }, function() {
        $( this ).find('.sub-menu').fadeOut();
      }
      );

    $('#login').click(function(e){
      e.preventDefault();
      $('#login-pop').fadeIn();
        centering('.popup');
    });

    $('.get-voucher').click(function(e){
      e.preventDefault();
      $('#get-voucher').fadeIn();
        centering('.popup2');
        $('input').select();
    });

    $('#coupon-error').click(function(e){
      e.preventDefault();
      $('#coupon-error-wrap').fadeIn();
        centering('#coupon-error-wrap .popup2');
    });

    $('#faq').click(function(e){
      e.preventDefault();
      $('#faq-wrap').fadeIn();
        centering('#faq-wrap .popup2');
    });

    $('#cancel-order').click(function(e){
      e.preventDefault();
      $('#cancel-order-wrap').fadeIn();
        centering('#cancel-order-wrap .popup2');
    });

    $('.popup .icon-close').click(function(e){
      $('.popup-wrap').fadeOut();
    }); 

centering('.popup2');

  $('.mobile-popup .tab-content .tab-cnt-section:first-child').fadeIn();
  $('.mobile-popup .tab-head li:first-child').addClass('active');
  $('.mobile-popup .tab-head li a').click(function(event) {
    event.preventDefault();
    $('.mobile-popup .tab-content .tab-cnt-section').fadeOut();
    $('.mobile-popup .tab-head li').removeClass('active');
    $(this).closest('li').addClass('active');

    var currentTab = $(this).attr('href');
    $(currentTab).fadeIn();

  });



});
$(window).load(function() {
  $('.flexslider').flexslider({
    animation: "slide"
  });

  verticalCentering ();
  
});


$(window).resize(function(){

  centering('.popup');
  centering('.popup2');
  centering('#coupon-error-wrap .popup2');
  centering('#cancel-order-wrap .popup2');
  centering('#faq-wrap .popup2');

  verticalCentering ();

  var windowWidth = $(window).width();

  if(windowWidth>801) {

    $(".user-preference-list > li").css('height', '');
      equalHeight($(".user-preference-list > li"));
    }

    if(windowWidth<801) {
      $('#swap-content').remove().appendTo('#mobile-content');
    } else {
      $('#swap-content').remove().appendTo('#screen-content');
    }

       if(windowWidth>480) {
        $(".team-list > li").css('height', '');
        equalHeight($(".team-list > li"));
        $(".special-offer-wrapper .special-offer-wrap-item").css('height', '');
        equalHeight($(".special-offer-wrapper .special-offer-wrap-item"));
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

function centering(element) {
  var elemWidth = $(element).width();
  var elemHeight = $(element).height();
  var wWidth = $(window).width();
  var wHeight = $(window).height();

  $(element).css({
    'top': (wHeight/2) - (elemHeight/2), 
    'left' :  (wWidth/2) - (elemWidth/2)
  })

}


function verticalCentering () {

  $('.deal-tab-wrap .offer-tab-content .offer-list').each(function(){
    var rowHeight = $(this).height();
    var targetHeight = $(this).find('.mobile-left-cnt img').height();
    if (targetHeight !== null ) {
    $(this).find('.mobile-left-cnt').css({
    'position' : 'relative',
    'top' : (rowHeight - targetHeight ) / 2 - 20
  });}
  });

}

function autocomplete() {
  var availableTags = ["ActionScript","AppleScript","Asp","BASIC","C","C++","Clojure","COBOL","ColdFusion","Erlang","Fortran","Groovy","Haskell","Java",
                      "JavaScript","Lisp","Perl","PHP","Python","Ruby","Scala","Scheme","Jabong","Amazon","Babyoye","Mynthra","eBay"];
  $('.autocomplete').autocomplete({
      source: availableTags
  });
}
