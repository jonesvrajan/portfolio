// Easy Responsive Tabs Plugin
// Author: Samson.Onna <Email : samson3d@gmail.com>
(function ($) {
    $.fn.extend({
        easyResponsiveTabs: function (options) {
            //Set the default values, use comma to separate the settings, example:
            var defaults = {
                type: 'default', //default, vertical, accordion;
                width: 'auto',
                fit: true,
                closed: 'tab',
                activate: function(){}
            }
            //Variables
            var options = $.extend(defaults, options);            
            var opt = options, jtype = opt.type, jfit = opt.fit, jwidth = opt.width, vtabs = 'vertical', accord = 'accordion';
            var hash = window.location.hash;
            var historyApi = !!(window.history && history.replaceState);
            
            //Events
            $(this).bind('tabactivate', function(e, currentTab) {
                if(typeof options.activate === 'function') {
                    options.activate.call(currentTab, e)
                }
            });

            //Main function
            this.each(function () {
                var $respTabs = $(this);
                var $respTabsList = $respTabs.find('ul.resp-tabs-list');
                var respTabsId = $respTabs.attr('id');
                $respTabs.find('ul.resp-tabs-list li').addClass('resp-tab-item');
                $respTabs.css({
                    'display': 'block',
                    'width': jwidth
                });

                $respTabs.find('.resp-tabs-container > div').addClass('resp-tab-content');
                jtab_options();
                //Properties Function
                function jtab_options() {
                    if (jtype == vtabs) {
                        $respTabs.addClass('resp-vtabs');
                    }
                    if (jfit == true) {
                        $respTabs.css({ width: '100%', margin: '0px' });
                    }
                    if (jtype == accord) {
                        $respTabs.addClass('resp-easy-accordion');
                        $respTabs.find('.resp-tabs-list').css('display', 'none');
                    }
                }

                //Assigning the h2 markup to accordion title
                var $tabItemh2;
                $respTabs.find('.resp-tab-content').before("<h2 class='resp-accordion' role='tab'><span class='resp-arrow'></span></h2>");

                var itemCount = 0;
                $respTabs.find('.resp-accordion').each(function () {
                    $tabItemh2 = $(this);
                    var $tabItem = $respTabs.find('.resp-tab-item:eq(' + itemCount + ')');
                    var $accItem = $respTabs.find('.resp-accordion:eq(' + itemCount + ')');
                    $accItem.append($tabItem.html());
                    $accItem.data($tabItem.data());
                    $tabItemh2.attr('aria-controls', 'tab_item-' + (itemCount));
                    itemCount++;
                });

                //Assigning the 'aria-controls' to Tab items
                var count = 0,
                    $tabContent;
                $respTabs.find('.resp-tab-item').each(function () {
                    $tabItem = $(this);
                    $tabItem.attr('aria-controls', 'tab_item-' + (count));
                    $tabItem.attr('role', 'tab');

                    //Assigning the 'aria-labelledby' attr to tab-content
                    var tabcount = 0;
                    $respTabs.find('.resp-tab-content').each(function () {
                        $tabContent = $(this);
                        $tabContent.attr('aria-labelledby', 'tab_item-' + (tabcount));
                        tabcount++;
                    });
                    count++;
                });
                
                // Show correct content area
                var tabNum = 0;
                if(hash!='') {
                    var matches = hash.match(new RegExp(respTabsId+"([0-9]+)"));
                    if (matches!==null && matches.length===2) {
                        tabNum = parseInt(matches[1],10)-1;
                        if (tabNum > count) {
                            tabNum = 0;
                        }
                    }
                }

                //Active correct tab
                $($respTabs.find('.resp-tab-item')[tabNum]).addClass('resp-tab-active');

                //keep closed if option = 'closed' or option is 'accordion' and the element is in accordion mode
                if(options.closed !== true && !(options.closed === 'accordion' && !$respTabsList.is(':visible')) && !(options.closed === 'tabs' && $respTabsList.is(':visible'))) {                  
                    $($respTabs.find('.resp-accordion')[tabNum]).addClass('resp-tab-active');
                    $($respTabs.find('.resp-tab-content')[tabNum]).addClass('resp-tab-content-active').attr('style', 'display:block');
                }
                //assign proper classes for when tabs mode is activated before making a selection in accordion mode
                else {
                    $($respTabs.find('.resp-tab-content')[tabNum]).addClass('resp-tab-content-active resp-accordion-closed')
                }

                //Tab Click action function
                $respTabs.find("[role=tab]").each(function () {
                   
                    var $currentTab = $(this);
                    $currentTab.click(function () {
                        
                        var $currentTab = $(this);
                        var $tabAria = $currentTab.attr('aria-controls');

                        if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
						    $currentTab.next('.resp-tab-content-active').slideUp('', function () { });
                            $currentTab.removeClass('resp-tab-active');
                            return false;
                        }
                        if (!$currentTab.hasClass('resp-tab-active') && $currentTab.hasClass('resp-accordion')) {
							$respTabs.find('.resp-tab-item').removeClass('resp-tab-active');
                            $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');
                            $respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').slideDown().addClass('resp-tab-content-active');
                        } else {
                            $respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
                            $respTabs.find('.resp-tab-content-active').removeAttr('style').removeClass('resp-tab-content-active');
                            $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');
                            $respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').addClass('resp-tab-content-active').attr('style', 'display:block');
                        }
                        //Trigger tab activation event
                        $currentTab.trigger('tabactivate', $currentTab);
                                     
                    });
                    
                });
                
                //Window resize function                   
                $(window).resize(function () {
					
				//	$respTabs.find('.resp-accordion-closed').removeAttr('style');
				//horizontalTab means first part

					var a = $('#horizontalTab .resp-tab-active').attr('aria-controls');
					var  selector =  '#horizontalTab .tab-content[aria-labelledby='+a+']';
					var selHeader= '#horizontalTab .resp-accordion[aria-controls='+a+']';
					$('#horizontalTab .tab-content').hide();
					$('#horizontalTab .resp-accordion').removeClass('resp-tab-active');
					$(selector).show();
					$(selHeader).addClass('resp-tab-active');

				//horizontalTab-2 means second part

					var b = $('#horizontalTab-2 .resp-tab-active').attr('aria-controls');
					var  selectorb =  '#horizontalTab-2 .resp-tab-content[aria-labelledby='+b+']';
					var selHeaderb= '#horizontalTab-2 .resp-accordion[aria-controls='+b+']';
					$('#horizontalTab-2 .resp-tab-content').hide();
					$('#horizontalTab-2 .resp-accordion').removeClass('resp-tab-active');
					$(selectorb).show();
					$(selHeaderb).addClass('resp-tab-active');
                });
            });
        }
    });
})(jQuery);

