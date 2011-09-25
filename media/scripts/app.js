/* 
* Skeleton V1.0.2
* Copyright 2011, Dave Gamache
* www.getskeleton.com
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 5/20/2011
*/	


$(document).ready(function() {

    var Time = function(date) {
        this.handleArgs(arguments);
        this.toMeridiumTime();
    }

    Time.prototype.handleArgs = function(args) {
        date = args[0] ? args[0] : new Date();
        if (date instanceof Date) {
            this.date = date;
            this.hour = this.date.getHours();
            this.minute = this.date.getMinutes();
            this.ampm = this.hour > 11 ? 'pm' : 'am';
        } else {
            $.extend(this, date);
        }
    }
    
    Time.prototype.toHtml = function() {
        return (this.hour < 10 ? '<span class="invisible">0</span>'+this.hour : this.hour)+'<span class="colon">:</span>'+(this.minute < 10 ? '0' : '') + this.minute;
    }

    Time.prototype.toJSON = function() {
        var json = {};
        var self = this;
        var key;
        for (key in this) {
            if (this.hasOwnProperty(key)) {
                json[key] = this[key];
            }
        }
        return json;
    }

    Time.prototype.toMeridiumTime = function() {
        var hour = (this.hour > 12 ? this.hour - 12 : this.hour);
        this.hour = hour ? hour : 12;
    }

    Time.prototype.toMilitaryTime = function(date) {
        date = date ? date : new Date();
        this.hour = date.getHours();
    }

    Time.prototype.toString = function() {
        var minute = this.minute < 10 ? '0' + this.minute : this.minute
        return ''+this.hour + minute + this.ampm;
    }

    var getAlarmTime = function() {
        var $alarm = $('.set-alarm');
        var hour = $alarm.find('.hour').val();
        var minute = $alarm.find('.minute').val();
        var ampm = $alarm.find('.ampm').val();

        return new Time({hour: hour, minute: minute, ampm: ampm})
    }

    var getCurrentTime = function() {
        var time = new Time();
        return time;
    }

    var playSong = function() {
       var embed = $('<object width="250" height="40"><param name="movie" value="http://grooveshark.com/songWidget.swf" /><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="hostname=cowbell.grooveshark.com&playlistID=60018582&style=metal&p=1" /><embed src="http://grooveshark.com/songWidget.swf" type="application/x-shockwave-flash" width="250" height="40" flashvars="hostname=cowbell.grooveshark.com&playlistID=60018582&style=metal&p=0" allowScriptAccess="always" wmode="window" /></object>');

       $('.container').append(embed);
    }


    var time = new Time();
    var $clock = $('.clock').html(time.toHtml());
    var date = new Date();
    var clockInterval = setInterval(function() {
        var newDate = new Date();
        if (date.getMinutes() != newDate.getMinutes()) { 
            
            if (getCurrentTime().toString() == getAlarmTime().toString()) {
                playSong()
            }

            date = newDate;
            var time = new Time(newDate);
            var $clock = $('.clock').first();
            var $newClock = $('<div class="clock">'+ time.toHtml() +'</div>');
            $('.clock-wrapper').append($newClock.html(time.toHtml()));
            $clock.animate({'opacity': 0}, 500, function() {
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
