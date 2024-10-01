AOS.init({
  duration: 800,
  easing: 'slide',
});

(function ($) {
  'use strict';

  $(window).stellar({
    responsive: true,
    parallaxBackgrounds: true,
    parallaxElements: true,
    horizontalScrolling: false,
    hideDistantElements: false,
    scrollProperty: 'scroll',
    horizontalOffset: 0,
    verticalOffset: 0,
  });

  // Scrollax
  $.Scrollax();

  var fullHeight = function () {
    $('.js-fullheight').css('height', $(window).height());
    $(window).resize(function () {
      $('.js-fullheight').css('height', $(window).height());
    });
  };
  fullHeight();

  // loader
  var loader = function () {
    setTimeout(function () {
      if ($('#ftco-loader').length > 0) {
        $('#ftco-loader').removeClass('show');
      }
    }, 1);
  };
  loader();

  // Scrollax
  $.Scrollax();

  var carousel = function () {
    // $('.home-slider').owlCarousel({
    //   loop: true,
    //   autoplay: true,
    //   margin: 0,
    //   animateOut: 'fadeOut',
    //   animateIn: 'fadeIn',
    //   nav: false,
    //   autoplayHoverPause: false,
    //   items: 1,
    //   navText: [
    //     "<span class='ion-md-arrow-back'></span>",
    //     "<span class='ion-chevron-right'></span>",
    //   ],
    //   responsive: {
    //     0: {
    //       items: 1,
    //       nav: false,
    //     },
    //     600: {
    //       items: 1,
    //       nav: false,
    //     },
    //     1000: {
    //       items: 1,
    //       nav: false,
    //     },
    //   },
    // });
    $('.carousel-work').owlCarousel({
      autoplay: true,
      center: true,
      loop: true,
      items: 1,
      margin: 30,
      stagePadding: 0,
      nav: true,
      navText: [
        '<span class="ion-ios-arrow-back">',
        '<span class="ion-ios-arrow-forward">',
      ],
      responsive: {
        0: {
          items: 1,
          stagePadding: 0,
        },
        600: {
          items: 2,
          stagePadding: 50,
        },
        1000: {
          items: 3,
          stagePadding: 100,
        },
      },
    });
  };
  carousel();

  $('nav .dropdown').hover(
    function () {
      var $this = $(this);
      // 	 timer;
      // clearTimeout(timer);
      $this.addClass('show');
      $this.find('> a').attr('aria-expanded', true);
      // $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
      $this.find('.dropdown-menu').addClass('show');
    },
    function () {
      var $this = $(this);
      // timer;
      // timer = setTimeout(function(){
      $this.removeClass('show');
      $this.find('> a').attr('aria-expanded', false);
      // $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
      $this.find('.dropdown-menu').removeClass('show');
      // }, 100);
    },
  );

  $('#dropdown04').on('show.bs.dropdown', function () {
    console.log('show');
  });

  // scroll
  var scrollWindow = function () {
    $(window).scroll(function () {
      var $w = $(this),
        st = $w.scrollTop(),
        navbar = $('.ftco_navbar'),
        sd = $('.js-scroll-wrap');

      if (st > 150) {
        if (!navbar.hasClass('scrolled')) {
          navbar.addClass('scrolled');
        }
      }
      if (st < 150) {
        if (navbar.hasClass('scrolled')) {
          navbar.removeClass('scrolled sleep');
        }
      }
      if (st > 350) {
        if (!navbar.hasClass('awake')) {
          navbar.addClass('awake');
        }

        if (sd.length > 0) {
          sd.addClass('sleep');
        }
      }
      if (st < 350) {
        if (navbar.hasClass('awake')) {
          navbar.removeClass('awake');
          navbar.addClass('sleep');
        }
        if (sd.length > 0) {
          sd.removeClass('sleep');
        }
      }
    });
  };
  scrollWindow();

  var counter = function () {
    $('#section-counter').waypoint(
      function (direction) {
        if (
          direction === 'down' &&
          !$(this.element).hasClass('ftco-animated')
        ) {
          var comma_separator_number_step =
            $.animateNumber.numberStepFactories.separator(',');
          $('.number').each(function () {
            var $this = $(this),
              num = $this.data('number');
            console.log(num);
            $this.animateNumber(
              {
                number: num,
                numberStep: comma_separator_number_step,
              },
              7000,
            );
          });
        }
      },
      { offset: '95%' },
    );
  };
  counter();

  var contentWayPoint = function () {
    var i = 0;
    $('.ftco-animate').waypoint(
      function (direction) {
        if (
          direction === 'down' &&
          !$(this.element).hasClass('ftco-animated')
        ) {
          i++;

          $(this.element).addClass('item-animate');
          setTimeout(function () {
            $('body .ftco-animate.item-animate').each(function (k) {
              var el = $(this);
              setTimeout(
                function () {
                  var effect = el.data('animate-effect');
                  if (effect === 'fadeIn') {
                    el.addClass('fadeIn ftco-animated');
                  } else if (effect === 'fadeInLeft') {
                    el.addClass('fadeInLeft ftco-animated');
                  } else if (effect === 'fadeInRight') {
                    el.addClass('fadeInRight ftco-animated');
                  } else {
                    el.addClass('fadeInUp ftco-animated');
                  }
                  el.removeClass('item-animate');
                },
                k * 50,
                'easeInOutExpo',
              );
            });
          }, 100);
        }
      },
      { offset: '95%' },
    );
  };
  contentWayPoint();

  // navigation

  var OnePageNav = function () {
    $(".smoothscroll[href^='#'], #ftco-nav ul li a[href^='#']").on(
      'click',
      function (e) {
        e.preventDefault();

        var hash = this.hash,
          navToggler = $('.navbar-toggler');
        $('html, body').animate(
          {
            scrollTop: $(hash).offset().top,
          },
          700,
          'easeInOutExpo',
          function () {
            window.location.hash = hash;
          },
        );

        if (navToggler.is(':visible')) {
          navToggler.click();
        }
      },
    );
    $('body').on('activate.bs.scrollspy', function () {
      console.log('nice');
    });
  };
  OnePageNav();

  // magnific popup
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: true,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      verticalFit: true,
    },
    zoom: {
      enabled: true,
      duration: 300, // don't foget to change the duration also in CSS
    },
  });

  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false,
  });

  $('.appointment_date').datepicker({
    format: 'm/d/yyyy',
    autoclose: true,
  });

  $('.appointment_time').timepicker();
})(jQuery);