/*
 * jQuery FlexSlider v2.2.2
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
;
(function ($) {

  //FlexSlider: Object Instance
  $.flexslider = function(el, options) {
    var slider = $(el);

    // making variables public
    slider.vars = $.extend({}, $.flexslider.defaults, options);

    var namespace = slider.vars.namespace,
        msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
        touch = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch) && slider.vars.touch,
        // depricating this idea, as devices are being released with both of these events
        //eventType = (touch) ? "touchend" : "click",
        eventType = "click touchend MSPointerUp keyup",
        watchedEvent = "",
        watchedEventClearTimer,
        vertical = slider.vars.direction === "vertical",
        reverse = slider.vars.reverse,
        carousel = (slider.vars.itemWidth > 0),
        fade = slider.vars.animation === "fade",
        asNav = slider.vars.asNavFor !== "",
        methods = {},
        focused = true;

    // Store a reference to the slider object
    $.data(el, "flexslider", slider);

    // Private slider methods
    methods = {
      init: function() {
        slider.animating = false;
        // Get current slide and make sure it is a number
        slider.currentSlide = parseInt( ( slider.vars.startAt ? slider.vars.startAt : 0), 10 );
        if ( isNaN( slider.currentSlide ) ) slider.currentSlide = 0;
        slider.animatingTo = slider.currentSlide;
        slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide === slider.last);
        slider.containerSelector = slider.vars.selector.substr(0,slider.vars.selector.search(' '));
        slider.slides = $(slider.vars.selector, slider);
        slider.container = $(slider.containerSelector, slider);
        slider.count = slider.slides.length;
        // SYNC:
        slider.syncExists = $(slider.vars.sync).length > 0;
        // SLIDE:
        if (slider.vars.animation === "slide") slider.vars.animation = "swing";
        slider.prop = (vertical) ? "top" : "marginLeft";
        slider.args = {};
        // SLIDESHOW:
        slider.manualPause = false;
        slider.stopped = false;
        //PAUSE WHEN INVISIBLE
        slider.started = false;
        slider.startTimeout = null;
        // TOUCH/USECSS:
        slider.transitions = !slider.vars.video && !fade && slider.vars.useCSS && (function() {
          var obj = document.createElement('div'),
              props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
          for (var i in props) {
            if ( obj.style[ props[i] ] !== undefined ) {
              slider.pfx = props[i].replace('Perspective','').toLowerCase();
              slider.prop = "-" + slider.pfx + "-transform";
              return true;
            }
          }
          return false;
        }());
        slider.ensureAnimationEnd = '';
        // CONTROLSCONTAINER:
        if (slider.vars.controlsContainer !== "") slider.controlsContainer = $(slider.vars.controlsContainer).length > 0 && $(slider.vars.controlsContainer);
        // MANUAL:
        if (slider.vars.manualControls !== "") slider.manualControls = $(slider.vars.manualControls).length > 0 && $(slider.vars.manualControls);

        // RANDOMIZE:
        if (slider.vars.randomize) {
          slider.slides.sort(function() { return (Math.round(Math.random())-0.5); });
          slider.container.empty().append(slider.slides);
        }

        slider.doMath();

        // INIT
        slider.setup("init");

        // CONTROLNAV:
        if (slider.vars.controlNav) methods.controlNav.setup();

        // DIRECTIONNAV:
        if (slider.vars.directionNav) methods.directionNav.setup();

        // KEYBOARD:
        if (slider.vars.keyboard && ($(slider.containerSelector).length === 1 || slider.vars.multipleKeyboard)) {
          $(document).bind('keyup', function(event) {
            var keycode = event.keyCode;
            if (!slider.animating && (keycode === 39 || keycode === 37)) {
              var target = (keycode === 39) ? slider.getTarget('next') :
                           (keycode === 37) ? slider.getTarget('prev') : false;
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }
          });
        }
        // MOUSEWHEEL:
        if (slider.vars.mousewheel) {
          slider.bind('mousewheel', function(event, delta, deltaX, deltaY) {
            event.preventDefault();
            var target = (delta < 0) ? slider.getTarget('next') : slider.getTarget('prev');
            slider.flexAnimate(target, slider.vars.pauseOnAction);
          });
        }

        // PAUSEPLAY
        if (slider.vars.pausePlay) methods.pausePlay.setup();

        //PAUSE WHEN INVISIBLE
        if (slider.vars.slideshow && slider.vars.pauseInvisible) methods.pauseInvisible.init();

        // SLIDSESHOW
        if (slider.vars.slideshow) {
          if (slider.vars.pauseOnHover) {
            slider.hover(function() {
              if (!slider.manualPlay && !slider.manualPause) slider.pause();
            }, function() {
              if (!slider.manualPause && !slider.manualPlay && !slider.stopped) slider.play();
            });
          }
          // initialize animation
          //If we're visible, or we don't use PageVisibility API
          if(!slider.vars.pauseInvisible || !methods.pauseInvisible.isHidden()) {
            (slider.vars.initDelay > 0) ? slider.startTimeout = setTimeout(slider.play, slider.vars.initDelay) : slider.play();
          }
        }

        // ASNAV:
        if (asNav) methods.asNav.setup();

        // TOUCH
        if (touch && slider.vars.touch) methods.touch();

        // FADE&&SMOOTHHEIGHT || SLIDE:
        if (!fade || (fade && slider.vars.smoothHeight)) $(window).bind("resize orientationchange focus", methods.resize);

        slider.find("img").attr("draggable", "false");

        // API: start() Callback
        setTimeout(function(){
          slider.vars.start(slider);
        }, 200);
      },
      asNav: {
        setup: function() {
          slider.asNav = true;
          slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
          slider.currentItem = slider.currentSlide;
          slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
          if(!msGesture){
              slider.slides.on(eventType, function(e){
                e.preventDefault();
                var $slide = $(this),
                    target = $slide.index();
                var posFromLeft = $slide.offset().left - $(slider).scrollLeft(); // Find position of slide relative to left of slider container
                if( posFromLeft <= 0 && $slide.hasClass( namespace + 'active-slide' ) ) {
                  slider.flexAnimate(slider.getTarget("prev"), true);
                } else if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass(namespace + "active-slide")) {
                  slider.direction = (slider.currentItem < target) ? "next" : "prev";
                  slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                }
              });
          }else{
              el._slider = slider;
              slider.slides.each(function (){
                  var that = this;
                  that._gesture = new MSGesture();
                  that._gesture.target = that;
                  that.addEventListener("MSPointerDown", function (e){
                      e.preventDefault();
                      if(e.currentTarget._gesture)
                          e.currentTarget._gesture.addPointer(e.pointerId);
                  }, false);
                  that.addEventListener("MSGestureTap", function (e){
                      e.preventDefault();
                      var $slide = $(this),
                          target = $slide.index();
                      if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass('active')) {
                          slider.direction = (slider.currentItem < target) ? "next" : "prev";
                          slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                      }
                  });
              });
          }
        }
      },
      controlNav: {
        setup: function() {
          if (!slider.manualControls) {
            methods.controlNav.setupPaging();
          } else { // MANUALCONTROLS:
            methods.controlNav.setupManual();
          }
        },
        setupPaging: function() {
          var type = (slider.vars.controlNav === "thumbnails") ? 'control-thumbs' : 'control-paging',
              j = 1,
              item,
              slide;

          slider.controlNavScaffold = $('<ol class="'+ namespace + 'control-nav ' + namespace + type + '"></ol>');

          if (slider.pagingCount > 1) {
            for (var i = 0; i < slider.pagingCount; i++) {
              slide = slider.slides.eq(i);
              item = (slider.vars.controlNav === "thumbnails") ? '<img src="' + slide.attr( 'data-thumb' ) + '"/>' : '<a>' + j + '</a>';
              if ( 'thumbnails' === slider.vars.controlNav && true === slider.vars.thumbCaptions ) {
                var captn = slide.attr( 'data-thumbcaption' );
                if ( '' != captn && undefined != captn ) item += '<span class="' + namespace + 'caption">' + captn + '</span>';
              }
              slider.controlNavScaffold.append('<li>' + item + '</li>');
              j++;
            }
          }

          // CONTROLSCONTAINER:
          (slider.controlsContainer) ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
          methods.controlNav.set();

          methods.controlNav.active();

          slider.controlNavScaffold.delegate('a, img', eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                slider.direction = (target > slider.currentSlide) ? "next" : "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();

          });
        },
        setupManual: function() {
          slider.controlNav = slider.manualControls;
          methods.controlNav.active();

          slider.controlNav.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                (target > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        set: function() {
          var selector = (slider.vars.controlNav === "thumbnails") ? 'img' : 'a';
          slider.controlNav = $('.' + namespace + 'control-nav li ' + selector, (slider.controlsContainer) ? slider.controlsContainer : slider);
        },
        active: function() {
          slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
        },
        update: function(action, pos) {
          if (slider.pagingCount > 1 && action === "add") {
            slider.controlNavScaffold.append($('<li><a>' + slider.count + '</a></li>'));
          } else if (slider.pagingCount === 1) {
            slider.controlNavScaffold.find('li').remove();
          } else {
            slider.controlNav.eq(pos).closest('li').remove();
          }
          methods.controlNav.set();
          (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length) ? slider.update(pos, action) : methods.controlNav.active();
        }
      },
      directionNav: {
        setup: function() {
          var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li><a class="' + namespace + 'prev" href="#">' + slider.vars.prevText + '</a></li><li><a class="' + namespace + 'next" href="#">' + slider.vars.nextText + '</a></li></ul>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            $(slider.controlsContainer).append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider.controlsContainer);
          } else {
            slider.append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider);
          }

          methods.directionNav.update();

          slider.directionNav.bind(eventType, function(event) {
            event.preventDefault();
            var target;

            if (watchedEvent === "" || watchedEvent === event.type) {
              target = ($(this).hasClass(namespace + 'next')) ? slider.getTarget('next') : slider.getTarget('prev');
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function() {
          var disabledClass = namespace + 'disabled';
          if (slider.pagingCount === 1) {
            slider.directionNav.addClass(disabledClass).attr('tabindex', '-1');
          } else if (!slider.vars.animationLoop) {
            if (slider.animatingTo === 0) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "prev").addClass(disabledClass).attr('tabindex', '-1');
            } else if (slider.animatingTo === slider.last) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "next").addClass(disabledClass).attr('tabindex', '-1');
            } else {
              slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
            }
          } else {
            slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
          }
        }
      },
      pausePlay: {
        setup: function() {
          var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a></a></div>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            slider.controlsContainer.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider.controlsContainer);
          } else {
            slider.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider);
          }

          methods.pausePlay.update((slider.vars.slideshow) ? namespace + 'pause' : namespace + 'play');

          slider.pausePlay.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              if ($(this).hasClass(namespace + 'pause')) {
                slider.manualPause = true;
                slider.manualPlay = false;
                slider.pause();
              } else {
                slider.manualPause = false;
                slider.manualPlay = true;
                slider.play();
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function(state) {
          (state === "play") ? slider.pausePlay.removeClass(namespace + 'pause').addClass(namespace + 'play').html(slider.vars.playText) : slider.pausePlay.removeClass(namespace + 'play').addClass(namespace + 'pause').html(slider.vars.pauseText);
        }
      },
      touch: function() {
        var startX,
          startY,
          offset,
          cwidth,
          dx,
          startT,
          scrolling = false,
          localX = 0,
          localY = 0,
          accDx = 0;

        if(!msGesture){
            el.addEventListener('touchstart', onTouchStart, false);

            function onTouchStart(e) {
              if (slider.animating) {
                e.preventDefault();
              } else if ( ( window.navigator.msPointerEnabled ) || e.touches.length === 1 ) {
                slider.pause();
                // CAROUSEL:
                cwidth = (vertical) ? slider.h : slider. w;
                startT = Number(new Date());
                // CAROUSEL:

                // Local vars for X and Y points.
                localX = e.touches[0].pageX;
                localY = e.touches[0].pageY;

                offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                         (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                         (carousel && slider.currentSlide === slider.last) ? slider.limit :
                         (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                         (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                startX = (vertical) ? localY : localX;
                startY = (vertical) ? localX : localY;

                el.addEventListener('touchmove', onTouchMove, false);
                el.addEventListener('touchend', onTouchEnd, false);
              }
            }

            function onTouchMove(e) {
              // Local vars for X and Y points.

              localX = e.touches[0].pageX;
              localY = e.touches[0].pageY;

              dx = (vertical) ? startX - localY : startX - localX;
              scrolling = (vertical) ? (Math.abs(dx) < Math.abs(localX - startY)) : (Math.abs(dx) < Math.abs(localY - startY));

              var fxms = 500;

              if ( ! scrolling || Number( new Date() ) - startT > fxms ) {
                e.preventDefault();
                if (!fade && slider.transitions) {
                  if (!slider.vars.animationLoop) {
                    dx = dx/((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
                  }
                  slider.setProps(offset + dx, "setTouch");
                }
              }
            }

            function onTouchEnd(e) {
              // finish the touch by undoing the touch session
              el.removeEventListener('touchmove', onTouchMove, false);

              if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                var updateDx = (reverse) ? -dx : dx,
                    target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                  slider.flexAnimate(target, slider.vars.pauseOnAction);
                } else {
                  if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                }
              }
              el.removeEventListener('touchend', onTouchEnd, false);

              startX = null;
              startY = null;
              dx = null;
              offset = null;
            }
        }else{
            el.style.msTouchAction = "none";
            el._gesture = new MSGesture();
            el._gesture.target = el;
            el.addEventListener("MSPointerDown", onMSPointerDown, false);
            el._slider = slider;
            el.addEventListener("MSGestureChange", onMSGestureChange, false);
            el.addEventListener("MSGestureEnd", onMSGestureEnd, false);

            function onMSPointerDown(e){
                e.stopPropagation();
                if (slider.animating) {
                    e.preventDefault();
                }else{
                    slider.pause();
                    el._gesture.addPointer(e.pointerId);
                    accDx = 0;
                    cwidth = (vertical) ? slider.h : slider. w;
                    startT = Number(new Date());
                    // CAROUSEL:

                    offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                        (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                            (carousel && slider.currentSlide === slider.last) ? slider.limit :
                                (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                                    (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                }
            }

            function onMSGestureChange(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                var transX = -e.translationX,
                    transY = -e.translationY;

                //Accumulate translations.
                accDx = accDx + ((vertical) ? transY : transX);
                dx = accDx;
                scrolling = (vertical) ? (Math.abs(accDx) < Math.abs(-transX)) : (Math.abs(accDx) < Math.abs(-transY));

                if(e.detail === e.MSGESTURE_FLAG_INERTIA){
                    setImmediate(function (){
                        el._gesture.stop();
                    });

                    return;
                }

                if (!scrolling || Number(new Date()) - startT > 500) {
                    e.preventDefault();
                    if (!fade && slider.transitions) {
                        if (!slider.vars.animationLoop) {
                            dx = accDx / ((slider.currentSlide === 0 && accDx < 0 || slider.currentSlide === slider.last && accDx > 0) ? (Math.abs(accDx) / cwidth + 2) : 1);
                        }
                        slider.setProps(offset + dx, "setTouch");
                    }
                }
            }

            function onMSGestureEnd(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                    var updateDx = (reverse) ? -dx : dx,
                        target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                    if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                        slider.flexAnimate(target, slider.vars.pauseOnAction);
                    } else {
                        if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                    }
                }

                startX = null;
                startY = null;
                dx = null;
                offset = null;
                accDx = 0;
            }
        }
      },
      resize: function() {
        if (!slider.animating && slider.is(':visible')) {
          if (!carousel) slider.doMath();

          if (fade) {
            // SMOOTH HEIGHT:
            methods.smoothHeight();
          } else if (carousel) { //CAROUSEL:
            slider.slides.width(slider.computedW);
            slider.update(slider.pagingCount);
            slider.setProps();
          }
          else if (vertical) { //VERTICAL:
            slider.viewport.height(slider.h);
            slider.setProps(slider.h, "setTotal");
          } else {
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) methods.smoothHeight();
            slider.newSlides.width(slider.computedW);
            slider.setProps(slider.computedW, "setTotal");
          }
        }
      },
      smoothHeight: function(dur) {
        if (!vertical || fade) {
          var $obj = (fade) ? slider : slider.viewport;
          (dur) ? $obj.animate({"height": slider.slides.eq(slider.animatingTo).height()}, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
        }
      },
      sync: function(action) {
        var $obj = $(slider.vars.sync).data("flexslider"),
            target = slider.animatingTo;

        switch (action) {
          case "animate": $obj.flexAnimate(target, slider.vars.pauseOnAction, false, true); break;
          case "play": if (!$obj.playing && !$obj.asNav) { $obj.play(); } break;
          case "pause": $obj.pause(); break;
        }
      },
      uniqueID: function($clone) {
        // Append _clone to current level and children elements with id attributes
        $clone.filter( '[id]' ).add($clone.find( '[id]' )).each(function() {
          var $this = $(this);
          $this.attr( 'id', $this.attr( 'id' ) + '_clone' );
        });
        return $clone;
      },
      pauseInvisible: {
        visProp: null,
        init: function() {
          var prefixes = ['webkit','moz','ms','o'];

          if ('hidden' in document) return 'hidden';
          for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Hidden') in document)
            methods.pauseInvisible.visProp = prefixes[i] + 'Hidden';
          }
          if (methods.pauseInvisible.visProp) {
            var evtname = methods.pauseInvisible.visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
            document.addEventListener(evtname, function() {
              if (methods.pauseInvisible.isHidden()) {
                if(slider.startTimeout) clearTimeout(slider.startTimeout); //If clock is ticking, stop timer and prevent from starting while invisible
                else slider.pause(); //Or just pause
              }
              else {
                if(slider.started) slider.play(); //Initiated before, just play
                else (slider.vars.initDelay > 0) ? setTimeout(slider.play, slider.vars.initDelay) : slider.play(); //Didn't init before: simply init or wait for it
              }
            });
          }
        },
        isHidden: function() {
          return document[methods.pauseInvisible.visProp] || false;
        }
      },
      setToClearWatchedEvent: function() {
        clearTimeout(watchedEventClearTimer);
        watchedEventClearTimer = setTimeout(function() {
          watchedEvent = "";
        }, 3000);
      }
    };

    // public methods
    slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
      if (!slider.vars.animationLoop && target !== slider.currentSlide) {
        slider.direction = (target > slider.currentSlide) ? "next" : "prev";
      }

      if (asNav && slider.pagingCount === 1) slider.direction = (slider.currentItem < target) ? "next" : "prev";

      if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
        if (asNav && withSync) {
          var master = $(slider.vars.asNavFor).data('flexslider');
          slider.atEnd = target === 0 || target === slider.count - 1;
          master.flexAnimate(target, true, false, true, fromNav);
          slider.direction = (slider.currentItem < target) ? "next" : "prev";
          master.direction = slider.direction;

          if (Math.ceil((target + 1)/slider.visible) - 1 !== slider.currentSlide && target !== 0) {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            target = Math.floor(target/slider.visible);
          } else {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            return false;
          }
        }

        slider.animating = true;
        slider.animatingTo = target;

        // SLIDESHOW:
        if (pause) slider.pause();

        // API: before() animation Callback
        slider.vars.before(slider);

        // SYNC:
        if (slider.syncExists && !fromNav) methods.sync("animate");

        // CONTROLNAV
        if (slider.vars.controlNav) methods.controlNav.active();

        // !CAROUSEL:
        // CANDIDATE: slide active class (for add/remove slide)
        if (!carousel) slider.slides.removeClass(namespace + 'active-slide').eq(target).addClass(namespace + 'active-slide');

        // INFINITE LOOP:
        // CANDIDATE: atEnd
        slider.atEnd = target === 0 || target === slider.last;

        // DIRECTIONNAV:
        if (slider.vars.directionNav) methods.directionNav.update();

        if (target === slider.last) {
          // API: end() of cycle Callback
          slider.vars.end(slider);
          // SLIDESHOW && !INFINITE LOOP:
          if (!slider.vars.animationLoop) slider.pause();
        }

        // SLIDE:
        if (!fade) {
          var dimension = (vertical) ? slider.slides.filter(':first').height() : slider.computedW,
              margin, slideString, calcNext;

          // INFINITE LOOP / REVERSE:
          if (carousel) {
            //margin = (slider.vars.itemWidth > slider.w) ? slider.vars.itemMargin * 2 : slider.vars.itemMargin;
            margin = slider.vars.itemMargin;
            calcNext = ((slider.itemW + margin) * slider.move) * slider.animatingTo;
            slideString = (calcNext > slider.limit && slider.visible !== 1) ? slider.limit : calcNext;
          } else if (slider.currentSlide === 0 && target === slider.count - 1 && slider.vars.animationLoop && slider.direction !== "next") {
            slideString = (reverse) ? (slider.count + slider.cloneOffset) * dimension : 0;
          } else if (slider.currentSlide === slider.last && target === 0 && slider.vars.animationLoop && slider.direction !== "prev") {
            slideString = (reverse) ? 0 : (slider.count + 1) * dimension;
          } else {
            slideString = (reverse) ? ((slider.count - 1) - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
          }
          slider.setProps(slideString, "", slider.vars.animationSpeed);
          if (slider.transitions) {
            if (!slider.vars.animationLoop || !slider.atEnd) {
              slider.animating = false;
              slider.currentSlide = slider.animatingTo;
            }
            
            // Unbind previous transitionEnd events and re-bind new transitionEnd event
            slider.container.unbind("webkitTransitionEnd transitionend");
            slider.container.bind("webkitTransitionEnd transitionend", function() {
              clearTimeout(slider.ensureAnimationEnd);
              slider.wrapup(dimension);
            });

            // Insurance for the ever-so-fickle transitionEnd event
            clearTimeout(slider.ensureAnimationEnd);
            slider.ensureAnimationEnd = setTimeout(function() {
              slider.wrapup(dimension);
            }, slider.vars.animationSpeed + 100);

          } else {
            slider.container.animate(slider.args, slider.vars.animationSpeed, slider.vars.easing, function(){
              slider.wrapup(dimension);
            });
          }
        } else { // FADE:
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationSpeed, slider.vars.easing);
            //slider.slides.eq(target).fadeIn(slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

            slider.slides.eq(slider.currentSlide).css({"zIndex": 1}).animate({"opacity": 0}, slider.vars.animationSpeed, slider.vars.easing);
            slider.slides.eq(target).css({"zIndex": 2}).animate({"opacity": 1}, slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

          } else {
            slider.slides.eq(slider.currentSlide).css({ "opacity": 0, "zIndex": 1 });
            slider.slides.eq(target).css({ "opacity": 1, "zIndex": 2 });
            slider.wrapup(dimension);
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) methods.smoothHeight(slider.vars.animationSpeed);
      }
    };
    slider.wrapup = function(dimension) {
      // SLIDE:
      if (!fade && !carousel) {
        if (slider.currentSlide === 0 && slider.animatingTo === slider.last && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpEnd");
        } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpStart");
        }
      }
      slider.animating = false;
      slider.currentSlide = slider.animatingTo;
      // API: after() animation Callback
      slider.vars.after(slider);
    };

    // SLIDESHOW:
    slider.animateSlides = function() {
      if (!slider.animating && focused ) slider.flexAnimate(slider.getTarget("next"));
    };
    // SLIDESHOW:
    slider.pause = function() {
      clearInterval(slider.animatedSlides);
      slider.animatedSlides = null;
      slider.playing = false;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) methods.pausePlay.update("play");
      // SYNC:
      if (slider.syncExists) methods.sync("pause");
    };
    // SLIDESHOW:
    slider.play = function() {
      if (slider.playing) clearInterval(slider.animatedSlides);
      slider.animatedSlides = slider.animatedSlides || setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
      slider.started = slider.playing = true;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) methods.pausePlay.update("pause");
      // SYNC:
      if (slider.syncExists) methods.sync("play");
    };
    // STOP:
    slider.stop = function () {
      slider.pause();
      slider.stopped = true;
    };
    slider.canAdvance = function(target, fromNav) {
      // ASNAV:
      var last = (asNav) ? slider.pagingCount - 1 : slider.last;
      return (fromNav) ? true :
             (asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev") ? true :
             (asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next") ? false :
             (target === slider.currentSlide && !asNav) ? false :
             (slider.vars.animationLoop) ? true :
             (slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next") ? false :
             (slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next") ? false :
             true;
    };
    slider.getTarget = function(dir) {
      slider.direction = dir;
      if (dir === "next") {
        return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide + 1;
      } else {
        return (slider.currentSlide === 0) ? slider.last : slider.currentSlide - 1;
      }
    };

    // SLIDE:
    slider.setProps = function(pos, special, dur) {
      var target = (function() {
        var posCheck = (pos) ? pos : ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo,
            posCalc = (function() {
              if (carousel) {
                return (special === "setTouch") ? pos :
                       (reverse && slider.animatingTo === slider.last) ? 0 :
                       (reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                       (slider.animatingTo === slider.last) ? slider.limit : posCheck;
              } else {
                switch (special) {
                  case "setTotal": return (reverse) ? ((slider.count - 1) - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                  case "setTouch": return (reverse) ? pos : pos;
                  case "jumpEnd": return (reverse) ? pos : slider.count * pos;
                  case "jumpStart": return (reverse) ? slider.count * pos : pos;
                  default: return pos;
                }
              }
            }());

            return (posCalc * -1) + "px";
          }());

      if (slider.transitions) {
        target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
        dur = (dur !== undefined) ? (dur/1000) + "s" : "0s";
        slider.container.css("-" + slider.pfx + "-transition-duration", dur);
         slider.container.css("transition-duration", dur);
      }

      slider.args[slider.prop] = target;
      if (slider.transitions || dur === undefined) slider.container.css(slider.args);

      slider.container.css('transform',target);
    };

    slider.setup = function(type) {
      // SLIDE:
      if (!fade) {
        var sliderOffset, arr;

        if (type === "init") {
          slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({"overflow": "hidden", "position": "relative"}).appendTo(slider).append(slider.container);
          // INFINITE LOOP:
          slider.cloneCount = 0;
          slider.cloneOffset = 0;
          // REVERSE:
          if (reverse) {
            arr = $.makeArray(slider.slides).reverse();
            slider.slides = $(arr);
            slider.container.empty().append(slider.slides);
          }
        }
        // INFINITE LOOP && !CAROUSEL:
        if (slider.vars.animationLoop && !carousel) {
          slider.cloneCount = 2;
          slider.cloneOffset = 1;
          // clear out old clones
          if (type !== "init") slider.container.find('.clone').remove();
          slider.container.append(methods.uniqueID(slider.slides.first().clone().addClass('clone')).attr('aria-hidden', 'true'))
                          .prepend(methods.uniqueID(slider.slides.last().clone().addClass('clone')).attr('aria-hidden', 'true'));
        }
        slider.newSlides = $(slider.vars.selector, slider);

        sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
        // VERTICAL:
        if (vertical && !carousel) {
          slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
          setTimeout(function(){
            slider.newSlides.css({"display": "block"});
            slider.doMath();
            slider.viewport.height(slider.h);
            slider.setProps(sliderOffset * slider.h, "init");
          }, (type === "init") ? 100 : 0);
        } else {
          slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
          slider.setProps(sliderOffset * slider.computedW, "init");
          setTimeout(function(){
            slider.doMath();
            slider.newSlides.css({"width": slider.computedW, "float": "left", "display": "block"});
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) methods.smoothHeight();
          }, (type === "init") ? 100 : 0);
        }
      } else { // FADE:
        slider.slides.css({"width": "100%", "float": "left", "marginRight": "-100%", "position": "relative"});
        if (type === "init") {
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeIn(slider.vars.animationSpeed, slider.vars.easing);
            if (slider.vars.fadeFirstSlide == false) {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).css({"opacity": 1});
            } else {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).animate({"opacity": 1},slider.vars.animationSpeed,slider.vars.easing);
            }
          } else {
            slider.slides.css({ "opacity": 0, "display": "block", "webkitTransition": "opacity " + slider.vars.animationSpeed / 1000 + "s ease", "zIndex": 1 }).eq(slider.currentSlide).css({ "opacity": 1, "zIndex": 2});
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) methods.smoothHeight();
      }
      // !CAROUSEL:
      // CANDIDATE: active slide
      if (!carousel) slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide");

      //FlexSlider: init() Callback
      slider.vars.init(slider);
    };

    slider.doMath = function() {
      var slide = slider.slides.first(),
          slideMargin = slider.vars.itemMargin,
          minItems = slider.vars.minItems,
          maxItems = slider.vars.maxItems;

      slider.w = (slider.viewport===undefined) ? slider.width() : slider.viewport.width();
      slider.h = slide.height();
      slider.boxPadding = slide.outerWidth() - slide.width();

      // CAROUSEL:
      if (carousel) {
        slider.itemT = slider.vars.itemWidth + slideMargin;
        slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
        slider.maxW = (maxItems) ? (maxItems * slider.itemT) - slideMargin : slider.w;
        slider.itemW = (slider.minW > slider.w) ? (slider.w - (slideMargin * (minItems - 1)))/minItems :
                       (slider.maxW < slider.w) ? (slider.w - (slideMargin * (maxItems - 1)))/maxItems :
                       (slider.vars.itemWidth > slider.w) ? slider.w : slider.vars.itemWidth;

        slider.visible = Math.floor(slider.w/(slider.itemW));
        slider.move = (slider.vars.move > 0 && slider.vars.move < slider.visible ) ? slider.vars.move : slider.visible;
        slider.pagingCount = Math.ceil(((slider.count - slider.visible)/slider.move) + 1);
        slider.last =  slider.pagingCount - 1;
        slider.limit = (slider.pagingCount === 1) ? 0 :
                       (slider.vars.itemWidth > slider.w) ? (slider.itemW * (slider.count - 1)) + (slideMargin * (slider.count - 1)) : ((slider.itemW + slideMargin) * slider.count) - slider.w - slideMargin;
      } else {
        slider.itemW = slider.w;
        slider.pagingCount = slider.count;
        slider.last = slider.count - 1;
      }
      slider.computedW = slider.itemW - slider.boxPadding;
    };

    slider.update = function(pos, action) {
      slider.doMath();

      // update currentSlide and slider.animatingTo if necessary
      if (!carousel) {
        if (pos < slider.currentSlide) {
          slider.currentSlide += 1;
        } else if (pos <= slider.currentSlide && pos !== 0) {
          slider.currentSlide -= 1;
        }
        slider.animatingTo = slider.currentSlide;
      }

      // update controlNav
      if (slider.vars.controlNav && !slider.manualControls) {
        if ((action === "add" && !carousel) || slider.pagingCount > slider.controlNav.length) {
          methods.controlNav.update("add");
        } else if ((action === "remove" && !carousel) || slider.pagingCount < slider.controlNav.length) {
          if (carousel && slider.currentSlide > slider.last) {
            slider.currentSlide -= 1;
            slider.animatingTo -= 1;
          }
          methods.controlNav.update("remove", slider.last);
        }
      }
      // update directionNav
      if (slider.vars.directionNav) methods.directionNav.update();

    };

    slider.addSlide = function(obj, pos) {
      var $obj = $(obj);

      slider.count += 1;
      slider.last = slider.count - 1;

      // append new slide
      if (vertical && reverse) {
        (pos !== undefined) ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
      } else {
        (pos !== undefined) ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.update(pos, "add");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      //FlexSlider: added() Callback
      slider.vars.added(slider);
    };
    slider.removeSlide = function(obj) {
      var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;

      // update count
      slider.count -= 1;
      slider.last = slider.count - 1;

      // remove slide
      if (isNaN(obj)) {
        $(obj, slider.slides).remove();
      } else {
        (vertical && reverse) ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.doMath();
      slider.update(pos, "remove");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      // FlexSlider: removed() Callback
      slider.vars.removed(slider);
    };

    //FlexSlider: Initialize
    methods.init();
  };

  // Ensure the slider isn't focussed if the window loses focus.
  $( window ).blur( function ( e ) {
    focused = false;
  }).focus( function ( e ) {
    focused = true;
  });

  //FlexSlider: Default Settings
  $.flexslider.defaults = {
    namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
    selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
    animation: "fade",              //String: Select your animation type, "fade" or "slide"
    easing: "swing",                //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
    direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
    reverse: false,                 //{NEW} Boolean: Reverse the animation direction
    animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
    smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
    startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
    slideshow: true,                //Boolean: Animate slider automatically
    slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
    animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
    initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
    randomize: false,               //Boolean: Randomize slide order
    fadeFirstSlide: true,           //Boolean: Fade in the first slide when animation type is "fade"
    thumbCaptions: false,           //Boolean: Whether or not to put captions on thumbnails when using the "thumbnails" controlNav.

    // Usability features
    pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
    pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
    pauseInvisible: true,           //{NEW} Boolean: Pause the slideshow when tab is invisible, resume when visible. Provides better UX, lower CPU usage.
    useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
    touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
    video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

    // Primary Controls
    controlNav: true,               //Boolean: Create navigation for paging control of each slide? Note: Leave true for manualControls usage
    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
    prevText: "Previous",           //String: Set the text for the "previous" directionNav item
    nextText: "Next",               //String: Set the text for the "next" directionNav item

    // Secondary Navigation
    keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
    multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
    mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
    pausePlay: false,               //Boolean: Create pause/play dynamic element
    pauseText: "Pause",             //String: Set the text for the "pause" pausePlay item
    playText: "Play",               //String: Set the text for the "play" pausePlay item

    // Special properties
    controlsContainer: "",          //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
    manualControls: "",             //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
    sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
    asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

    // Carousel Options
    itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
    itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
    minItems: 1,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
    maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
    move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
    allowOneSlide: true,           //{NEW} Boolean: Whether or not to allow a slider comprised of a single slide

    // Callback API
    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
    end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
    added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
    removed: function(){},           //{NEW} Callback: function(slider) - Fires after a slide is removed
    init: function() {}             //{NEW} Callback: function(slider) - Fires after the slider is initially setup
  };

  //FlexSlider: Plugin Function
  $.fn.flexslider = function(options) {
    if (options === undefined) options = {};

    if (typeof options === "object") {
      return this.each(function() {
        var $this = $(this),
            selector = (options.selector) ? options.selector : ".slides > li",
            $slides = $this.find(selector);

      if ( ( $slides.length === 1 && options.allowOneSlide === true ) || $slides.length === 0 ) {
          $slides.fadeIn(400);
          if (options.start) options.start($this);
        } else if ($this.data('flexslider') === undefined) {
          new $.flexslider(this, options);
        }
      });
    } else {
      // Helper strings to quickly perform functions on the slider
      var $slider = $(this).data('flexslider');
      switch (options) {
        case "play": $slider.play(); break;
        case "pause": $slider.pause(); break;
        case "stop": $slider.stop(); break;
        case "next": $slider.flexAnimate($slider.getTarget("next"), true); break;
        case "prev":
        case "previous": $slider.flexAnimate($slider.getTarget("prev"), true); break;
        default: if (typeof options === "number") $slider.flexAnimate(options, true);
      }
    }
  };
})(jQuery);

// -----------------------------------
// Slidebars
// Version 0.10
// http://plugins.adchsm.me/slidebars/
//
// Written by Adam Smith
// http://www.adchsm.me/
//
// Released under MIT License
// http://plugins.adchsm.me/slidebars/license.txt
//
// ---------------------
// Index of Slidebars.js
//
// 001 - Default Settings
// 002 - Feature Detection
// 003 - User Agents
// 004 - Setup
// 005 - Animation
// 006 - Operations
// 007 - API
// 008 - User Input

;(function($) {

    $.slidebars = function(options) {

        // ----------------------
        // 001 - Default Settings

        var settings = $.extend({
            siteClose: true, // true or false - Enable closing of Slidebars by clicking on #sb-site.
            scrollLock: false, // true or false - Prevent scrolling of site when a Slidebar is open.
            disableOver: false, // integer or false - Hide Slidebars over a specific width.
            hideControlClasses: false // true or false - Hide controls at same width as disableOver.
        }, options);

        // -----------------------
        // 002 - Feature Detection

        var test = document.createElement('div').style, // Create element to test on.
        supportTransition = false, // Variable for testing transitions.
        supportTransform = false; // variable for testing transforms.

        // Test for CSS Transitions
        if (test.MozTransition === '' || test.WebkitTransition === '' || test.OTransition === '' || test.transition === '') supportTransition = true;

        // Test for CSS Transforms
        if (test.MozTransform === '' || test.WebkitTransform === '' || test.OTransform === '' || test.transform === '') supportTransform = true;

        // -----------------
        // 003 - User Agents

        var ua = navigator.userAgent, // Get user agent string.
        android = false, // Variable for storing android version.
        iOS = false; // Variable for storing iOS version.
        
        if (/Android/.test(ua)) { // Detect Android in user agent string.
            android = ua.substr(ua.indexOf('Android')+8, 3); // Set version of Android.
        } else if (/(iPhone|iPod|iPad)/.test(ua)) { // Detect iOS in user agent string.
            iOS = ua.substr(ua.indexOf('OS ')+3, 3).replace('_', '.'); // Set version of iOS.
        }
        
        if (android && android < 3 || iOS && iOS < 5) $('html').addClass('sb-static'); // Add helper class for older versions of Android & iOS.

        // -----------
        // 004 - Setup

        // Site container
        var $site = $('#sb-site, .sb-site-container'); // Cache the selector.

        // Left Slidebar    
        if ($('.sb-left').length) { // Check if the left Slidebar exists.
            var $left = $('.sb-left'), // Cache the selector.
            leftActive = false; // Used to check whether the left Slidebar is open or closed.
        }

        // Right Slidebar
        if ($('.sb-right').length) { // Check if the right Slidebar exists.
            var $right = $('.sb-right'), // Cache the selector.
            rightActive = false; // Used to check whether the right Slidebar is open or closed.
        }
                
        var init = false, // Initialisation variable.
        windowWidth = $(window).width(), // Get width of window.
        $controls = $('.sb-toggle-left, .sb-toggle-right, .sb-open-left, .sb-open-right, .sb-close'), // Cache the control classes.
        $slide = $('.sb-slide'); // Cache users elements to animate.
        
        // Initailise Slidebars
        function initialise() {
            if (!settings.disableOver || (typeof settings.disableOver === 'number' && settings.disableOver >= windowWidth)) { // False or larger than window size. 
                init = true; // true enabled Slidebars to open.
                $('html').addClass('sb-init'); // Add helper class.
                if (settings.hideControlClasses) $controls.removeClass('sb-hide'); // Remove class just incase Slidebars was originally disabled.
                css(); // Set required inline styles.
            } else if (typeof settings.disableOver === 'number' && settings.disableOver < windowWidth) { // Less than window size.
                init = false; // false stop Slidebars from opening.
                $('html').removeClass('sb-init'); // Remove helper class.
                if (settings.hideControlClasses) $controls.addClass('sb-hide'); // Hide controls
                $site.css('minHeight', ''); // Remove minimum height.
                if (leftActive || rightActive) close(); // Close Slidebars if open.
            }
        }
        initialise();
        
        // Inline CSS
        function css() {
            // Set minimum height.
            $site.css('minHeight', ''); // Reset minimum height.
            $site.css('minHeight', $('html').height() + 'px'); // Set minimum height of the site to the minimum height of the html.
            
            // Custom Slidebar widths.
            if ($left && $left.hasClass('sb-width-custom')) $left.css('width', $left.attr('data-sb-width')); // Set user custom width.
            if ($right && $right.hasClass('sb-width-custom')) $right.css('width', $right.attr('data-sb-width')); // Set user custom width.
            
            // Set off-canvas margins for Slidebars with push and overlay animations.
            if ($left && ($left.hasClass('sb-style-push') || $left.hasClass('sb-style-overlay'))) $left.css('marginLeft', '-' + $left.css('width'));
            if ($right && ($right.hasClass('sb-style-push') || $right.hasClass('sb-style-overlay'))) $right.css('marginRight', '-' + $right.css('width'));
            
            // Site scroll locking.
            if (settings.scrollLock) $('html').addClass('sb-scroll-lock');
        }
        
        // Resize Functions
        $(window).resize(function() {
            var resizedWindowWidth = $(window).width(); // Get resized window width.
            if (windowWidth !== resizedWindowWidth) { // Slidebars is running and window was actually resized.
                windowWidth = resizedWindowWidth; // Set the new window width.
                initialise(); // Call initalise to see if Slidebars should still be running.
                if (leftActive) open('left'); // If left Slidebar is open, calling open will ensure it is the correct size.
                if (rightActive) open('right'); // If right Slidebar is open, calling open will ensure it is the correct size.
            }
        });
        // I may include a height check along side a width check here in future.

        // ---------------
        // 005 - Animation

        var animation; // Animation type.

        // Set animation type.
        if (supportTransition && supportTransform) { // Browser supports css transitions and transforms.
            animation = 'translate'; // Translate for browsers that support it.
            if (android && android < 4.4) animation = 'side'; // Android supports both, but can't translate any fixed positions, so use left instead.
        } else {
            animation = 'jQuery'; // Browsers that don't support css transitions and transitions.
        }

        // Animate mixin.
        function animate(object, amount, side) {
            // Choose selectors depending on animation style.
            var selector;
            
            if (object.hasClass('sb-style-push')) {
                selector = $site.add(object).add($slide); // Push - Animate site, Slidebar and user elements.
            } else if (object.hasClass('sb-style-overlay')) {
                selector = object; // Overlay - Animate Slidebar only.
            } else {
                selector = $site.add($slide); // Reveal - Animate site and user elements.
            }
            
            // Apply animation
            if (animation === 'translate') {
                selector.css('transform', 'translate(' + amount + ')'); // Apply the animation.

            } else if (animation === 'side') {      
                if (amount[0] === '-') amount = amount.substr(1); // Remove the '-' from the passed amount for side animations.
                if (amount !== '0px') selector.css(side, '0px'); // Add a 0 value so css transition works.
                setTimeout(function() { // Set a timeout to allow the 0 value to be applied above.
                    selector.css(side, amount); // Apply the animation.
                }, 1);

            } else if (animation === 'jQuery') {
                if (amount[0] === '-') amount = amount.substr(1); // Remove the '-' from the passed amount for jQuery animations.
                var properties = {};
                properties[side] = amount;
                selector.stop().animate(properties, 400); // Stop any current jQuery animation before starting another.
            }
            
            // If closed, remove the inline styling on completion of the animation.
            setTimeout(function() {
                if (amount === '0px') {
                    selector.removeAttr('style');
                    css();
                }
            }, 400);
        }

        // ----------------
        // 006 - Operations

        // Open a Slidebar
        function open(side) {
            // Check to see if opposite Slidebar is open.
            if (side === 'left' && $left && rightActive || side === 'right' && $right && leftActive) { // It's open, close it, then continue.
                close();
                setTimeout(proceed, 400);
            } else { // Its not open, continue.
                proceed();
            }

            // Open
            function proceed() {
                if (init && side === 'left' && $left) { // Slidebars is initiated, left is in use and called to open.
                    $('html').addClass('sb-active sb-active-left'); // Add active classes.
                    $left.addClass('sb-active');
                    animate($left, $left.css('width'), 'left'); // Animation
                    setTimeout(function() { leftActive = true; }, 400); // Set active variables.
                } else if (init && side === 'right' && $right) { // Slidebars is initiated, right is in use and called to open.
                    $('html').addClass('sb-active sb-active-right'); // Add active classes.
                    $right.addClass('sb-active');
                    animate($right, '-' + $right.css('width'), 'right'); // Animation
                    setTimeout(function() { rightActive = true; }, 400); // Set active variables.
                }
            }
        }
            
        // Close either Slidebar
        function close(link) {
            if (leftActive || rightActive) { // If a Slidebar is open.
                if (leftActive) {
                    animate($left, '0px', 'left'); // Animation
                    leftActive = false;
                }
                if (rightActive) {
                    animate($right, '0px', 'right'); // Animation
                    rightActive = false;
                }
            
                setTimeout(function() { // Wait for closing animation to finish.
                    $('html').removeClass('sb-active sb-active-left sb-active-right'); // Remove active classes.
                    if ($left) $left.removeClass('sb-active');
                    if ($right) $right.removeClass('sb-active');
                    if (typeof link !== 'undefined') window.location = link; // If a link has been passed to the function, go to it.
                }, 400);
            }
        }
        
        // Toggle either Slidebar
        function toggle(side) {
            if (side === 'left' && $left) { // If left Slidebar is called and in use.
                if (!leftActive) {
                    open('left'); // Slidebar is closed, open it.
                } else {
                    close(); // Slidebar is open, close it.
                }
            }
            if (side === 'right' && $right) { // If right Slidebar is called and in use.
                if (!rightActive) {
                    open('right'); // Slidebar is closed, open it.
                } else {
                    close(); // Slidebar is open, close it.
                }
            }
        }

        // ---------
        // 007 - API
        
        this.slidebars = {
            open: open, // Maps user variable name to the open method.
            close: close, // Maps user variable name to the close method.
            toggle: toggle, // Maps user variable name to the toggle method.
            init: function() { // Returns true or false whether Slidebars are running or not.
                return init; // Returns true or false whether Slidebars are running.
            },
            active: function(side) { // Returns true or false whether Slidebar is open or closed.
                if (side === 'left' && $left) return leftActive;
                if (side === 'right' && $right) return rightActive;
            },
            destroy: function(side) { // Removes the Slidebar from the DOM.
                if (side === 'left' && $left) {
                    if (leftActive) close(); // Close if its open.
                    setTimeout(function() {
                        $left.remove(); // Remove it.
                        $left = false; // Set variable to false so it cannot be opened again.
                    }, 400);
                }
                if (side === 'right' && $right) {
                    if (rightActive) close(); // Close if its open.
                    setTimeout(function() {
                        $right.remove(); // Remove it.
                        $right = false; // Set variable to false so it cannot be opened again.
                    }, 400);
                }
            }
        };

        // ----------------
        // 008 - User Input
        
        function eventHandler(event, selector) {
            event.stopPropagation(); // Stop event bubbling.
            event.preventDefault(); // Prevent default behaviour
            if (event.type === 'touchend') selector.off('click'); // If event type was touch turn off clicks to prevent phantom clicks.
        }
        
        // Toggle left Slidebar
        $('.sb-toggle-left').on('touchend click', function(event) {
            eventHandler(event, $(this)); // Handle the event.
            toggle('left'); // Toggle the left Slidbar.
        });
        
        // Toggle right Slidebar
        $('.sb-toggle-right').on('touchend click', function(event) {
            eventHandler(event, $(this)); // Handle the event.
            toggle('right'); // Toggle the right Slidbar.
        });
        
        // Open left Slidebar
        $('.sb-open-left').on('touchend click', function(event) {
            eventHandler(event, $(this)); // Handle the event.
            open('left'); // Open the left Slidebar.
        });
        
        // Open right Slidebar
        $('.sb-open-right').on('touchend click', function(event) {
            eventHandler(event, $(this)); // Handle the event.
            open('right'); // Open the right Slidebar.
        });
        
        // Close a Slidebar
        $('.sb-close').on('touchend click', function(event) {
            eventHandler(event, $(this)); // Handle the event.
            var link;
            
            // Close Slidebar via link
            if ( $(this).parents('.sb-slidebar') ) {
                if ( $(this).is('a') ) {
                    link = $(this).attr('href');
                } else if ( $(this).children('a') ) {
                    link = $(this).children('a').attr('href');
                }
            }
            
            close(link); // Close Slidebar and pass link.
        });
        
        // Close Slidebar via site
        $site.on('touchend click', function(event) {
            if (settings.siteClose && (leftActive || rightActive)) { // If settings permit closing by site and left or right Slidebar is open.
                eventHandler(event, $(this)); // Handle the event.
                close(); // Close it.
            }
        });
        
    }; // End Slidebars function.

}) (jQuery);

/*

Uniform v2.1.0
Copyright © 2009 Josh Pyles / Pixelmatrix Design LLC
http://pixelmatrixdesign.com

Requires jQuery 1.3 or newer

Much thanks to Thomas Reynolds and Buck Wilson for their help and advice on
this.

Disabling text selection is made possible by Mathias Bynens
<http://mathiasbynens.be/> and his noSelect plugin.
<https://github.com/mathiasbynens/jquery-noselect>, which is embedded.

Also, thanks to David Kaneda and Eugene Bond for their contributions to the
plugin.

Tyler Akins has also rewritten chunks of the plugin, helped close many issues,
and ensured version 2 got out the door.

License:
MIT License - http://www.opensource.org/licenses/mit-license.php

Enjoy!

*/
/*global jQuery, window, document, navigator*/

