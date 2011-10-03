/* 
* Skeleton V1.0.2
* Copyright 2011, Dave Gamache
* www.getskeleton.com
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 5/20/2011
*/	

// underscore template languate settings
_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g, // {{ var }}
    evaluate: /\{\%(.+?)\%\}/g // {% expression %}
};

$.fn.typeItOut = function(options, callback) {
    return this.each(function() {
        $this = $(this);
        settings = {
            text: null,
            interval: 100
        };

        _.extend(settings, options);


        var i = 0;
        var intervalID = setInterval(function() {
            if (i < settings.text.length) {
                $this.text($this.text() + settings.text[i]);
                i++
            } else {
                clearInterval(intervalID);
                if(_.isFunction(callback)) { callback(); }
            }
        }, settings.interval);
        
        return this;
    });
}

$(document).ready(function() {

    var socket = io.connect('', {port: 8000});

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
            this.meridium = this.hour > 11 ? 'pm' : 'am';
        } else {
            $.extend(this, date);
        }
    }
    
    Time.prototype.toHtml = function() {
        return (this.hour < 10 ? '<span class="invisible">0</span>'+this.hour : this.hour)+'<span class="colon">:</span>'+(this.minute < 10 ? '0' : '') + this.minute+'<div class="meridium '+this.meridium+'"><div class="am">am</div><div class="pm">pm</div></div>';
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
        return ''+this.hour + minute + this.meridium;
    }

    var getAlarmTime = function() {
        var $alarm = $('.set-alarm');
        var hour = $alarm.find('.hour').val();
        var minute = $alarm.find('.minute').val();
        var meridium = $alarm.find('.ampm').val();

        return new Time({hour: hour, minute: minute, meridium: meridium})
    }

    var getCurrentTime = function() {
        var time = new Time();
        return time;
    }

    var playSong = function() {
        var songID = $('.songs-to-play li').first().attr('id');
       var embed = $('<object width="250" height="40"><param name="movie" value="http://grooveshark.com/songWidget.swf" /><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="hostname=cowbell.grooveshark.com&songID='+songID+'&style=metal&p=1" /><embed src="http://grooveshark.com/songWidget.swf" type="application/x-shockwave-flash" width="250" height="40" flashvars="hostname=cowbell.grooveshark.com&songID='+songID+'&style=metal&p=0" allowScriptAccess="always" wmode="window" /></object>');

       $('.container').append(embed);
    }


    var time = new Time();
    var $clock = $('.digits .lit').html(time.toHtml());
    var date = new Date();
    var clockInterval = setInterval(function() {
        var newDate = new Date();
        if (date.getMinutes() != newDate.getMinutes()) { 
            
            if (getCurrentTime().toString() == getAlarmTime().toString()) {
                playSong()
            }

            date = newDate;
            var time = new Time(newDate);
            var $clock = $('.digits .lit').first();
            var $newClock = $('<div class="lit">'+ time.toHtml() +'</div>');
            $('.digits').append($newClock.html(time.toHtml()));
            $clock.animate({'opacity': 0}, 500, function() {
                $clock.remove();
                $clock = $newClock;
            });
        }

        $('.colon').toggleClass('on')
        

    }, 1000);

    $('.day').click(function() {
        $(this).toggleClass('off');
    });

    var showSearch = function(callback) {
        $('.center-display > div').not('.search').animate({'opacity': 0}, function() {
            $(this).hide();
        });
        $('.center-display .search').css('display', 'block').animate({'opacity': 1}, callback);
    }

    var showDigits = function(callback) {
        $('.center-display > div').not('.digits').animate({'opacity': 0}, function() {
            $(this).hide();
            $('.search .title').text('');
        });
        $('.center-display .digits').css('display', 'block').animate({'opacity': 1}, callback);
    }

    var searchInit = function (callback) {
        $('.search .title').typeItOut({text: 'What song? '}, callback);
        $('.search-input').trigger('select');
    }
        
    $('.title').click(function(e) {
        e.preventDefault();
        var $digitsWrapper = $('.digits');
        
        
        +$digitsWrapper.css('opacity') ? showSearch(searchInit) : showDigits();

    });
 

    $('.search-input').keypress(function(e) {
        if (typeof searchTimeout !== 'undefined') { clearTimeout(searchTimeout); };
        searchTimeout = setTimeout(function() {
            var query = $('.search-input').val();
            socket.emit('search', {query: query});
        }, 300);
    });

    var $results = $('.search-results');
    var $songsToPlay =  $('.songs-to-play');
    $results.delegate('li', 'click', function(e) {
        e.preventDefault();
        $songsToPlay.append($(this).clone());
    });

    $songsToPlay.delegate('li', 'click', function(e) {
        e.preventDefault();
        var $el = $(this);
        $el.addClass('invisible')
            .animate({'margin-left': '-'+($el.width() + 20)}, function() {
                $el.remove();
            });
    });

    socket.on('searchResponse', function(data) {
        var template = _.template($('.search-results-template').html());
        var $rendered = $(template({results: data}));
        $results.html($rendered);
        $rendered.animate({'opacity': 1});
    });



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
