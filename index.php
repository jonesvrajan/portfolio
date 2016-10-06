<?PHP
/*
    Contact Form from HTML Form Guide
    This program is free software published under the
    terms of the GNU Lesser General Public License.
    See this page for more info:
    http://www.html-form-guide.com/contact-form/simple-php-contact-form.html
*/
require_once("./include/fgcontactform.php");

$formproc = new FGContactForm();


//1. Add your email address here.
//You can add more than one receipients.
$formproc->AddRecipient('jonesvrajan@gmail.com'); //<<---Put your email address here


//2. For better security. Get a random tring from this link: http://tinyurl.com/randstr
// and put it here
$formproc->SetFormRandomKey('CnRrspl1FyEylUj');


if(isset($_POST['submitted']))
{
   if($formproc->ProcessForm())
   {
        $formproc->RedirectToURL("thank-you.php");
   }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">
<title>Jones Rajan | Front-End Developer portfolio</title>


<!-- Custom CSS -->
<link href="assets/css/main.css" rel="stylesheet">
<script type="text/javascript" src="assets/js/modernizr.custom.js"></script>

<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body data-spy="scroll" data-offset="0" data-target="#navbar-main">
<div id="navbar-main"> 
  <!-- Fixed navbar -->
  <div class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
        <a class="navbar-brand smoothScroll" href="#home">JVR</a> </div>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
          <li><a href="#home" class="smoothScroll">Home</a></li>
          <li> <a href="#about" class="smoothScroll"> About</a></li>
          <li> <a href="#services" class="smoothScroll"> Skills</a></li>
          <li> <a href="#portfolio" class="smoothScroll"> Portfolio</a></li>
          <li> <a href="#team" class="smoothScroll"> Testimonials</a></li>
          <li> <a href="#contact" class="smoothScroll"> Contact</a></li>
        </ul>
      </div>
      <!--/.nav-collapse --> 
    </div>
  </div>
</div>

<!-- ==== HEADERWRAP ==== -->
<div id="headerwrap" name="home">
  <header class="clearfix"> <i class="fa fa-html5 icon"></i>
    <h1>JONES RAJAN</h1>
    <p>UI | UX | Web | Mobile | Design | Development</p>
    <a href="#contact" class="smoothScroll btn btn-lg">  QUICK CONTACT </a> </header>
</div>
<!-- /headerwrap --> 

<!-- ==== ABOUT ==== -->
<div id="about" name="about">
  <div class="container">
    <div class="row white">
      <h2 class="centered">ABOUT</h2>
      <p class="info">A brief description about myself.</p>
      <div class="col-lg-8 col-lg-offset-2">
        <p class="large">
          I am a Web Front-End Developer and Designer. 
I love creative challenges to solve. As a Web and Technology enthusiast,
I believe there are lots more to explore and experiment
        </p>
      </div>
    </div>
    <!-- row --> 
  </div>
</div>
<!-- container --> 

<!-- ==== SERVICES ==== -->
<div id="services" name="services">
  <div class="container">
    <div class="row">
      <h2 class="centered">SKILLS</h2>
      <p class="info">Primary skillset apart from Frameworks, Technologies and Softwares.</p>
      <div class="skillst5">
        <div class="skillbar" data-percent="90%">
          <div class="title">HTML 5</div>
          <div class="count-bar color-1">
            <div class="count"></div>
          </div>
        </div>
        <div class="skillbar" data-percent="90%">
          <div class="title">CSS 3</div>
          <div class="count-bar color-2">
            <div class="count"></div>
          </div>
        </div>
        <div class="skillbar" data-percent="60%">
          <div class="title">Javascript</div>
          <div class="count-bar color-3">
            <div class="count"></div>
          </div>
        </div>
        <div class="skillbar" data-percent="90%">
          <div class="title">Responsive and Mobile Web</div>
          <div class="count-bar color-4">
            <div class="count"></div>
          </div>
        </div>
        <div class="skillbar" data-percent="80%">
          <div class="title">Adobe Creative Cloud</div>
          <div class="count-bar color-5">
            <div class="count"></div>
          </div>
        </div>
      </div>
      <h2 class="centered screen">TECHNOLOGY STACK</h2>
      <p class="info screen"> List of languages, softwares, frameworks using for getting things done.</p>

      <div id="technology-stack" class="carousel slide technologies" data-ride="carousel">
          <!-- Indicators 
          <ol class="carousel-indicators">
            <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
            <li data-target="#carousel-example-generic" data-slide-to="1"></li>
            <li data-target="#carousel-example-generic" data-slide-to="2"></li>
          </ol> -->

        <!-- Wrapper for slides -->
        <div class="carousel-inner" role="listbox">
           <!-- <div class="row">
                <div class="col-sm-1"><a href="#" title="HTML5"><img src="assets/img/technologies/html-5.svg"></a></div>
                <div class="col-sm-1"><a href="#" title="CSS3"><img src="assets/img/technologies/css-3.svg"></a></div>
                <div class="col-sm-1"><a href="#" title="Javascript"><img src="assets/img/technologies/javascript.svg"></a></div>
                <div class="col-sm-1"><a href="#" title="jQuery"><img src="assets/img/technologies/jquery.svg"></a></div>
                <div class="col-sm-1"><a href="#" title="SASS"><img src="assets/img/technologies/sass.svg"></a></div>
                <div class="col-sm-1"><a href="#" title="LESS"><img src="assets/img/technologies/less.svg"></a></div>
                <div class="col-sm-1"><a href="#" title="JSON"><img src="assets/img/technologies/json.svg"></a></div>
                <div class="col-sm-1"><a href="#" title="W3C"><img src="assets/img/technologies/w3c.svg"></a></div>
                <div class="col-sm-1"><a href="#" title="Bootstrap"><img src="assets/img/technologies/bootstrap.svg"></a></div>
                <div class="col-xs-6 col-sm-1"><a href="#" title="Yeoman"><img src="assets/img/technologies/yeoman.svg"></a></div>
                <div class="col-xs-6 col-sm-1"><a href="#" title="Bower"><img src="assets/img/technologies/bower.svg"></a></div>
                <div class="col-xs-6 col-sm-1"><a href="#" title="Grunt"><img src="assets/img/technologies/grunt.svg"></a></div>
              </div> -->
          <div class="item active">
            <ul class="logos">
                <li>
                  <a href="http://www.w3.org/TR/html5/" target="_blank" class="logo-item">
                      <img src="assets/img/technologies/html-5.svg" alt="HTML5" class=""/>
                      <span class="name">HTML5</span>
                  </a>
                </li>
                <li>
                  <a href="http://www.w3.org/TR/CSS/" target="_blank" class="logo-item">
                      <img src="assets/img/technologies/css-3.svg" alt="CSS3" class=""/>
                      <span class="name">CSS3</span>
                  </a>
                </li>
                <li>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/javascript.svg" alt="javascript (JS)" class=""/>
                    <span class="name">javascript (JS)</span>
                  </a>
                </li>

                <li>
                  <a href="https://jquery.com/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/jquery.svg" alt="jQuery" class=""/>
                    <span class="name">jQuery</span>
                  </a>
                </li>
                <li>
                  <a href="http://sass-lang.com/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/sass.svg" alt="Sass" class="">
                    <span class="name">Sass</span>
                  </a>
                </li>
                <li>
                  <a href="http://lesscss.org/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/less.svg" alt="Less" class="">
                    <span class="name">Less</span>
                  </a> 
                </li>
              </ul>
            </div>

            <div class="item">
              <ul class="logos">
                <li>
                  <a href="http://compass-style.org/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/compass.svg" alt="Compass" class="">
                    <span class="name">Compass</span>
                  </a>
                </li>
                <li>
                  <a href="http://neat.bourbon.io/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/neat.svg" alt="Neat" class="">
                    <span class="name">Neat</span>
                </a>
                </li>
                <li>
                  <a href="http://bourbon.io/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/bourbon.svg" alt="bourbon" class="">
                    <span class="name">bourbon</span>
                  </a>
                </li>

                <li>
                   <a href="http://yeoman.io/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/yeoman.svg" alt="Yeoman" class="">
                    <span class="name">Yeoman</span>
                  </a>
                </li>
                <li>
                  <a href="http://bower.io/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/bower.svg" alt="Bower" class="">
                    <span class="name">Bower</span>
                  </a>
                </li>
                <li>
                  <a href="http://gruntjs.com/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/grunt.svg" alt="Grunt" class="">
                    <span class="name">Grunt</span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="item">
              <ul class="logos">
                <li>
                    <a href="http://gulpjs.com/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/gulp.svg" height="140" alt="Gulp" class="">
                    <span class="name">Gulp</span>
                  </a>
                </li>
                <li>
                  <a href="http://getbootstrap.com/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/bootstrap.svg" alt="Bootstrap" class="">
                    <span class="name">Bootstrap</span>
                  </a>
                </li>
                <li>
                  <a href="https://git-scm.com/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/git.svg" alt="Git" class="">
                    <span class="name">Git</span>
                  </a>
                </li>

                <li>
                  <a href="http://crossbrowsertesting.com/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/crossbrowsertesting.svg" alt="Cross Browser Testing" class="">
                    <span class="name">Cross Browser Testing</span>
                  </a>
                </li>
                <li>
                  <a href="http://json.org/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/json.svg" alt="JSON" class="">
                    <span class="name">JSON</span>
                  </a>
                </li>
                <li>
                  <a href="https://wordpress.org/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/wordpress-icon.svg" alt="Wordpress" class="">
                    <span class="name">Wordpress</span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="item">
              <ul class="logos">
                <li>
                  <a href="http://php.net/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/php.svg" alt="PHP" class="">
                    <span class="name">PHP</span>
                  </a>
                </li>
                <li>
                  <a href="http://handlebarsjs.com/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/handlebars.svg" alt="Handlebars" class="">
                    <span class="name">Handlebars</span>
                  </a>
                </li>
                <li>
                  <a href="https://angularjs.org/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/angular-icon.svg" alt="Angular" class="">
                    <span class="name">Angular</span>
                </a>
                </li>

                <li>
                  <a href="https://nodejs.org/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/nodejs.svg" alt="Node.js" class="">
                    <span class="name">Node.js</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.meteor.com/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/meteor.svg" alt="Meteor" class="">
                    <span class="name">Meteor</span>
                  </a>
                </li>
                <li>
                  <a href="http://emberjs.com/" target="_blank" class="logo-item">
                    <img src="assets/img/technologies/ember.svg" alt="Ember" class="">
                    <span class="name">Ember</span>
                  </a>
                </li>
              </ul>
            </div>
            <!-- <div class="item">
              <div class="row">
                  <div class="col-xs-6 col-sm-1"><a href="#" title="Gulp"><img src="assets/img/technologies/gulp.svg"></a></div>
                  <div class="col-xs-6 col-sm-1"><a href="#" title="HandlebarJs"><img src="assets/img/technologies/handlebars.svg"></a></div>
                  <div class="col-xs-6 col-sm-1"><a href="#" title="HAML"><img src="assets/img/technologies/haml.svg"></a></div>
                  <div class="col-xs-6 col-sm-1"><a href="#" title="Git"><img src="assets/img/technologies/git.svg"></a></div>
                  <div class="col-xs-6 col-sm-1"><a href="#" title="Jade"><img src="assets/img/technologies/jade.svg"></a></div>
                  <div class="col-xs-6 col-sm-1"><a href="#" title="D3Js"><img src="assets/img/technologies/d3.svg"></a></div>
                  <div class="col-xs-6 col-sm-1"><a href="#" title="AngularJs"><img src="assets/img/technologies/angular-icon.svg"></a></div>
                  <div class="col-xs-6 col-sm-1"><a href="#" title="NodeJs"><img src="assets/img/technologies/nodejs.svg"></a></div>
                  <div class="col-xs-6 col-sm-1"><a href="#" title="EmberJs"><img src="assets/img/technologies/ember.svg"></a></div>
                  <div class="col-xs-6 col-sm-1"><a href="#" title="Node Package Manager"><img src="assets/img/technologies/npm.svg"></a></div>
                  <div class="col-xs-6 col-sm-1"><a href="#" title="Wordpress"><img src="assets/img/technologies/wordpress-icon.svg"></a></div>
                  <div class="col-xs-6 col-sm-1"><a href="#" title="PHP"><img src="assets/img/technologies/php.svg"></a></div>
                </div>
            </div> -->
          </div>

          <a class="left carousel-control" href="#technology-stack" role="button" data-slide="prev">
                <span class="fa fa-chevron-left" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="right carousel-control" href="#technology-stack" role="button" data-slide="next">
                <span class="fa fa-chevron-right" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </a>

        </div>


    </div>
    <!-- row --> 
  </div>
</div>
<!-- container --> 




<!-- ==== PORTFOLIO ==== -->
<div id="portfolio" name="portfolio">
  <div class="container">
    <div class="row">
      <h2 class="centered">PORTFOLIO</h2>
      <p class="info">Some of Recent works. For more visit <a target="_blank" href="https://github.com/jonesvrajan?tab=repositories">Github.</a></p>
    </div>
    <!-- /row -->
    <div class="container portfolio-container">
      <div class="row"> 
        
        <!-- PORTFOLIO IMAGE 1 -->
        <div class="col-md-4 ">
          <div class="grid mask">
            <figure> <img class="img-responsive" src="assets/img/portfolio/arg-1.jpg" alt="">
              <figcaption>
                <h4>Austin Reed Group</h4>
                <h5>HTML, CSS, jQuery, Mobile optimization</h5>
                <a href="http://www.austinreed.com/" target="_blank" class="btn btn-default">Visit Site</a> </figcaption>
              <!-- /figcaption --> 
            </figure>
            <!-- /figure --> 
          </div>
          <!-- /grid-mask --> 
        </div>
        
        <!-- PORTFOLIO IMAGE 2 -->
        <div class="col-md-4">
          <div class="grid mask">
            <figure> <img class="img-responsive" src="assets/img/portfolio/arg-2.jpg" alt="">
              <figcaption>
                <h4>Austin Reed Group - Viyella</h4>
                <h5>HTML, CSS, jQuery, Mobile optimization</h5>
                <a href="http://www.viyella.com/" target="_blank" class="btn btn-default">Visit Site</a> </figcaption>
              <!-- /figcaption --> 
            </figure>
            <!-- /figure --> 
          </div>
          <!-- /grid-mask --> 
        </div>
        
        <!-- PORTFOLIO IMAGE 3 -->
        <div class="col-md-4">
          <div class="grid mask">
            <figure> <img class="img-responsive" src="assets/img/portfolio/arg-3.jpg" alt="">
              <figcaption>
                <h4>Austin Reed Group - CC Fashion</h4>
                <h5>HTML, CSS, jQuery, Mobile optimization</h5>
                <a href="http://www.cc.co.uk/" target="_blank" class="btn btn-default">Visit Site</a> </figcaption>
              <!-- /figcaption --> 
            </figure>
            <!-- /figure --> 
          </div>
          <!-- /grid-mask --> 
        </div>
      </div>
      <!-- /row --> 
      
      <!-- PORTFOLIO IMAGE 4 -->
      <div class="row">
        <div class="col-md-4 ">
          <div class="grid mask">
            <figure> <img class="img-responsive" src="assets/img/portfolio/vc.jpg" alt="">
              <figcaption>
                <h4>Vouchercodes</h4>
                <h5>HTML, CSS, jQuery, Mobile optimization</h5>
                <a href="http://www.vouchercodes.in/" target="_blank" class="btn btn-default">Visit Site</a> </figcaption>
              <!-- /figcaption --> 
            </figure>
            <!-- /figure --> 
          </div>
          <!-- /grid-mask --> 
        </div>
        
        <!-- PORTFOLIO IMAGE 5 -->
        
        <div class="col-md-4">
          <div class="grid mask">
            <figure> <img class="img-responsive" src="assets/img/portfolio/saatva.jpg" alt="">
              <figcaption>
                <h4>Saatva</h4>
                <h5>HTML, CSS, jQuery, Mobile optimization</h5>
                <a href="http://jonesvrajan.github.io/saatva/" target="_blank" class="btn btn-default">Visit Site</a> </figcaption>
              <!-- /figcaption --> 
            </figure>
            <!-- /figure --> 
          </div>
          <!-- /grid-mask --> 
        </div>
        <!-- /col -->
        <!-- PORTFOLIO IMAGE 7 -->
        <div class="col-md-4">
          <div class="grid mask">
            <figure> <img class="img-responsive" src="assets/img/portfolio/cinemit.jpg" alt="">
              <figcaption>
                <h4>Cinemit</h4>
                <h5>HTML, CSS, jQuery, Mobile optimization</h5>
                <a href="http://jonesvrajan.github.io/cinemit-html-responsive/" target="_blank" class="btn btn-default">Visit Site</a> </figcaption>
              <!-- /figcaption --> 
            </figure>
            <!-- /figure --> 
          </div>
          <!-- /grid-mask --> 
        </div> 
      </div>
      <!-- /row --> 
      </div>
  </div>
</div>
<!-- /container --> 

<!-- ==== TEAM MEMBERS ==== -->
<div id="team" name="team">
  <div class="container">
    <div class="row centered">
      <h2 class="centered">TESTIMONIALS</h2>
      <p class="info">Opinion about the work I have done with love for some really cool people around the globe.</p>
    
     
        <div id="testimonials" class="carousel slide" data-ride="carousel">
          <!-- Indicators 
          <ol class="carousel-indicators">
            <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
            <li data-target="#carousel-example-generic" data-slide-to="1"></li>
            <li data-target="#carousel-example-generic" data-slide-to="2"></li>
          </ol> -->

        <!-- Wrapper for slides -->
        <div class="carousel-inner" role="listbox">
          <div class="item active">
            <div class="centered"> <img class="img img-circle" src="https://media.licdn.com/mpr/mpr/shrinknp_100_100/p/8/005/034/1f2/07f2d83.jpg" height="80px" width="80px" alt="">
              <h4><strong>Harris P. </strong> - Technical Team Leader at ProBytes Software Pvt Ltd</h4>
              <p>" Jones is a good front end developer "</p>
              </div>
            </div>
                <div class="item">
             <div class="centered"> <img class="img img-circle" src="https://media.licdn.com/mpr/mpr/shrinknp_100_100/p/1/005/022/33b/37818cf.jpg" height="80" width="80px" alt="">
             <h4><strong>Ram Govind Narayan</strong> - Director at Xminds, Web and Mobile solutions dev house</h4>
              <p>" Jones is a fantastic person to work with. He is not only a loyal and innovative resource but also an inspiring person to work with. 

Jones is a responsible and a smart person with lots of knowledge in his field. If you ever need someone to deliver under pressure, no slip-ups, just results, Jones is your man!!!  "</p></div>
              </div>
              <div class="item">
             <div class="centered"> <img class="img img-circle" src="https://media.licdn.com/mpr/mpr/shrinknp_100_100/p/3/000/10d/1d8/225084b.jpg" height="80px" width="80px" alt="">
              <h4><strong>Sreejith M </strong> - Senior Software Engineer at Xminds</h4>
              <p>" Good designer and css fixer. "</p>
              </div>
            
              </div>
              <div class="item">
             <div class="centered"> <img class="img img-circle" src="https://media.licdn.com/mpr/mpr/shrinknp_100_100/p/3/005/072/271/0a330a5.jpg" height="80px" width="80px" alt="">
              <h4><strong>Benedict Sefa Ziorklui</strong> - Front-End Developer</h4>
               <p>" Jones was a fantastic person to work with. He is well educated, polite, result driven and a good team player who is always ready to provide help and support when needed. "</p></div>
              </div>
              <div class="item">
             <div class="centered"> <img class="img img-circle" src="https://media.licdn.com/mpr/mpr/shrinknp_100_100/p/5/005/087/3a0/0c88db0.jpg" height="80px" width="80px" alt="">
              <h4><strong>Arun VC</strong> - Chief Technology Officer at E-Team Informatica</h4>
              <p>" Jones is the best UI/UX Developer i know in India. He always delivers the best. He is hard working and passionate about his work. "</p>
             </div>
              </div>
          </div>

          <a class="left carousel-control" href="#testimonials" role="button" data-slide="prev">
                <span class="fa fa-chevron-left" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="right carousel-control" href="#testimonials" role="button" data-slide="next">
                <span class="fa fa-chevron-right" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </a>

        </div>



  </div>
  <!-- row --> 
</div>
<!-- container --> 
</div>

<!-- ==== CONTACT ==== -->
<div id="contact" name="contact" style="display: none">
  <div class="container">
    <div class="row">
      <h2 class="centered">CONTACT</h2>
      <p class="info">Need to talk about a big idea? Just message.</p>

    </div>
    <div class="row">
      <div class="col-lg-8 col-lg-offset-2 centered">
        <form id='contactus' action='<?php echo $formproc->GetSelfScript(); ?>' method='post' accept-charset='UTF-8'>
        <input type='hidden' name='submitted' id='submitted' value='1'/>
        <input type='hidden' name='<?php echo $formproc->GetFormIDInputName(); ?>' value='<?php echo $formproc->GetFormIDInputValue(); ?>'/>
        <input type='text' style="display: none;"  class='spmhidip' name='<?php echo $formproc->GetSpamTrapInputName(); ?>' />

        <div style="display: none;" class='short_explanation'>* required fields</div>

        <div><span style="display: block; width: 100%;top: 0; left: 0" class='error bg-danger'><p><?php echo $formproc->GetErrorMessage(); ?></p></span></div>
          <div class="row">
            <div class="col-xs-6 col-md-6 form-group">
              <input type='text' name='name' id='name' class="form-control" value='<?php echo $formproc->SafeDisplay('name') ?>' maxlength="50" placeholder="Name" />
            </div>
            <div class="col-xs-6 col-md-6 form-group">
              <input type='text' class="form-control" name='email' id='email' value='<?php echo $formproc->SafeDisplay('email') ?>' maxlength="50" placeholder="Email" />
            </div>
            <span id='contactus_email_errorloc' class='error'></span>
          </div>
          <textarea rows="10" cols="50" class="form-control" name='message' placeholder="Message" id='message'><?php echo $formproc->SafeDisplay('message') ?></textarea>
          <div class="row">
            <div class="col-xs-12 col-md-12">
               <input type='submit' class="btn btn btn-lg" name='Submit' value='Send Message' />
            </div>
          </div>
        </form>
        <!-- form --> 
      </div>
    </div>
    <!-- row --> 

  </div>
</div>
<!-- container -->

<div id="footerwrap">
  <div class="container">
    <div class="row">
      <div class="col-md-8"> <span class="copyright">Designed and Coded with love by <a href="http://jonesrajan.me/">Jones</a></span> </div>
      <div class="col-md-4">
        <ul class="list-inline social-buttons">
          <li><a href="https://twitter.com/jonesvrajan" target="_blank"><i class="fa fa-twitter"></i></a> </li>
          <li><a href="https://www.facebook.com/jonesvrajan" target="_blank"><i class="fa fa-facebook"></i></a> </li>
          <li><a href="https://plus.google.com/u/0/110025962607829690471/posts" target="_blank"><i class="fa fa-google-plus"></i></a> </li>
          <li><a href="https://in.linkedin.com/in/jonesrajan" target="_blank"><i class="fa fa-linkedin"></i></a> </li>
          <li><a href="https://github.com/jonesvrajan" target="_blank"><i class="fa fa-github"></i></a> </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Bootstrap core JavaScript
    ================================================== --> 
<!-- Placed at the end of the document so the pages load faster --> 
<script type="text/javascript" src="assets/js/jquery.min.js"></script>
<script type="text/javascript" src="assets/js/bootstrap.min.js"></script> 
<script type="text/javascript" src="assets/js/retina.js"></script> 
<script type="text/javascript" src="assets/js/jquery.easing.1.3.js"></script> 
<script type="text/javascript" src="assets/js/smoothscroll.js"></script> 
<script type="text/javascript" src="assets/js/jquery-func.js"></script>
<script src="assets/js/jquery.appear.js" type="text/javascript"></script>
    <script src="assets/js/custom.js" type="text/javascript"></script>
    <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-26413464-2', 'auto');
  ga('send', 'pageview');

</script>
</body>
</html>