(function ($, undef) {
    "use strict";

    /**
     * Use .prop() if jQuery supports it, otherwise fall back to .attr()
     *
     * @param jQuery $el jQuery'd element on which we're calling attr/prop
     * @param ... All other parameters are passed to jQuery's function
     * @return The result from jQuery
     */
    function attrOrProp($el) {
        var args = Array.prototype.slice.call(arguments, 1);

        if ($el.prop) {
            // jQuery 1.6+
            return $el.prop.apply($el, args);
        }

        // jQuery 1.5 and below
        return $el.attr.apply($el, args);
    }

    /**
     * For backwards compatibility with older jQuery libraries, only bind
     * one thing at a time.  Also, this function adds our namespace to
     * events in one consistent location, shrinking the minified code.
     *
     * The properties on the events object are the names of the events
     * that we are supposed to add to.  It can be a space separated list.
     * The namespace will be added automatically.
     *
     * @param jQuery $el
     * @param Object options Uniform options for this element
     * @param Object events Events to bind, properties are event names
     */
    function bindMany($el, options, events) {
        var name, namespaced;

        for (name in events) {
            if (events.hasOwnProperty(name)) {
                namespaced = name.replace(/ |$/g, options.eventNamespace);
                $el.bind(namespaced, events[name]);
            }
        }
    }

    /**
     * Bind the hover, active, focus, and blur UI updates
     *
     * @param jQuery $el Original element
     * @param jQuery $target Target for the events (our div/span)
     * @param Object options Uniform options for the element $target
     */
    function bindUi($el, $target, options) {
        bindMany($el, options, {
            focus: function () {
                $target.addClass(options.focusClass);
            },
            blur: function () {
                $target.removeClass(options.focusClass);
                $target.removeClass(options.activeClass);
            },
            mouseenter: function () {
                $target.addClass(options.hoverClass);
            },
            mouseleave: function () {
                $target.removeClass(options.hoverClass);
                $target.removeClass(options.activeClass);
            },
            "mousedown touchbegin": function () {
                if (!$el.is(":disabled")) {
                    $target.addClass(options.activeClass);
                }
            },
            "mouseup touchend": function () {
                $target.removeClass(options.activeClass);
            }
        });
    }

    /**
     * Remove the hover, focus, active classes.
     *
     * @param jQuery $el Element with classes
     * @param Object options Uniform options for the element
     */
    function classClearStandard($el, options) {
        $el.removeClass(options.hoverClass + " " + options.focusClass + " " + options.activeClass);
    }

    /**
     * Add or remove a class, depending on if it's "enabled"
     *
     * @param jQuery $el Element that has the class added/removed
     * @param String className Class or classes to add/remove
     * @param Boolean enabled True to add the class, false to remove
     */
    function classUpdate($el, className, enabled) {
        if (enabled) {
            $el.addClass(className);
        } else {
            $el.removeClass(className);
        }
    }

    /**
     * Updating the "checked" property can be a little tricky.  This
     * changed in jQuery 1.6 and now we can pass booleans to .prop().
     * Prior to that, one either adds an attribute ("checked=checked") or
     * removes the attribute.
     *
     * @param jQuery $tag Our Uniform span/div
     * @param jQuery $el Original form element
     * @param Object options Uniform options for this element
     */
    function classUpdateChecked($tag, $el, options) {
        var c = "checked",
            isChecked = $el.is(":" + c);

        if ($el.prop) {
            // jQuery 1.6+
            $el.prop(c, isChecked);
        } else {
            // jQuery 1.5 and below
            if (isChecked) {
                $el.attr(c, c);
            } else {
                $el.removeAttr(c);
            }
        }

        classUpdate($tag, options.checkedClass, isChecked);
    }

    /**
     * Set or remove the "disabled" class for disabled elements, based on
     * if the 
     *
     * @param jQuery $tag Our Uniform span/div
     * @param jQuery $el Original form element
     * @param Object options Uniform options for this element
     */
    function classUpdateDisabled($tag, $el, options) {
        classUpdate($tag, options.disabledClass, $el.is(":disabled"));
    }

    /**
     * Wrap an element inside of a container or put the container next
     * to the element.  See the code for examples of the different methods.
     *
     * Returns the container that was added to the HTML.
     *
     * @param jQuery $el Element to wrap
     * @param jQuery $container Add this new container around/near $el
     * @param String method One of "after", "before" or "wrap"
     * @return $container after it has been cloned for adding to $el
     */
    function divSpanWrap($el, $container, method) {
        switch (method) {
        case "after":
            // Result:  <element /> <container />
            $el.after($container);
            return $el.next();
        case "before":
            // Result:  <container /> <element />
            $el.before($container);
            return $el.prev();
        case "wrap":
            // Result:  <container> <element /> </container>
            $el.wrap($container);
            return $el.parent();
        }

        return null;
    }


    /**
     * Create a div/span combo for uniforming an element
     *
     * @param jQuery $el Element to wrap
     * @param Object options Options for the element, set by the user
     * @param Object divSpanConfig Options for how we wrap the div/span
     * @return Object Contains the div and span as properties
     */
    function divSpan($el, options, divSpanConfig) {
        var $div, $span, id;

        if (!divSpanConfig) {
            divSpanConfig = {};
        }

        divSpanConfig = $.extend({
            bind: {},
            divClass: null,
            divWrap: "wrap",
            spanClass: null,
            spanHtml: null,
            spanWrap: "wrap"
        }, divSpanConfig);

        $div = $('<div />');
        $span = $('<span />');

        // Automatically hide this div/span if the element is hidden.
        // Do not hide if the element is hidden because a parent is hidden.
        if (options.autoHide && $el.is(':hidden') && $el.css('display') === 'none') {
            $div.hide();
        }

        if (divSpanConfig.divClass) {
            $div.addClass(divSpanConfig.divClass);
        }

        if (options.wrapperClass) {
            $div.addClass(options.wrapperClass);
        }

        if (divSpanConfig.spanClass) {
            $span.addClass(divSpanConfig.spanClass);
        }

        id = attrOrProp($el, 'id');

        if (options.useID && id) {
            attrOrProp($div, 'id', options.idPrefix + '-' + id);
        }

        if (divSpanConfig.spanHtml) {
            $span.html(divSpanConfig.spanHtml);
        }

        $div = divSpanWrap($el, $div, divSpanConfig.divWrap);
        $span = divSpanWrap($el, $span, divSpanConfig.spanWrap);
        classUpdateDisabled($div, $el, options);
        return {
            div: $div,
            span: $span
        };
    }


    /**
     * Wrap an element with a span to apply a global wrapper class
     *
     * @param jQuery $el Element to wrap
     * @param object options
     * @return jQuery Wrapper element
     */
    function wrapWithWrapperClass($el, options) {
        var $span;

        if (!options.wrapperClass) {
            return null;
        }

        $span = $('<span />').addClass(options.wrapperClass);
        $span = divSpanWrap($el, $span, "wrap");
        return $span;
    }


    /**
     * Test if high contrast mode is enabled.
     *
     * In high contrast mode, background images can not be set and
     * they are always returned as 'none'.
     *
     * @return boolean True if in high contrast mode
     */
    function highContrast() {
        var c, $div, el, rgb;

        // High contrast mode deals with white and black
        rgb = 'rgb(120,2,153)';
        $div = $('<div style="width:0;height:0;color:' + rgb + '">');
        $('body').append($div);
        el = $div.get(0);

        // $div.css() will get the style definition, not
        // the actually displaying style
        if (window.getComputedStyle) {
            c = window.getComputedStyle(el, '').color;
        } else {
            c = (el.currentStyle || el.style || {}).color;
        }

        $div.remove();
        return c.replace(/ /g, '') !== rgb;
    }


    /**
     * Change text into safe HTML
     *
     * @param String text
     * @return String HTML version
     */
    function htmlify(text) {
        if (!text) {
            return "";
        }

        return $('<span />').text(text).html();
    }

    /**
     * If not MSIE, return false.
     * If it is, return the version number.
     *
     * @return false|number
     */
    function isMsie() {
        return navigator.cpuClass && !navigator.product;
    }

    /**
     * Return true if this version of IE allows styling
     *
     * @return boolean
     */
    function isMsieSevenOrNewer() {
        if (typeof window.XMLHttpRequest !== 'undefined') {
            return true;
        }

        return false;
    }

    /**
     * Test if the element is a multiselect
     *
     * @param jQuery $el Element
     * @return boolean true/false
     */
    function isMultiselect($el) {
        var elSize;

        if ($el[0].multiple) {
            return true;
        }

        elSize = attrOrProp($el, "size");

        if (!elSize || elSize <= 1) {
            return false;
        }

        return true;
    }

    /**
     * Meaningless utility function.  Used mostly for improving minification.
     *
     * @return false
     */
    function returnFalse() {
        return false;
    }

    /**
     * noSelect plugin, very slightly modified
     * http://mths.be/noselect v1.0.3
     *
     * @param jQuery $elem Element that we don't want to select
     * @param Object options Uniform options for the element
     */
    function noSelect($elem, options) {
        var none = 'none';
        bindMany($elem, options, {
            'selectstart dragstart mousedown': returnFalse
        });

        $elem.css({
            MozUserSelect: none,
            msUserSelect: none,
            webkitUserSelect: none,
            userSelect: none
        });
    }

    /**
     * Updates the filename tag based on the value of the real input
     * element.
     *
     * @param jQuery $el Actual form element
     * @param jQuery $filenameTag Span/div to update
     * @param Object options Uniform options for this element
     */
    function setFilename($el, $filenameTag, options) {
        var filename = $el.val();

        if (filename === "") {
            filename = options.fileDefaultHtml;
        } else {
            filename = filename.split(/[\/\\]+/);
            filename = filename[(filename.length - 1)];
        }

        $filenameTag.text(filename);
    }


    /**
     * Function from jQuery to swap some CSS values, run a callback,
     * then restore the CSS.  Modified to pass JSLint and handle undefined
     * values with 'use strict'.
     *
     * @param jQuery $el Element
     * @param object newCss CSS values to swap out
     * @param Function callback Function to run
     */
    function swap($elements, newCss, callback) {
        var restore, item;

        restore = [];

        $elements.each(function () {
            var name;

            for (name in newCss) {
                if (Object.prototype.hasOwnProperty.call(newCss, name)) {
                    restore.push({
                        el: this,
                        name: name,
                        old: this.style[name]
                    });

                    this.style[name] = newCss[name];
                }
            }
        });

        callback();

        while (restore.length) {
            item = restore.pop();
            item.el.style[item.name] = item.old;
        }
    }


    /**
     * The browser doesn't provide sizes of elements that are not visible.
     * This will clone an element and add it to the DOM for calculations.
     *
     * @param jQuery $el
     * @param String method
     */
    function sizingInvisible($el, callback) {
        var targets;

        // We wish to target ourselves and any parents as long as
        // they are not visible
        targets = $el.parents();
        targets.push($el[0]);
        targets = targets.not(':visible');
        swap(targets, {
            visibility: "hidden",
            display: "block",
            position: "absolute"
        }, callback);
    }


    /**
     * Standard way to unwrap the div/span combination from an element
     *
     * @param jQuery $el Element that we wish to preserve
     * @param Object options Uniform options for the element
     * @return Function This generated function will perform the given work
     */
    function unwrapUnwrapUnbindFunction($el, options) {
        return function () {
            $el.unwrap().unwrap().unbind(options.eventNamespace);
        };
    }

    var allowStyling = true,  // False if IE6 or other unsupported browsers
        highContrastTest = false,  // Was the high contrast test ran?
        uniformHandlers = [  // Objects that take care of "unification"
            {
                // Buttons
                match: function ($el) {
                    return $el.is("a, button, :submit, :reset, input[type='button']");
                },
                apply: function ($el, options) {
                    var $div, defaultSpanHtml, ds, getHtml, doingClickEvent;
                    defaultSpanHtml = options.submitDefaultHtml;

                    if ($el.is(":reset")) {
                        defaultSpanHtml = options.resetDefaultHtml;
                    }

                    if ($el.is("a, button")) {
                        // Use the HTML inside the tag
                        getHtml = function () {
                            return $el.html() || defaultSpanHtml;
                        };
                    } else {
                        // Use the value property of the element
                        getHtml = function () {
                            return htmlify(attrOrProp($el, "value")) || defaultSpanHtml;
                        };
                    }

                    ds = divSpan($el, options, {
                        divClass: options.buttonClass,
                        spanHtml: getHtml(),
                    });
                    $div = ds.div;
                    bindUi($el, $div, options);
                    doingClickEvent = false;
                    bindMany($div, options, {
                        "click touchend": function () {
                            var ev, res, target, href;

                            if (doingClickEvent) {
                                return;
                            }

                            if ($el.is(':disabled')) {
                                return;
                            }

                            doingClickEvent = true;

                            if ($el[0].dispatchEvent) {
                                ev = document.createEvent("MouseEvents");
                                ev.initEvent("click", true, true);
                                res = $el[0].dispatchEvent(ev);

                                if ($el.is('a') && res) {
                                    target = attrOrProp($el, 'target');
                                    href = attrOrProp($el, 'href');

                                    if (!target || target === '_self') {
                                        document.location.href = href;
                                    } else {
                                        window.open(href, target);
                                    }
                                }
                            } else {
                                $el.click();
                            }

                            doingClickEvent = false;
                        }
                    });
                    noSelect($div, options);
                    return {
                        remove: function () {
                            // Move $el out
                            $div.after($el);

                            // Remove div and span
                            $div.remove();

                            // Unbind events
                            $el.unbind(options.eventNamespace);
                            return $el;
                        },
                        update: function () {
                            classClearStandard($div, options);
                            classUpdateDisabled($div, $el, options);
                            $el.detach();
                            ds.span.html(getHtml()).append($el);
                        }
                    };
                }
            },
            {
                // Checkboxes
                match: function ($el) {
                    return $el.is(":checkbox");
                },
                apply: function ($el, options) {
                    var ds, $div, $span;
                    ds = divSpan($el, options, {
                        divClass: options.checkboxClass
                    });
                    $div = ds.div;
                    $span = ds.span;

                    // Add focus classes, toggling, active, etc.
                    bindUi($el, $div, options);
                    bindMany($el, options, {
                        "click touchend": function () {
                            classUpdateChecked($span, $el, options);
                        }
                    });
                    classUpdateChecked($span, $el, options);
                    return {
                        remove: unwrapUnwrapUnbindFunction($el, options),
                        update: function () {
                            classClearStandard($div, options);
                            $span.removeClass(options.checkedClass);
                            classUpdateChecked($span, $el, options);
                            classUpdateDisabled($div, $el, options);
                        }
                    };
                }
            },
            {
                // File selection / uploads
                match: function ($el) {
                    return $el.is(":file");
                },
                apply: function ($el, options) {
                    var ds, $div, $filename, $button;

                    // The "span" is the button
                    ds = divSpan($el, options, {
                        divClass: options.fileClass,
                        spanClass: options.fileButtonClass,
                        spanHtml: options.fileButtonHtml,
                        spanWrap: "after"
                    });
                    $div = ds.div;
                    $button = ds.span;
                    $filename = $("<span />").html(options.fileDefaultHtml);
                    $filename.addClass(options.filenameClass);
                    $filename = divSpanWrap($el, $filename, "after");

                    // Set the size
                    if (!attrOrProp($el, "size")) {
                        attrOrProp($el, "size", $div.width() / 10);
                    }

                    // Actions
                    function filenameUpdate() {
                        setFilename($el, $filename, options);
                    }

                    bindUi($el, $div, options);

                    // Account for input saved across refreshes
                    filenameUpdate();

                    // IE7 doesn't fire onChange until blur or second fire.
                    if (isMsie()) {
                        // IE considers browser chrome blocking I/O, so it
                        // suspends tiemouts until after the file has
                        // been selected.
                        bindMany($el, options, {
                            click: function () {
                                $el.trigger("change");
                                setTimeout(filenameUpdate, 0);
                            }
                        });
                    } else {
                        // All other browsers behave properly
                        bindMany($el, options, {
                            change: filenameUpdate
                        });
                    }

                    noSelect($filename, options);
                    noSelect($button, options);
                    return {
                        remove: function () {
                            // Remove filename and button
                            $filename.remove();
                            $button.remove();

                            // Unwrap parent div, remove events
                            return $el.unwrap().unbind(options.eventNamespace);
                        },
                        update: function () {
                            classClearStandard($div, options);
                            setFilename($el, $filename, options);
                            classUpdateDisabled($div, $el, options);
                        }
                    };
                }
            },
            {
                // Input fields (text)
                match: function ($el) {
                    if ($el.is("input")) {
                        var t = (" " + attrOrProp($el, "type") + " ").toLowerCase(),
                            allowed = " color date datetime datetime-local email month number password search tel text time url week ";
                        return allowed.indexOf(t) >= 0;
                    }

                    return false;
                },
                apply: function ($el, options) {
                    var elType, $wrapper;

                    elType = attrOrProp($el, "type");
                    $el.addClass(options.inputClass);
                    $wrapper = wrapWithWrapperClass($el, options);
                    bindUi($el, $el, options);

                    if (options.inputAddTypeAsClass) {
                        $el.addClass(elType);
                    }

                    return {
                        remove: function () {
                            $el.removeClass(options.inputClass);

                            if (options.inputAddTypeAsClass) {
                                $el.removeClass(elType);
                            }

                            if ($wrapper) {
                                $el.unwrap();
                            }
                        },
                        update: returnFalse
                    };
                }
            },
            {
                // Radio buttons
                match: function ($el) {
                    return $el.is(":radio");
                },
                apply: function ($el, options) {
                    var ds, $div, $span;
                    ds = divSpan($el, options, {
                        divClass: options.radioClass
                    });
                    $div = ds.div;
                    $span = ds.span;

                    // Add classes for focus, handle active, checked
                    bindUi($el, $div, options);
                    bindMany($el, options, {
                        "click touchend": function () {
                            // Find all radios with the same name, then update
                            // them with $.uniform.update() so the right
                            // per-element options are used
                            $.uniform.update($(':radio[name="' + attrOrProp($el, "name") + '"]'));
                        }
                    });
                    classUpdateChecked($span, $el, options);
                    return {
                        remove: unwrapUnwrapUnbindFunction($el, options),
                        update: function () {
                            classClearStandard($div, options);
                            classUpdateChecked($span, $el, options);
                            classUpdateDisabled($div, $el, options);
                        }
                    };
                }
            },
            {
                // Select lists, but do not style multiselects here
                match: function ($el) {
                    if ($el.is("select") && !isMultiselect($el)) {
                        return true;
                    }

                    return false;
                },
                apply: function ($el, options) {
                    var ds, $div, $span, origElemWidth;

                    if (options.selectAutoWidth) {
                        sizingInvisible($el, function () {
                            origElemWidth = $el.width();
                        });
                    }

                    ds = divSpan($el, options, {
                        divClass: options.selectClass,
                        spanHtml: ($el.find(":selected:first") || $el.find("option:first")).html(),
                        spanWrap: "before"
                    });
                    $div = ds.div;
                    $span = ds.span;

                    if (options.selectAutoWidth) {
                        // Use the width of the select and adjust the
                        // span and div accordingly
                        sizingInvisible($el, function () {
                            // Force "display: block" - related to bug #287
                            swap($([ $span[0], $div[0] ]), {
                                display: "block"
                            }, function () {
                                var spanPad;
                                spanPad = $span.outerWidth() - $span.width();
                                $div.width(origElemWidth + spanPad);
                                $span.width(origElemWidth);
                            });
                        });
                    } else {
                        // Force the select to fill the size of the div
                        $div.addClass('fixedWidth');
                    }

                    // Take care of events
                    bindUi($el, $div, options);
                    bindMany($el, options, {
                        change: function () {
                            $span.html($el.find(":selected").html());
                            $div.removeClass(options.activeClass);
                        },
                        "click touchend": function () {
                            // IE7 and IE8 may not update the value right
                            // until after click event - issue #238
                            var selHtml = $el.find(":selected").html();

                            if ($span.html() !== selHtml) {
                                // Change was detected
                                // Fire the change event on the select tag
                                $el.trigger('change');
                            }
                        },
                        keyup: function () {
                            $span.html($el.find(":selected").html());
                        }
                    });
                    noSelect($span, options);
                    return {
                        remove: function () {
                            // Remove sibling span
                            $span.remove();

                            // Unwrap parent div
                            $el.unwrap().unbind(options.eventNamespace);
                            return $el;
                        },
                        update: function () {
                            if (options.selectAutoWidth) {
                                // Easier to remove and reapply formatting
                                $.uniform.restore($el);
                                $el.uniform(options);
                            } else {
                                classClearStandard($div, options);

                                // Reset current selected text
                                $span.html($el.find(":selected").html());
                                classUpdateDisabled($div, $el, options);
                            }
                        }
                    };
                }
            },
            {
                // Select lists - multiselect lists only
                match: function ($el) {
                    if ($el.is("select") && isMultiselect($el)) {
                        return true;
                    }

                    return false;
                },
                apply: function ($el, options) {
                    var $wrapper;

                    $el.addClass(options.selectMultiClass);
                    $wrapper = wrapWithWrapperClass($el, options);
                    bindUi($el, $el, options);

                    return {
                        remove: function () {
                            $el.removeClass(options.selectMultiClass);

                            if ($wrapper) {
                                $el.unwrap();
                            }
                        },
                        update: returnFalse
                    };
                }
            },
            {
                // Textareas
                match: function ($el) {
                    return $el.is("textarea");
                },
                apply: function ($el, options) {
                    var $wrapper;

                    $el.addClass(options.textareaClass);
                    $wrapper = wrapWithWrapperClass($el, options);
                    bindUi($el, $el, options);

                    return {
                        remove: function () {
                            $el.removeClass(options.textareaClass);

                            if ($wrapper) {
                                $el.unwrap();
                            }
                        },
                        update: returnFalse
                    };
                }
            }
        ];

    // IE6 can't be styled - can't set opacity on select
    if (isMsie() && !isMsieSevenOrNewer()) {
        allowStyling = false;
    }

    $.uniform = {
        // Default options that can be overridden globally or when uniformed
        // globally:  $.uniform.defaults.fileButtonHtml = "Pick A File";
        // on uniform:  $('input').uniform({fileButtonHtml: "Pick a File"});
        defaults: {
            activeClass: "active",
            autoHide: true,
            buttonClass: "button",
            checkboxClass: "checker",
            checkedClass: "checked",
            disabledClass: "disabled",
            eventNamespace: ".uniform",
            fileButtonClass: "action",
            fileButtonHtml: "Choose File",
            fileClass: "uploader",
            fileDefaultHtml: "No file selected",
            filenameClass: "filename",
            focusClass: "focus",
            hoverClass: "hover",
            idPrefix: "uniform",
            inputAddTypeAsClass: true,
            inputClass: "uniform-input",
            radioClass: "radio",
            resetDefaultHtml: "Reset",
            resetSelector: false,  // We'll use our own function when you don't specify one
            selectAutoWidth: true,
            selectClass: "selector",
            selectMultiClass: "uniform-multiselect",
            submitDefaultHtml: "Submit",  // Only text allowed
            textareaClass: "uniform",
            useID: true,
            wrapperClass: null
        },

        // All uniformed elements - DOM objects
        elements: []
    };

    $.fn.uniform = function (options) {
        var el = this;
        options = $.extend({}, $.uniform.defaults, options);

        // If we are in high contrast mode, do not allow styling
        if (!highContrastTest) {
            highContrastTest = true;

            if (highContrast()) {
                allowStyling = false;
            }
        }

        // Only uniform on browsers that work
        if (!allowStyling) {
            return this;
        }

        // Code for specifying a reset button
        if (options.resetSelector) {
            $(options.resetSelector).mouseup(function () {
                window.setTimeout(function () {
                    $.uniform.update(el);
                }, 10);
            });
        }

        return this.each(function () {
            var $el = $(this), i, handler, callbacks;

            // Avoid uniforming elements already uniformed - just update
            if ($el.data("uniformed")) {
                $.uniform.update($el);
                return;
            }

            // See if we have any handler for this type of element
            for (i = 0; i < uniformHandlers.length; i = i + 1) {
                handler = uniformHandlers[i];

                if (handler.match($el, options)) {
                    callbacks = handler.apply($el, options);
                    $el.data("uniformed", callbacks);

                    // Store element in our global array
                    $.uniform.elements.push($el.get(0));
                    return;
                }
            }

            // Could not style this element
        });
    };

    $.uniform.restore = $.fn.uniform.restore = function (elem) {
        if (elem === undef) {
            elem = $.uniform.elements;
        }

        $(elem).each(function () {
            var $el = $(this), index, elementData;
            elementData = $el.data("uniformed");

            // Skip elements that are not uniformed
            if (!elementData) {
                return;
            }

            // Unbind events, remove additional markup that was added
            elementData.remove();

            // Remove item from list of uniformed elements
            index = $.inArray(this, $.uniform.elements);

            if (index >= 0) {
                $.uniform.elements.splice(index, 1);
            }

            $el.removeData("uniformed");
        });
    };

    $.uniform.update = $.fn.uniform.update = function (elem) {
        if (elem === undef) {
            elem = $.uniform.elements;
        }

        $(elem).each(function () {
            var $el = $(this), elementData;
            elementData = $el.data("uniformed");

            // Skip elements that are not uniformed
            if (!elementData) {
                return;
            }

            elementData.update($el, elementData.options);
        });
    };
}(jQuery));






