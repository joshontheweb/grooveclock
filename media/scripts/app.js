/* 
* Skeleton V1.0.2
* Copyright 2011, Dave Gamache
* www.getskeleton.com
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 5/20/2011
*/	


$(document).ready(function() {

    var formattedDate = function() {
        var date = new Date();
        minutes = date.getMinutes();
        var hours = date.getHours();
        hours = (hours > 12 ? hours - 12 : hours);
        hours = hours ? hours : 12;
        return hours+'<span class="colon">:</span>'+(minutes < 10 ? '0' : '') + minutes;
    }
    var $clock = $('.clock').html(formattedDate());
    var date = new Date();
    var clockInterval = setInterval(function() {
        var newDate = new Date();
        if (date.getMinutes() != newDate.getMinutes()) { 
            date = newDate;
            var $clock = $('.clock').first();
            var $newClock = $('<div class="clock">'+ formattedDate() +'</div>');
            $('.clock-wrapper').append($newClock.html(formattedDate()));
            $clock.animate({'font-size': 175, 'opacity': 0}, 500, function() {
                $clock.remove();
                $clock = $newClock;
            });
        }

        $('.colon').toggleClass('on')
        

    }, 1000);
    // var formattedDate = function() {
        //     var date = new Date();
        //     minutes = date.getMinutes();
        //     var hours = date.getHours();
        //     hours = (hours > 12 ? hours - 12 : hours);
        //     hours = hours ? hours : 12;
        //     return hours+':'+(minutes < 10 ? '0' : '') + minutes;
        // }
        // 
        // var $clock = $('.clock').text(formattedDate());
        // var clockInterval = setInterval(function() {
        //     var date = new Date();
        //     var $newClock = $('<div class="clock">'+ formattedDate() +'</div>');
        //     $clock.fadeOut(5000, function() {
        //         $clock.remove();
        //     });
        // 
        //     $('.clock-wrapper').append($newClock.text(formattedDate()));
        //     $clock.text(formattedDate());
        // }, 5000);
    
    

	/* Tabs Activiation
	================================================== */
	var tabs = $('ul.tabs');
	
	tabs.each(function(i) {
		//Get all tabs
		var tab = $(this).find('> li > a');
		tab.click(function(e) {
			
			//Get Location of tab's content
			var contentLocation = $(this).attr('href') + "Tab";
			
			//Let go if not a hashed one
			if(contentLocation.charAt(0)=="#") {
			
				e.preventDefault();
			
				//Make Tab Active
				tab.removeClass('active');
				$(this).addClass('active');
				
				//Show Tab Content & add active class
				$(contentLocation).show().addClass('active').siblings().hide().removeClass('active');
				
			} 
		});
	}); 
	
});
