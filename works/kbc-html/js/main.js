$(document).ready(function () {

  $('.carousel').carousel("cycle");
    
    //$(document).on("scroll", onScroll);
    
    //smoothscroll
    $('#nav a[href^="#"]').on('click', function (e) {
        $('#nav li').removeClass('active');
        $(this).closest('li').addClass('active');
        e.preventDefault();
        
        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top+2
        }, 500, 'swing', function () {
            window.location.hash = target;
            //$(document).on("scroll", onScroll);
        });
    });
});