/*================= JQUERY UI PLUGIN STARTS ====================*/


//this jquery ui plugin is limited for only datepicker and autocomplete. 

/*! jQuery UI - v1.11.2 - 2014-12-22
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, autocomplete.js, datepicker.js, menu.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define([ "jquery" ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
}(function( $ ) {
/*!
 * jQuery UI Core 1.11.2
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */


// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
    version: "1.11.2",

    keyCode: {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    }
});

// plugins
$.fn.extend({
    scrollParent: function( includeHidden ) {
        var position = this.css( "position" ),
            excludeStaticParent = position === "absolute",
            overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
            scrollParent = this.parents().filter( function() {
                var parent = $( this );
                if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
                    return false;
                }
                return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
            }).eq( 0 );

        return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
    },

    uniqueId: (function() {
        var uuid = 0;

        return function() {
            return this.each(function() {
                if ( !this.id ) {
                    this.id = "ui-id-" + ( ++uuid );
                }
            });
        };
    })(),

    removeUniqueId: function() {
        return this.each(function() {
            if ( /^ui-id-\d+$/.test( this.id ) ) {
                $( this ).removeAttr( "id" );
            }
        });
    }
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
    var map, mapName, img,
        nodeName = element.nodeName.toLowerCase();
    if ( "area" === nodeName ) {
        map = element.parentNode;
        mapName = map.name;
        if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
            return false;
        }
        img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
        return !!img && visible( img );
    }
    return ( /input|select|textarea|button|object/.test( nodeName ) ?
        !element.disabled :
        "a" === nodeName ?
            element.href || isTabIndexNotNaN :
            isTabIndexNotNaN) &&
        // the element and all of its ancestors must be visible
        visible( element );
}

function visible( element ) {
    return $.expr.filters.visible( element ) &&
        !$( element ).parents().addBack().filter(function() {
            return $.css( this, "visibility" ) === "hidden";
        }).length;
}

$.extend( $.expr[ ":" ], {
    data: $.expr.createPseudo ?
        $.expr.createPseudo(function( dataName ) {
            return function( elem ) {
                return !!$.data( elem, dataName );
            };
        }) :
        // support: jQuery <1.8
        function( elem, i, match ) {
            return !!$.data( elem, match[ 3 ] );
        },

    focusable: function( element ) {
        return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
    },

    tabbable: function( element ) {
        var tabIndex = $.attr( element, "tabindex" ),
            isTabIndexNaN = isNaN( tabIndex );
        return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
    }
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
    $.each( [ "Width", "Height" ], function( i, name ) {
        var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
            type = name.toLowerCase(),
            orig = {
                innerWidth: $.fn.innerWidth,
                innerHeight: $.fn.innerHeight,
                outerWidth: $.fn.outerWidth,
                outerHeight: $.fn.outerHeight
            };

        function reduce( elem, size, border, margin ) {
            $.each( side, function() {
                size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
                if ( border ) {
                    size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
                }
                if ( margin ) {
                    size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
                }
            });
            return size;
        }

        $.fn[ "inner" + name ] = function( size ) {
            if ( size === undefined ) {
                return orig[ "inner" + name ].call( this );
            }

            return this.each(function() {
                $( this ).css( type, reduce( this, size ) + "px" );
            });
        };

        $.fn[ "outer" + name] = function( size, margin ) {
            if ( typeof size !== "number" ) {
                return orig[ "outer" + name ].call( this, size );
            }

            return this.each(function() {
                $( this).css( type, reduce( this, size, true, margin ) + "px" );
            });
        };
    });
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
    $.fn.addBack = function( selector ) {
        return this.add( selector == null ?
            this.prevObject : this.prevObject.filter( selector )
        );
    };
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
    $.fn.removeData = (function( removeData ) {
        return function( key ) {
            if ( arguments.length ) {
                return removeData.call( this, $.camelCase( key ) );
            } else {
                return removeData.call( this );
            }
        };
    })( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
    focus: (function( orig ) {
        return function( delay, fn ) {
            return typeof delay === "number" ?
                this.each(function() {
                    var elem = this;
                    setTimeout(function() {
                        $( elem ).focus();
                        if ( fn ) {
                            fn.call( elem );
                        }
                    }, delay );
                }) :
                orig.apply( this, arguments );
        };
    })( $.fn.focus ),

    disableSelection: (function() {
        var eventType = "onselectstart" in document.createElement( "div" ) ?
            "selectstart" :
            "mousedown";

        return function() {
            return this.bind( eventType + ".ui-disableSelection", function( event ) {
                event.preventDefault();
            });
        };
    })(),

    enableSelection: function() {
        return this.unbind( ".ui-disableSelection" );
    },

    zIndex: function( zIndex ) {
        if ( zIndex !== undefined ) {
            return this.css( "zIndex", zIndex );
        }

        if ( this.length ) {
            var elem = $( this[ 0 ] ), position, value;
            while ( elem.length && elem[ 0 ] !== document ) {
                // Ignore z-index if position is set to a value where z-index is ignored by the browser
                // This makes behavior of this function consistent across browsers
                // WebKit always returns auto if the element is positioned
                position = elem.css( "position" );
                if ( position === "absolute" || position === "relative" || position === "fixed" ) {
                    // IE returns 0 when zIndex is not specified
                    // other browsers return a string
                    // we ignore the case of nested elements with an explicit value of 0
                    // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                    value = parseInt( elem.css( "zIndex" ), 10 );
                    if ( !isNaN( value ) && value !== 0 ) {
                        return value;
                    }
                }
                elem = elem.parent();
            }
        }

        return 0;
    }
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
    add: function( module, option, set ) {
        var i,
            proto = $.ui[ module ].prototype;
        for ( i in set ) {
            proto.plugins[ i ] = proto.plugins[ i ] || [];
            proto.plugins[ i ].push( [ option, set[ i ] ] );
        }
    },
    call: function( instance, name, args, allowDisconnected ) {
        var i,
            set = instance.plugins[ name ];

        if ( !set ) {
            return;
        }

        if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
            return;
        }

        for ( i = 0; i < set.length; i++ ) {
            if ( instance.options[ set[ i ][ 0 ] ] ) {
                set[ i ][ 1 ].apply( instance.element, args );
            }
        }
    }
};


/*!
 * jQuery UI Widget 1.11.2
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */


var widget_uuid = 0,
    widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
    return function( elems ) {
        var events, elem, i;
        for ( i = 0; (elem = elems[i]) != null; i++ ) {
            try {

                // Only trigger remove when necessary to save time
                events = $._data( elem, "events" );
                if ( events && events.remove ) {
                    $( elem ).triggerHandler( "remove" );
                }

            // http://bugs.jquery.com/ticket/8235
            } catch ( e ) {}
        }
        orig( elems );
    };
})( $.cleanData );

$.widget = function( name, base, prototype ) {
    var fullName, existingConstructor, constructor, basePrototype,
        // proxiedPrototype allows the provided prototype to remain unmodified
        // so that it can be used as a mixin for multiple widgets (#8876)
        proxiedPrototype = {},
        namespace = name.split( "." )[ 0 ];

    name = name.split( "." )[ 1 ];
    fullName = namespace + "-" + name;

    if ( !prototype ) {
        prototype = base;
        base = $.Widget;
    }

    // create selector for plugin
    $.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
        return !!$.data( elem, fullName );
    };

    $[ namespace ] = $[ namespace ] || {};
    existingConstructor = $[ namespace ][ name ];
    constructor = $[ namespace ][ name ] = function( options, element ) {
        // allow instantiation without "new" keyword
        if ( !this._createWidget ) {
            return new constructor( options, element );
        }

        // allow instantiation without initializing for simple inheritance
        // must use "new" keyword (the code above always passes args)
        if ( arguments.length ) {
            this._createWidget( options, element );
        }
    };
    // extend with the existing constructor to carry over any static properties
    $.extend( constructor, existingConstructor, {
        version: prototype.version,
        // copy the object used to create the prototype in case we need to
        // redefine the widget later
        _proto: $.extend( {}, prototype ),
        // track widgets that inherit from this widget in case this widget is
        // redefined after a widget inherits from it
        _childConstructors: []
    });

    basePrototype = new base();
    // we need to make the options hash a property directly on the new instance
    // otherwise we'll modify the options hash on the prototype that we're
    // inheriting from
    basePrototype.options = $.widget.extend( {}, basePrototype.options );
    $.each( prototype, function( prop, value ) {
        if ( !$.isFunction( value ) ) {
            proxiedPrototype[ prop ] = value;
            return;
        }
        proxiedPrototype[ prop ] = (function() {
            var _super = function() {
                    return base.prototype[ prop ].apply( this, arguments );
                },
                _superApply = function( args ) {
                    return base.prototype[ prop ].apply( this, args );
                };
            return function() {
                var __super = this._super,
                    __superApply = this._superApply,
                    returnValue;

                this._super = _super;
                this._superApply = _superApply;

                returnValue = value.apply( this, arguments );

                this._super = __super;
                this._superApply = __superApply;

                return returnValue;
            };
        })();
    });
    constructor.prototype = $.widget.extend( basePrototype, {
        // TODO: remove support for widgetEventPrefix
        // always use the name + a colon as the prefix, e.g., draggable:start
        // don't prefix for widgets that aren't DOM-based
        widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
    }, proxiedPrototype, {
        constructor: constructor,
        namespace: namespace,
        widgetName: name,
        widgetFullName: fullName
    });

    // If this widget is being redefined then we need to find all widgets that
    // are inheriting from it and redefine all of them so that they inherit from
    // the new version of this widget. We're essentially trying to replace one
    // level in the prototype chain.
    if ( existingConstructor ) {
        $.each( existingConstructor._childConstructors, function( i, child ) {
            var childPrototype = child.prototype;

            // redefine the child widget using the same prototype that was
            // originally used, but inherit from the new version of the base
            $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
        });
        // remove the list of existing child constructors from the old constructor
        // so the old child constructors can be garbage collected
        delete existingConstructor._childConstructors;
    } else {
        base._childConstructors.push( constructor );
    }

    $.widget.bridge( name, constructor );

    return constructor;
};

$.widget.extend = function( target ) {
    var input = widget_slice.call( arguments, 1 ),
        inputIndex = 0,
        inputLength = input.length,
        key,
        value;
    for ( ; inputIndex < inputLength; inputIndex++ ) {
        for ( key in input[ inputIndex ] ) {
            value = input[ inputIndex ][ key ];
            if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
                // Clone objects
                if ( $.isPlainObject( value ) ) {
                    target[ key ] = $.isPlainObject( target[ key ] ) ?
                        $.widget.extend( {}, target[ key ], value ) :
                        // Don't extend strings, arrays, etc. with objects
                        $.widget.extend( {}, value );
                // Copy everything else by reference
                } else {
                    target[ key ] = value;
                }
            }
        }
    }
    return target;
};

$.widget.bridge = function( name, object ) {
    var fullName = object.prototype.widgetFullName || name;
    $.fn[ name ] = function( options ) {
        var isMethodCall = typeof options === "string",
            args = widget_slice.call( arguments, 1 ),
            returnValue = this;

        // allow multiple hashes to be passed on init
        options = !isMethodCall && args.length ?
            $.widget.extend.apply( null, [ options ].concat(args) ) :
            options;

        if ( isMethodCall ) {
            this.each(function() {
                var methodValue,
                    instance = $.data( this, fullName );
                if ( options === "instance" ) {
                    returnValue = instance;
                    return false;
                }
                if ( !instance ) {
                    return $.error( "cannot call methods on " + name + " prior to initialization; " +
                        "attempted to call method '" + options + "'" );
                }
                if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
                    return $.error( "no such method '" + options + "' for " + name + " widget instance" );
                }
                methodValue = instance[ options ].apply( instance, args );
                if ( methodValue !== instance && methodValue !== undefined ) {
                    returnValue = methodValue && methodValue.jquery ?
                        returnValue.pushStack( methodValue.get() ) :
                        methodValue;
                    return false;
                }
            });
        } else {
            this.each(function() {
                var instance = $.data( this, fullName );
                if ( instance ) {
                    instance.option( options || {} );
                    if ( instance._init ) {
                        instance._init();
                    }
                } else {
                    $.data( this, fullName, new object( options, this ) );
                }
            });
        }

        return returnValue;
    };
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: {
        disabled: false,

        // callbacks
        create: null
    },
    _createWidget: function( options, element ) {
        element = $( element || this.defaultElement || this )[ 0 ];
        this.element = $( element );
        this.uuid = widget_uuid++;
        this.eventNamespace = "." + this.widgetName + this.uuid;

        this.bindings = $();
        this.hoverable = $();
        this.focusable = $();

        if ( element !== this ) {
            $.data( element, this.widgetFullName, this );
            this._on( true, this.element, {
                remove: function( event ) {
                    if ( event.target === element ) {
                        this.destroy();
                    }
                }
            });
            this.document = $( element.style ?
                // element within the document
                element.ownerDocument :
                // element is window or document
                element.document || element );
            this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
        }

        this.options = $.widget.extend( {},
            this.options,
            this._getCreateOptions(),
            options );

        this._create();
        this._trigger( "create", null, this._getCreateEventData() );
        this._init();
    },
    _getCreateOptions: $.noop,
    _getCreateEventData: $.noop,
    _create: $.noop,
    _init: $.noop,

    destroy: function() {
        this._destroy();
        // we can probably remove the unbind calls in 2.0
        // all event bindings should go through this._on()
        this.element
            .unbind( this.eventNamespace )
            .removeData( this.widgetFullName )
            // support: jquery <1.6.3
            // http://bugs.jquery.com/ticket/9413
            .removeData( $.camelCase( this.widgetFullName ) );
        this.widget()
            .unbind( this.eventNamespace )
            .removeAttr( "aria-disabled" )
            .removeClass(
                this.widgetFullName + "-disabled " +
                "ui-state-disabled" );

        // clean up events and states
        this.bindings.unbind( this.eventNamespace );
        this.hoverable.removeClass( "ui-state-hover" );
        this.focusable.removeClass( "ui-state-focus" );
    },
    _destroy: $.noop,

    widget: function() {
        return this.element;
    },

    option: function( key, value ) {
        var options = key,
            parts,
            curOption,
            i;

        if ( arguments.length === 0 ) {
            // don't return a reference to the internal hash
            return $.widget.extend( {}, this.options );
        }

        if ( typeof key === "string" ) {
            // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
            options = {};
            parts = key.split( "." );
            key = parts.shift();
            if ( parts.length ) {
                curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
                for ( i = 0; i < parts.length - 1; i++ ) {
                    curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                    curOption = curOption[ parts[ i ] ];
                }
                key = parts.pop();
                if ( arguments.length === 1 ) {
                    return curOption[ key ] === undefined ? null : curOption[ key ];
                }
                curOption[ key ] = value;
            } else {
                if ( arguments.length === 1 ) {
                    return this.options[ key ] === undefined ? null : this.options[ key ];
                }
                options[ key ] = value;
            }
        }

        this._setOptions( options );

        return this;
    },
    _setOptions: function( options ) {
        var key;

        for ( key in options ) {
            this._setOption( key, options[ key ] );
        }

        return this;
    },
    _setOption: function( key, value ) {
        this.options[ key ] = value;

        if ( key === "disabled" ) {
            this.widget()
                .toggleClass( this.widgetFullName + "-disabled", !!value );

            // If the widget is becoming disabled, then nothing is interactive
            if ( value ) {
                this.hoverable.removeClass( "ui-state-hover" );
                this.focusable.removeClass( "ui-state-focus" );
            }
        }

        return this;
    },

    enable: function() {
        return this._setOptions({ disabled: false });
    },
    disable: function() {
        return this._setOptions({ disabled: true });
    },

    _on: function( suppressDisabledCheck, element, handlers ) {
        var delegateElement,
            instance = this;

        // no suppressDisabledCheck flag, shuffle arguments
        if ( typeof suppressDisabledCheck !== "boolean" ) {
            handlers = element;
            element = suppressDisabledCheck;
            suppressDisabledCheck = false;
        }

        // no element argument, shuffle and use this.element
        if ( !handlers ) {
            handlers = element;
            element = this.element;
            delegateElement = this.widget();
        } else {
            element = delegateElement = $( element );
            this.bindings = this.bindings.add( element );
        }

        $.each( handlers, function( event, handler ) {
            function handlerProxy() {
                // allow widgets to customize the disabled handling
                // - disabled as an array instead of boolean
                // - disabled class as method for disabling individual parts
                if ( !suppressDisabledCheck &&
                        ( instance.options.disabled === true ||
                            $( this ).hasClass( "ui-state-disabled" ) ) ) {
                    return;
                }
                return ( typeof handler === "string" ? instance[ handler ] : handler )
                    .apply( instance, arguments );
            }

            // copy the guid so direct unbinding works
            if ( typeof handler !== "string" ) {
                handlerProxy.guid = handler.guid =
                    handler.guid || handlerProxy.guid || $.guid++;
            }

            var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
                eventName = match[1] + instance.eventNamespace,
                selector = match[2];
            if ( selector ) {
                delegateElement.delegate( selector, eventName, handlerProxy );
            } else {
                element.bind( eventName, handlerProxy );
            }
        });
    },

    _off: function( element, eventName ) {
        eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
            this.eventNamespace;
        element.unbind( eventName ).undelegate( eventName );

        // Clear the stack to avoid memory leaks (#10056)
        this.bindings = $( this.bindings.not( element ).get() );
        this.focusable = $( this.focusable.not( element ).get() );
        this.hoverable = $( this.hoverable.not( element ).get() );
    },

    _delay: function( handler, delay ) {
        function handlerProxy() {
            return ( typeof handler === "string" ? instance[ handler ] : handler )
                .apply( instance, arguments );
        }
        var instance = this;
        return setTimeout( handlerProxy, delay || 0 );
    },

    _hoverable: function( element ) {
        this.hoverable = this.hoverable.add( element );
        this._on( element, {
            mouseenter: function( event ) {
                $( event.currentTarget ).addClass( "ui-state-hover" );
            },
            mouseleave: function( event ) {
                $( event.currentTarget ).removeClass( "ui-state-hover" );
            }
        });
    },

    _focusable: function( element ) {
        this.focusable = this.focusable.add( element );
        this._on( element, {
            focusin: function( event ) {
                $( event.currentTarget ).addClass( "ui-state-focus" );
            },
            focusout: function( event ) {
                $( event.currentTarget ).removeClass( "ui-state-focus" );
            }
        });
    },

    _trigger: function( type, event, data ) {
        var prop, orig,
            callback = this.options[ type ];

        data = data || {};
        event = $.Event( event );
        event.type = ( type === this.widgetEventPrefix ?
            type :
            this.widgetEventPrefix + type ).toLowerCase();
        // the original event may come from any element
        // so we need to reset the target on the new event
        event.target = this.element[ 0 ];

        // copy original event properties over to the new event
        orig = event.originalEvent;
        if ( orig ) {
            for ( prop in orig ) {
                if ( !( prop in event ) ) {
                    event[ prop ] = orig[ prop ];
                }
            }
        }

        this.element.trigger( event, data );
        return !( $.isFunction( callback ) &&
            callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
            event.isDefaultPrevented() );
    }
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
    $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
        if ( typeof options === "string" ) {
            options = { effect: options };
        }
        var hasOptions,
            effectName = !options ?
                method :
                options === true || typeof options === "number" ?
                    defaultEffect :
                    options.effect || defaultEffect;
        options = options || {};
        if ( typeof options === "number" ) {
            options = { duration: options };
        }
        hasOptions = !$.isEmptyObject( options );
        options.complete = callback;
        if ( options.delay ) {
            element.delay( options.delay );
        }
        if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
            element[ method ]( options );
        } else if ( effectName !== method && element[ effectName ] ) {
            element[ effectName ]( options.duration, options.easing, callback );
        } else {
            element.queue(function( next ) {
                $( this )[ method ]();
                if ( callback ) {
                    callback.call( element[ 0 ] );
                }
                next();
            });
        }
    };
});

var widget = $.widget;


/*!
 * jQuery UI Mouse 1.11.2
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 */


var mouseHandled = false;
$( document ).mouseup( function() {
    mouseHandled = false;
});

