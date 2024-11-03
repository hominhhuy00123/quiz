$(function () {
    "use strict";
    var windowW = $(window).width();
    var windowH = $(window).height();
    var headerHeight = $('header').outerHeight();


    // Explore page
    $('.explore.sidebar').css({
        'height': 'calc(100vh - ' + headerHeight + 'px)',
        'position': 'fixed',
        'bottom': headerHeight
    });
    $('.explore .barExpand').css({
        'position': 'fixed',
        'bottom': headerHeight,
        'top': '0'

    });

    // Location page
    var hSidebar = $('.bar-inner').outerHeight();
    $('.poi-options').css({
        'height': 'calc(100vh - ' + headerHeight + 'px)',
        'bottom': headerHeight
    });
    $('.poi-options .togglecollapse').css({
        'height': hSidebar,
        'position': 'fixed',
        'bottom': headerHeight,
        'top': headerHeight
    });

    // Modal bottom style
    if (headerHeight > 0) {
        $('.modal-bottom-cs').css({
            'bottom': headerHeight + 15
        });
    } else {
        $('.modal-bottom-cs').css({
            'bottom': 15
        });
    }

    function getToogleAptBot() {
        $('.warp-searchbar').css({
            'bottom': headerHeight + 15
        });
        $('.wrapCheckMatrix').css({
            'bottom': headerHeight + 15
        });
        $('.searchbar').css({
            'height': 'calc(70vh - ' - headerHeight + '15px)',
            'bottom': headerHeight + 15
        });
        $('.warp-resultbar').css({
            'height': 'calc(70vh - ' - headerHeight + '15px)',
            'bottom': headerHeight + 15
        });
        $('.wrapCheckMatrix').css({
            'bottom': headerHeight + 15
        });
        $('.wrapCheckMatrix .availability_matrix').css({
            'bottom': headerHeight + 15,
        });
        $('.wrapCheckMatrix .js_show_availability_matrix').css({
            'bottom': 'calc(72vh + ' + headerHeight + 'px)',
        });
        if (windowW <= 991 && windowW > windowH) {
            $('.wrapCheckMatrix .js_show_availability_matrix').css({
                'top': '1rem',
                'bottom': 'unset',
            });
        }
    }

    function clickToResult() {
        if (windowW <= 991) {
            $('.js_to_result').click(function () {
                $('.warp-resultbar').show();
            });
        }
    }

    getToogleAptBot();
    clickToResult();
    $(window).on('load resize orientationchange', function () {
        getToogleAptBot();
        clickToResult();
    })
    
    // Slider use for the same setting
    var owlSlideshow = $('.js-slideshow-carousel');
    owlSlideshow.owlCarousel({
        loop: false,
        touchDrag: true,
        mouseDrag: true,
        margin: 0,
        //stagePadding: 0,
        nav: true,
        items: 1,
        dots: false,
        autoplay: false,
        animateOut: 'fadeOut',
        autoplayTimeout: 3500,
        navText: [
            '<span class="backIcon btnRounded bg-white ml-2"><i class="fa fa-arrow-left"></i></span>',
            '<span class="backIcon btnRounded bg-white ml-2"><i class="fa fa-arrow-right"></i></span>'
        ]
    });

    //Menu Mobile
    $("#nav-icon").click(function (event) {
        $(this).toggleClass('open');
        $('.navbar').toggleClass('open');
    });

    $(document).on('click','.btn-search-ab, #fullSearchBtn', function (e) {
        e.preventDefault();
        $('.warp-resultbar').show();
        $('.warp-searchbar').removeClass('togglecollapse');
    });

    //btn-sidebar filter explore page
    function showSideBar(show) {
        if (show) {
            $('.btn-sidebar').hide();
            $('.sidebar').addClass('active');
        }
        else {
            $('.sidebar').removeClass('active');
            setTimeout(function () { $('.btn-sidebar').show(); }, 500);
        }
    }
    $('.btn-hidebar').click(function (e) {
        e.preventDefault();
        showSideBar(false);
    });
    $('.btn-sidebar').click(function (e) {
        e.preventDefault();
        showSideBar(true);
    });

    // Toggle the side navigation account page
    $("body").on('click', ".js_sidebarToggle, .menu-wrapper-overlay", function (e) {
        $("body").toggleClass("sidebar-toggled");
        if ($(".menu-wrapper-overlay").length == 0) {
            $("body").append('<div class="menu-wrapper-overlay"  data-toggle="collapse" data-target="#navbarResponsive"></div>');
        } else {
            $(".menu-wrapper-overlay").remove();
        }
    });
    $("body").on('click', '.menu-wrapper-overlay', function (e) {
        $("body").removeClass("sidebar-toggled");
        $(this).remove();
    });
    $("body").on('click', ".manage-sidebar .nav-item", function (e) {
        $("body").removeClass("sidebar-toggled");
        $('.menu-wrapper-overlay').remove();
        $('.navbar-collapse.collapse').removeClass('show');
    });

    $("body").on('click', '.custom-bs-dropdowns .dropdown-menu', function (event) {
        event.stopPropagation();
    });

    window.addEventListener("orientationchange", function (event) {
        if ($('.menu-wrapper-overlay').length > 0 && $(window).width() > 1000) {
            $(".navbar-close-toggler").click();
        }
    });

    AOS.init({
        offset: 200,
        duration: 600,
        easing: 'ease-in-sine',

        disable: function () {
            var maxWidth = 1024;
            return window.innerWidth < maxWidth;
        }
    });

});
