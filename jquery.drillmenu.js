/*   Author: Christopher Hayes
	Date: 	10/11/2012
	
	Purpose: This is a jQuery plugin designed to provide a sexy drilldown menu optimized for touch enabled mobile devices.
*/

;(function( $ ) {
	var _getLastCrumb = function() {
		return $($.drillmenu.settings.breadcrumbs).children().last();
	};
	
	var _getFirstCrumb = function() {
		return $($.drillmenu.settings.breadcrumbs).children().first();
	};
	
	var _getCrumbSize = function() {
		return $($.drillmenu.settings.breadcrumbs).children().length;
	};
	
	var _hideSubLists = function(x) {
		if (x == null) { return }
		x.find('ul').hide();
	}
	
	var _getNav = function() {
		return $($.drillmenu.settings.nav);
	}
	
	var _addPercent = function(value, add) {
		var int = parseInt(value);
		int += add;
		return '' + int + '%';
	}
	
	var _subPercent = function(value, sub) {
		return _addPercent(value, sub * -1);
	}
	
	var _calcPercent = function(width, left) {
		var leftInt = parseInt(left);
		var widthInt = parseInt(width);
		if (leftInt == 0) {
			return 0;
		}
		else {
			return Math.round(leftInt / widthInt) * 100;
		}
	}
	
	$.drillmenu = function(obj) {
		
	}
	
	$.drillmenu.push = function(x, event) {
		$li = x.parent();
		$ul = $li.find('> ul').first();
		
		if ($ul.children().length > 0) {			
			$.drillmenu.activateCrumb(_getLastCrumb());
			$.drillmenu.addCrumb(x.text(), $ul);
			
			$ul.show();
			$nav = _getNav();
			$nav.animate({'left':_subPercent(_calcPercent($nav.width(), $nav.css('left')), 100)}, 400, function() { jQuery($.drillmenu.settings.breadcrumbs).slideDown(300, 'easeOutQuart'); });
			
			event.preventDefault();
		}
	};
	
	$.drillmenu.pop = function(x, event) {
		var index = $($.drillmenu.settings.breadcrumbs).children().index(x.parent());
		var popSize = _getCrumbSize() - index - 1;
		for (var i=0; i<popSize; i++) {
			_getLastCrumb().detach();
		}
		
		$ul = x.parent().data('ul');
		$.drillmenu.deactivateCrumb(x.parent());
		$nav = _getNav();
		$nav.animate({'left':_addPercent(_calcPercent($nav.width(), $nav.css('left')), popSize * 100)}, 400, function() { _hideSubLists($ul); });
		
		if (_getCrumbSize() == 1) {
			$($.drillmenu.settings.breadcrumbs).slideUp(300);
		}
	};
	
	$.drillmenu.addCrumb = function(text, ul) {
		$crumb = $('<li>').html(text);
		$crumb.data('ul', ul);
		$($.drillmenu.settings.breadcrumbs).append($crumb);
	};
	
	$.drillmenu.activateCrumb = function(crumb) {
		$a = $('<a href="#">'+crumb.text()+'</a>');
		$a.click(function(e) {
			$.drillmenu.pop($(this), e);
		});
		crumb.empty().append($a);
	};
	
	$.drillmenu.deactivateCrumb = function(crumb) {
		crumb.html(crumb.text());
	};
	
	$.drillmenu.reset = function() {
		$nav = _getNav();
		$nav.css('left', '0%');
		_hideSubLists($nav);
		
		var popSize = _getCrumbSize() - 1;
		for (var i=0; i<popSize; i++) {
			_getLastCrumb().detach();
		}
	}

	$.fn.drillmenu = function(options) {
		$.drillmenu.settings = $.extend( {
			'nav' 			: '.nav',
			'breadcrumbs' 	: '.breadcrumbs'
		}, options);
		
		return this.each(function() {
			$top = $(this).find($.drillmenu.settings.nav).first();
			$.drillmenu.addCrumb('Top', $top);
			_hideSubLists($top);
			$top.find('li a').click(function(e) {
				$.drillmenu.push($(this), e);
				return true;
			});
		});
	};
})( jQ_1_9 );
