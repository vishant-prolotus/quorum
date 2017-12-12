$(function () {

    // List Items Limiter
    $(".list-items-limiter").length > 0 && $(".list-items-limiter").each(function () {
        $this = $(this);
        $ListChildrenLength = $this.children().length;
        $ListChildrenLength > 5 && $this.find("> li:gt(3)").hide().addClass("hidden-elements").end().append($('<li class="toggle-item"><a class="primary-btn full-width marT30"><span class="show-more">Show More</span><span class="show-less">Show Less</span></a><\/li>').click(function () {
            $(this).siblings(".hidden-elements").slideToggle().end().toggleClass("active")
        }))
    });

    $("#menuTrigger").on("click", function(){
        $("#main-navigation").slideToggle();
    });


    if($('.custom-scroller').length>0){
    $('.custom-scroller').scrollbar();
}

    // Calling Functions here
    TabNavigation();
    themeselectbox();
    ResponsiveTable();
    popup();
    Accordion();
});

function TabNavigation() {
   if ($(".tab-navigation").length > 0) {
       $("body").on("click", ".tab-link", function(){
           var $this = $(this);
           var $target = $this.data("tab");
           $this.closest(".tab-navigation").find(".tab-link").removeClass("active");
           $this.closest(".tab-navigation").find(".tab-pane").removeClass("active").hide();
           $this.addClass("active");
           $("#"+$target).addClass("active").show();
           if ($(".tab-navigation .theme-selectbox").length>0) {
               themeselectbox();
           }
       });
   } 
}

function themeselectbox() {
    if ($(".theme-selectbox").length > 0) {
    $(".theme-selectbox").select2({
            minimumResultsForSearch: Infinity/*,
        allowClear: true*/
        });
    }
}

function ResponsiveTable() {
    if ($(".responsive-table").length > 0) {
        $(".responsive-table tbody td").each(function (index) {
            cell = this.cellIndex;

            var ThValue = $(this).closest('table').find('th:eq(' + cell + ')').text();
            var dataLabelValue = "";

            if (ThValue !== "")
                dataLabelValue = ThValue;

            $(this).attr("data-label", dataLabelValue);
        });
    }
}

function popup() {
    $(".has-popup-trigger").on("click", ".popup-trigger", function() {
                var formPopup = $(this).data("popup");
                $(".site-popup").fadeOut();
                $(".fs-overlay").fadeIn();
                $("."+formPopup).fadeIn();
            });
            $(".fs-overlay, .site-popup .site-popup-close").on("click", function() {
                $(".fs-overlay").fadeOut();
                $(".site-popup").fadeOut();
            });
}

function Accordion() {

    if ($(".site-accordion").length > 0) {
        $('.site-accordion .accordion-block-content').hide();
        $('.site-accordion .accordion-block-heading').on("click", function () {
            var $trigger = $(this);

            if (!$trigger.hasClass('active')) {
                $('.site-accordion .accordion-block-heading').removeClass("active");

                $trigger.closest(".site-accordion").find(".accordion-block-content").stop(0, 0).slideUp();
                $trigger.addClass("active").next().stop(0, 0).slideDown();
            } else {
                $trigger.removeClass("active").next().stop(0, 0).slideUp();
            }

            return false;
        });

        if ($(".accordion-block-heading").hasClass("active-on-load")) {
            $(".accordion-block-heading.active-on-load").trigger("click");
        }
    }
}