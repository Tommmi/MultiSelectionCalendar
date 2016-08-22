(function() {
	'use strict';
	var $asm = {};
	global.MultiSelectionCalendar = global.MultiSelectionCalendar || {};
	ss.initAssembly($asm, 'multiselectioncalendar');
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.DayField
	var $MultiSelectionCalendar_$DayField = function(id, xIdx, yIdx, date, currentClass) {
		this.$1$IdField = 0;
		this.$1$XIdxField = 0;
		this.$1$YIdxField = 0;
		this.$1$DateField = new Date(0);
		this.$1$TdElementField = null;
		this.$dayFieldClass = null;
		this.$1$DivElementField = null;
		this.$1$IsMouseEventBoundField = false;
		this.set_$id(id);
		this.set_$xIdx(xIdx);
		this.set_$yIdx(yIdx);
		this.set_$date(date);
		this.$dayFieldClass = currentClass;
	};
	$MultiSelectionCalendar_$DayField.__typeName = 'MultiSelectionCalendar.$DayField';
	$MultiSelectionCalendar_$DayField.$ctor1 = function(id, xIdx, yIdx, date, currentClass) {
		this.$1$IdField = 0;
		this.$1$XIdxField = 0;
		this.$1$YIdxField = 0;
		this.$1$DateField = new Date(0);
		this.$1$TdElementField = null;
		this.$dayFieldClass = null;
		this.$1$DivElementField = null;
		this.$1$IsMouseEventBoundField = false;
		this.set_$id(id);
		this.set_$xIdx(xIdx);
		this.set_$yIdx(yIdx);
		this.set_$date(date);
		this.$dayFieldClass = new $MultiSelectionCalendar_$DayFieldClassAttribute(currentClass);
	};
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.DayFieldClassAttribute
	var $MultiSelectionCalendar_$DayFieldClassAttribute = function(classValue) {
		this.$1$IsSelectedMonthField = false;
		this.$1$IsEnabledDayField = false;
		this.$1$SelectionIdxField = 0;
		if (ss.isNullOrUndefined(classValue)) {
			return;
		}
		this.set_$isSelectedMonth(ss.startsWithString(classValue, 'cm'));
		this.set_$isEnabledDay(classValue.indexOf('e') !== -1);
		if (classValue.length > 3) {
			if (classValue.charCodeAt(classValue.length - 2) === 115) {
				this.set_$selectionIdx(parseInt(String.fromCharCode(classValue.charCodeAt(classValue.length - 1))));
			}
		}
	};
	$MultiSelectionCalendar_$DayFieldClassAttribute.__typeName = 'MultiSelectionCalendar.$DayFieldClassAttribute';
	$MultiSelectionCalendar_$DayFieldClassAttribute.$ctor1 = function(isSelectedMonth, isEnabledDay, selectionIdx) {
		this.$1$IsSelectedMonthField = false;
		this.$1$IsEnabledDayField = false;
		this.$1$SelectionIdxField = 0;
		this.set_$isSelectedMonth(isSelectedMonth);
		this.set_$isEnabledDay(isEnabledDay);
		this.set_$selectionIdx(selectionIdx);
	};
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.Program
	var $MultiSelectionCalendar_$Program = function() {
	};
	$MultiSelectionCalendar_$Program.__typeName = 'MultiSelectionCalendar.$Program';
	$MultiSelectionCalendar_$Program.$main = function() {
		$MultiSelectionCalendar_MultiSelectionCalendar.init();
	};
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.Calendar
	var $MultiSelectionCalendar_Calendar = function() {
	};
	$MultiSelectionCalendar_Calendar.__typeName = 'MultiSelectionCalendar.Calendar';
	$MultiSelectionCalendar_Calendar.getDateRangesFromString = function(timeRanges) {
		var ranges = [];
		if (ss.isNullOrUndefined(timeRanges)) {
			ranges.push(new $MultiSelectionCalendar_Range(new Date(1940, 1 - 1, 1), new Date(2100, 1 - 1, 1), 0));
			return ranges;
		}
		var $t1 = timeRanges.split(String.fromCharCode(59));
		for (var $t2 = 0; $t2 < $t1.length; $t2++) {
			var part = $t1[$t2];
			var rangeText = part;
			var selectionIdx = { $: 0 };
			if (rangeText.length > 1) {
				if (rangeText.charCodeAt(1) === 58) {
					ss.Int32.tryParse(String.fromCharCode(rangeText.charCodeAt(0)), selectionIdx);
					rangeText = rangeText.substring(2);
				}
			}
			var dates = rangeText.split(String.fromCharCode(45));
			if (dates.length === 2) {
				var start = $MultiSelectionCalendar_Calendar.$parseExact(dates[0], 'dd.MM.yyyy');
				var end = $MultiSelectionCalendar_Calendar.$parseExact(dates[1], 'dd.MM.yyyy');
				if (ss.isValue(start) && ss.isValue(end)) {
					ranges.push(new $MultiSelectionCalendar_Range(ss.unbox(start), ss.unbox(end), selectionIdx.$));
				}
			}
		}
		return ranges;
	};
	$MultiSelectionCalendar_Calendar.getStringFromDateRanges = function(ranges) {
		var buf = new ss.StringBuilder();
		var firstTime = true;
		for (var $t1 = 0; $t1 < ranges.length; $t1++) {
			var range = ranges[$t1];
			if (firstTime) {
				firstTime = false;
			}
			else {
				buf.append(';');
			}
			buf.append(range.get_selectionIdx());
			buf.append(':');
			buf.append($MultiSelectionCalendar_Calendar.$dateToString(range.get_start(), 'dd.MM.yyyy'));
			buf.append('-');
			buf.append($MultiSelectionCalendar_Calendar.$dateToString(range.get_end(), 'dd.MM.yyyy'));
		}
		return buf.toString();
	};
	$MultiSelectionCalendar_Calendar.$parseExact = function(date, format) {
		return ss.parseExactDate(date, format);
	};
	$MultiSelectionCalendar_Calendar.$dateToString = function(date, format) {
		return ss.formatDate(date, format);
	};
	global.MultiSelectionCalendar.Calendar = $MultiSelectionCalendar_Calendar;
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.MultiSelectionCalendar
	var $MultiSelectionCalendar_MultiSelectionCalendar = function(calendarId) {
		this.$1$CalendarIdField = 0;
		this.$1$CalendarRootElementField = null;
		this.$_currentEnabledRangesAsString = null;
		this.$_currentValueOfInputElement = null;
		this.$_dayFields = [];
		this.$_enabledRanges = null;
		this.$_endSelectionField = null;
		this.$_eventsBoundAfterCalenderInitialized = false;
		this.$_eventsBoundAfterMonthNavigation = false;
		this.$_firstDayOfActiveMonth = new Date(0);
		this.$1$InputElementField = null;
		this.$_isMouseInsideCalendar = false;
		this.$_isSelectionModeOn = false;
		this.$_lastEnteredDayField = null;
		this.$_mousePosY = 0;
		this.$_rowHeight = 0;
		this.$_scrollerIsRunning = false;
		this.$_startSelectionField = null;
		this.$_tBody = null;
		this.$_weekSelectionModeActive = null;
		this.set_$calendarId(calendarId);
	};
	$MultiSelectionCalendar_MultiSelectionCalendar.__typeName = 'MultiSelectionCalendar.MultiSelectionCalendar';
	$MultiSelectionCalendar_MultiSelectionCalendar.init = function() {
		$MultiSelectionCalendar_MultiSelectionCalendarResource.set_currentLanguageIsoCode($MultiSelectionCalendar_MultiSelectionCalendar.$getLanguageIsoCodeFromHiddenInputEelement());
		$MultiSelectionCalendar_MultiSelectionCalendar.$_weekdayNames = [$MultiSelectionCalendar_MultiSelectionCalendarResource.get_monday(), $MultiSelectionCalendar_MultiSelectionCalendarResource.get_tuesday(), $MultiSelectionCalendar_MultiSelectionCalendarResource.get_wednesday(), $MultiSelectionCalendar_MultiSelectionCalendarResource.get_thursday(), $MultiSelectionCalendar_MultiSelectionCalendarResource.get_friday(), $MultiSelectionCalendar_MultiSelectionCalendarResource.get_saturday(), $MultiSelectionCalendar_MultiSelectionCalendarResource.get_sunday()];
		var inputElements = $('input.multiSelectionCalendar');
		var calendarId = 0;
		var $t1 = inputElements.get();
		for (var $t2 = 0; $t2 < $t1.length; $t2++) {
			var inputElement = $t1[$t2];
			var inputDom = ss.cast(inputElement, ss.isValue(inputElement) && (ss.isInstanceOfType(inputElement, Element) && inputElement.tagName === 'INPUT'));
			var calendarIdx = calendarId++;
			var calendar = new $MultiSelectionCalendar_MultiSelectionCalendar(calendarIdx);
			$MultiSelectionCalendar_MultiSelectionCalendar.$calendars.push(calendar);
			calendar.$modifyHtml(inputDom);
			var calendarDomElement = ss.cast(inputDom.parentElement, ss.isValue(inputDom.parentElement) && (ss.isInstanceOfType(inputDom.parentElement, Element) && inputDom.parentElement.tagName === 'DIV'));
			calendar.set_$calendarRootElement(calendarDomElement);
			calendar.set_$inputElement(inputDom);
			calendar.$updateEnableStatusOfMonthNavigation();
			calendar.$updateDayFieldsMap();
			calendar.$bindEvents(true);
		}
	};
	$MultiSelectionCalendar_MultiSelectionCalendar.getDateRangesFromString = function(timeRanges) {
		return $MultiSelectionCalendar_Calendar.getDateRangesFromString(timeRanges);
	};
	$MultiSelectionCalendar_MultiSelectionCalendar.getStringFromDateRanges = function(ranges) {
		return $MultiSelectionCalendar_Calendar.getStringFromDateRanges(ranges);
	};
	$MultiSelectionCalendar_MultiSelectionCalendar.$appendLin = function(text, formattedText, args) {
		text.appendLine(ss.formatString.apply(null, [formattedText].concat(args)));
	};
	$MultiSelectionCalendar_MultiSelectionCalendar.$getLanguageIsoCodeFromHiddenInputEelement = function() {
		var firstInputElement = Enumerable.from($('input.multiSelectionCalendar').get()).select(function(x) {
			return ss.cast(x, Object);
		}).firstOrDefault(null, ss.getDefaultValue(Object));
		if (ss.isValue(firstInputElement)) {
			return ss.coalesce(firstInputElement.getAttribute('language'), '');
		}
		return '';
	};
	$MultiSelectionCalendar_MultiSelectionCalendar.$getNameOfMonth = function(month) {
		switch (month) {
			case 1: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_january();
			}
			case 2: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_february();
			}
			case 3: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_march();
			}
			case 4: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_april();
			}
			case 5: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_may();
			}
			case 6: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_june();
			}
			case 7: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_july();
			}
			case 8: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_august();
			}
			case 9: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_september();
			}
			case 10: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_october();
			}
			case 11: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_november();
			}
			case 12: {
				return $MultiSelectionCalendar_MultiSelectionCalendarResource.get_december();
			}
			default: {
				return month.toString();
			}
		}
	};
	$MultiSelectionCalendar_MultiSelectionCalendar.$isInRanges = function(ranges, date) {
		return Enumerable.from(ranges).any(function(r) {
			return date >= r.get_start() && date <= r.get_end();
		});
	};
	global.MultiSelectionCalendar.MultiSelectionCalendar = $MultiSelectionCalendar_MultiSelectionCalendar;
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.MultiSelectionCalendarResource
	var $MultiSelectionCalendar_MultiSelectionCalendarResource = function() {
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.__typeName = 'MultiSelectionCalendar.MultiSelectionCalendarResource';
	$MultiSelectionCalendar_MultiSelectionCalendarResource.$getString = function(key) {
		if (typeof(global.MultiSelectionCalendar.Strings[$MultiSelectionCalendar_MultiSelectionCalendarResource.get_currentLanguageIsoCode()]) != 'undefined') {
			var text = global.MultiSelectionCalendar.Strings[$MultiSelectionCalendar_MultiSelectionCalendarResource.get_currentLanguageIsoCode()][key];
			if (ss.isValue(text)) {
				return text;
			}
		}
		var txt = global.MultiSelectionCalendar.Strings['default'][key];
		return txt;
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_currentLanguageIsoCode = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$1$CurrentLanguageIsoCodeField;
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.set_currentLanguageIsoCode = function(value) {
		$MultiSelectionCalendar_MultiSelectionCalendarResource.$1$CurrentLanguageIsoCodeField = value;
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_april = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('april');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_august = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('august');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_december = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('december');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_february = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('february');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_friday = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('friday');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_hintNextMonth = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('hintnextmonth');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_hintPreviousMonth = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('hintpreviousmonth');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_january = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('january');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_july = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('july');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_june = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('june');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_march = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('march');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_may = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('may');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_monday = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('monday');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_november = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('november');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_october = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('october');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_saturday = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('saturday');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_september = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('september');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_sunday = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('sunday');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_thursday = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('thursday');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_tuesday = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('tuesday');
	};
	$MultiSelectionCalendar_MultiSelectionCalendarResource.get_wednesday = function() {
		return $MultiSelectionCalendar_MultiSelectionCalendarResource.$getString('wednesday');
	};
	global.MultiSelectionCalendar.MultiSelectionCalendarResource = $MultiSelectionCalendar_MultiSelectionCalendarResource;
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.Position
	var $MultiSelectionCalendar_Position = function(x, y) {
		this.$1$XField = 0;
		this.$1$YField = 0;
		this.set_x(x);
		this.set_y(y);
	};
	$MultiSelectionCalendar_Position.__typeName = 'MultiSelectionCalendar.Position';
	global.MultiSelectionCalendar.Position = $MultiSelectionCalendar_Position;
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.Range
	var $MultiSelectionCalendar_Range = function(start, end, selectionIdx) {
		this.$1$StartField = new Date(0);
		this.$1$EndField = new Date(0);
		this.$1$SelectionIdxField = 0;
		this.set_start(new Date(start.getFullYear(), start.getMonth(), start.getDate()));
		this.set_end(new Date(end.getFullYear(), end.getMonth(), end.getDate()));
		this.set_selectionIdx(selectionIdx);
	};
	$MultiSelectionCalendar_Range.__typeName = 'MultiSelectionCalendar.Range';
	global.MultiSelectionCalendar.Range = $MultiSelectionCalendar_Range;
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.Rectangle
	var $MultiSelectionCalendar_Rectangle = function(top, right, bottom, left) {
		this.$1$TopField = 0;
		this.$1$RightField = 0;
		this.$1$BottomField = 0;
		this.$1$LeftField = 0;
		this.set_top(top);
		this.set_right(right);
		this.set_bottom(bottom);
		this.set_left(left);
	};
	$MultiSelectionCalendar_Rectangle.__typeName = 'MultiSelectionCalendar.Rectangle';
	global.MultiSelectionCalendar.Rectangle = $MultiSelectionCalendar_Rectangle;
	ss.initClass($MultiSelectionCalendar_$DayField, $asm, {
		get_$id: function() {
			return this.$1$IdField;
		},
		set_$id: function(value) {
			this.$1$IdField = value;
		},
		get_$xIdx: function() {
			return this.$1$XIdxField;
		},
		set_$xIdx: function(value) {
			this.$1$XIdxField = value;
		},
		get_$yIdx: function() {
			return this.$1$YIdxField;
		},
		set_$yIdx: function(value) {
			this.$1$YIdxField = value;
		},
		get_$date: function() {
			return this.$1$DateField;
		},
		set_$date: function(value) {
			this.$1$DateField = value;
		},
		get_$tdElement: function() {
			return this.$1$TdElementField;
		},
		set_$tdElement: function(value) {
			this.$1$TdElementField = value;
		},
		get_$currentClass: function() {
			return this.$dayFieldClass.toString();
		},
		set_$currentClass: function(value) {
			this.$dayFieldClass = new $MultiSelectionCalendar_$DayFieldClassAttribute(value);
		},
		get_$divElement: function() {
			return this.$1$DivElementField;
		},
		set_$divElement: function(value) {
			this.$1$DivElementField = value;
		},
		get_$isEnabled: function() {
			return this.$dayFieldClass.get_$isEnabledDay();
		},
		get_$isMouseEventBound: function() {
			return this.$1$IsMouseEventBoundField;
		},
		set_$isMouseEventBound: function(value) {
			this.$1$IsMouseEventBoundField = value;
		},
		get_$selectionIdx: function() {
			return this.$dayFieldClass.get_$selectionIdx();
		}
	});
	$MultiSelectionCalendar_$DayField.$ctor1.prototype = $MultiSelectionCalendar_$DayField.prototype;
	ss.initClass($MultiSelectionCalendar_$DayFieldClassAttribute, $asm, {
		get_$isSelectedMonth: function() {
			return this.$1$IsSelectedMonthField;
		},
		set_$isSelectedMonth: function(value) {
			this.$1$IsSelectedMonthField = value;
		},
		get_$isEnabledDay: function() {
			return this.$1$IsEnabledDayField;
		},
		set_$isEnabledDay: function(value) {
			this.$1$IsEnabledDayField = value;
		},
		get_$selectionIdx: function() {
			return this.$1$SelectionIdxField;
		},
		set_$selectionIdx: function(value) {
			this.$1$SelectionIdxField = value;
		},
		toString: function() {
			return (this.get_$isSelectedMonth() ? 'cm' : 'om') + (this.get_$isEnabledDay() ? 'e' : 'd') + ((this.get_$selectionIdx() > 0) ? ('s' + this.get_$selectionIdx()) : '');
		}
	});
	$MultiSelectionCalendar_$DayFieldClassAttribute.$ctor1.prototype = $MultiSelectionCalendar_$DayFieldClassAttribute.prototype;
	ss.initClass($MultiSelectionCalendar_$Program, $asm, {});
	ss.initClass($MultiSelectionCalendar_Calendar, $asm, {});
	ss.initClass($MultiSelectionCalendar_MultiSelectionCalendar, $asm, {
		get_$calendarId: function() {
			return this.$1$CalendarIdField;
		},
		set_$calendarId: function(value) {
			this.$1$CalendarIdField = value;
		},
		get_$calendarRootElement: function() {
			return this.$1$CalendarRootElementField;
		},
		set_$calendarRootElement: function(value) {
			this.$1$CalendarRootElementField = value;
		},
		get_$inputElement: function() {
			return this.$1$InputElementField;
		},
		set_$inputElement: function(value) {
			this.$1$InputElementField = value;
		},
		$addOldSelectedDateRanges: function(selectedRanges) {
			var oldSelectionRanges = this.$getSelectedRangesFromInputElement(this.get_$inputElement());
			var $t1 = this.$_dayFields[0].get_$date();
			var firstVisibleDay = new Date($t1.getFullYear(), $t1.getMonth(), $t1.getDate());
			var $t2 = Enumerable.from(this.$_dayFields).last().get_$date();
			var lastVisibleDay = new Date($t2.getFullYear(), $t2.getMonth(), $t2.getDate());
			for (var $t3 = 0; $t3 < oldSelectionRanges.length; $t3++) {
				var oldSelectionRange = oldSelectionRanges[$t3];
				var startDate = oldSelectionRange.get_start();
				var endDate = oldSelectionRange.get_end();
				if (startDate >= firstVisibleDay) {
					if (startDate <= lastVisibleDay) {
						startDate = Saltarelle.Utils.DateTimeExtension.addDaysSafe(lastVisibleDay, 1);
					}
				}
				else if (endDate >= firstVisibleDay) {
					endDate = Saltarelle.Utils.DateTimeExtension.addDaysSafe(firstVisibleDay, -1);
					if (endDate > lastVisibleDay) {
						selectedRanges.push(new $MultiSelectionCalendar_Range(Saltarelle.Utils.DateTimeExtension.addDaysSafe(lastVisibleDay, 1), endDate, oldSelectionRange.get_selectionIdx()));
					}
				}
				if (endDate >= startDate) {
					selectedRanges.push(new $MultiSelectionCalendar_Range(startDate, endDate, oldSelectionRange.get_selectionIdx()));
				}
			}
		},
		$appendAdditionalRowsToBody: function() {
			var lastGeneratedDayField = Enumerable.from(this.$_dayFields).last();
			var startDate = Saltarelle.Utils.DateTimeExtension.addDaysSafe(lastGeneratedDayField.get_$date(), 1);
			var startId = lastGeneratedDayField.get_$id() + 1;
			var html = new ss.StringBuilder();
			this.$writeTDs(html, startDate, this.$getSelectedRangesFromInputElement(this.get_$inputElement()), startId);
			var tbody = this.$getTBody();
			tbody.append(html.toString());
			this.$updateDayFieldsMap();
			this.$bindEvents(false);
		},
		$bindEvents: function(updateBodyOfTable) {
			if (!this.$_eventsBoundAfterMonthNavigation) {
				var previousMonthLink = this.$getPrevMonthLink();
				var nextMonthLink = this.$getNextMonthLink();
				if ($(previousMonthLink).hasClass('enabled')) {
					$(previousMonthLink).on('click', ss.mkdel(this, function(ev) {
						this.$onMonthNavigateClicked(ev, false);
					}));
				}
				if ($(nextMonthLink).hasClass('enabled')) {
					$(nextMonthLink).on('click', ss.mkdel(this, function(ev1) {
						this.$onMonthNavigateClicked(ev1, true);
					}));
				}
				this.$_eventsBoundAfterMonthNavigation = true;
			}
			if (!this.$_eventsBoundAfterCalenderInitialized) {
				var calendar = $(this.get_$calendarRootElement());
				$(window).on('mouseup', ss.mkdel(this, this.$onMouseUp));
				$(window).on('mousemove', ss.mkdel(this, this.$onMouseMove));
				$(window).on('dragend', ss.mkdel(this, this.$onMouseUp));
				calendar.on('dragstart', ss.mkdel(this, this.$onDragStart));
				calendar.on('mousewheel', ss.mkdel(this, this.$onMouseWheel));
				var $t4 = this.get_$inputElement();
				var $t1 = { ntype: 38, type: Element, name: 'elem' };
				var $t2 = { typeDef: Element, name: 'Value', type: 16, returnType: String, getter: { typeDef: Element, name: 'get_Value', type: 8, params: [], returnType: String, fget: 'value' }, setter: { typeDef: Element, name: 'set_Value', type: 8, params: [String], returnType: Object, fset: 'value' }, fname: 'value' };
				var $t3 = { ntype: 23, type: $t2.returnType, expression: $t1, member: $t2 };
				Saltarelle.Utils.StaticReflection.hookSetterOfProperty(Object, String).call(null, $t4, { ntype: 18, type: Function, returnType: $t3.type, body: $t3, params: [$t1] }, ss.mkdel(this, this.$onInputValueChanged));
				this.$_eventsBoundAfterCalenderInitialized = true;
			}
			var allEnabledDayFields = Enumerable.from(this.$_dayFields).where(function(dayField) {
				return dayField.get_$isEnabled() && !dayField.get_$isMouseEventBound();
			}).toArray();
			if (updateBodyOfTable) {
				this.$_tBody = $('tBody', this.get_$calendarRootElement());
				this.$_tBody.on('mouseleave', ss.mkdel(this, this.$onMouseLeaveFromCalendar));
				this.$_tBody.on('mouseenter', ss.mkdel(this, this.$onMouseEnterIntoCalendar));
			}
			for (var $t5 = 0; $t5 < allEnabledDayFields.length; $t5++) {
				var dayField1 = { $: allEnabledDayFields[$t5] };
				var td = dayField1.$.get_$tdElement();
				td.on('mousedown', ss.mkdel({ dayField1: dayField1, $this: this }, function(ev2) {
					this.$this.$onMouseDownInField(ev2, this.dayField1.$);
				}));
				// td.On("mouseenter", ev => OnMouseEnterInField(dayField));
				dayField1.$.set_$isMouseEventBound(true);
			}
		},
		$calcScrollAnimationTime: function(scrollHeightPx, downScroll) {
			var maxSpeedRowsPerSecond = 6;
			var minSpeedRowsPerSecond = 1;
			var mouseDistanceToCalendar;
			if (downScroll) {
				mouseDistanceToCalendar = this.$_mousePosY - this.$getBottomBorderOfCalendar();
			}
			else {
				mouseDistanceToCalendar = this.$getCalendarTop() - this.$_mousePosY;
			}
			var speed = minSpeedRowsPerSecond + ss.Int32.div((maxSpeedRowsPerSecond - minSpeedRowsPerSecond) * mouseDistanceToCalendar, 400);
			if (speed < minSpeedRowsPerSecond) {
				speed = minSpeedRowsPerSecond;
			}
			else if (speed > maxSpeedRowsPerSecond) {
				speed = maxSpeedRowsPerSecond;
			}
			var time = ss.Int32.trunc(ss.round(1000 * scrollHeightPx / this.$getRowHeight() / speed));
			return time;
		},
		$doForEachDayField: function(onDayField) {
			var startField = this.$_startSelectionField;
			var endField = this.$_endSelectionField;
			var selectionIdx = this.$getSelectionIdxFromInputField();
			if (this.$_isSelectionModeOn) {
				// if selection started with younger days
				if (startField.get_$id() > endField.get_$id()) {
					// correct interval so that start < end
					startField = endField;
					endField = this.$_startSelectionField;
				}
			}
			else {
				startField = new $MultiSelectionCalendar_$DayField.$ctor1(1, 1, 1, new Date(), '');
				endField = new $MultiSelectionCalendar_$DayField.$ctor1(0, 0, 0, new Date(), '');
			}
			// for each day field
			var $t1 = Enumerable.from(this.$_dayFields).where(function(val) {
				return val.get_$isEnabled();
			}).getEnumerator();
			try {
				while ($t1.moveNext()) {
					var dayField = $t1.current();
					var isFieldInsideSelection;
					// if we want to select just week days
					if (ss.isValue(this.$_weekSelectionModeActive) && ss.unbox(this.$_weekSelectionModeActive)) {
						isFieldInsideSelection = dayField.get_$xIdx() >= startField.get_$xIdx() && dayField.get_$xIdx() <= endField.get_$xIdx() && dayField.get_$yIdx() >= startField.get_$yIdx() && dayField.get_$yIdx() <= endField.get_$yIdx();
					}
					else {
						isFieldInsideSelection = dayField.get_$id() >= startField.get_$id() && dayField.get_$id() <= endField.get_$id();
					}
					if (isFieldInsideSelection) {
						var visibleClass = dayField.get_$divElement().attr('class');
						var isActiveMonth = dayField.get_$date().getMonth() + 1 === this.$_firstDayOfActiveMonth.getMonth() + 1 && dayField.get_$date().getFullYear() === this.$_firstDayOfActiveMonth.getFullYear();
						// calculate the correct class attribute value
						var classValue = (new $MultiSelectionCalendar_$DayFieldClassAttribute.$ctor1(isActiveMonth, true, selectionIdx)).toString();
						onDayField(dayField, visibleClass, classValue, true);
					}
					else {
						var visibleClass1 = dayField.get_$divElement().attr('class');
						onDayField(dayField, visibleClass1, dayField.get_$currentClass(), false);
					}
				}
			}
			finally {
				$t1.dispose();
			}
		},
		$finalizeSelection: function() {
			if (!this.$_isSelectionModeOn) {
				return;
			}
			if (ss.referenceEquals(this.$_startSelectionField, this.$_endSelectionField)) {
				var dayField = this.$_startSelectionField;
				var selectionIdx = this.$getSelectionIdxFromInputField();
				var dayWasSelected = dayField.$dayFieldClass.get_$selectionIdx() === selectionIdx;
				if (dayWasSelected) {
					dayField.$dayFieldClass.set_$selectionIdx(0);
					dayField.get_$divElement().attr('class', dayField.get_$currentClass());
				}
				else {
					dayField.$dayFieldClass.set_$selectionIdx(selectionIdx);
					dayField.get_$divElement().attr('class', dayField.get_$currentClass());
				}
			}
			else {
				this.$doForEachDayField(function(dayField1, currentClass, newClass, isInSelection) {
					dayField1.set_$currentClass(newClass);
				});
			}
			this.$saveNewSelectedRangeStringInHiddenInput();
			this.$_isSelectionModeOn = false;
			this.$_weekSelectionModeActive = null;
			this.$_startSelectionField = null;
			this.$_endSelectionField = null;
		},
		$getBodyHeight: function() {
			var countRows = ss.Int32.div(this.$_dayFields.length, 7);
			var rowHeight = this.$getRowHeight();
			return countRows * rowHeight;
		},
		$getBottomBorderOfCalendar: function() {
			var calendarJq = $(this.get_$calendarRootElement());
			var calendarTop = calendarJq.offset().top;
			return calendarTop + calendarJq.outerHeight();
		},
		$getCalendarTop: function() {
			var calendarJq = $(this.get_$calendarRootElement());
			var title = $('.title', this.get_$calendarRootElement());
			var head = $('thead', this.get_$calendarRootElement());
			return calendarJq.offset().top + title.outerHeight() + head.outerHeight();
		},
		$getCurrentScrollY: function() {
			return this.$getTBody().scrollTop();
		},
		$getDayField: function(id) {
			return Enumerable.from(this.$_dayFields).firstOrDefault(function(d) {
				return d.get_$id() === id;
			}, ss.getDefaultValue($MultiSelectionCalendar_$DayField));
		},
		$getFirstEnabledDay: function() {
			var firstEnabledRange = Enumerable.from(this.$_enabledRanges).orderBy(function(r) {
				return r.get_start();
			}).firstOrDefault(null, ss.getDefaultValue($MultiSelectionCalendar_Range));
			if (ss.isNullOrUndefined(firstEnabledRange)) {
				return new Date(1940, 1 - 1, 1);
			}
			return firstEnabledRange.get_start();
		},
		$getFirstSelectedDay: function(inputElement) {
			var selectedRanges = this.$getSelectedRangesFromInputElement(inputElement);
			var firstSelectedRange = Enumerable.from(selectedRanges).orderBy(function(r) {
				return r.get_start();
			}).firstOrDefault(null, ss.getDefaultValue($MultiSelectionCalendar_Range));
			if (ss.isNullOrUndefined(firstSelectedRange)) {
				return new Date();
			}
			return firstSelectedRange.get_start();
		},
		$getHtmlOfTable: function(inputDomElement) {
			this.$_currentEnabledRangesAsString = inputDomElement.getAttribute('enabledRanges');
			this.$_enabledRanges = $MultiSelectionCalendar_MultiSelectionCalendar.getDateRangesFromString(this.$_currentEnabledRangesAsString);
			var firstSelectedDay = this.$getFirstSelectedDay(inputDomElement);
			this.$_firstDayOfActiveMonth = new Date(firstSelectedDay.getFullYear(), firstSelectedDay.getMonth() + 1 - 1, 1);
			var html = new ss.StringBuilder();
			this.$writeTemplateOfPicker(html, inputDomElement);
			var htmlTxt = html.toString();
			return htmlTxt;
		},
		$getLastEnabledDay: function() {
			var lastEnabledRange = Enumerable.from(this.$_enabledRanges).orderByDescending(function(r) {
				return r.get_end();
			}).firstOrDefault(null, ss.getDefaultValue($MultiSelectionCalendar_Range));
			if (ss.isNullOrUndefined(lastEnabledRange)) {
				return new Date(2100, 1 - 1, 1);
			}
			return lastEnabledRange.get_end();
		},
		$getNextMonthLink: function() {
			var $t1 = $('a.nextMonth', this.get_$calendarRootElement()).get(0);
			return ss.cast($t1, ss.isValue($t1) && (ss.isInstanceOfType($t1, Element) && $t1.tagName === 'A'));
		},
		$getPrevMonthLink: function() {
			var $t1 = $('a.previousMonth', this.get_$calendarRootElement()).get(0);
			return ss.cast($t1, ss.isValue($t1) && (ss.isInstanceOfType($t1, Element) && $t1.tagName === 'A'));
		},
		$getRowHeight: function() {
			if (this.$_rowHeight === 0) {
				this.$_rowHeight = $('td', this.get_$calendarRootElement()).first().outerHeight();
			}
			return this.$_rowHeight;
		},
		$getSelectionIdxFromInputField: function() {
			var selectionIdxTxt = this.get_$inputElement().getAttribute('selectionIdx');
			var selectionIdx = {};
			ss.Int32.tryParse(selectionIdxTxt, selectionIdx);
			return selectionIdx.$;
		},
		$getSelectionIdxOfDay: function(dateofDay, selectedRanges) {
			var date = new Date(dateofDay.getFullYear(), dateofDay.getMonth(), dateofDay.getDate());
			var firstFoundRange = Enumerable.from(selectedRanges).firstOrDefault(function(r) {
				return date >= r.get_start() && date <= r.get_end();
			}, ss.getDefaultValue($MultiSelectionCalendar_Range));
			if (ss.isNullOrUndefined(firstFoundRange)) {
				return 0;
			}
			return firstFoundRange.get_selectionIdx();
		},
		$getSelectedRangesFromInputElement: function(inputElement) {
			this.$_currentValueOfInputElement = inputElement.value;
			return $MultiSelectionCalendar_MultiSelectionCalendar.getDateRangesFromString(inputElement.value);
		},
		$getTBody: function() {
			return this.$_tBody;
		},
		$getWeekDay: function(weekDay) {
			return $MultiSelectionCalendar_MultiSelectionCalendar.$_weekdayNames[weekDay];
		},
		$getViewportHeightOfBody: function() {
			var calendarJq = $(this.get_$calendarRootElement());
			var title = $('.title', this.get_$calendarRootElement());
			var head = $('thead', this.get_$calendarRootElement());
			return calendarJq.innerHeight() - title.outerHeight() - head.outerHeight();
		},
		$modifyHtml: function(inputDomElement) {
			var parentElement = ss.safeCast(inputDomElement.parentElement, ss.isValue(inputDomElement.parentElement) && (ss.isInstanceOfType(inputDomElement.parentElement, Element) && inputDomElement.parentElement.tagName === 'DIV'));
			if (ss.isNullOrUndefined(parentElement)) {
				throw new ss.Exception('input element must have a <div> element as parent !');
			}
			var parentElementJq = $(parentElement);
			parentElementJq.addClass('multiSelectionCalendar');
			parentElementJq.attr('calendarId', this.get_$calendarId().toString());
			var inputElementJq = $(inputDomElement);
			inputElementJq.removeClass('multiSelectionCalendar');
			inputElementJq.addClass('hidden');
			var htmlTxt = this.$getHtmlOfTable(inputDomElement);
			parentElementJq.append(htmlTxt);
		},
		$onDragStart: function(e) {
			e.preventDefault();
		},
		$onInputValueChanged: function(newValue) {
			if (ss.referenceEquals(this.$_currentValueOfInputElement, newValue)) {
				return;
			}
			this.$regenerateTable();
		},
		$onMonthNavigateClicked: function(e, wantsNextMonth) {
			var html = new ss.StringBuilder();
			var $t1 = $('.picker', this.get_$calendarRootElement()).get(0);
			var picker = ss.cast($t1, ss.isValue($t1) && (ss.isInstanceOfType($t1, Element) && $t1.tagName === 'DIV'));
			this.$_firstDayOfActiveMonth = new Date(this.$_firstDayOfActiveMonth.getFullYear(), this.$_firstDayOfActiveMonth.getMonth() + (wantsNextMonth ? 1 : -1), this.$_firstDayOfActiveMonth.getDate(), this.$_firstDayOfActiveMonth.getHours(), this.$_firstDayOfActiveMonth.getMinutes(), this.$_firstDayOfActiveMonth.getSeconds(), this.$_firstDayOfActiveMonth.getMilliseconds());
			this.$writeTemplateOfPicker(html, this.get_$inputElement());
			var pickerJq = $(picker);
			pickerJq.replaceWith(html.toString());
			this.$_eventsBoundAfterMonthNavigation = false;
			this.$updateEnableStatusOfMonthNavigation();
			this.$updateDayFieldsMap();
			this.$bindEvents(true);
		},
		$onMouseDownInField: function(e, dayField) {
			if (e.button === 0) {
				this.$_isSelectionModeOn = true;
				this.$_startSelectionField = dayField;
				this.$_endSelectionField = dayField;
				this.$updateSelection();
			}
		},
		$onMouseEnterIntoCalendar: function(e) {
			this.$_isMouseInsideCalendar = true;
			this.$stopScroll();
		},
		$onMouseMove: function(e) {
			var x = e.pageX;
			var y = e.pageY;
			this.$_mousePosY = y;
			var tBody = this.$getTBody();
			var offset = tBody.offset();
			var pos = new $MultiSelectionCalendar_Position(offset.left, offset.top);
			var visiblePortRect = new $MultiSelectionCalendar_Rectangle(pos.get_y(), pos.get_x() + tBody.width(), pos.get_y() + tBody.height(), pos.get_x());
			if (visiblePortRect.get_width() === 0) {
				return;
			}
			var scrollPos = this.$getCurrentScrollY();
			var weekNb = ss.Int32.div((x - visiblePortRect.get_left()) * 7, visiblePortRect.get_width());
			if (weekNb < 0) {
				weekNb = 0;
			}
			else if (weekNb > 6) {
				weekNb = 6;
			}
			if (y > visiblePortRect.get_bottom() - 10) {
				y = visiblePortRect.get_bottom() - 10;
			}
			else if (y < visiblePortRect.get_top() + 10) {
				y = visiblePortRect.get_top() + 10;
			}
			var rowNb = ss.Int32.div(y - visiblePortRect.get_top() + scrollPos, this.$getRowHeight());
			if (rowNb < 0) {
				rowNb = 0;
			}
			else if (rowNb > ss.Int32.div(this.$_dayFields.length, 7)) {
				rowNb = ss.Int32.div(this.$_dayFields.length, 7);
			}
			var dayField = this.$_dayFields[rowNb * 7 + weekNb];
			if (!ss.referenceEquals(this.$_lastEnteredDayField, dayField)) {
				this.$_lastEnteredDayField = dayField;
				this.$onSelectionEnd(dayField);
			}
		},
		$onMouseLeaveFromCalendar: function(e) {
			this.$_isMouseInsideCalendar = false;
			if (this.$_isSelectionModeOn) {
				this.$startScroll();
			}
		},
		$onMouseUp: function(e) {
			this.$stopScroll();
			this.$finalizeSelection();
			this.$stopScroll();
		},
		$onMouseWheel: function(e) {
			if (this.$_scrollerIsRunning) {
				return;
			}
			var ev = e;
			var deltaY = ev.deltaY;
			ev.stopImmediatePropagation();
			ev.preventDefault();
			ev.stopPropagation();
			this.$scrollImediately(deltaY);
		},
		$onSelectionEnd: function(dayField) {
			if (this.$_isSelectionModeOn) {
				if (!ss.isValue(this.$_weekSelectionModeActive)) {
					if (dayField.get_$xIdx() === this.$_startSelectionField.get_$xIdx()) {
						if (dayField.get_$yIdx() !== this.$_startSelectionField.get_$yIdx()) {
							this.$_weekSelectionModeActive = true;
						}
					}
					else {
						this.$_weekSelectionModeActive = false;
					}
				}
				this.$_endSelectionField = dayField;
				this.$updateSelection();
			}
		},
		$prependAdditionalRowsToBody: function() {
			var firstGeneratedDayField = Enumerable.from(this.$_dayFields).first();
			var startDate = Saltarelle.Utils.DateTimeExtension.addDaysSafe(firstGeneratedDayField.get_$date(), -49);
			var startId = firstGeneratedDayField.get_$id() - 49;
			var html = new ss.StringBuilder();
			this.$writeTDs(html, startDate, this.$getSelectedRangesFromInputElement(this.get_$inputElement()), startId);
			var tbody = this.$getTBody();
			tbody.prepend(html.toString());
			tbody.scrollTop(tbody.scrollTop() + this.$getRowHeight() * $MultiSelectionCalendar_MultiSelectionCalendar.$visibleCountOfRows);
			this.$updateDayFieldsMap();
			this.$bindEvents(false);
		},
		$regenerateTable: function() {
			var htmlTxt = this.$getHtmlOfTable(this.get_$inputElement());
			$('.picker', this.get_$calendarRootElement()).replaceWith(htmlTxt);
			this.$_eventsBoundAfterMonthNavigation = false;
			this.$updateEnableStatusOfMonthNavigation();
			this.$updateDayFieldsMap();
			this.$bindEvents(true);
		},
		$saveNewSelectedRangeStringInHiddenInput: function() {
			var selectedRanges = [];
			this.$addOldSelectedDateRanges(selectedRanges);
			var startDayField = null;
			var currentDayField = null;
			var currentSelectionIdx = 0;
			for (var $t1 = 0; $t1 < this.$_dayFields.length; $t1++) {
				var dayField = this.$_dayFields[$t1];
				currentDayField = dayField;
				var selIdx = dayField.get_$selectionIdx();
				if (selIdx !== currentSelectionIdx) {
					if (currentSelectionIdx !== 0) {
						// ReSharper disable once PossibleNullReferenceException
						var newRange = new $MultiSelectionCalendar_Range(startDayField.get_$date(), Saltarelle.Utils.DateTimeExtension.addDaysSafe(dayField.get_$date(), -1), currentSelectionIdx);
						selectedRanges.push(newRange);
					}
					currentSelectionIdx = selIdx;
					startDayField = dayField;
				}
			}
			if (currentSelectionIdx !== 0) {
				if (ss.isValue(currentDayField) && ss.isValue(startDayField)) {
					var newRange1 = new $MultiSelectionCalendar_Range(startDayField.get_$date(), currentDayField.get_$date(), currentSelectionIdx);
					selectedRanges.push(newRange1);
				}
			}
			var selectedRangesTxt = $MultiSelectionCalendar_MultiSelectionCalendar.getStringFromDateRanges(selectedRanges);
			this.$_currentValueOfInputElement = selectedRangesTxt;
			this.get_$inputElement().value = selectedRangesTxt;
			this.get_$inputElement().setAttribute('value', selectedRangesTxt);
			$(this.get_$inputElement()).trigger('change');
		},
		$scrollImediately: function(scrollHeight) {
			var $state = 0, $t1;
			var $sm = ss.mkdel(this, function() {
				var $doFinally = true;
				$sm1:
				for (;;) {
					switch ($state) {
						case 0: {
							$state = -1;
							if (this.$_scrollerIsRunning) {
								return;
							}
							$state = 1;
							continue $sm1;
						}
						case 1:
						case 2:
						case 3: {
							if ($state === 1) {
								$state = 2;
							}
							try {
								$sm2:
								for (;;) {
									switch ($state) {
										case 2: {
											$state = -1;
											this.$_scrollerIsRunning = true;
											$t1 = this.$startNextScroll(scrollHeight < 0, true);
											$state = 3;
											$t1.continueWith($sm);
											$doFinally = false;
											return;
										}
										case 3: {
											$state = -1;
											$t1.getAwaitedResult();
											$state = -1;
											break $sm2;
										}
										default: {
											break $sm2;
										}
									}
								}
							}
							finally {
								if ($doFinally) {
									this.$_scrollerIsRunning = false;
								}
							}
							$state = -1;
							break $sm1;
						}
						default: {
							break $sm1;
						}
					}
				}
			});
			$sm();
		},
		$startNextScroll: function(down, scrollFast) {
			var $state = 0, $tcs = new ss.TaskCompletionSource(), scrollAmountPx, currentHeightOfBody, currentScrollPos, viewPortHeight, targetScrollPos, maxScrollPos, minScrollPos, time, cssProperties, waitTask, animateTask, $t1;
			var $sm = ss.mkdel(this, function() {
				try {
					$sm1:
					for (;;) {
						switch ($state) {
							case 0: {
								$state = -1;
								scrollAmountPx = 50;
								currentHeightOfBody = this.$getBodyHeight();
								currentScrollPos = this.$getCurrentScrollY();
								viewPortHeight = this.$getViewportHeightOfBody();
								if (down) {
									maxScrollPos = currentHeightOfBody - viewPortHeight;
									if (maxScrollPos < currentScrollPos + scrollAmountPx) {
										this.$appendAdditionalRowsToBody();
									}
									targetScrollPos = currentScrollPos + scrollAmountPx;
								}
								else {
									minScrollPos = 0;
									if (minScrollPos > currentScrollPos - scrollAmountPx) {
										this.$prependAdditionalRowsToBody();
									}
									targetScrollPos = this.$getCurrentScrollY() - scrollAmountPx;
								}
								if (scrollFast) {
									this.$getTBody().scrollTop(targetScrollPos);
									$state = -1;
									break $sm1;
								}
								else {
									time = this.$calcScrollAnimationTime(scrollAmountPx, down);
									cssProperties = {};
									cssProperties['scrollTop'] = targetScrollPos + 'px';
									waitTask = ss.Task.delay(time + 100);
									animateTask = ss.Task.fromDoneCallback(this.$getTBody(), 'animate', cssProperties, time, 'linear');
									$t1 = ss.Task.whenAny([waitTask, animateTask]);
									$state = 1;
									$t1.continueWith($sm);
									return;
								}
							}
							case 1: {
								$state = -1;
								$t1.getAwaitedResult();
								$state = -1;
								break $sm1;
							}
							default: {
								break $sm1;
							}
						}
					}
					$tcs.setResult(null);
				}
				catch ($t2) {
					$tcs.setException(ss.Exception.wrap($t2));
				}
			});
			$sm();
			return $tcs.task;
		},
		$startScroll: function() {
			var $state = 0, tolerance, downScroll, upScroll, $t1, $t2;
			var $sm = ss.mkdel(this, function() {
				var $doFinally = true;
				$sm1:
				for (;;) {
					switch ($state) {
						case 0: {
							$state = -1;
							if (this.$_scrollerIsRunning) {
								return;
							}
							this.$_scrollerIsRunning = true;
							$state = 1;
							continue $sm1;
						}
						case 1:
						case 2:
						case 3:
						case 4:
						case 5: {
							if ($state === 1) {
								$state = 2;
							}
							try {
								$sm2:
								for (;;) {
									switch ($state) {
										case 2: {
											$state = -1;
											tolerance = 10;
											$state = 3;
											continue $sm2;
										}
										case 3: {
											$state = -1;
											if (!(this.$_isSelectionModeOn && !this.$_isMouseInsideCalendar && this.$_scrollerIsRunning)) {
												$state = -1;
												break $sm2;
											}
											downScroll = this.$getBottomBorderOfCalendar() < this.$_mousePosY + tolerance;
											upScroll = this.$getCalendarTop() > this.$_mousePosY + tolerance;
											if (downScroll || upScroll) {
												$t1 = this.$startNextScroll(downScroll, false);
												$state = 4;
												$t1.continueWith($sm);
												$doFinally = false;
												return;
											}
											else {
												$t2 = ss.Task.delay(500);
												$state = 5;
												$t2.continueWith($sm);
												$doFinally = false;
												return;
											}
										}
										case 4: {
											$state = -1;
											$t1.getAwaitedResult();
											$state = 3;
											continue $sm2;
										}
										case 5: {
											$state = -1;
											$t2.getAwaitedResult();
											$state = 3;
											continue $sm2;
										}
										default: {
											break $sm2;
										}
									}
								}
							}
							finally {
								if ($doFinally) {
									this.$_scrollerIsRunning = false;
								}
							}
							$state = -1;
							break $sm1;
						}
						default: {
							break $sm1;
						}
					}
				}
			});
			$sm();
		},
		$stopScroll: function() {
			this.$getTBody().stop(true);
		},
		$updateDayFieldsMap: function() {
			var tds = Enumerable.from($('td', this.get_$calendarRootElement()).get()).select(function(x) {
				return ss.cast(x, HTMLElement);
			}).toArray();
			var i = 0;
			for (var $t1 = 0; $t1 < tds.length; $t1++) {
				var td = tds[$t1];
				var id = parseInt(td.id);
				var rowNb = ss.Int32.div(i, 7);
				var dayField = this.$getDayField(id);
				dayField.set_$yIdx(rowNb);
				if (ss.isNullOrUndefined(dayField.get_$tdElement())) {
					dayField.set_$tdElement($(td));
					dayField.set_$divElement($('div', td).first());
				}
				i++;
			}
		},
		$updateEnableStatusOfMonthNavigation: function() {
			var previousMonthLinkJq = $(this.$getPrevMonthLink());
			var previousMonth = Saltarelle.Utils.DateTimeExtension.addDaysSafe(this.$_firstDayOfActiveMonth, -1);
			if (previousMonth < this.$getFirstEnabledDay()) {
				previousMonthLinkJq.removeClass('enabled');
				previousMonthLinkJq.addClass('disabled');
			}
			else {
				previousMonthLinkJq.removeClass('disabled');
				previousMonthLinkJq.addClass('enabled');
			}
			var nextMonthLinkJq = $(this.$getNextMonthLink());
			var nextMonth = new Date(this.$_firstDayOfActiveMonth.getFullYear(), this.$_firstDayOfActiveMonth.getMonth() + 1, this.$_firstDayOfActiveMonth.getDate(), this.$_firstDayOfActiveMonth.getHours(), this.$_firstDayOfActiveMonth.getMinutes(), this.$_firstDayOfActiveMonth.getSeconds(), this.$_firstDayOfActiveMonth.getMilliseconds());
			if (nextMonth > this.$getLastEnabledDay()) {
				nextMonthLinkJq.removeClass('enabled');
				nextMonthLinkJq.addClass('disabled');
			}
			else {
				nextMonthLinkJq.removeClass('disabled');
				nextMonthLinkJq.addClass('enabled');
			}
		},
		$updateSelection: function() {
			if (!this.$_isSelectionModeOn) {
				return;
			}
			this.$doForEachDayField(function(dayField, currentClass, newClass, isInSelection) {
				if (!ss.referenceEquals(currentClass, newClass)) {
					dayField.get_$divElement().attr('class', newClass);
				}
			});
		},
		$writeTDs: function(html, startDate, selectedRanges, startId) {
			var currentDate = startDate;
			for (var row = 0; row < $MultiSelectionCalendar_MultiSelectionCalendar.$visibleCountOfRows; row++) {
				html.appendLine('\t\t\t\t<tr>');
				for (var weekDay = 0; weekDay < 7; weekDay++) {
					var isActiveMonth = currentDate.getMonth() + 1 === this.$_firstDayOfActiveMonth.getMonth() + 1 && currentDate.getFullYear() === this.$_firstDayOfActiveMonth.getFullYear();
					var currentClass = new $MultiSelectionCalendar_$DayFieldClassAttribute.$ctor1(isActiveMonth, $MultiSelectionCalendar_MultiSelectionCalendar.$isInRanges(this.$_enabledRanges, currentDate), this.$getSelectionIdxOfDay(currentDate, selectedRanges));
					var dayField = new $MultiSelectionCalendar_$DayField(startId, weekDay, row, currentDate, currentClass);
					if (this.$_dayFields.length > 0) {
						var id = dayField.get_$id();
						if (Enumerable.from(this.$_dayFields).last().get_$id() < id) {
							this.$_dayFields.push(dayField);
						}
						else {
							for (var i = 0; i < this.$_dayFields.length; i++) {
								if (this.$_dayFields[i].get_$id() > id) {
									ss.insert(this.$_dayFields, i, dayField);
									break;
								}
							}
						}
					}
					else {
						this.$_dayFields.push(dayField);
					}
					$MultiSelectionCalendar_MultiSelectionCalendar.$appendLin(html, '\t\t\t\t<td class="{3}" id="{2}"><div class=\'{1}\'>{0}</div></td>', [currentDate.getDate(), currentClass, startId, (isActiveMonth ? 'cm' : 'om')]);
					currentDate = Saltarelle.Utils.DateTimeExtension.addDaysSafe(currentDate, 1);
					startId++;
				}
				html.appendLine('\t\t\t\t</tr>');
			}
		},
		$writeTemplateOfPicker: function(html, inputElement) {
			var selectedRanges = this.$getSelectedRangesFromInputElement(inputElement);
			ss.clear(this.$_dayFields);
			var id = 10000 * this.get_$calendarId() + 777;
			var firstDayOfMonth = this.$_firstDayOfActiveMonth;
			var firstWeekDayOfMonth = firstDayOfMonth.getDay();
			var currentDate = firstDayOfMonth;
			if (firstWeekDayOfMonth !== 1) {
				if (firstWeekDayOfMonth === 0) {
					currentDate = Saltarelle.Utils.DateTimeExtension.addDaysSafe(currentDate, -6);
				}
				else {
					currentDate = Saltarelle.Utils.DateTimeExtension.addDaysSafe(currentDate, -firstWeekDayOfMonth + 1);
				}
			}
			html.appendLine("\t<div class='picker'>");
			html.appendLine("\t\t<div class='title text-center wrapper clearfix'>");
			$MultiSelectionCalendar_MultiSelectionCalendar.$appendLin(html, "\t\t\t<div class='pull-left'><a class='label text-center previousMonth' title='{0}' href='#'><span class='glyphicon glyphicon-backward iconPreviousMonth'></a></div>", [$MultiSelectionCalendar_MultiSelectionCalendarResource.get_hintPreviousMonth()]);
			$MultiSelectionCalendar_MultiSelectionCalendar.$appendLin(html, '\t\t\t{0} <b>{1}</b>', [$MultiSelectionCalendar_MultiSelectionCalendar.$getNameOfMonth(this.$_firstDayOfActiveMonth.getMonth() + 1), this.$_firstDayOfActiveMonth.getFullYear()]);
			$MultiSelectionCalendar_MultiSelectionCalendar.$appendLin(html, "\t\t\t<div class='pull-right'><a class='label text-center nextMonth' title='{0}' href='#'><span class='glyphicon glyphicon-forward iconPreviousMonth'></a></div>", [$MultiSelectionCalendar_MultiSelectionCalendarResource.get_hintNextMonth()]);
			html.appendLine('\t\t</div>');
			html.appendLine("\t\t<table class='table'>");
			html.appendLine('\t\t\t<thead>');
			html.appendLine('\t\t\t\t<tr>');
			for (var weekDay = 0; weekDay < 7; weekDay++) {
				$MultiSelectionCalendar_MultiSelectionCalendar.$appendLin(html, '\t\t\t\t\t<th><div>{0}</div></th>', [this.$getWeekDay(weekDay)]);
			}
			html.appendLine('\t\t\t\t</tr>');
			html.appendLine('\t\t\t</thead>');
			html.appendLine('\t\t\t<tbody>');
			this.$writeTDs(html, currentDate, selectedRanges, id);
			html.appendLine('\t\t\t</tbody>');
			html.appendLine('\t\t</table>');
			html.appendLine('\t</div>');
		}
	});
	ss.initClass($MultiSelectionCalendar_MultiSelectionCalendarResource, $asm, {});
	ss.initClass($MultiSelectionCalendar_Position, $asm, {
		get_x: function() {
			return this.$1$XField;
		},
		set_x: function(value) {
			this.$1$XField = value;
		},
		get_y: function() {
			return this.$1$YField;
		},
		set_y: function(value) {
			this.$1$YField = value;
		}
	});
	ss.initClass($MultiSelectionCalendar_Range, $asm, {
		get_start: function() {
			return this.$1$StartField;
		},
		set_start: function(value) {
			this.$1$StartField = value;
		},
		get_end: function() {
			return this.$1$EndField;
		},
		set_end: function(value) {
			this.$1$EndField = value;
		},
		get_selectionIdx: function() {
			return this.$1$SelectionIdxField;
		},
		set_selectionIdx: function(value) {
			this.$1$SelectionIdxField = value;
		}
	});
	ss.initClass($MultiSelectionCalendar_Rectangle, $asm, {
		get_top: function() {
			return this.$1$TopField;
		},
		set_top: function(value) {
			this.$1$TopField = value;
		},
		get_right: function() {
			return this.$1$RightField;
		},
		set_right: function(value) {
			this.$1$RightField = value;
		},
		get_bottom: function() {
			return this.$1$BottomField;
		},
		set_bottom: function(value) {
			this.$1$BottomField = value;
		},
		get_left: function() {
			return this.$1$LeftField;
		},
		set_left: function(value) {
			this.$1$LeftField = value;
		},
		get_width: function() {
			return this.get_right() - this.get_left();
		},
		get_height: function() {
			return this.get_bottom() - this.get_top();
		},
		isInside: function(position) {
			return position.get_x() >= this.get_left() && position.get_x() <= this.get_right() && position.get_y() >= this.get_top() && position.get_y() <= this.get_bottom();
		}
	});
	(function() {
		$MultiSelectionCalendar_MultiSelectionCalendarResource.$1$CurrentLanguageIsoCodeField = null;
	})();
	(function() {
		$MultiSelectionCalendar_MultiSelectionCalendar.$calendars = [];
		$MultiSelectionCalendar_MultiSelectionCalendar.$visibleCountOfRows = 7;
		$MultiSelectionCalendar_MultiSelectionCalendar.$_weekdayNames = null;
	})();
	$MultiSelectionCalendar_$Program.$main();
})();