// =======================================
// popup js starts here
// =======================================
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const popup = document.getElementById('loginPopup');
  const closeBtn = document.querySelector('.close');

  loginBtn.onclick = function () {
    popup.style.display = 'block';
  };

  closeBtn.onclick = function () {
    popup.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target == popup) {
      popup.style.display = 'none';
    }
  };
});

var galleryThumbs = new Swiper('.gallery-thumbs', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: '2',
  // coverflowEffect: {
  //   rotate: 50,
  //   stretch: 0,
  //   depth: 100,
  //   modifier: 1,
  //   slideShadows : true,
  // },

  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 50,
    modifier: 6,
    slideShadows: false,
  },
});

var galleryTop = new Swiper('.swiper-container.testimonial', {
  speed: 400,
  spaceBetween: 50,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  direction: 'vertical',
  pagination: {
    clickable: true,
    el: '.swiper-pagination',
    type: 'bullets',
  },
  thumbs: {
    swiper: galleryThumbs,
  },
});

//   =================================================
//STAR RATING JS HERE
// ===================================================
// document.querySelectorAll('.star-rating input').forEach(input => {
//     input.addEventListener('change', () => {
//         console.log(`Rated ${input.value} stars`);
//     });
// });
// slide one to another slide
var stars = new StarRating('.star-rating');

// silde to another deface slider
$('.box').click(function () {
  $('.box').removeClass('active');
  $(this).addClass('active');
});

// defac list owl carasoul js
$('.owl-carousel.defac-list-owl').owlCarousel({
  loop: true,
  margin: 10,
  nav: true,
  dots: false, // Add this line to disable dots
  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 2,
    },
    1000: {
      items: 2,
    },
  },
});

// ===online offline toogle buttn js strst here
const toggleButton = document.getElementById('toggleButton');

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    toggleButton.classList.toggle('online');
    toggleButton.classList.toggle('offline');

    if (toggleButton.classList.contains('online')) {
      toggleButton.textContent = 'Online';
      // Add online functionality here
    } else {
      toggleButton.textContent = 'Offline';
      // Add offline functionality here
    }
  });
}

// js for multiple selection
// In your Javascript (external .js resource or <script> tag)
$(document).ready(function () {
  $('.js-example-basic-single').select2({
    placeholder: 'Select Category',
  });
});

// =======================================
// CUSTOM MODAL
// =======================================
//input#member_image file input name
jQuery('input#add-profilePicUrl').on('change', function () {
  if (this.files && this.files[0]) {
    let image = this;

    var reader = new FileReader();
    reader.onload = function (e) {
      jQuery('#defac-photo').attr('src', e.target.result); //img tag id
      createCloseButton('#defac-photo', 'input#add-profilePicUrl');
    };
    reader.readAsDataURL(this.files[0]);
  }
});

jQuery('input#add-coverPicUrl').on('change', function () {
  let image = this;
  if (this.files && this.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      jQuery('#defac-cover-photo').attr('src', e.target.result);
      createCloseButton('#defac-cover-photo', 'input#add-coverPicUrl');
    };
    reader.readAsDataURL(this.files[0]);
  }
});

function createCloseButton(imageSelector, inputSelector) {
  // Remove existing close button if any

  jQuery(imageSelector).closest('.uploaded-image');
  var defaulImage = jQuery(imageSelector).attr('ref');
  // Create close button
  var closeButton = jQuery('<button class="close-btn">X</button>');

  // Append close button to container
  jQuery(imageSelector).closest('.uploaded-image').append(closeButton);

  // Attach click event to close button
  closeButton.on('click', function () {
    if (defaulImage) {
      jQuery(imageSelector).attr('src', defaulImage);
    }
    jQuery(inputSelector).val('');
    jQuery(this).remove();
  });
}
