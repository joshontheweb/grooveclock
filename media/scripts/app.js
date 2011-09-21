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
        return hours+':'+(minutes < 10 ? '0' : '') + minutes;
    }
    
    var $clock = $('.clock').text(formattedDate());
    var clockInterval = setInterval(function() {
        var date = new Date();
        $clock.text(formattedDate());
    }, 30000);

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