var mouse = $.widget("ui.mouse", {
    version: "1.11.2",
    options: {
        cancel: "input,textarea,button,select,option",
        distance: 1,
        delay: 0
    },
    _mouseInit: function() {
        var that = this;

        this.element
            .bind("mousedown." + this.widgetName, function(event) {
                return that._mouseDown(event);
            })
            .bind("click." + this.widgetName, function(event) {
                if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                    $.removeData(event.target, that.widgetName + ".preventClickEvent");
                    event.stopImmediatePropagation();
                    return false;
                }
            });

        this.started = false;
    },

    // TODO: make sure destroying one instance of mouse doesn't mess with
    // other instances of mouse
    _mouseDestroy: function() {
        this.element.unbind("." + this.widgetName);
        if ( this._mouseMoveDelegate ) {
            this.document
                .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
                .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
        }
    },

    _mouseDown: function(event) {
        // don't let more than one widget handle mouseStart
        if ( mouseHandled ) {
            return;
        }

        this._mouseMoved = false;

        // we may have missed mouseup (out of window)
        (this._mouseStarted && this._mouseUp(event));

        this._mouseDownEvent = event;

        var that = this,
            btnIsLeft = (event.which === 1),
            // event.target.nodeName works around a bug in IE 8 with
            // disabled inputs (#7620)
            elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
        if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
            return true;
        }

        this.mouseDelayMet = !this.options.delay;
        if (!this.mouseDelayMet) {
            this._mouseDelayTimer = setTimeout(function() {
                that.mouseDelayMet = true;
            }, this.options.delay);
        }

        if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
            this._mouseStarted = (this._mouseStart(event) !== false);
            if (!this._mouseStarted) {
                event.preventDefault();
                return true;
            }
        }

        // Click event may never have fired (Gecko & Opera)
        if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
            $.removeData(event.target, this.widgetName + ".preventClickEvent");
        }

        // these delegates are required to keep context
        this._mouseMoveDelegate = function(event) {
            return that._mouseMove(event);
        };
        this._mouseUpDelegate = function(event) {
            return that._mouseUp(event);
        };

        this.document
            .bind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
            .bind( "mouseup." + this.widgetName, this._mouseUpDelegate );

        event.preventDefault();

        mouseHandled = true;
        return true;
    },

    _mouseMove: function(event) {
        // Only check for mouseups outside the document if you've moved inside the document
        // at least once. This prevents the firing of mouseup in the case of IE<9, which will
        // fire a mousemove event if content is placed under the cursor. See #7778
        // Support: IE <9
        if ( this._mouseMoved ) {
            // IE mouseup check - mouseup happened when mouse was out of window
            if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
                return this._mouseUp(event);

            // Iframe mouseup check - mouseup occurred in another document
            } else if ( !event.which ) {
                return this._mouseUp( event );
            }
        }

        if ( event.which || event.button ) {
            this._mouseMoved = true;
        }

        if (this._mouseStarted) {
            this._mouseDrag(event);
            return event.preventDefault();
        }

        if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
            this._mouseStarted =
                (this._mouseStart(this._mouseDownEvent, event) !== false);
            (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
        }

        return !this._mouseStarted;
    },

    _mouseUp: function(event) {
        this.document
            .unbind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
            .unbind( "mouseup." + this.widgetName, this._mouseUpDelegate );

        if (this._mouseStarted) {
            this._mouseStarted = false;

            if (event.target === this._mouseDownEvent.target) {
                $.data(event.target, this.widgetName + ".preventClickEvent", true);
            }

            this._mouseStop(event);
        }

        mouseHandled = false;
        return false;
    },

    _mouseDistanceMet: function(event) {
        return (Math.max(
                Math.abs(this._mouseDownEvent.pageX - event.pageX),
                Math.abs(this._mouseDownEvent.pageY - event.pageY)
            ) >= this.options.distance
        );
    },

    _mouseDelayMet: function(/* event */) {
        return this.mouseDelayMet;
    },

    // These are placeholder methods, to be overriden by extending plugin
    _mouseStart: function(/* event */) {},
    _mouseDrag: function(/* event */) {},
    _mouseStop: function(/* event */) {},
    _mouseCapture: function(/* event */) { return true; }
});


/*!
 * jQuery UI Position 1.11.2
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
    max = Math.max,
    abs = Math.abs,
    round = Math.round,
    rhorizontal = /left|center|right/,
    rvertical = /top|center|bottom/,
    roffset = /[\+\-]\d+(\.[\d]+)?%?/,
    rposition = /^\w+/,
    rpercent = /%$/,
    _position = $.fn.position;

function getOffsets( offsets, width, height ) {
    return [
        parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
        parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
    ];
}

function parseCss( element, property ) {
    return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
    var raw = elem[0];
    if ( raw.nodeType === 9 ) {
        return {
            width: elem.width(),
            height: elem.height(),
            offset: { top: 0, left: 0 }
        };
    }
    if ( $.isWindow( raw ) ) {
        return {
            width: elem.width(),
            height: elem.height(),
            offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
        };
    }
    if ( raw.preventDefault ) {
        return {
            width: 0,
            height: 0,
            offset: { top: raw.pageY, left: raw.pageX }
        };
    }
    return {
        width: elem.outerWidth(),
        height: elem.outerHeight(),
        offset: elem.offset()
    };
}

$.position = {
    scrollbarWidth: function() {
        if ( cachedScrollbarWidth !== undefined ) {
            return cachedScrollbarWidth;
        }
        var w1, w2,
            div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
            innerDiv = div.children()[0];

        $( "body" ).append( div );
        w1 = innerDiv.offsetWidth;
        div.css( "overflow", "scroll" );

        w2 = innerDiv.offsetWidth;

        if ( w1 === w2 ) {
            w2 = div[0].clientWidth;
        }

        div.remove();

        return (cachedScrollbarWidth = w1 - w2);
    },
    getScrollInfo: function( within ) {
        var overflowX = within.isWindow || within.isDocument ? "" :
                within.element.css( "overflow-x" ),
            overflowY = within.isWindow || within.isDocument ? "" :
                within.element.css( "overflow-y" ),
            hasOverflowX = overflowX === "scroll" ||
                ( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
            hasOverflowY = overflowY === "scroll" ||
                ( overflowY === "auto" && within.height < within.element[0].scrollHeight );
        return {
            width: hasOverflowY ? $.position.scrollbarWidth() : 0,
            height: hasOverflowX ? $.position.scrollbarWidth() : 0
        };
    },
    getWithinInfo: function( element ) {
        var withinElement = $( element || window ),
            isWindow = $.isWindow( withinElement[0] ),
            isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
        return {
            element: withinElement,
            isWindow: isWindow,
            isDocument: isDocument,
            offset: withinElement.offset() || { left: 0, top: 0 },
            scrollLeft: withinElement.scrollLeft(),
            scrollTop: withinElement.scrollTop(),

            // support: jQuery 1.6.x
            // jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
            width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
            height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
        };
    }
};

$.fn.position = function( options ) {
    if ( !options || !options.of ) {
        return _position.apply( this, arguments );
    }

    // make a copy, we don't want to modify arguments
    options = $.extend( {}, options );

    var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
        target = $( options.of ),
        within = $.position.getWithinInfo( options.within ),
        scrollInfo = $.position.getScrollInfo( within ),
        collision = ( options.collision || "flip" ).split( " " ),
        offsets = {};

    dimensions = getDimensions( target );
    if ( target[0].preventDefault ) {
        // force left top to allow flipping
        options.at = "left top";
    }
    targetWidth = dimensions.width;
    targetHeight = dimensions.height;
    targetOffset = dimensions.offset;
    // clone to reuse original targetOffset later
    basePosition = $.extend( {}, targetOffset );

    // force my and at to have valid horizontal and vertical positions
    // if a value is missing or invalid, it will be converted to center
    $.each( [ "my", "at" ], function() {
        var pos = ( options[ this ] || "" ).split( " " ),
            horizontalOffset,
            verticalOffset;

        if ( pos.length === 1) {
            pos = rhorizontal.test( pos[ 0 ] ) ?
                pos.concat( [ "center" ] ) :
                rvertical.test( pos[ 0 ] ) ?
                    [ "center" ].concat( pos ) :
                    [ "center", "center" ];
        }
        pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
        pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

        // calculate offsets
        horizontalOffset = roffset.exec( pos[ 0 ] );
        verticalOffset = roffset.exec( pos[ 1 ] );
        offsets[ this ] = [
            horizontalOffset ? horizontalOffset[ 0 ] : 0,
            verticalOffset ? verticalOffset[ 0 ] : 0
        ];

        // reduce to just the positions without the offsets
        options[ this ] = [
            rposition.exec( pos[ 0 ] )[ 0 ],
            rposition.exec( pos[ 1 ] )[ 0 ]
        ];
    });

    // normalize collision option
    if ( collision.length === 1 ) {
        collision[ 1 ] = collision[ 0 ];
    }

    if ( options.at[ 0 ] === "right" ) {
        basePosition.left += targetWidth;
    } else if ( options.at[ 0 ] === "center" ) {
        basePosition.left += targetWidth / 2;
    }

    if ( options.at[ 1 ] === "bottom" ) {
        basePosition.top += targetHeight;
    } else if ( options.at[ 1 ] === "center" ) {
        basePosition.top += targetHeight / 2;
    }

    atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
    basePosition.left += atOffset[ 0 ];
    basePosition.top += atOffset[ 1 ];

    return this.each(function() {
        var collisionPosition, using,
            elem = $( this ),
            elemWidth = elem.outerWidth(),
            elemHeight = elem.outerHeight(),
            marginLeft = parseCss( this, "marginLeft" ),
            marginTop = parseCss( this, "marginTop" ),
            collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
            collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
            position = $.extend( {}, basePosition ),
            myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

        if ( options.my[ 0 ] === "right" ) {
            position.left -= elemWidth;
        } else if ( options.my[ 0 ] === "center" ) {
            position.left -= elemWidth / 2;
        }

        if ( options.my[ 1 ] === "bottom" ) {
            position.top -= elemHeight;
        } else if ( options.my[ 1 ] === "center" ) {
            position.top -= elemHeight / 2;
        }

        position.left += myOffset[ 0 ];
        position.top += myOffset[ 1 ];

        // if the browser doesn't support fractions, then round for consistent results
        if ( !supportsOffsetFractions ) {
            position.left = round( position.left );
            position.top = round( position.top );
        }

        collisionPosition = {
            marginLeft: marginLeft,
            marginTop: marginTop
        };

        $.each( [ "left", "top" ], function( i, dir ) {
            if ( $.ui.position[ collision[ i ] ] ) {
                $.ui.position[ collision[ i ] ][ dir ]( position, {
                    targetWidth: targetWidth,
                    targetHeight: targetHeight,
                    elemWidth: elemWidth,
                    elemHeight: elemHeight,
                    collisionPosition: collisionPosition,
                    collisionWidth: collisionWidth,
                    collisionHeight: collisionHeight,
                    offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
                    my: options.my,
                    at: options.at,
                    within: within,
                    elem: elem
                });
            }
        });

        if ( options.using ) {
            // adds feedback as second argument to using callback, if present
            using = function( props ) {
                var left = targetOffset.left - position.left,
                    right = left + targetWidth - elemWidth,
                    top = targetOffset.top - position.top,
                    bottom = top + targetHeight - elemHeight,
                    feedback = {
                        target: {
                            element: target,
                            left: targetOffset.left,
                            top: targetOffset.top,
                            width: targetWidth,
                            height: targetHeight
                        },
                        element: {
                            element: elem,
                            left: position.left,
                            top: position.top,
                            width: elemWidth,
                            height: elemHeight
                        },
                        horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                        vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
                    };
                if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
                    feedback.horizontal = "center";
                }
                if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
                    feedback.vertical = "middle";
                }
                if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
                    feedback.important = "horizontal";
                } else {
                    feedback.important = "vertical";
                }
                options.using.call( this, props, feedback );
            };
        }

        elem.offset( $.extend( position, { using: using } ) );
    });
};

$.ui.position = {
    fit: {
        left: function( position, data ) {
            var within = data.within,
                withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                outerWidth = within.width,
                collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                overLeft = withinOffset - collisionPosLeft,
                overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                newOverRight;

            // element is wider than within
            if ( data.collisionWidth > outerWidth ) {
                // element is initially over the left side of within
                if ( overLeft > 0 && overRight <= 0 ) {
                    newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
                    position.left += overLeft - newOverRight;
                // element is initially over right side of within
                } else if ( overRight > 0 && overLeft <= 0 ) {
                    position.left = withinOffset;
                // element is initially over both left and right sides of within
                } else {
                    if ( overLeft > overRight ) {
                        position.left = withinOffset + outerWidth - data.collisionWidth;
                    } else {
                        position.left = withinOffset;
                    }
                }
            // too far left -> align with left edge
            } else if ( overLeft > 0 ) {
                position.left += overLeft;
            // too far right -> align with right edge
            } else if ( overRight > 0 ) {
                position.left -= overRight;
            // adjust based on position and margin
            } else {
                position.left = max( position.left - collisionPosLeft, position.left );
            }
        },
        top: function( position, data ) {
            var within = data.within,
                withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                outerHeight = data.within.height,
                collisionPosTop = position.top - data.collisionPosition.marginTop,
                overTop = withinOffset - collisionPosTop,
                overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                newOverBottom;

            // element is taller than within
            if ( data.collisionHeight > outerHeight ) {
                // element is initially over the top of within
                if ( overTop > 0 && overBottom <= 0 ) {
                    newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
                    position.top += overTop - newOverBottom;
                // element is initially over bottom of within
                } else if ( overBottom > 0 && overTop <= 0 ) {
                    position.top = withinOffset;
                // element is initially over both top and bottom of within
                } else {
                    if ( overTop > overBottom ) {
                        position.top = withinOffset + outerHeight - data.collisionHeight;
                    } else {
                        position.top = withinOffset;
                    }
                }
            // too far up -> align with top
            } else if ( overTop > 0 ) {
                position.top += overTop;
            // too far down -> align with bottom edge
            } else if ( overBottom > 0 ) {
                position.top -= overBottom;
            // adjust based on position and margin
            } else {
                position.top = max( position.top - collisionPosTop, position.top );
            }
        }
    },
    flip: {
        left: function( position, data ) {
            var within = data.within,
                withinOffset = within.offset.left + within.scrollLeft,
                outerWidth = within.width,
                offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                overLeft = collisionPosLeft - offsetLeft,
                overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                myOffset = data.my[ 0 ] === "left" ?
                    -data.elemWidth :
                    data.my[ 0 ] === "right" ?
                        data.elemWidth :
                        0,
                atOffset = data.at[ 0 ] === "left" ?
                    data.targetWidth :
                    data.at[ 0 ] === "right" ?
                        -data.targetWidth :
                        0,
                offset = -2 * data.offset[ 0 ],
                newOverRight,
                newOverLeft;

            if ( overLeft < 0 ) {
                newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
                if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
                    position.left += myOffset + atOffset + offset;
                }
            } else if ( overRight > 0 ) {
                newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
                if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
                    position.left += myOffset + atOffset + offset;
                }
            }
        },
        top: function( position, data ) {
            var within = data.within,
                withinOffset = within.offset.top + within.scrollTop,
                outerHeight = within.height,
                offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                collisionPosTop = position.top - data.collisionPosition.marginTop,
                overTop = collisionPosTop - offsetTop,
                overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                top = data.my[ 1 ] === "top",
                myOffset = top ?
                    -data.elemHeight :
                    data.my[ 1 ] === "bottom" ?
                        data.elemHeight :
                        0,
                atOffset = data.at[ 1 ] === "top" ?
                    data.targetHeight :
                    data.at[ 1 ] === "bottom" ?
                        -data.targetHeight :
                        0,
                offset = -2 * data.offset[ 1 ],
                newOverTop,
                newOverBottom;
            if ( overTop < 0 ) {
                newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
                if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
                    position.top += myOffset + atOffset + offset;
                }
            } else if ( overBottom > 0 ) {
                newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
                if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
                    position.top += myOffset + atOffset + offset;
                }
            }
        }
    },
    flipfit: {
        left: function() {
            $.ui.position.flip.left.apply( this, arguments );
            $.ui.position.fit.left.apply( this, arguments );
        },
        top: function() {
            $.ui.position.flip.top.apply( this, arguments );
            $.ui.position.fit.top.apply( this, arguments );
        }
    }
};

// fraction support test
(function() {
    var testElement, testElementParent, testElementStyle, offsetLeft, i,
        body = document.getElementsByTagName( "body" )[ 0 ],
        div = document.createElement( "div" );

    //Create a "fake body" for testing based on method used in jQuery.support
    testElement = document.createElement( body ? "div" : "body" );
    testElementStyle = {
        visibility: "hidden",
        width: 0,
        height: 0,
        border: 0,
        margin: 0,
        background: "none"
    };
    if ( body ) {
        $.extend( testElementStyle, {
            position: "absolute",
            left: "-1000px",
            top: "-1000px"
        });
    }
    for ( i in testElementStyle ) {
        testElement.style[ i ] = testElementStyle[ i ];
    }
    testElement.appendChild( div );
    testElementParent = body || document.documentElement;
    testElementParent.insertBefore( testElement, testElementParent.firstChild );

    div.style.cssText = "position: absolute; left: 10.7432222px;";

    offsetLeft = $( div ).offset().left;
    supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

    testElement.innerHTML = "";
    testElementParent.removeChild( testElement );
})();

})();

var position = $.ui.position;


/*!
 * jQuery UI Menu 1.11.2
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/menu/
 */


var menu = $.widget( "ui.menu", {
    version: "1.11.2",
    defaultElement: "<ul>",
    delay: 300,
    options: {
        icons: {
            submenu: "ui-icon-carat-1-e"
        },
        items: "> *",
        menus: "ul",
        position: {
            my: "left-1 top",
            at: "right top"
        },
        role: "menu",

        // callbacks
        blur: null,
        focus: null,
        select: null
    },

    _create: function() {
        this.activeMenu = this.element;

        // Flag used to prevent firing of the click handler
        // as the event bubbles up through nested menus
        this.mouseHandled = false;
        this.element
            .uniqueId()
            .addClass( "ui-menu ui-widget ui-widget-content" )
            .toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length )
            .attr({
                role: this.options.role,
                tabIndex: 0
            });

        if ( this.options.disabled ) {
            this.element
                .addClass( "ui-state-disabled" )
                .attr( "aria-disabled", "true" );
        }

        this._on({
            // Prevent focus from sticking to links inside menu after clicking
            // them (focus should always stay on UL during navigation).
            "mousedown .ui-menu-item": function( event ) {
                event.preventDefault();
            },
            "click .ui-menu-item": function( event ) {
                var target = $( event.target );
                if ( !this.mouseHandled && target.not( ".ui-state-disabled" ).length ) {
                    this.select( event );

                    // Only set the mouseHandled flag if the event will bubble, see #9469.
                    if ( !event.isPropagationStopped() ) {
                        this.mouseHandled = true;
                    }

                    // Open submenu on click
                    if ( target.has( ".ui-menu" ).length ) {
                        this.expand( event );
                    } else if ( !this.element.is( ":focus" ) && $( this.document[ 0 ].activeElement ).closest( ".ui-menu" ).length ) {

                        // Redirect focus to the menu
                        this.element.trigger( "focus", [ true ] );

                        // If the active item is on the top level, let it stay active.
                        // Otherwise, blur the active item since it is no longer visible.
                        if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
                            clearTimeout( this.timer );
                        }
                    }
                }
            },
            "mouseenter .ui-menu-item": function( event ) {
                // Ignore mouse events while typeahead is active, see #10458.
                // Prevents focusing the wrong item when typeahead causes a scroll while the mouse
                // is over an item in the menu
                if ( this.previousFilter ) {
                    return;
                }
                var target = $( event.currentTarget );
                // Remove ui-state-active class from siblings of the newly focused menu item
                // to avoid a jump caused by adjacent elements both having a class with a border
                target.siblings( ".ui-state-active" ).removeClass( "ui-state-active" );
                this.focus( event, target );
            },
            mouseleave: "collapseAll",
            "mouseleave .ui-menu": "collapseAll",
            focus: function( event, keepActiveItem ) {
                // If there's already an active item, keep it active
                // If not, activate the first item
                var item = this.active || this.element.find( this.options.items ).eq( 0 );

                if ( !keepActiveItem ) {
                    this.focus( event, item );
                }
            },
            blur: function( event ) {
                this._delay(function() {
                    if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
                        this.collapseAll( event );
                    }
                });
            },
            keydown: "_keydown"
        });

        this.refresh();

        // Clicks outside of a menu collapse any open menus
        this._on( this.document, {
            click: function( event ) {
                if ( this._closeOnDocumentClick( event ) ) {
                    this.collapseAll( event );
                }

                // Reset the mouseHandled flag
                this.mouseHandled = false;
            }
        });
    },

    _destroy: function() {
        // Destroy (sub)menus
        this.element
            .removeAttr( "aria-activedescendant" )
            .find( ".ui-menu" ).addBack()
                .removeClass( "ui-menu ui-widget ui-widget-content ui-menu-icons ui-front" )
                .removeAttr( "role" )
                .removeAttr( "tabIndex" )
                .removeAttr( "aria-labelledby" )
                .removeAttr( "aria-expanded" )
                .removeAttr( "aria-hidden" )
                .removeAttr( "aria-disabled" )
                .removeUniqueId()
                .show();

        // Destroy menu items
        this.element.find( ".ui-menu-item" )
            .removeClass( "ui-menu-item" )
            .removeAttr( "role" )
            .removeAttr( "aria-disabled" )
            .removeUniqueId()
            .removeClass( "ui-state-hover" )
            .removeAttr( "tabIndex" )
            .removeAttr( "role" )
            .removeAttr( "aria-haspopup" )
            .children().each( function() {
                var elem = $( this );
                if ( elem.data( "ui-menu-submenu-carat" ) ) {
                    elem.remove();
                }
            });

        // Destroy menu dividers
        this.element.find( ".ui-menu-divider" ).removeClass( "ui-menu-divider ui-widget-content" );
    },

    _keydown: function( event ) {
        var match, prev, character, skip,
            preventDefault = true;

        switch ( event.keyCode ) {
        case $.ui.keyCode.PAGE_UP:
            this.previousPage( event );
            break;
        case $.ui.keyCode.PAGE_DOWN:
            this.nextPage( event );
            break;
        case $.ui.keyCode.HOME:
            this._move( "first", "first", event );
            break;
        case $.ui.keyCode.END:
            this._move( "last", "last", event );
            break;
        case $.ui.keyCode.UP:
            this.previous( event );
            break;
        case $.ui.keyCode.DOWN:
            this.next( event );
            break;
        case $.ui.keyCode.LEFT:
            this.collapse( event );
            break;
        case $.ui.keyCode.RIGHT:
            if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
                this.expand( event );
            }
            break;
        case $.ui.keyCode.ENTER:
        case $.ui.keyCode.SPACE:
            this._activate( event );
            break;
        case $.ui.keyCode.ESCAPE:
            this.collapse( event );
            break;
        default:
            preventDefault = false;
            prev = this.previousFilter || "";
            character = String.fromCharCode( event.keyCode );
            skip = false;

            clearTimeout( this.filterTimer );

            if ( character === prev ) {
                skip = true;
            } else {
                character = prev + character;
            }

            match = this._filterMenuItems( character );
            match = skip && match.index( this.active.next() ) !== -1 ?
                this.active.nextAll( ".ui-menu-item" ) :
                match;

            // If no matches on the current filter, reset to the last character pressed
            // to move down the menu to the first item that starts with that character
            if ( !match.length ) {
                character = String.fromCharCode( event.keyCode );
                match = this._filterMenuItems( character );
            }

            if ( match.length ) {
                this.focus( event, match );
                this.previousFilter = character;
                this.filterTimer = this._delay(function() {
                    delete this.previousFilter;
                }, 1000 );
            } else {
                delete this.previousFilter;
            }
        }

        if ( preventDefault ) {
            event.preventDefault();
        }
    },

    _activate: function( event ) {
        if ( !this.active.is( ".ui-state-disabled" ) ) {
            if ( this.active.is( "[aria-haspopup='true']" ) ) {
                this.expand( event );
            } else {
                this.select( event );
            }
        }
    },

    refresh: function() {
        var menus, items,
            that = this,
            icon = this.options.icons.submenu,
            submenus = this.element.find( this.options.menus );

        this.element.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length );

        // Initialize nested menus
        submenus.filter( ":not(.ui-menu)" )
            .addClass( "ui-menu ui-widget ui-widget-content ui-front" )
            .hide()
            .attr({
                role: this.options.role,
                "aria-hidden": "true",
                "aria-expanded": "false"
            })
            .each(function() {
                var menu = $( this ),
                    item = menu.parent(),
                    submenuCarat = $( "<span>" )
                        .addClass( "ui-menu-icon ui-icon " + icon )
                        .data( "ui-menu-submenu-carat", true );

                item
                    .attr( "aria-haspopup", "true" )
                    .prepend( submenuCarat );
                menu.attr( "aria-labelledby", item.attr( "id" ) );
            });

        menus = submenus.add( this.element );
        items = menus.find( this.options.items );

        // Initialize menu-items containing spaces and/or dashes only as dividers
        items.not( ".ui-menu-item" ).each(function() {
            var item = $( this );
            if ( that._isDivider( item ) ) {
                item.addClass( "ui-widget-content ui-menu-divider" );
            }
        });

        // Don't refresh list items that are already adapted
        items.not( ".ui-menu-item, .ui-menu-divider" )
            .addClass( "ui-menu-item" )
            .uniqueId()
            .attr({
                tabIndex: -1,
                role: this._itemRole()
            });

        // Add aria-disabled attribute to any disabled menu item
        items.filter( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

        // If the active item has been removed, blur the menu
        if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
            this.blur();
        }
    },

    _itemRole: function() {
        return {
            menu: "menuitem",
            listbox: "option"
        }[ this.options.role ];
    },

    _setOption: function( key, value ) {
        if ( key === "icons" ) {
            this.element.find( ".ui-menu-icon" )
                .removeClass( this.options.icons.submenu )
                .addClass( value.submenu );
        }
        if ( key === "disabled" ) {
            this.element
                .toggleClass( "ui-state-disabled", !!value )
                .attr( "aria-disabled", value );
        }
        this._super( key, value );
    },

    focus: function( event, item ) {
        var nested, focused;
        this.blur( event, event && event.type === "focus" );

        this._scrollIntoView( item );

        this.active = item.first();
        focused = this.active.addClass( "ui-state-focus" ).removeClass( "ui-state-active" );
        // Only update aria-activedescendant if there's a role
        // otherwise we assume focus is managed elsewhere
        if ( this.options.role ) {
            this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
        }

        // Highlight active parent menu item, if any
        this.active
            .parent()
            .closest( ".ui-menu-item" )
            .addClass( "ui-state-active" );

        if ( event && event.type === "keydown" ) {
            this._close();
        } else {
            this.timer = this._delay(function() {
                this._close();
            }, this.delay );
        }

        nested = item.children( ".ui-menu" );
        if ( nested.length && event && ( /^mouse/.test( event.type ) ) ) {
            this._startOpening(nested);
        }
        this.activeMenu = item.parent();

        this._trigger( "focus", event, { item: item } );
    },

    _scrollIntoView: function( item ) {
        var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
        if ( this._hasScroll() ) {
            borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
            paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
            offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
            scroll = this.activeMenu.scrollTop();
            elementHeight = this.activeMenu.height();
            itemHeight = item.outerHeight();

            if ( offset < 0 ) {
                this.activeMenu.scrollTop( scroll + offset );
            } else if ( offset + itemHeight > elementHeight ) {
                this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
            }
        }
    },

    blur: function( event, fromFocus ) {
        if ( !fromFocus ) {
            clearTimeout( this.timer );
        }

        if ( !this.active ) {
            return;
        }

        this.active.removeClass( "ui-state-focus" );
        this.active = null;

        this._trigger( "blur", event, { item: this.active } );
    },

    _startOpening: function( submenu ) {
        clearTimeout( this.timer );

        // Don't open if already open fixes a Firefox bug that caused a .5 pixel
        // shift in the submenu position when mousing over the carat icon
        if ( submenu.attr( "aria-hidden" ) !== "true" ) {
            return;
        }

        this.timer = this._delay(function() {
            this._close();
            this._open( submenu );
        }, this.delay );
    },

    _open: function( submenu ) {
        var position = $.extend({
            of: this.active
        }, this.options.position );

        clearTimeout( this.timer );
        this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
            .hide()
            .attr( "aria-hidden", "true" );

        submenu
            .show()
            .removeAttr( "aria-hidden" )
            .attr( "aria-expanded", "true" )
            .position( position );
    },

    collapseAll: function( event, all ) {
        clearTimeout( this.timer );
        this.timer = this._delay(function() {
            // If we were passed an event, look for the submenu that contains the event
            var currentMenu = all ? this.element :
                $( event && event.target ).closest( this.element.find( ".ui-menu" ) );

            // If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
            if ( !currentMenu.length ) {
                currentMenu = this.element;
            }

            this._close( currentMenu );

            this.blur( event );
            this.activeMenu = currentMenu;
        }, this.delay );
    },

    // With no arguments, closes the currently active menu - if nothing is active
    // it closes all menus.  If passed an argument, it will search for menus BELOW
    _close: function( startMenu ) {
        if ( !startMenu ) {
            startMenu = this.active ? this.active.parent() : this.element;
        }

        startMenu
            .find( ".ui-menu" )
                .hide()
                .attr( "aria-hidden", "true" )
                .attr( "aria-expanded", "false" )
            .end()
            .find( ".ui-state-active" ).not( ".ui-state-focus" )
                .removeClass( "ui-state-active" );
    },

    _closeOnDocumentClick: function( event ) {
        return !$( event.target ).closest( ".ui-menu" ).length;
    },

    _isDivider: function( item ) {

        // Match hyphen, em dash, en dash
        return !/[^\-\u2014\u2013\s]/.test( item.text() );
    },

    collapse: function( event ) {
        var newItem = this.active &&
            this.active.parent().closest( ".ui-menu-item", this.element );
        if ( newItem && newItem.length ) {
            this._close();
            this.focus( event, newItem );
        }
    },

    expand: function( event ) {
        var newItem = this.active &&
            this.active
                .children( ".ui-menu " )
                .find( this.options.items )
                .first();

        if ( newItem && newItem.length ) {
            this._open( newItem.parent() );

            // Delay so Firefox will not hide activedescendant change in expanding submenu from AT
            this._delay(function() {
                this.focus( event, newItem );
            });
        }
    },

    next: function( event ) {
        this._move( "next", "first", event );
    },

    previous: function( event ) {
        this._move( "prev", "last", event );
    },

    isFirstItem: function() {
        return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
    },

    isLastItem: function() {
        return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
    },

    _move: function( direction, filter, event ) {
        var next;
        if ( this.active ) {
            if ( direction === "first" || direction === "last" ) {
                next = this.active
                    [ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
                    .eq( -1 );
            } else {
                next = this.active
                    [ direction + "All" ]( ".ui-menu-item" )
                    .eq( 0 );
            }
        }
        if ( !next || !next.length || !this.active ) {
            next = this.activeMenu.find( this.options.items )[ filter ]();
        }

        this.focus( event, next );
    },

    nextPage: function( event ) {
        var item, base, height;

        if ( !this.active ) {
            this.next( event );
            return;
        }
        if ( this.isLastItem() ) {
            return;
        }
        if ( this._hasScroll() ) {
            base = this.active.offset().top;
            height = this.element.height();
            this.active.nextAll( ".ui-menu-item" ).each(function() {
                item = $( this );
                return item.offset().top - base - height < 0;
            });

            this.focus( event, item );
        } else {
            this.focus( event, this.activeMenu.find( this.options.items )
                [ !this.active ? "first" : "last" ]() );
        }
    },

    previousPage: function( event ) {
        var item, base, height;
        if ( !this.active ) {
            this.next( event );
            return;
        }
        if ( this.isFirstItem() ) {
            return;
        }
        if ( this._hasScroll() ) {
            base = this.active.offset().top;
            height = this.element.height();
            this.active.prevAll( ".ui-menu-item" ).each(function() {
                item = $( this );
                return item.offset().top - base + height > 0;
            });

            this.focus( event, item );
        } else {
            this.focus( event, this.activeMenu.find( this.options.items ).first() );
        }
    },

    _hasScroll: function() {
        return this.element.outerHeight() < this.element.prop( "scrollHeight" );
    },

    select: function( event ) {
        // TODO: It should never be possible to not have an active item at this
        // point, but the tests don't trigger mouseenter before click.
        this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
        var ui = { item: this.active };
        if ( !this.active.has( ".ui-menu" ).length ) {
            this.collapseAll( event, true );
        }
        this._trigger( "select", event, ui );
    },

    _filterMenuItems: function(character) {
        var escapedCharacter = character.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),
            regex = new RegExp( "^" + escapedCharacter, "i" );

        return this.activeMenu
            .find( this.options.items )

            // Only match on items, not dividers or other content (#10571)
            .filter( ".ui-menu-item" )
            .filter(function() {
                return regex.test( $.trim( $( this ).text() ) );
            });
    }
});


