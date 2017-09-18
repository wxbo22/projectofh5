// Loading Page Start
$({
	property: 0
}).animate({
	property: 100
}, {
	duration: 3000,
	step: function () {
		var percentage = Math.round(this.property);

		$('#progress').css('width', percentage + "%");

		if (percentage == 100) {
			$("#progress").addClass("done"); //完成，隐藏进度条
			$(".cx-loading").remove();
		}
	}
});
// Loading Page end



// 首页滑动加载动画开始

$(function ($) {
	var times = 300;
	$(".top-logo").on("inview", function () {
		var $this = $(this);
		$this.off("inview");
		setTimeout(function () {
			$this.removeClass("w_hidden")
				.addClass("animated bounceInLeft")
		}, times);
	});

	$(".top-right-img").on("inview", function () {
		var $this = $(this);
		$this.off("inview");
		setTimeout(function () {
			$this.removeClass("w_hidden")
				.addClass("animated bounceInRight")
		}, 600);
		setTimeout(function () {
			$this.removeClass("animated bounceInRight")
				.addClass("tree")
		}, 2000);
	});

	$(".top-bird").on("inview", function () {
		var $this = $(this);
		$this.off("inview");
		setTimeout(function () {
			$this.removeClass("w_hidden")
				.addClass("animated fadeIn")
		}, times);
		setTimeout(function () {
			$this.removeClass("animated fadeIn");
			birdAnimate($this);
		}, 2000);
	});

	$(".middle-ome").on("inview", function () {
		var $this = $(this);
		$this.off("inview");
		setTimeout(function () {
			$this.removeClass("w_hidden")
				.addClass("animated bounceInDown");
			getMiddle(".middle-ome", false);
		}, 600);
		setTimeout(function () {
			$this.removeClass("animated bounceInDown")
				.addClass("picanimate");
		}, 1800);

	});


});


function birdAnimate(obj) {
	if (obj.position().left < $(document).width() - 80 && obj.position().left >= -80) {
		obj.animate({
			left: '100%'
		}, 12000, function () {
			obj.addClass('birdTurn');
			birdAnimate(obj);
		});
	} else if (obj.position().left < 0) {
		obj.animate({
			left: '100%'
		}, 12000, function () {
			obj.addClass('birdTurn');
			birdAnimate(obj);
		});
	} else if (obj.position().left >= $(document).width() - 80) {
		obj.animate({
			left: '-80px'
		}, 12000, function () {
			obj.removeClass('birdTurn');
			birdAnimate(obj);
		});
	}
}

function getMiddle(objName, bool) {
	var objH = $(objName).height(),
		wH = $(document).height();
	var mh = parseInt(wH / 2) - parseInt(objH / 2);
	$(objName).css('margin-top', mh);
	if (bool) {
		var objW = $(objName).width(),
			wW = $(document).width();
		var mw = parseInt(wW / 2) - parseInt(objW / 2);
		$(objName).css('margin-left', mw);
	}
}

//inview
(function ($) {
	var inviewObjects = {},
		viewportSize, viewportOffset,
		d = document,
		w = window,
		documentElement = d.documentElement,
		expando = $.expando;

	$.event.special.inview = {
		add: function (data) {
			inviewObjects[data.guid + "-" + this[expando]] = {
				data: data,
				$element: $(this)
			};
		},

		remove: function (data) {
			try {
				delete inviewObjects[data.guid + "-" + this[expando]];
			} catch (e) {}
		}
	};

	function getViewportSize() {
		var mode, domObject, size = {
			height: w.innerHeight,
			width: w.innerWidth
		};

		// if this is correct then return it. iPad has compat Mode, so will
		// go into check clientHeight/clientWidth (which has the wrong value).
		if (!size.height) {
			mode = d.compatMode;
			if (mode || !$.support.boxModel) { // IE, Gecko
				domObject = mode === 'CSS1Compat' ?
					documentElement : // Standards
					d.body; // Quirks
				size = {
					height: domObject.clientHeight,
					width: domObject.clientWidth
				};
			}
		}

		return size;
	}

	function getViewportOffset() {
		return {
			top: w.pageYOffset || documentElement.scrollTop || d.body.scrollTop,
			left: w.pageXOffset || documentElement.scrollLeft || d.body.scrollLeft
		};
	}

	function checkInView() {
		var $elements = $(),
			elementsLength, i = 0;

		$.each(inviewObjects, function (i, inviewObject) {
			var selector = inviewObject.data.selector,
				$element = inviewObject.$element;
			$elements = $elements.add(selector ? $element.find(selector) : $element);
		});

		elementsLength = $elements.length;
		if (elementsLength) {
			viewportSize = viewportSize || getViewportSize();
			viewportOffset = viewportOffset || getViewportOffset();

			for (; i < elementsLength; i++) {
				// Ignore elements that are not in the DOM tree
				if (!$.contains(documentElement, $elements[i])) {
					continue;
				}

				var $element = $($elements[i]),
					elementSize = {
						height: $element.height(),
						width: $element.width()
					},
					elementOffset = $element.offset(),
					inView = $element.data('inview'),
					visiblePartX,
					visiblePartY,
					visiblePartsMerged;

				// Don't ask me why because I haven't figured out yet:
				// viewportOffset and viewportSize are sometimes suddenly null in Firefox 5.
				// Even though it sounds weird:
				// It seems that the execution of this function is interferred by the onresize/onscroll event
				// where viewportOffset and viewportSize are unset
				if (!viewportOffset || !viewportSize) {
					return;
				}

				if (elementOffset.top + elementSize.height > viewportOffset.top &&
					elementOffset.top < viewportOffset.top + viewportSize.height &&
					elementOffset.left + elementSize.width > viewportOffset.left &&
					elementOffset.left < viewportOffset.left + viewportSize.width) {
					visiblePartX = (viewportOffset.left > elementOffset.left ?
						'right' : (viewportOffset.left + viewportSize.width) < (elementOffset.left + elementSize.width) ?
						'left' : 'both');
					visiblePartY = (viewportOffset.top > elementOffset.top ?
						'bottom' : (viewportOffset.top + viewportSize.height) < (elementOffset.top + elementSize.height) ?
						'top' : 'both');
					visiblePartsMerged = visiblePartX + "-" + visiblePartY;
					if (!inView || inView !== visiblePartsMerged) {
						$element.data('inview', visiblePartsMerged).trigger('inview', [true, visiblePartX, visiblePartY]);
					}
				} else if (inView) {
					$element.data('inview', false).trigger('inview', [false]);
				}
			}
		}
	}

	$(w).bind("scroll resize", function () {
		viewportSize = viewportOffset = null;
	});

	// IE < 9 scrolls to focused elements without firing the "scroll" event
	if (!documentElement.addEventListener && documentElement.attachEvent) {
		documentElement.attachEvent("onfocusin", function () {
			viewportOffset = null;
		});
	}

	// Use setInterval in order to also make sure this captures elements within
	// "overflow:scroll" elements or elements that appeared in the dom tree due to
	// dom manipulation and reflow
	// old: $(window).scroll(checkInView);
	//
	// By the way, iOS (iPad, iPhone, ...) seems to not execute, or at least delays
	// intervals while the user scrolls. Therefore the inview event might fire a bit late there
	setInterval(checkInView, 250);
})(jQuery);
// 首页滑动加载动画结束

$(function () {
	$(".middle-ome img").on("singleTap", function () {
		if($(this).parent().hasClass("animation-pause")){
			$(this).parent().removeClass("animation-pause");			
		} else {
			$(this).parent().addClass("animation-pause");						
		}
	});
});