/*!
 * jQuery UI Autocomplete 1.11.2
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/autocomplete/
 */


$.widget( "ui.autocomplete", {
    version: "1.11.2",
    defaultElement: "<input>",
    options: {
        appendTo: null,
        autoFocus: false,
        delay: 300,
        minLength: 1,
        position: {
            my: "left top",
            at: "left bottom",
            collision: "none"
        },
        source: null,

        // callbacks
        change: null,
        close: null,
        focus: null,
        open: null,
        response: null,
        search: null,
        select: null
    },

    requestIndex: 0,
    pending: 0,

    _create: function() {
        // Some browsers only repeat keydown events, not keypress events,
        // so we use the suppressKeyPress flag to determine if we've already
        // handled the keydown event. #7269
        // Unfortunately the code for & in keypress is the same as the up arrow,
        // so we use the suppressKeyPressRepeat flag to avoid handling keypress
        // events when we know the keydown event was used to modify the
        // search term. #7799
        var suppressKeyPress, suppressKeyPressRepeat, suppressInput,
            nodeName = this.element[ 0 ].nodeName.toLowerCase(),
            isTextarea = nodeName === "textarea",
            isInput = nodeName === "input";

        this.isMultiLine =
            // Textareas are always multi-line
            isTextarea ? true :
            // Inputs are always single-line, even if inside a contentEditable element
            // IE also treats inputs as contentEditable
            isInput ? false :
            // All other element types are determined by whether or not they're contentEditable
            this.element.prop( "isContentEditable" );

        this.valueMethod = this.element[ isTextarea || isInput ? "val" : "text" ];
        this.isNewMenu = true;

        this.element
            .addClass( "ui-autocomplete-input" )
            .attr( "autocomplete", "off" );

        this._on( this.element, {
            keydown: function( event ) {
                if ( this.element.prop( "readOnly" ) ) {
                    suppressKeyPress = true;
                    suppressInput = true;
                    suppressKeyPressRepeat = true;
                    return;
                }

                suppressKeyPress = false;
                suppressInput = false;
                suppressKeyPressRepeat = false;
                var keyCode = $.ui.keyCode;
                switch ( event.keyCode ) {
                case keyCode.PAGE_UP:
                    suppressKeyPress = true;
                    this._move( "previousPage", event );
                    break;
                case keyCode.PAGE_DOWN:
                    suppressKeyPress = true;
                    this._move( "nextPage", event );
                    break;
                case keyCode.UP:
                    suppressKeyPress = true;
                    this._keyEvent( "previous", event );
                    break;
                case keyCode.DOWN:
                    suppressKeyPress = true;
                    this._keyEvent( "next", event );
                    break;
                case keyCode.ENTER:
                    // when menu is open and has focus
                    if ( this.menu.active ) {
                        // #6055 - Opera still allows the keypress to occur
                        // which causes forms to submit
                        suppressKeyPress = true;
                        event.preventDefault();
                        this.menu.select( event );
                    }
                    break;
                case keyCode.TAB:
                    if ( this.menu.active ) {
                        this.menu.select( event );
                    }
                    break;
                case keyCode.ESCAPE:
                    if ( this.menu.element.is( ":visible" ) ) {
                        if ( !this.isMultiLine ) {
                            this._value( this.term );
                        }
                        this.close( event );
                        // Different browsers have different default behavior for escape
                        // Single press can mean undo or clear
                        // Double press in IE means clear the whole form
                        event.preventDefault();
                    }
                    break;
                default:
                    suppressKeyPressRepeat = true;
                    // search timeout should be triggered before the input value is changed
                    this._searchTimeout( event );
                    break;
                }
            },
            keypress: function( event ) {
                if ( suppressKeyPress ) {
                    suppressKeyPress = false;
                    if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
                        event.preventDefault();
                    }
                    return;
                }
                if ( suppressKeyPressRepeat ) {
                    return;
                }

                // replicate some key handlers to allow them to repeat in Firefox and Opera
                var keyCode = $.ui.keyCode;
                switch ( event.keyCode ) {
                case keyCode.PAGE_UP:
                    this._move( "previousPage", event );
                    break;
                case keyCode.PAGE_DOWN:
                    this._move( "nextPage", event );
                    break;
                case keyCode.UP:
                    this._keyEvent( "previous", event );
                    break;
                case keyCode.DOWN:
                    this._keyEvent( "next", event );
                    break;
                }
            },
            input: function( event ) {
                if ( suppressInput ) {
                    suppressInput = false;
                    event.preventDefault();
                    return;
                }
                this._searchTimeout( event );
            },
            focus: function() {
                this.selectedItem = null;
                this.previous = this._value();
            },
            blur: function( event ) {
                if ( this.cancelBlur ) {
                    delete this.cancelBlur;
                    return;
                }

                clearTimeout( this.searching );
                this.close( event );
                this._change( event );
            }
        });

        this._initSource();
        this.menu = $( "<ul>" )
            .addClass( "ui-autocomplete ui-front" )
            .appendTo( this._appendTo() )
            .menu({
                // disable ARIA support, the live region takes care of that
                role: null
            })
            .hide()
            .menu( "instance" );

        this._on( this.menu.element, {
            mousedown: function( event ) {
                // prevent moving focus out of the text field
                event.preventDefault();

                // IE doesn't prevent moving focus even with event.preventDefault()
                // so we set a flag to know when we should ignore the blur event
                this.cancelBlur = true;
                this._delay(function() {
                    delete this.cancelBlur;
                });

                // clicking on the scrollbar causes focus to shift to the body
                // but we can't detect a mouseup or a click immediately afterward
                // so we have to track the next mousedown and close the menu if
                // the user clicks somewhere outside of the autocomplete
                var menuElement = this.menu.element[ 0 ];
                if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
                    this._delay(function() {
                        var that = this;
                        this.document.one( "mousedown", function( event ) {
                            if ( event.target !== that.element[ 0 ] &&
                                    event.target !== menuElement &&
                                    !$.contains( menuElement, event.target ) ) {
                                that.close();
                            }
                        });
                    });
                }
            },
            menufocus: function( event, ui ) {
                var label, item;
                // support: Firefox
                // Prevent accidental activation of menu items in Firefox (#7024 #9118)
                if ( this.isNewMenu ) {
                    this.isNewMenu = false;
                    if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
                        this.menu.blur();

                        this.document.one( "mousemove", function() {
                            $( event.target ).trigger( event.originalEvent );
                        });

                        return;
                    }
                }

                item = ui.item.data( "ui-autocomplete-item" );
                if ( false !== this._trigger( "focus", event, { item: item } ) ) {
                    // use value to match what will end up in the input, if it was a key event
                    if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
                        this._value( item.value );
                    }
                }

                // Announce the value in the liveRegion
                label = ui.item.attr( "aria-label" ) || item.value;
                if ( label && $.trim( label ).length ) {
                    this.liveRegion.children().hide();
                    $( "<div>" ).text( label ).appendTo( this.liveRegion );
                }
            },
            menuselect: function( event, ui ) {
                var item = ui.item.data( "ui-autocomplete-item" ),
                    previous = this.previous;

                // only trigger when focus was lost (click on menu)
                if ( this.element[ 0 ] !== this.document[ 0 ].activeElement ) {
                    this.element.focus();
                    this.previous = previous;
                    // #6109 - IE triggers two focus events and the second
                    // is asynchronous, so we need to reset the previous
                    // term synchronously and asynchronously :-(
                    this._delay(function() {
                        this.previous = previous;
                        this.selectedItem = item;
                    });
                }

                if ( false !== this._trigger( "select", event, { item: item } ) ) {
                    this._value( item.value );
                }
                // reset the term after the select event
                // this allows custom select handling to work properly
                this.term = this._value();

                this.close( event );
                this.selectedItem = item;
            }
        });

        this.liveRegion = $( "<span>", {
                role: "status",
                "aria-live": "assertive",
                "aria-relevant": "additions"
            })
            .addClass( "ui-helper-hidden-accessible" )
            .appendTo( this.document[ 0 ].body );

        // turning off autocomplete prevents the browser from remembering the
        // value when navigating through history, so we re-enable autocomplete
        // if the page is unloaded before the widget is destroyed. #7790
        this._on( this.window, {
            beforeunload: function() {
                this.element.removeAttr( "autocomplete" );
            }
        });
    },

    _destroy: function() {
        clearTimeout( this.searching );
        this.element
            .removeClass( "ui-autocomplete-input" )
            .removeAttr( "autocomplete" );
        this.menu.element.remove();
        this.liveRegion.remove();
    },

    _setOption: function( key, value ) {
        this._super( key, value );
        if ( key === "source" ) {
            this._initSource();
        }
        if ( key === "appendTo" ) {
            this.menu.element.appendTo( this._appendTo() );
        }
        if ( key === "disabled" && value && this.xhr ) {
            this.xhr.abort();
        }
    },

    _appendTo: function() {
        var element = this.options.appendTo;

        if ( element ) {
            element = element.jquery || element.nodeType ?
                $( element ) :
                this.document.find( element ).eq( 0 );
        }

        if ( !element || !element[ 0 ] ) {
            element = this.element.closest( ".ui-front" );
        }

        if ( !element.length ) {
            element = this.document[ 0 ].body;
        }

        return element;
    },

    _initSource: function() {
        var array, url,
            that = this;
        if ( $.isArray( this.options.source ) ) {
            array = this.options.source;
            this.source = function( request, response ) {
                response( $.ui.autocomplete.filter( array, request.term ) );
            };
        } else if ( typeof this.options.source === "string" ) {
            url = this.options.source;
            this.source = function( request, response ) {
                if ( that.xhr ) {
                    that.xhr.abort();
                }
                that.xhr = $.ajax({
                    url: url,
                    data: request,
                    dataType: "json",
                    success: function( data ) {
                        response( data );
                    },
                    error: function() {
                        response([]);
                    }
                });
            };
        } else {
            this.source = this.options.source;
        }
    },

    _searchTimeout: function( event ) {
        clearTimeout( this.searching );
        this.searching = this._delay(function() {

            // Search if the value has changed, or if the user retypes the same value (see #7434)
            var equalValues = this.term === this._value(),
                menuVisible = this.menu.element.is( ":visible" ),
                modifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

            if ( !equalValues || ( equalValues && !menuVisible && !modifierKey ) ) {
                this.selectedItem = null;
                this.search( null, event );
            }
        }, this.options.delay );
    },

    search: function( value, event ) {
        value = value != null ? value : this._value();

        // always save the actual value, not the one passed as an argument
        this.term = this._value();

        if ( value.length < this.options.minLength ) {
            return this.close( event );
        }

        if ( this._trigger( "search", event ) === false ) {
            return;
        }

        return this._search( value );
    },

    _search: function( value ) {
        this.pending++;
        this.element.addClass( "ui-autocomplete-loading" );
        this.cancelSearch = false;

        this.source( { term: value }, this._response() );
    },

    _response: function() {
        var index = ++this.requestIndex;

        return $.proxy(function( content ) {
            if ( index === this.requestIndex ) {
                this.__response( content );
            }

            this.pending--;
            if ( !this.pending ) {
                this.element.removeClass( "ui-autocomplete-loading" );
            }
        }, this );
    },

    __response: function( content ) {
        if ( content ) {
            content = this._normalize( content );
        }
        this._trigger( "response", null, { content: content } );
        if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
            this._suggest( content );
            this._trigger( "open" );
        } else {
            // use ._close() instead of .close() so we don't cancel future searches
            this._close();
        }
    },

    close: function( event ) {
        this.cancelSearch = true;
        this._close( event );
    },

    _close: function( event ) {
        if ( this.menu.element.is( ":visible" ) ) {
            this.menu.element.hide();
            this.menu.blur();
            this.isNewMenu = true;
            this._trigger( "close", event );
        }
    },

    _change: function( event ) {
        if ( this.previous !== this._value() ) {
            this._trigger( "change", event, { item: this.selectedItem } );
        }
    },

    _normalize: function( items ) {
        // assume all items have the right format when the first item is complete
        if ( items.length && items[ 0 ].label && items[ 0 ].value ) {
            return items;
        }
        return $.map( items, function( item ) {
            if ( typeof item === "string" ) {
                return {
                    label: item,
                    value: item
                };
            }
            return $.extend( {}, item, {
                label: item.label || item.value,
                value: item.value || item.label
            });
        });
    },

    _suggest: function( items ) {
        var ul = this.menu.element.empty();
        this._renderMenu( ul, items );
        this.isNewMenu = true;
        this.menu.refresh();

        // size and position menu
        ul.show();
        this._resizeMenu();
        ul.position( $.extend({
            of: this.element
        }, this.options.position ) );

        if ( this.options.autoFocus ) {
            this.menu.next();
        }
    },

    _resizeMenu: function() {
        var ul = this.menu.element;
        ul.outerWidth( Math.max(
            // Firefox wraps long text (possibly a rounding bug)
            // so we add 1px to avoid the wrapping (#7513)
            ul.width( "" ).outerWidth() + 1,
            this.element.outerWidth()
        ) );
    },

    _renderMenu: function( ul, items ) {
        var that = this;
        $.each( items, function( index, item ) {
            that._renderItemData( ul, item );
        });
    },

    _renderItemData: function( ul, item ) {
        return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
    },

    _renderItem: function( ul, item ) {
        return $( "<li>" ).text( item.label ).appendTo( ul );
    },

    _move: function( direction, event ) {
        if ( !this.menu.element.is( ":visible" ) ) {
            this.search( null, event );
            return;
        }
        if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
                this.menu.isLastItem() && /^next/.test( direction ) ) {

            if ( !this.isMultiLine ) {
                this._value( this.term );
            }

            this.menu.blur();
            return;
        }
        this.menu[ direction ]( event );
    },

    widget: function() {
        return this.menu.element;
    },

    _value: function() {
        return this.valueMethod.apply( this.element, arguments );
    },

    _keyEvent: function( keyEvent, event ) {
        if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
            this._move( keyEvent, event );

            // prevents moving cursor to beginning/end of the text field in some browsers
            event.preventDefault();
        }
    }
});

$.extend( $.ui.autocomplete, {
    escapeRegex: function( value ) {
        return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
    },
    filter: function( array, term ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex( term ), "i" );
        return $.grep( array, function( value ) {
            return matcher.test( value.label || value.value || value );
        });
    }
});

// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
    options: {
        messages: {
            noResults: "No search results.",
            results: function( amount ) {
                return amount + ( amount > 1 ? " results are" : " result is" ) +
                    " available, use up and down arrow keys to navigate.";
            }
        }
    },

    __response: function( content ) {
        var message;
        this._superApply( arguments );
        if ( this.options.disabled || this.cancelSearch ) {
            return;
        }
        if ( content && content.length ) {
            message = this.options.messages.results( content.length );
        } else {
            message = this.options.messages.noResults;
        }
        this.liveRegion.children().hide();
        $( "<div>" ).text( message ).appendTo( this.liveRegion );
    }
});

var autocomplete = $.ui.autocomplete;


/*!
 * jQuery UI Datepicker 1.11.2
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/datepicker/
 */


$.extend($.ui, { datepicker: { version: "1.11.2" } });

var datepicker_instActive;

function datepicker_getZindex( elem ) {
    var position, value;
    while ( elem.length && elem[ 0 ] !== document ) {
        // Ignore z-index if position is set to a value where z-index is ignored by the browser
        // This makes behavior of this function consistent across browsers
        // WebKit always returns auto if the element is positioned
        position = elem.css( "position" );
        if ( position === "absolute" || position === "relative" || position === "fixed" ) {
            // IE returns 0 when zIndex is not specified
            // other browsers return a string
            // we ignore the case of nested elements with an explicit value of 0
            // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
            value = parseInt( elem.css( "zIndex" ), 10 );
            if ( !isNaN( value ) && value !== 0 ) {
                return value;
            }
        }
        elem = elem.parent();
    }

    return 0;
}
/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
    this._curInst = null; // The current instance in use
    this._keyEvent = false; // If the last event was a key event
    this._disabledInputs = []; // List of date picker inputs that have been disabled
    this._datepickerShowing = false; // True if the popup picker is showing , false if not
    this._inDialog = false; // True if showing within a "dialog", false if not
    this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
    this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
    this._appendClass = "ui-datepicker-append"; // The name of the append marker class
    this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
    this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
    this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
    this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
    this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
    this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
    this.regional = []; // Available regional settings, indexed by language code
    this.regional[""] = { // Default regional settings
        closeText: "Done", // Display text for close link
        prevText: "Prev", // Display text for previous month link
        nextText: "Next", // Display text for next month link
        currentText: "Today", // Display text for current month link
        monthNames: ["January","February","March","April","May","June",
            "July","August","September","October","November","December"], // Names of months for drop-down and formatting
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
        dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"], // Column headings for days starting at Sunday
        weekHeader: "Wk", // Column header for week of the year
        dateFormat: "mm/dd/yy", // See format options on parseDate
        firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
        isRTL: false, // True if right-to-left language, false if left-to-right
        showMonthAfterYear: false, // True if the year select precedes month, false for month then year
        yearSuffix: "" // Additional text to append to the year in the month headers
    };
    this._defaults = { // Global defaults for all the date picker instances
        showOn: "focus", // "focus" for popup on focus,
            // "button" for trigger button, or "both" for either
        showAnim: "fadeIn", // Name of jQuery animation for popup
        showOptions: {}, // Options for enhanced animations
        defaultDate: null, // Used when field is blank: actual date,
            // +/-number for offset from today, null for today
        appendText: "", // Display text following the input box, e.g. showing the format
        buttonText: "...", // Text for trigger button
        buttonImage: "", // URL for trigger button image
        buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
        hideIfNoPrevNext: false, // True to hide next/previous month links
            // if not applicable, false to just disable them
        navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
        gotoCurrent: false, // True if today link goes back to current selection instead
        changeMonth: false, // True if month can be selected directly, false if only prev/next
        changeYear: false, // True if year can be selected directly, false if only prev/next
        yearRange: "c-10:c+10", // Range of years to display in drop-down,
            // either relative to today's year (-nn:+nn), relative to currently displayed year
            // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
        showOtherMonths: false, // True to show dates in other months, false to leave blank
        selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
        showWeek: false, // True to show week of the year, false to not show it
        calculateWeek: this.iso8601Week, // How to calculate the week of the year,
            // takes a Date and returns the number of the week for it
        shortYearCutoff: "+10", // Short year values < this are in the current century,
            // > this are in the previous century,
            // string value starting with "+" for current year + value
        minDate: null, // The earliest selectable date, or null for no limit
        maxDate: null, // The latest selectable date, or null for no limit
        duration: "fast", // Duration of display/closure
        beforeShowDay: null, // Function that takes a date and returns an array with
            // [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
            // [2] = cell title (optional), e.g. $.datepicker.noWeekends
        beforeShow: null, // Function that takes an input field and
            // returns a set of custom settings for the date picker
        onSelect: null, // Define a callback function when a date is selected
        onChangeMonthYear: null, // Define a callback function when the month or year is changed
        onClose: null, // Define a callback function when the datepicker is closed
        numberOfMonths: 1, // Number of months to show at a time
        showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
        stepMonths: 1, // Number of months to step back/forward
        stepBigMonths: 12, // Number of months to step back/forward for the big links
        altField: "", // Selector for an alternate field to store selected dates into
        altFormat: "", // The date format to use for the alternate field
        constrainInput: true, // The input is constrained by the current date format
        showButtonPanel: false, // True to show button panel, false to not show it
        autoSize: false, // True to size the input for the date format, false to leave as is
        disabled: false // The initial disabled state
    };
    $.extend(this._defaults, this.regional[""]);
    this.regional.en = $.extend( true, {}, this.regional[ "" ]);
    this.regional[ "en-US" ] = $.extend( true, {}, this.regional.en );
    this.dpDiv = datepicker_bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
}

$.extend(Datepicker.prototype, {
    /* Class name added to elements to indicate already configured with a date picker. */
    markerClassName: "hasDatepicker",

    //Keep track of the maximum number of rows displayed (see #7043)
    maxRows: 4,

    // TODO rename to "widget" when switching to widget factory
    _widgetDatepicker: function() {
        return this.dpDiv;
    },

    /* Override the default settings for all instances of the date picker.
     * @param  settings  object - the new settings to use as defaults (anonymous object)
     * @return the manager object
     */
    setDefaults: function(settings) {
        datepicker_extendRemove(this._defaults, settings || {});
        return this;
    },

    /* Attach the date picker to a jQuery selection.
     * @param  target   element - the target input field or division or span
     * @param  settings  object - the new settings to use for this date picker instance (anonymous)
     */
    _attachDatepicker: function(target, settings) {
        var nodeName, inline, inst;
        nodeName = target.nodeName.toLowerCase();
        inline = (nodeName === "div" || nodeName === "span");
        if (!target.id) {
            this.uuid += 1;
            target.id = "dp" + this.uuid;
        }
        inst = this._newInst($(target), inline);
        inst.settings = $.extend({}, settings || {});
        if (nodeName === "input") {
            this._connectDatepicker(target, inst);
        } else if (inline) {
            this._inlineDatepicker(target, inst);
        }
    },

    /* Create a new instance object. */
    _newInst: function(target, inline) {
        var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
        return {id: id, input: target, // associated target
            selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
            drawMonth: 0, drawYear: 0, // month being drawn
            inline: inline, // is datepicker inline or not
            dpDiv: (!inline ? this.dpDiv : // presentation div
            datepicker_bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))};
    },

    /* Attach the date picker to an input field. */
    _connectDatepicker: function(target, inst) {
        var input = $(target);
        inst.append = $([]);
        inst.trigger = $([]);
        if (input.hasClass(this.markerClassName)) {
            return;
        }
        this._attachments(input, inst);
        input.addClass(this.markerClassName).keydown(this._doKeyDown).
            keypress(this._doKeyPress).keyup(this._doKeyUp);
        this._autoSize(inst);
        $.data(target, "datepicker", inst);
        //If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
        if( inst.settings.disabled ) {
            this._disableDatepicker( target );
        }
    },

    /* Make attachments based on settings. */
    _attachments: function(input, inst) {
        var showOn, buttonText, buttonImage,
            appendText = this._get(inst, "appendText"),
            isRTL = this._get(inst, "isRTL");

        if (inst.append) {
            inst.append.remove();
        }
        if (appendText) {
            inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
            input[isRTL ? "before" : "after"](inst.append);
        }

        input.unbind("focus", this._showDatepicker);

        if (inst.trigger) {
            inst.trigger.remove();
        }

        showOn = this._get(inst, "showOn");
        if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
            input.focus(this._showDatepicker);
        }
        if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
            buttonText = this._get(inst, "buttonText");
            buttonImage = this._get(inst, "buttonImage");
            inst.trigger = $(this._get(inst, "buttonImageOnly") ?
                $("<img/>").addClass(this._triggerClass).
                    attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
                $("<button type='button'></button>").addClass(this._triggerClass).
                    html(!buttonImage ? buttonText : $("<img/>").attr(
                    { src:buttonImage, alt:buttonText, title:buttonText })));
            input[isRTL ? "before" : "after"](inst.trigger);
            inst.trigger.click(function() {
                if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
                    $.datepicker._hideDatepicker();
                } else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
                    $.datepicker._hideDatepicker();
                    $.datepicker._showDatepicker(input[0]);
                } else {
                    $.datepicker._showDatepicker(input[0]);
                }
                return false;
            });
        }
    },

    /* Apply the maximum length for the date format. */
    _autoSize: function(inst) {
        if (this._get(inst, "autoSize") && !inst.inline) {
            var findMax, max, maxI, i,
                date = new Date(2009, 12 - 1, 20), // Ensure double digits
                dateFormat = this._get(inst, "dateFormat");

            if (dateFormat.match(/[DM]/)) {
                findMax = function(names) {
                    max = 0;
                    maxI = 0;
                    for (i = 0; i < names.length; i++) {
                        if (names[i].length > max) {
                            max = names[i].length;
                            maxI = i;
                        }
                    }
                    return maxI;
                };
                date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
                    "monthNames" : "monthNamesShort"))));
                date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
                    "dayNames" : "dayNamesShort"))) + 20 - date.getDay());
            }
            inst.input.attr("size", this._formatDate(inst, date).length);
        }
    },

    /* Attach an inline date picker to a div. */
    _inlineDatepicker: function(target, inst) {
        var divSpan = $(target);
        if (divSpan.hasClass(this.markerClassName)) {
            return;
        }
        divSpan.addClass(this.markerClassName).append(inst.dpDiv);
        $.data(target, "datepicker", inst);
        this._setDate(inst, this._getDefaultDate(inst), true);
        this._updateDatepicker(inst);
        this._updateAlternate(inst);
        //If disabled option is true, disable the datepicker before showing it (see ticket #5665)
        if( inst.settings.disabled ) {
            this._disableDatepicker( target );
        }
        // Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
        // http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
        inst.dpDiv.css( "display", "block" );
    },

    /* Pop-up the date picker in a "dialog" box.
     * @param  input element - ignored
     * @param  date string or Date - the initial date to display
     * @param  onSelect  function - the function to call when a date is selected
     * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
     * @param  pos int[2] - coordinates for the dialog's position within the screen or
     *                  event - with x/y coordinates or
     *                  leave empty for default (screen centre)
     * @return the manager object
     */
    _dialogDatepicker: function(input, date, onSelect, settings, pos) {
        var id, browserWidth, browserHeight, scrollX, scrollY,
            inst = this._dialogInst; // internal instance

        if (!inst) {
            this.uuid += 1;
            id = "dp" + this.uuid;
            this._dialogInput = $("<input type='text' id='" + id +
                "' style='position: absolute; top: -100px; width: 0px;'/>");
            this._dialogInput.keydown(this._doKeyDown);
            $("body").append(this._dialogInput);
            inst = this._dialogInst = this._newInst(this._dialogInput, false);
            inst.settings = {};
            $.data(this._dialogInput[0], "datepicker", inst);
        }
        datepicker_extendRemove(inst.settings, settings || {});
        date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
        this._dialogInput.val(date);

        this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
        if (!this._pos) {
            browserWidth = document.documentElement.clientWidth;
            browserHeight = document.documentElement.clientHeight;
            scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            this._pos = // should use actual width/height below
                [(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
        }

        // move input on screen for focus, but hidden behind dialog
        this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
        inst.settings.onSelect = onSelect;
        this._inDialog = true;
        this.dpDiv.addClass(this._dialogClass);
        this._showDatepicker(this._dialogInput[0]);
        if ($.blockUI) {
            $.blockUI(this.dpDiv);
        }
        $.data(this._dialogInput[0], "datepicker", inst);
        return this;
    },

    /* Detach a datepicker from its control.
     * @param  target   element - the target input field or division or span
     */
    _destroyDatepicker: function(target) {
        var nodeName,
            $target = $(target),
            inst = $.data(target, "datepicker");

        if (!$target.hasClass(this.markerClassName)) {
            return;
        }

        nodeName = target.nodeName.toLowerCase();
        $.removeData(target, "datepicker");
        if (nodeName === "input") {
            inst.append.remove();
            inst.trigger.remove();
            $target.removeClass(this.markerClassName).
                unbind("focus", this._showDatepicker).
                unbind("keydown", this._doKeyDown).
                unbind("keypress", this._doKeyPress).
                unbind("keyup", this._doKeyUp);
        } else if (nodeName === "div" || nodeName === "span") {
            $target.removeClass(this.markerClassName).empty();
        }
    },

    /* Enable the date picker to a jQuery selection.
     * @param  target   element - the target input field or division or span
     */
    _enableDatepicker: function(target) {
        var nodeName, inline,
            $target = $(target),
            inst = $.data(target, "datepicker");

        if (!$target.hasClass(this.markerClassName)) {
            return;
        }

        nodeName = target.nodeName.toLowerCase();
        if (nodeName === "input") {
            target.disabled = false;
            inst.trigger.filter("button").
                each(function() { this.disabled = false; }).end().
                filter("img").css({opacity: "1.0", cursor: ""});
        } else if (nodeName === "div" || nodeName === "span") {
            inline = $target.children("." + this._inlineClass);
            inline.children().removeClass("ui-state-disabled");
            inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
                prop("disabled", false);
        }
        this._disabledInputs = $.map(this._disabledInputs,
            function(value) { return (value === target ? null : value); }); // delete entry
    },

    /* Disable the date picker to a jQuery selection.
     * @param  target   element - the target input field or division or span
     */
    _disableDatepicker: function(target) {
        var nodeName, inline,
            $target = $(target),
            inst = $.data(target, "datepicker");

        if (!$target.hasClass(this.markerClassName)) {
            return;
        }

        nodeName = target.nodeName.toLowerCase();
        if (nodeName === "input") {
            target.disabled = true;
            inst.trigger.filter("button").
                each(function() { this.disabled = true; }).end().
                filter("img").css({opacity: "0.5", cursor: "default"});
        } else if (nodeName === "div" || nodeName === "span") {
            inline = $target.children("." + this._inlineClass);
            inline.children().addClass("ui-state-disabled");
            inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
                prop("disabled", true);
        }
        this._disabledInputs = $.map(this._disabledInputs,
            function(value) { return (value === target ? null : value); }); // delete entry
        this._disabledInputs[this._disabledInputs.length] = target;
    },

    /* Is the first field in a jQuery collection disabled as a datepicker?
     * @param  target   element - the target input field or division or span
     * @return boolean - true if disabled, false if enabled
     */
    _isDisabledDatepicker: function(target) {
        if (!target) {
            return false;
        }
        for (var i = 0; i < this._disabledInputs.length; i++) {
            if (this._disabledInputs[i] === target) {
                return true;
            }
        }
        return false;
    },

    /* Retrieve the instance data for the target control.
     * @param  target  element - the target input field or division or span
     * @return  object - the associated instance data
     * @throws  error if a jQuery problem getting data
     */
    _getInst: function(target) {
        try {
            return $.data(target, "datepicker");
        }
        catch (err) {
            throw "Missing instance data for this datepicker";
        }
    },

    /* Update or retrieve the settings for a date picker attached to an input field or division.
     * @param  target  element - the target input field or division or span
     * @param  name object - the new settings to update or
     *              string - the name of the setting to change or retrieve,
     *              when retrieving also "all" for all instance settings or
     *              "defaults" for all global defaults
     * @param  value   any - the new value for the setting
     *              (omit if above is an object or to retrieve a value)
     */
    _optionDatepicker: function(target, name, value) {
        var settings, date, minDate, maxDate,
            inst = this._getInst(target);

        if (arguments.length === 2 && typeof name === "string") {
            return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
                (inst ? (name === "all" ? $.extend({}, inst.settings) :
                this._get(inst, name)) : null));
        }

        settings = name || {};
        if (typeof name === "string") {
            settings = {};
            settings[name] = value;
        }

        if (inst) {
            if (this._curInst === inst) {
                this._hideDatepicker();
            }

            date = this._getDateDatepicker(target, true);
            minDate = this._getMinMaxDate(inst, "min");
            maxDate = this._getMinMaxDate(inst, "max");
            datepicker_extendRemove(inst.settings, settings);
            // reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
            if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
                inst.settings.minDate = this._formatDate(inst, minDate);
            }
            if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
                inst.settings.maxDate = this._formatDate(inst, maxDate);
            }
            if ( "disabled" in settings ) {
                if ( settings.disabled ) {
                    this._disableDatepicker(target);
                } else {
                    this._enableDatepicker(target);
                }
            }
            this._attachments($(target), inst);
            this._autoSize(inst);
            this._setDate(inst, date);
            this._updateAlternate(inst);
            this._updateDatepicker(inst);
        }
    },

    // change method deprecated
    _changeDatepicker: function(target, name, value) {
        this._optionDatepicker(target, name, value);
    },

    /* Redraw the date picker attached to an input field or division.
     * @param  target  element - the target input field or division or span
     */
    _refreshDatepicker: function(target) {
        var inst = this._getInst(target);
        if (inst) {
            this._updateDatepicker(inst);
        }
    },

    /* Set the dates for a jQuery selection.
     * @param  target element - the target input field or division or span
     * @param  date Date - the new date
     */
    _setDateDatepicker: function(target, date) {
        var inst = this._getInst(target);
        if (inst) {
            this._setDate(inst, date);
            this._updateDatepicker(inst);
            this._updateAlternate(inst);
        }
    },

    /* Get the date(s) for the first entry in a jQuery selection.
     * @param  target element - the target input field or division or span
     * @param  noDefault boolean - true if no default date is to be used
     * @return Date - the current date
     */
    _getDateDatepicker: function(target, noDefault) {
        var inst = this._getInst(target);
        if (inst && !inst.inline) {
            this._setDateFromField(inst, noDefault);
        }
        return (inst ? this._getDate(inst) : null);
    },

    /* Handle keystrokes. */
    _doKeyDown: function(event) {
        var onSelect, dateStr, sel,
            inst = $.datepicker._getInst(event.target),
            handled = true,
            isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

        inst._keyEvent = true;
        if ($.datepicker._datepickerShowing) {
            switch (event.keyCode) {
                case 9: $.datepicker._hideDatepicker();
                        handled = false;
                        break; // hide on tab out
                case 13: sel = $("td." + $.datepicker._dayOverClass + ":not(." +
                                    $.datepicker._currentClass + ")", inst.dpDiv);
                        if (sel[0]) {
                            $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
                        }

                        onSelect = $.datepicker._get(inst, "onSelect");
                        if (onSelect) {
                            dateStr = $.datepicker._formatDate(inst);

                            // trigger custom callback
                            onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
                        } else {
                            $.datepicker._hideDatepicker();
                        }

                        return false; // don't submit the form
                case 27: $.datepicker._hideDatepicker();
                        break; // hide on escape
                case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                            -$.datepicker._get(inst, "stepBigMonths") :
                            -$.datepicker._get(inst, "stepMonths")), "M");
                        break; // previous month/year on page up/+ ctrl
                case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                            +$.datepicker._get(inst, "stepBigMonths") :
                            +$.datepicker._get(inst, "stepMonths")), "M");
                        break; // next month/year on page down/+ ctrl
                case 35: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._clearDate(event.target);
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // clear on ctrl or command +end
                case 36: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._gotoToday(event.target);
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // current on ctrl or command +home
                case 37: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        // -1 day on ctrl or command +left
                        if (event.originalEvent.altKey) {
                            $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                -$.datepicker._get(inst, "stepBigMonths") :
                                -$.datepicker._get(inst, "stepMonths")), "M");
                        }
                        // next month/year on alt +left on Mac
                        break;
                case 38: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, -7, "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // -1 week on ctrl or command +up
                case 39: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        // +1 day on ctrl or command +right
                        if (event.originalEvent.altKey) {
                            $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                +$.datepicker._get(inst, "stepBigMonths") :
                                +$.datepicker._get(inst, "stepMonths")), "M");
                        }
                        // next month/year on alt +right
                        break;
                case 40: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, +7, "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // +1 week on ctrl or command +down
                default: handled = false;
            }
        } else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
            $.datepicker._showDatepicker(this);
        } else {
            handled = false;
        }

        if (handled) {
            event.preventDefault();
            event.stopPropagation();
        }
    },

    /* Filter entered characters - based on date format. */
    _doKeyPress: function(event) {
        var chars, chr,
            inst = $.datepicker._getInst(event.target);

        if ($.datepicker._get(inst, "constrainInput")) {
            chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
            chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
            return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
        }
    },

    /* Synchronise manual entry and field/alternate field. */
    _doKeyUp: function(event) {
        var date,
            inst = $.datepicker._getInst(event.target);

        if (inst.input.val() !== inst.lastVal) {
            try {
                date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
                    (inst.input ? inst.input.val() : null),
                    $.datepicker._getFormatConfig(inst));

                if (date) { // only if valid
                    $.datepicker._setDateFromField(inst);
                    $.datepicker._updateAlternate(inst);
                    $.datepicker._updateDatepicker(inst);
                }
            }
            catch (err) {
            }
        }
        return true;
    },

    /* Pop-up the date picker for a given input field.
     * If false returned from beforeShow event handler do not show.
     * @param  input  element - the input field attached to the date picker or
     *                  event - if triggered by focus
     */
    _showDatepicker: function(input) {
        input = input.target || input;
        if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
            input = $("input", input.parentNode)[0];
        }

        if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
            return;
        }

        var inst, beforeShow, beforeShowSettings, isFixed,
            offset, showAnim, duration;

        inst = $.datepicker._getInst(input);
        if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
            $.datepicker._curInst.dpDiv.stop(true, true);
            if ( inst && $.datepicker._datepickerShowing ) {
                $.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
            }
        }

        beforeShow = $.datepicker._get(inst, "beforeShow");
        beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
        if(beforeShowSettings === false){
            return;
        }
        datepicker_extendRemove(inst.settings, beforeShowSettings);

        inst.lastVal = null;
        $.datepicker._lastInput = input;
        $.datepicker._setDateFromField(inst);

        if ($.datepicker._inDialog) { // hide cursor
            input.value = "";
        }
        if (!$.datepicker._pos) { // position below input
            $.datepicker._pos = $.datepicker._findPos(input);
            $.datepicker._pos[1] += input.offsetHeight; // add the height
        }

        isFixed = false;
        $(input).parents().each(function() {
            isFixed |= $(this).css("position") === "fixed";
            return !isFixed;
        });

        offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
        $.datepicker._pos = null;
        //to avoid flashes on Firefox
        inst.dpDiv.empty();
        // determine sizing offscreen
        inst.dpDiv.css({position: "absolute", display: "block", top: "-1000px"});
        $.datepicker._updateDatepicker(inst);
        // fix width for dynamic number of date pickers
        // and adjust position before showing
        offset = $.datepicker._checkOffset(inst, offset, isFixed);
        inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
            "static" : (isFixed ? "fixed" : "absolute")), display: "none",
            left: offset.left + "px", top: offset.top + "px"});

        if (!inst.inline) {
            showAnim = $.datepicker._get(inst, "showAnim");
            duration = $.datepicker._get(inst, "duration");
            inst.dpDiv.css( "z-index", datepicker_getZindex( $( input ) ) + 1 );
            $.datepicker._datepickerShowing = true;

            if ( $.effects && $.effects.effect[ showAnim ] ) {
                inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
            } else {
                inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
            }

            if ( $.datepicker._shouldFocusInput( inst ) ) {
                inst.input.focus();
            }

            $.datepicker._curInst = inst;
        }
    },

    /* Generate the date picker content. */
    _updateDatepicker: function(inst) {
        this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
        datepicker_instActive = inst; // for delegate hover events
        inst.dpDiv.empty().append(this._generateHTML(inst));
        this._attachHandlers(inst);

        var origyearshtml,
            numMonths = this._getNumberOfMonths(inst),
            cols = numMonths[1],
            width = 17,
            activeCell = inst.dpDiv.find( "." + this._dayOverClass + " a" );

        if ( activeCell.length > 0 ) {
            datepicker_handleMouseover.apply( activeCell.get( 0 ) );
        }

        inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
        if (cols > 1) {
            inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
        }
        inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
            "Class"]("ui-datepicker-multi");
        inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") +
            "Class"]("ui-datepicker-rtl");

        if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput( inst ) ) {
            inst.input.focus();
        }

        // deffered render of the years select (to avoid flashes on Firefox)
        if( inst.yearshtml ){
            origyearshtml = inst.yearshtml;
            setTimeout(function(){
                //assure that inst.yearshtml didn't change.
                if( origyearshtml === inst.yearshtml && inst.yearshtml ){
                    inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
                }
                origyearshtml = inst.yearshtml = null;
            }, 0);
        }
    },

    // #6694 - don't focus the input if it's already focused
    // this breaks the change event in IE
    // Support: IE and jQuery <1.9
    _shouldFocusInput: function( inst ) {
        return inst.input && inst.input.is( ":visible" ) && !inst.input.is( ":disabled" ) && !inst.input.is( ":focus" );
    },

    /* Check positioning to remain on screen. */
    _checkOffset: function(inst, offset, isFixed) {
        var dpWidth = inst.dpDiv.outerWidth(),
            dpHeight = inst.dpDiv.outerHeight(),
            inputWidth = inst.input ? inst.input.outerWidth() : 0,
            inputHeight = inst.input ? inst.input.outerHeight() : 0,
            viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
            viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

        offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
        offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
        offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

        // now check if datepicker is showing outside window viewport - move to a better place if so.
        offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 0);
        offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + inputHeight) : 0);

        return offset;
    },

    /* Find an object's position on the screen. */
    _findPos: function(obj) {
        var position,
            inst = this._getInst(obj),
            isRTL = this._get(inst, "isRTL");

        while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
            obj = obj[isRTL ? "previousSibling" : "nextSibling"];
        }

        position = $(obj).offset();
        return [position.left, position.top];
    },

    /* Hide the date picker from view.
     * @param  input  element - the input field attached to the date picker
     */
    _hideDatepicker: function(input) {
        var showAnim, duration, postProcess, onClose,
            inst = this._curInst;

        if (!inst || (input && inst !== $.data(input, "datepicker"))) {
            return;
        }

        if (this._datepickerShowing) {
            showAnim = this._get(inst, "showAnim");
            duration = this._get(inst, "duration");
            postProcess = function() {
                $.datepicker._tidyDialog(inst);
            };

            // DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
            if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) ) {
                inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
            } else {
                inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
                    (showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
            }

            if (!showAnim) {
                postProcess();
            }
            this._datepickerShowing = false;

            onClose = this._get(inst, "onClose");
            if (onClose) {
                onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
            }

            this._lastInput = null;
            if (this._inDialog) {
                this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" });
                if ($.blockUI) {
                    $.unblockUI();
                    $("body").append(this.dpDiv);
                }
            }
            this._inDialog = false;
        }
    },

    /* Tidy up after a dialog display. */
    _tidyDialog: function(inst) {
        inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
    },

    /* Close date picker if clicked elsewhere. */
    _checkExternalClick: function(event) {
        if (!$.datepicker._curInst) {
            return;
        }

        var $target = $(event.target),
            inst = $.datepicker._getInst($target[0]);

        if ( ( ( $target[0].id !== $.datepicker._mainDivId &&
                $target.parents("#" + $.datepicker._mainDivId).length === 0 &&
                !$target.hasClass($.datepicker.markerClassName) &&
                !$target.closest("." + $.datepicker._triggerClass).length &&
                $.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
            ( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst ) ) {
                $.datepicker._hideDatepicker();
        }
    },

    /* Adjust one of the date sub-fields. */
    _adjustDate: function(id, offset, period) {
        var target = $(id),
            inst = this._getInst(target[0]);

        if (this._isDisabledDatepicker(target[0])) {
            return;
        }
        this._adjustInstDate(inst, offset +
            (period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
            period);
        this._updateDatepicker(inst);
    },

    /* Action for current link. */
    _gotoToday: function(id) {
        var date,
            target = $(id),
            inst = this._getInst(target[0]);

        if (this._get(inst, "gotoCurrent") && inst.currentDay) {
            inst.selectedDay = inst.currentDay;
            inst.drawMonth = inst.selectedMonth = inst.currentMonth;
            inst.drawYear = inst.selectedYear = inst.currentYear;
        } else {
            date = new Date();
            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
        }
        this._notifyChange(inst);
        this._adjustDate(target);
    },

    /* Action for selecting a new month/year. */
    _selectMonthYear: function(id, select, period) {
        var target = $(id),
            inst = this._getInst(target[0]);

        inst["selected" + (period === "M" ? "Month" : "Year")] =
        inst["draw" + (period === "M" ? "Month" : "Year")] =
            parseInt(select.options[select.selectedIndex].value,10);

        this._notifyChange(inst);
        this._adjustDate(target);
    },

    /* Action for selecting a day. */
    _selectDay: function(id, month, year, td) {
        var inst,
            target = $(id);

        if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
            return;
        }

        inst = this._getInst(target[0]);
        inst.selectedDay = inst.currentDay = $("a", td).html();
        inst.selectedMonth = inst.currentMonth = month;
        inst.selectedYear = inst.currentYear = year;
        this._selectDate(id, this._formatDate(inst,
            inst.currentDay, inst.currentMonth, inst.currentYear));
    },

    /* Erase the input field and hide the date picker. */
    _clearDate: function(id) {
        var target = $(id);
        this._selectDate(target, "");
    },

    /* Update the input field with the selected date. */
    _selectDate: function(id, dateStr) {
        var onSelect,
            target = $(id),
            inst = this._getInst(target[0]);

        dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
        if (inst.input) {
            inst.input.val(dateStr);
        }
        this._updateAlternate(inst);

        onSelect = this._get(inst, "onSelect");
        if (onSelect) {
            onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
        } else if (inst.input) {
            inst.input.trigger("change"); // fire the change event
        }

        if (inst.inline){
            this._updateDatepicker(inst);
        } else {
            this._hideDatepicker();
            this._lastInput = inst.input[0];
            if (typeof(inst.input[0]) !== "object") {
                inst.input.focus(); // restore focus
            }
            this._lastInput = null;
        }
    },

    /* Update any alternate field to synchronise with the main field. */
    _updateAlternate: function(inst) {
        var altFormat, date, dateStr,
            altField = this._get(inst, "altField");

        if (altField) { // update alternate field too
            altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
            date = this._getDate(inst);
            dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
            $(altField).each(function() { $(this).val(dateStr); });
        }
    },

    /* Set as beforeShowDay function to prevent selection of weekends.
     * @param  date  Date - the date to customise
     * @return [boolean, string] - is this date selectable?, what is its CSS class?
     */
    noWeekends: function(date) {
        var day = date.getDay();
        return [(day > 0 && day < 6), ""];
    },

    /* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
     * @param  date  Date - the date to get the week for
     * @return  number - the number of the week within the year that contains this date
     */
    iso8601Week: function(date) {
        var time,
            checkDate = new Date(date.getTime());

        // Find Thursday of this week starting on Monday
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

        time = checkDate.getTime();
        checkDate.setMonth(0); // Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    },

    /* Parse a string value into a date object.
     * See formatDate below for the possible formats.
     *
     * @param  format string - the expected format of the date
     * @param  value string - the date in the above format
     * @param  settings Object - attributes include:
     *                  shortYearCutoff  number - the cutoff year for determining the century (optional)
     *                  dayNamesShort   string[7] - abbreviated names of the days from Sunday (optional)
     *                  dayNames        string[7] - names of the days from Sunday (optional)
     *                  monthNamesShort string[12] - abbreviated names of the months (optional)
     *                  monthNames      string[12] - names of the months (optional)
     * @return  Date - the extracted date value or null if value is blank
     */
    parseDate: function (format, value, settings) {
        if (format == null || value == null) {
            throw "Invalid arguments";
        }

        value = (typeof value === "object" ? value.toString() : value + "");
        if (value === "") {
            return null;
        }

        var iFormat, dim, extra,
            iValue = 0,
            shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
            shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
                new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
            dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
            dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
            monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
            monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
            year = -1,
            month = -1,
            day = -1,
            doy = -1,
            literal = false,
            date,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            },
            // Extract a number from the string value
            getNumber = function(match) {
                var isDoubled = lookAhead(match),
                    size = (match === "@" ? 14 : (match === "!" ? 20 :
                    (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
                    minSize = (match === "y" ? size : 1),
                    digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
                    num = value.substring(iValue).match(digits);
                if (!num) {
                    throw "Missing number at position " + iValue;
                }
                iValue += num[0].length;
                return parseInt(num[0], 10);
            },
            // Extract a name from the string value and convert to an index
            getName = function(match, shortNames, longNames) {
                var index = -1,
                    names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
                        return [ [k, v] ];
                    }).sort(function (a, b) {
                        return -(a[1].length - b[1].length);
                    });

                $.each(names, function (i, pair) {
                    var name = pair[1];
                    if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
                        index = pair[0];
                        iValue += name.length;
                        return false;
                    }
                });
                if (index !== -1) {
                    return index + 1;
                } else {
                    throw "Unknown name at position " + iValue;
                }
            },
            // Confirm that a literal character matches the string value
            checkLiteral = function() {
                if (value.charAt(iValue) !== format.charAt(iFormat)) {
                    throw "Unexpected literal at position " + iValue;
                }
                iValue++;
            };

        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal) {
                if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                    literal = false;
                } else {
                    checkLiteral();
                }
            } else {
                switch (format.charAt(iFormat)) {
                    case "d":
                        day = getNumber("d");
                        break;
                    case "D":
                        getName("D", dayNamesShort, dayNames);
                        break;
                    case "o":
                        doy = getNumber("o");
                        break;
                    case "m":
                        month = getNumber("m");
                        break;
                    case "M":
                        month = getName("M", monthNamesShort, monthNames);
                        break;
                    case "y":
                        year = getNumber("y");
                        break;
                    case "@":
                        date = new Date(getNumber("@"));
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "!":
                        date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "'":
                        if (lookAhead("'")){
                            checkLiteral();
                        } else {
                            literal = true;
                        }
                        break;
                    default:
                        checkLiteral();
                }
            }
        }

        if (iValue < value.length){
            extra = value.substr(iValue);
            if (!/^\s+/.test(extra)) {
                throw "Extra/unparsed characters found in date: " + extra;
            }
        }

        if (year === -1) {
            year = new Date().getFullYear();
        } else if (year < 100) {
            year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                (year <= shortYearCutoff ? 0 : -100);
        }

        if (doy > -1) {
            month = 1;
            day = doy;
            do {
                dim = this._getDaysInMonth(year, month - 1);
                if (day <= dim) {
                    break;
                }
                month++;
                day -= dim;
            } while (true);
        }

        date = this._daylightSavingAdjust(new Date(year, month - 1, day));
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            throw "Invalid date"; // E.g. 31/02/00
        }
        return date;
    },

    /* Standard date formats. */
    ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
    COOKIE: "D, dd M yy",
    ISO_8601: "yy-mm-dd",
    RFC_822: "D, d M y",
    RFC_850: "DD, dd-M-y",
    RFC_1036: "D, d M y",
    RFC_1123: "D, d M yy",
    RFC_2822: "D, d M yy",
    RSS: "D, d M y", // RFC 822
    TICKS: "!",
    TIMESTAMP: "@",
    W3C: "yy-mm-dd", // ISO 8601

    _ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
        Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

    /* Format a date object into a string value.
     * The format can be combinations of the following:
     * d  - day of month (no leading zero)
     * dd - day of month (two digit)
     * o  - day of year (no leading zeros)
     * oo - day of year (three digit)
     * D  - day name short
     * DD - day name long
     * m  - month of year (no leading zero)
     * mm - month of year (two digit)
     * M  - month name short
     * MM - month name long
     * y  - year (two digit)
     * yy - year (four digit)
     * @ - Unix timestamp (ms since 01/01/1970)
     * ! - Windows ticks (100ns since 01/01/0001)
     * "..." - literal text
     * '' - single quote
     *
     * @param  format string - the desired format of the date
     * @param  date Date - the date value to format
     * @param  settings Object - attributes include:
     *                  dayNamesShort   string[7] - abbreviated names of the days from Sunday (optional)
     *                  dayNames        string[7] - names of the days from Sunday (optional)
     *                  monthNamesShort string[12] - abbreviated names of the months (optional)
     *                  monthNames      string[12] - names of the months (optional)
     * @return  string - the date in the above format
     */
    formatDate: function (format, date, settings) {
        if (!date) {
            return "";
        }

        var iFormat,
            dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
            dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
            monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
            monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            },
            // Format a number, with leading zero if necessary
            formatNumber = function(match, value, len) {
                var num = "" + value;
                if (lookAhead(match)) {
                    while (num.length < len) {
                        num = "0" + num;
                    }
                }
                return num;
            },
            // Format a name, short or long as requested
            formatName = function(match, value, shortNames, longNames) {
                return (lookAhead(match) ? longNames[value] : shortNames[value]);
            },
            output = "",
            literal = false;

        if (date) {
            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                        literal = false;
                    } else {
                        output += format.charAt(iFormat);
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case "d":
                            output += formatNumber("d", date.getDate(), 2);
                            break;
                        case "D":
                            output += formatName("D", date.getDay(), dayNamesShort, dayNames);
                            break;
                        case "o":
                            output += formatNumber("o",
                                Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                            break;
                        case "m":
                            output += formatNumber("m", date.getMonth() + 1, 2);
                            break;
                        case "M":
                            output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
                            break;
                        case "y":
                            output += (lookAhead("y") ? date.getFullYear() :
                                (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
                            break;
                        case "@":
                            output += date.getTime();
                            break;
                        case "!":
                            output += date.getTime() * 10000 + this._ticksTo1970;
                            break;
                        case "'":
                            if (lookAhead("'")) {
                                output += "'";
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            output += format.charAt(iFormat);
                    }
                }
            }
        }
        return output;
    },

    /* Extract all possible characters from the date format. */
    _possibleChars: function (format) {
        var iFormat,
            chars = "",
            literal = false,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            };

        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal) {
                if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                    literal = false;
                } else {
                    chars += format.charAt(iFormat);
                }
            } else {
                switch (format.charAt(iFormat)) {
                    case "d": case "m": case "y": case "@":
                        chars += "0123456789";
                        break;
                    case "D": case "M":
                        return null; // Accept anything
                    case "'":
                        if (lookAhead("'")) {
                            chars += "'";
                        } else {
                            literal = true;
                        }
                        break;
                    default:
                        chars += format.charAt(iFormat);
                }
            }
        }
        return chars;
    },

    /* Get a setting value, defaulting if necessary. */
    _get: function(inst, name) {
        return inst.settings[name] !== undefined ?
            inst.settings[name] : this._defaults[name];
    },

    /* Parse existing date and initialise date picker. */
    _setDateFromField: function(inst, noDefault) {
        if (inst.input.val() === inst.lastVal) {
            return;
        }

        var dateFormat = this._get(inst, "dateFormat"),
            dates = inst.lastVal = inst.input ? inst.input.val() : null,
            defaultDate = this._getDefaultDate(inst),
            date = defaultDate,
            settings = this._getFormatConfig(inst);

        try {
            date = this.parseDate(dateFormat, dates, settings) || defaultDate;
        } catch (event) {
            dates = (noDefault ? "" : dates);
        }
        inst.selectedDay = date.getDate();
        inst.drawMonth = inst.selectedMonth = date.getMonth();
        inst.drawYear = inst.selectedYear = date.getFullYear();
        inst.currentDay = (dates ? date.getDate() : 0);
        inst.currentMonth = (dates ? date.getMonth() : 0);
        inst.currentYear = (dates ? date.getFullYear() : 0);
        this._adjustInstDate(inst);
    },

    /* Retrieve the default date shown on opening. */
    _getDefaultDate: function(inst) {
        return this._restrictMinMax(inst,
            this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
    },

    /* A date may be specified as an exact value or a relative one. */
    _determineDate: function(inst, date, defaultDate) {
        var offsetNumeric = function(offset) {
                var date = new Date();
                date.setDate(date.getDate() + offset);
                return date;
            },
            offsetString = function(offset) {
                try {
                    return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
                        offset, $.datepicker._getFormatConfig(inst));
                }
                catch (e) {
                    // Ignore
                }

                var date = (offset.toLowerCase().match(/^c/) ?
                    $.datepicker._getDate(inst) : null) || new Date(),
                    year = date.getFullYear(),
                    month = date.getMonth(),
                    day = date.getDate(),
                    pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                    matches = pattern.exec(offset);

                while (matches) {
                    switch (matches[2] || "d") {
                        case "d" : case "D" :
                            day += parseInt(matches[1],10); break;
                        case "w" : case "W" :
                            day += parseInt(matches[1],10) * 7; break;
                        case "m" : case "M" :
                            month += parseInt(matches[1],10);
                            day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                            break;
                        case "y": case "Y" :
                            year += parseInt(matches[1],10);
                            day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                            break;
                    }
                    matches = pattern.exec(offset);
                }
                return new Date(year, month, day);
            },
            newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
                (typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

        newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
        if (newDate) {
            newDate.setHours(0);
            newDate.setMinutes(0);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
        }
        return this._daylightSavingAdjust(newDate);
    },

    /* Handle switch to/from daylight saving.
     * Hours may be non-zero on daylight saving cut-over:
     * > 12 when midnight changeover, but then cannot generate
     * midnight datetime, so jump to 1AM, otherwise reset.
     * @param  date  (Date) the date to check
     * @return  (Date) the corrected date
     */
    _daylightSavingAdjust: function(date) {
        if (!date) {
            return null;
        }
        date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
        return date;
    },

    /* Set the date(s) directly. */
    _setDate: function(inst, date, noChange) {
        var clear = !date,
            origMonth = inst.selectedMonth,
            origYear = inst.selectedYear,
            newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

        inst.selectedDay = inst.currentDay = newDate.getDate();
        inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
        inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
        if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
            this._notifyChange(inst);
        }
        this._adjustInstDate(inst);
        if (inst.input) {
            inst.input.val(clear ? "" : this._formatDate(inst));
        }
    },

    /* Retrieve the date(s) directly. */
    _getDate: function(inst) {
        var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
            this._daylightSavingAdjust(new Date(
            inst.currentYear, inst.currentMonth, inst.currentDay)));
            return startDate;
    },

    /* Attach the onxxx handlers.  These are declared statically so
     * they work with static code transformers like Caja.
     */
    _attachHandlers: function(inst) {
        var stepMonths = this._get(inst, "stepMonths"),
            id = "#" + inst.id.replace( /\\\\/g, "\\" );
        inst.dpDiv.find("[data-handler]").map(function () {
            var handler = {
                prev: function () {
                    $.datepicker._adjustDate(id, -stepMonths, "M");
                },
                next: function () {
                    $.datepicker._adjustDate(id, +stepMonths, "M");
                },
                hide: function () {
                    $.datepicker._hideDatepicker();
                },
                today: function () {
                    $.datepicker._gotoToday(id);
                },
                selectDay: function () {
                    $.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
                    return false;
                },
                selectMonth: function () {
                    $.datepicker._selectMonthYear(id, this, "M");
                    return false;
                },
                selectYear: function () {
                    $.datepicker._selectMonthYear(id, this, "Y");
                    return false;
                }
            };
            $(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
        });
    },

    /* Generate the HTML for the current state of the date picker. */
    _generateHTML: function(inst) {
        var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
            controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
            monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
            selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
            cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
            printDate, dRow, tbody, daySettings, otherMonth, unselectable,
            tempDate = new Date(),
            today = this._daylightSavingAdjust(
                new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
            isRTL = this._get(inst, "isRTL"),
            showButtonPanel = this._get(inst, "showButtonPanel"),
            hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
            navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
            numMonths = this._getNumberOfMonths(inst),
            showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
            stepMonths = this._get(inst, "stepMonths"),
            isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
            currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
                new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
            minDate = this._getMinMaxDate(inst, "min"),
            maxDate = this._getMinMaxDate(inst, "max"),
            drawMonth = inst.drawMonth - showCurrentAtPos,
            drawYear = inst.drawYear;

        if (drawMonth < 0) {
            drawMonth += 12;
            drawYear--;
        }
        if (maxDate) {
            maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
                maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
            maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
            while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
                drawMonth--;
                if (drawMonth < 0) {
                    drawMonth = 11;
                    drawYear--;
                }
            }
        }
        inst.drawMonth = drawMonth;
        inst.drawYear = drawYear;

        prevText = this._get(inst, "prevText");
        prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
            this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
            this._getFormatConfig(inst)));

        prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
            "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
            " title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" :
            (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+ prevText +"'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>"));

        nextText = this._get(inst, "nextText");
        nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
            this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
            this._getFormatConfig(inst)));

        next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
            "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
            " title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" :
            (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+ nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>"));

        currentText = this._get(inst, "currentText");
        gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
        currentText = (!navigationAsDateFormat ? currentText :
            this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

        controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
            this._get(inst, "closeText") + "</button>" : "");

        buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") +
            (this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
            ">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

        firstDay = parseInt(this._get(inst, "firstDay"),10);
        firstDay = (isNaN(firstDay) ? 0 : firstDay);

        showWeek = this._get(inst, "showWeek");
        dayNames = this._get(inst, "dayNames");
        dayNamesMin = this._get(inst, "dayNamesMin");
        monthNames = this._get(inst, "monthNames");
        monthNamesShort = this._get(inst, "monthNamesShort");
        beforeShowDay = this._get(inst, "beforeShowDay");
        showOtherMonths = this._get(inst, "showOtherMonths");
        selectOtherMonths = this._get(inst, "selectOtherMonths");
        defaultDate = this._getDefaultDate(inst);
        html = "";
        dow;
        for (row = 0; row < numMonths[0]; row++) {
            group = "";
            this.maxRows = 4;
            for (col = 0; col < numMonths[1]; col++) {
                selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
                cornerClass = " ui-corner-all";
                calender = "";
                if (isMultiMonth) {
                    calender += "<div class='ui-datepicker-group";
                    if (numMonths[1] > 1) {
                        switch (col) {
                            case 0: calender += " ui-datepicker-group-first";
                                cornerClass = " ui-corner-" + (isRTL ? "right" : "left"); break;
                            case numMonths[1]-1: calender += " ui-datepicker-group-last";
                                cornerClass = " ui-corner-" + (isRTL ? "left" : "right"); break;
                            default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
                        }
                    }
                    calender += "'>";
                }
                calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
                    (/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
                    (/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
                    this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
                    row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
                    "</div><table class='ui-datepicker-calendar'><thead>" +
                    "<tr>";
                thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
                for (dow = 0; dow < 7; dow++) { // days of the week
                    day = (dow + firstDay) % 7;
                    thead += "<th scope='col'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
                        "<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
                }
                calender += thead + "</tr></thead><tbody>";
                daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
                if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
                    inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
                }
                leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
                curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
                numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
                this.maxRows = numRows;
                printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
                for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
                    calender += "<tr>";
                    tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
                        this._get(inst, "calculateWeek")(printDate) + "</td>");
                    for (dow = 0; dow < 7; dow++) { // create date picker days
                        daySettings = (beforeShowDay ?
                            beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
                        otherMonth = (printDate.getMonth() !== drawMonth);
                        unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
                            (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                        tbody += "<td class='" +
                            ((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
                            (otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
                            ((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
                            (defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
                            // or defaultDate is current printedDate and defaultDate is selectedDate
                            " " + this._dayOverClass : "") + // highlight selected day
                            (unselectable ? " " + this._unselectableClass + " ui-state-disabled": "") +  // highlight unselectable days
                            (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
                            (printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
                            (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
                            ((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
                            (unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
                            (otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
                            (unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
                            (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
                            (printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
                            (otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
                            "' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
                        printDate.setDate(printDate.getDate() + 1);
                        printDate = this._daylightSavingAdjust(printDate);
                    }
                    calender += tbody + "</tr>";
                }
                drawMonth++;
                if (drawMonth > 11) {
                    drawMonth = 0;
                    drawYear++;
                }
                calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
                            ((numMonths[0] > 0 && col === numMonths[1]-1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
                group += calender;
            }
            html += group;
        }
        html += buttonPanel;
        inst._keyEvent = false;
        return html;
    },

    /* Generate the month and year header. */
    _generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
            secondary, monthNames, monthNamesShort) {

        var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
            changeMonth = this._get(inst, "changeMonth"),
            changeYear = this._get(inst, "changeYear"),
            showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
            html = "<div class='ui-datepicker-title'>",
            monthHtml = "";

        // month selection
        if (secondary || !changeMonth) {
            monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
        } else {
            inMinYear = (minDate && minDate.getFullYear() === drawYear);
            inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
            monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
            for ( month = 0; month < 12; month++) {
                if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
                    monthHtml += "<option value='" + month + "'" +
                        (month === drawMonth ? " selected='selected'" : "") +
                        ">" + monthNamesShort[month] + "</option>";
                }
            }
            monthHtml += "</select>";
        }

        if (!showMonthAfterYear) {
            html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
        }

        // year selection
        if ( !inst.yearshtml ) {
            inst.yearshtml = "";
            if (secondary || !changeYear) {
                html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
            } else {
                // determine range of years to display
                years = this._get(inst, "yearRange").split(":");
                thisYear = new Date().getFullYear();
                determineYear = function(value) {
                    var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
                        (value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
                        parseInt(value, 10)));
                    return (isNaN(year) ? thisYear : year);
                };
                year = determineYear(years[0]);
                endYear = Math.max(year, determineYear(years[1] || ""));
                year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
                endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
                inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
                for (; year <= endYear; year++) {
                    inst.yearshtml += "<option value='" + year + "'" +
                        (year === drawYear ? " selected='selected'" : "") +
                        ">" + year + "</option>";
                }
                inst.yearshtml += "</select>";

                html += inst.yearshtml;
                inst.yearshtml = null;
            }
        }

        html += this._get(inst, "yearSuffix");
        if (showMonthAfterYear) {
            html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
        }
        html += "</div>"; // Close datepicker_header
        return html;
    },

    /* Adjust one of the date sub-fields. */
    _adjustInstDate: function(inst, offset, period) {
        var year = inst.drawYear + (period === "Y" ? offset : 0),
            month = inst.drawMonth + (period === "M" ? offset : 0),
            day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
            date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

        inst.selectedDay = date.getDate();
        inst.drawMonth = inst.selectedMonth = date.getMonth();
        inst.drawYear = inst.selectedYear = date.getFullYear();
        if (period === "M" || period === "Y") {
            this._notifyChange(inst);
        }
    },

    /* Ensure a date is within any min/max bounds. */
    _restrictMinMax: function(inst, date) {
        var minDate = this._getMinMaxDate(inst, "min"),
            maxDate = this._getMinMaxDate(inst, "max"),
            newDate = (minDate && date < minDate ? minDate : date);
        return (maxDate && newDate > maxDate ? maxDate : newDate);
    },

    /* Notify change of month/year. */
    _notifyChange: function(inst) {
        var onChange = this._get(inst, "onChangeMonthYear");
        if (onChange) {
            onChange.apply((inst.input ? inst.input[0] : null),
                [inst.selectedYear, inst.selectedMonth + 1, inst]);
        }
    },

    /* Determine the number of months to show. */
    _getNumberOfMonths: function(inst) {
        var numMonths = this._get(inst, "numberOfMonths");
        return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
    },

    /* Determine the current maximum date - ensure no time components are set. */
    _getMinMaxDate: function(inst, minMax) {
        return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
    },

    /* Find the number of days in a given month. */
    _getDaysInMonth: function(year, month) {
        return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
    },

    /* Find the day of the week of the first of a month. */
    _getFirstDayOfMonth: function(year, month) {
        return new Date(year, month, 1).getDay();
    },

    /* Determines if we should allow a "next/prev" month display change. */
    _canAdjustMonth: function(inst, offset, curYear, curMonth) {
        var numMonths = this._getNumberOfMonths(inst),
            date = this._daylightSavingAdjust(new Date(curYear,
            curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

        if (offset < 0) {
            date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
        }
        return this._isInRange(inst, date);
    },

    /* Is the given date in the accepted range? */
    _isInRange: function(inst, date) {
        var yearSplit, currentYear,
            minDate = this._getMinMaxDate(inst, "min"),
            maxDate = this._getMinMaxDate(inst, "max"),
            minYear = null,
            maxYear = null,
            years = this._get(inst, "yearRange");
            if (years){
                yearSplit = years.split(":");
                currentYear = new Date().getFullYear();
                minYear = parseInt(yearSplit[0], 10);
                maxYear = parseInt(yearSplit[1], 10);
                if ( yearSplit[0].match(/[+\-].*/) ) {
                    minYear += currentYear;
                }
                if ( yearSplit[1].match(/[+\-].*/) ) {
                    maxYear += currentYear;
                }
            }

        return ((!minDate || date.getTime() >= minDate.getTime()) &&
            (!maxDate || date.getTime() <= maxDate.getTime()) &&
            (!minYear || date.getFullYear() >= minYear) &&
            (!maxYear || date.getFullYear() <= maxYear));
    },

    /* Provide the configuration settings for formatting/parsing. */
    _getFormatConfig: function(inst) {
        var shortYearCutoff = this._get(inst, "shortYearCutoff");
        shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
            new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
        return {shortYearCutoff: shortYearCutoff,
            dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
            monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames")};
    },

    /* Format the given date for display. */
    _formatDate: function(inst, day, month, year) {
        if (!day) {
            inst.currentDay = inst.selectedDay;
            inst.currentMonth = inst.selectedMonth;
            inst.currentYear = inst.selectedYear;
        }
        var date = (day ? (typeof day === "object" ? day :
            this._daylightSavingAdjust(new Date(year, month, day))) :
            this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
        return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
    }
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global datepicker_instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function datepicker_bindHover(dpDiv) {
    var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
    return dpDiv.delegate(selector, "mouseout", function() {
            $(this).removeClass("ui-state-hover");
            if (this.className.indexOf("ui-datepicker-prev") !== -1) {
                $(this).removeClass("ui-datepicker-prev-hover");
            }
            if (this.className.indexOf("ui-datepicker-next") !== -1) {
                $(this).removeClass("ui-datepicker-next-hover");
            }
        })
        .delegate( selector, "mouseover", datepicker_handleMouseover );
}

function datepicker_handleMouseover() {
    if (!$.datepicker._isDisabledDatepicker( datepicker_instActive.inline? datepicker_instActive.dpDiv.parent()[0] : datepicker_instActive.input[0])) {
        $(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
        $(this).addClass("ui-state-hover");
        if (this.className.indexOf("ui-datepicker-prev") !== -1) {
            $(this).addClass("ui-datepicker-prev-hover");
        }
        if (this.className.indexOf("ui-datepicker-next") !== -1) {
            $(this).addClass("ui-datepicker-next-hover");
        }
    }
}

/* jQuery extend now ignores nulls! */
function datepicker_extendRemove(target, props) {
    $.extend(target, props);
    for (var name in props) {
        if (props[name] == null) {
            target[name] = props[name];
        }
    }
    return target;
}

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
                    Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

    /* Verify an empty collection wasn't passed - Fixes #6976 */
    if ( !this.length ) {
        return this;
    }

    /* Initialise the date picker. */
    if (!$.datepicker.initialized) {
        $(document).mousedown($.datepicker._checkExternalClick);
        $.datepicker.initialized = true;
    }

    /* Append datepicker main container to body if not exist. */
    if ($("#"+$.datepicker._mainDivId).length === 0) {
        $("body").append($.datepicker.dpDiv);
    }

    var otherArgs = Array.prototype.slice.call(arguments, 1);
    if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
        return $.datepicker["_" + options + "Datepicker"].
            apply($.datepicker, [this[0]].concat(otherArgs));
    }
    if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
        return $.datepicker["_" + options + "Datepicker"].
            apply($.datepicker, [this[0]].concat(otherArgs));
    }
    return this.each(function() {
        typeof options === "string" ?
            $.datepicker["_" + options + "Datepicker"].
                apply($.datepicker, [this].concat(otherArgs)) :
            $.datepicker._attachDatepicker(this, options);
    });
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.11.2";

var datepicker = $.datepicker;



}));


/*================= JQUERY UI PLUGIN ENDS ====================*/