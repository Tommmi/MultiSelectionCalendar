using System;
using System.Collections;
using System.Collections.Generic;
using System.Html;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using jQueryApi;
using Saltarelle.Utils;


// ReSharper disable ConvertIfStatementToNullCoalescingExpression
// ReSharper disable AutoPropertyCanBeMadeGetOnly.Local
// ReSharper disable ConvertIfStatementToConditionalTernaryExpression
// ReSharper disable UseStringInterpolation
// ReSharper disable UseObjectOrCollectionInitializer

namespace MultiSelectionCalendar
{
	// ReSharper disable once UnusedMember.Global
	/// <summary>
	/// An instance of MultiSelectionCalendar represents a calendar on the webpage. 
	/// You may select several dates and date ranges in the calendar and associate them 
	/// to different selection groups (e.g. red, blue, green, and so on).
	/// You may hold down mouse and select several dates by just moving the mouse.
	/// If you want, you may select just weekdays only.
	/// You may configure the dates which are selectable.
	/// </summary>
	public class MultiSelectionCalendar
	{
		#region public

		public static void Init()
		{
			MultiSelectionCalendarResource.CurrentLanguageIsoCode = GetLanguageIsoCodeFromHiddenInputEelement();

			_weekdayNames = new[]
			{
				MultiSelectionCalendarResource.Monday,
				MultiSelectionCalendarResource.Tuesday,
				MultiSelectionCalendarResource.Wednesday,
				MultiSelectionCalendarResource.Thursday,
				MultiSelectionCalendarResource.Friday,
				MultiSelectionCalendarResource.Saturday,
				MultiSelectionCalendarResource.Sunday,
			};

			var inputElements = jQuery.Select("input.multiSelectionCalendar");
			int calendarId = 0;
			foreach (var inputElement in inputElements.GetItems())
			{
				var inputDom = (InputElement)inputElement;
				int calendarIdx = calendarId++;
				var calendar = new MultiSelectionCalendar(calendarIdx);
				Calendars.Add(calendar);
				calendar.ModifyHtml(inputDom);
				var calendarDomElement = (DivElement)inputDom.ParentElement;
				calendar.CalendarRootElement = calendarDomElement;
				calendar.InputElement = inputDom;
				calendar.UpdateEnableStatusOfMonthNavigation();
				calendar.UpdateDayFieldsMap();
				calendar.BindEvents(true);
			}
		}

		public static List<Range> GetDateRangesFromString(string timeRanges)
		{
			return Calendar.GetDateRangesFromString(timeRanges);
		}

		public static string GetStringFromDateRanges(List<Range> ranges)
		{
			return Calendar.GetStringFromDateRanges(ranges);
		}

		#endregion

		#region private

		#region Static

		#region fields

		// ReSharper disable once NotAccessedField.Local
		private static readonly List<MultiSelectionCalendar> Calendars = new List<MultiSelectionCalendar>();
		// ReSharper disable once InconsistentNaming
		private const int VisibleCountOfRows = 7;
		private static string[] _weekdayNames;

		#endregion

		#region members

		private static void AppendLin(StringBuilder text, string formattedText,  params object[] args)
		{
			text.AppendLine(string.Format(formattedText, args));
		}

		private static string GetLanguageIsoCodeFromHiddenInputEelement()
		{
			var firstInputElement = jQuery.Select("input.multiSelectionCalendar").GetElements().Cast<InputElement>().FirstOrDefault();
			if (firstInputElement != null)
				return firstInputElement.GetAttribute("language")??"";
			return "";
		}

		private static string GetNameOfMonth(int month)
		{
			switch (month)
			{
				case 1:
					return MultiSelectionCalendarResource.January;
				case 2:
					return MultiSelectionCalendarResource.February;
				case 3:
					return MultiSelectionCalendarResource.March;
				case 4:
					return MultiSelectionCalendarResource.April;
				case 5:
					return MultiSelectionCalendarResource.May;
				case 6:
					return MultiSelectionCalendarResource.June;
				case 7:
					return MultiSelectionCalendarResource.July;
				case 8:
					return MultiSelectionCalendarResource.August;
				case 9:
					return MultiSelectionCalendarResource.September;
				case 10:
					return MultiSelectionCalendarResource.October;
				case 11:
					return MultiSelectionCalendarResource.November;
				case 12:
					return MultiSelectionCalendarResource.December;
				default:
					return month.ToString();
			}
		}

		private static bool IsInRanges(List<Range> ranges, DateTime date)
		{
			return ranges.Any(r => date >= r.Start && date <= r.End);
		}

		#endregion

		#endregion

		#region fields

		private int CalendarId { get; set; }
		private DivElement CalendarRootElement { get; set; }
		private string _currentEnabledRangesAsString;
		private string _currentValueOfInputElement;
		private readonly List<DayField> _dayFields = new List<DayField>();
		private List<Range> _enabledRanges;
		private DayField _endSelectionField;
		private bool _eventsBoundAfterCalenderInitialized;
		private bool _eventsBoundAfterMonthNavigation;
		private DateTime _firstDayOfActiveMonth;
		private InputElement InputElement { get; set; }
		private bool _isMouseInsideCalendar;
		private bool _isSelectionModeOn;
		private DayField _lastEnteredDayField;
		private int _mousePosY;
		private int _rowHeight;
		private bool _scrollerIsRunning;
		private DayField _startSelectionField;
		private jQueryObject _tBody;
		private bool? _weekSelectionModeActive;

		#endregion

		#region constructor

		private MultiSelectionCalendar(int calendarId)
		{
			CalendarId = calendarId;
		}

		#endregion

		#region methods

		/// <summary>
		/// Adds the currently selected date ranges as given in hidden input field to the passed list of ranges.
		/// Except the date ranges addressed by _dayFields.
		/// </summary>
		/// <param name="selectedRanges"></param>
		private void AddOldSelectedDateRanges(List<Range> selectedRanges)
		{
			var oldSelectionRanges = GetSelectedRangesFromInputElement(InputElement);

			var firstVisibleDay = _dayFields[0].Date.Date;
			var lastVisibleDay = _dayFields.Last().Date.Date;
			foreach (var oldSelectionRange in oldSelectionRanges)
			{
				var startDate = oldSelectionRange.Start;
				var endDate = oldSelectionRange.End;

				if (startDate >= firstVisibleDay)
				{
					if (startDate <= lastVisibleDay)
						startDate = lastVisibleDay.AddDaysSafe(1);
				}
				else
				{
					if (endDate >= firstVisibleDay)
					{
						endDate = firstVisibleDay.AddDaysSafe(-1);
						if (endDate > lastVisibleDay)
						{
							selectedRanges.Add(new Range(lastVisibleDay.AddDaysSafe(1), endDate, oldSelectionRange.SelectionIdx));
						}
					}
				}

				if (endDate >= startDate)
					selectedRanges.Add(new Range(startDate, endDate, oldSelectionRange.SelectionIdx));
			}
		}

		private void AppendAdditionalRowsToBody()
		{
			var lastGeneratedDayField = _dayFields.Last();
			var startDate = lastGeneratedDayField.Date.AddDaysSafe(1);
			var startId = lastGeneratedDayField.Id + 1;
			var html = new StringBuilder();
			WriteTDs(html, startDate, GetSelectedRangesFromInputElement(InputElement), startId);
			var tbody = GetTBody();
			tbody.Append(html.ToString());
			UpdateDayFieldsMap();
			BindEvents(false);
		}

		private void BindEvents(bool updateBodyOfTable)
		{
			if (!_eventsBoundAfterMonthNavigation)
			{
				var previousMonthLink = GetPrevMonthLink();
				var nextMonthLink = GetNextMonthLink();
				if (jQuery.FromElement(previousMonthLink).HasClass("enabled"))
				{
					jQuery
						.FromElement(previousMonthLink)
						.On("click", ev => OnMonthNavigateClicked(ev, false));
				}
				if (jQuery.FromElement(nextMonthLink).HasClass("enabled"))
				{
					jQuery
						.FromElement(nextMonthLink)
						.On("click", ev => OnMonthNavigateClicked(ev, true));
				}
				_eventsBoundAfterMonthNavigation = true;
			}

			if (!_eventsBoundAfterCalenderInitialized)
			{
				var calendar = jQuery.FromElement(CalendarRootElement);
				jQuery.Window.On("mouseup", OnMouseUp);
				jQuery.Window.On("mousemove", OnMouseMove);
				jQuery.Window.On("dragend", OnMouseUp);
				calendar.On("dragstart", OnDragStart);
				calendar.On("mousewheel", OnMouseWheel);
				InputElement.HookSetterOfProperty(elem=>elem.Value, OnInputValueChanged);
				_eventsBoundAfterCalenderInitialized = true;
			}

			var allEnabledDayFields = _dayFields
				.Where(dayField => dayField.IsEnabled && !dayField.IsMouseEventBound)
				.ToArray();

			if (updateBodyOfTable)
			{
				_tBody = jQuery.Select("tBody",CalendarRootElement);
				_tBody.On("mouseleave", OnMouseLeaveFromCalendar);
				_tBody.On("mouseenter", OnMouseEnterIntoCalendar);
			}


			foreach (var dayField in allEnabledDayFields)
			{
				var td = dayField.TdElement;
				td.On("mousedown", ev => OnMouseDownInField(ev, dayField));
				// td.On("mouseenter", ev => OnMouseEnterInField(dayField));
				dayField.IsMouseEventBound = true;
			}
		}

		private int CalcScrollAnimationTime(int scrollHeightPx,bool downScroll)
		{
			var maxSpeedRowsPerSecond = 6;
			var minSpeedRowsPerSecond = 1;
			int mouseDistanceToCalendar;

			if (downScroll)
				mouseDistanceToCalendar = _mousePosY - GetBottomBorderOfCalendar();
			else
				mouseDistanceToCalendar = GetCalendarTop() - _mousePosY;

			var speed = minSpeedRowsPerSecond + (maxSpeedRowsPerSecond - minSpeedRowsPerSecond)*mouseDistanceToCalendar/400;
			if (speed < minSpeedRowsPerSecond)
				speed = minSpeedRowsPerSecond;
			else if (speed > maxSpeedRowsPerSecond)
				speed = maxSpeedRowsPerSecond;
			var time = (int) Math.Round(1000.0* scrollHeightPx / GetRowHeight()/speed);
			return time;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="onDayField">
		/// void OnDayField(DayField dayField,string currentlySetClass, string newClass, bool isInsideSelection)
		/// </param>
		private void DoForEachDayField(OnDayFieldFunc onDayField)
		{
			var startField = _startSelectionField;
			var endField = _endSelectionField;
			var selectionIdx = GetSelectionIdxFromInputField();

			if (_isSelectionModeOn)
			{
				// if selection started with younger days
				if (startField.Id > endField.Id)
				{
					// correct interval so that start < end
					startField = endField;
					endField = _startSelectionField;
				}
			}
			else
			{
				startField = new DayField(1,1,1,DateTime.Now,"");
				endField = new DayField(0, 0, 0, DateTime.Now, "");
			}

			// for each day field
			foreach (var dayField in _dayFields.Where(val=>val.IsEnabled))
			{
				bool isFieldInsideSelection;

				// if we want to select just week days
				if (_weekSelectionModeActive.HasValue && _weekSelectionModeActive.Value)
				{
					isFieldInsideSelection =
						dayField.XIdx >= startField.XIdx
						&& dayField.XIdx <= endField.XIdx
						&& dayField.YIdx >= startField.YIdx
						&& dayField.YIdx <= endField.YIdx;
				}
				else
				{
					isFieldInsideSelection = dayField.Id >= startField.Id && dayField.Id <= endField.Id;
				}

				if (isFieldInsideSelection)
				{
					var visibleClass = dayField.DivElement.GetAttribute("class");
					var isActiveMonth = dayField.Date.Month == _firstDayOfActiveMonth.Month && dayField.Date.Year == _firstDayOfActiveMonth.Year;
					// calculate the correct class attribute value
					var classValue = new DayFieldClassAttribute(isActiveMonth,true, selectionIdx).ToString();
					onDayField(dayField, visibleClass, classValue, true);
				}
				else
				{
					var visibleClass = dayField.DivElement.GetAttribute("class");
					onDayField(dayField, visibleClass, dayField.CurrentClass, false);
				}
			}
		}

		private void FinalizeSelection()
		{
			if (!_isSelectionModeOn)
				return;

			if (_startSelectionField == _endSelectionField)
			{
				var dayField = _startSelectionField;
				int selectionIdx = GetSelectionIdxFromInputField();
				bool dayWasSelected = dayField.DayFieldClass.SelectionIdx == selectionIdx;

				if (dayWasSelected)
				{
					dayField.DayFieldClass.SelectionIdx = 0;
					dayField.DivElement.Attribute("class", dayField.CurrentClass);
				}
				else
				{
					dayField.DayFieldClass.SelectionIdx = selectionIdx;
					dayField.DivElement.Attribute("class", dayField.CurrentClass);
				}
			}
			else
			{
				DoForEachDayField((dayField, currentClass, newClass, isInSelection) =>
				{
					dayField.CurrentClass = newClass;
				});

			}

			SaveNewSelectedRangeStringInHiddenInput();

			_isSelectionModeOn = false;
			_weekSelectionModeActive = null;
			_startSelectionField = null;
			_endSelectionField = null;
		}

		private int GetBodyHeight()
		{
			var countRows = _dayFields.Count/7;
			var rowHeight = GetRowHeight();
			return countRows * rowHeight;
		}

		private int GetBottomBorderOfCalendar()
		{
			var calendarJq = jQuery.FromElement(CalendarRootElement);
			var calendarTop = calendarJq.GetOffset().Top;
			return calendarTop + calendarJq.GetOuterHeight();
		}

		private int GetCalendarTop()
		{
			var calendarJq = jQuery.FromElement(CalendarRootElement);
			var title = jQuery.Select(".title", CalendarRootElement);
			var head = jQuery.Select("thead", CalendarRootElement);
			return calendarJq.GetOffset().Top + title.GetOuterHeight() + head.GetOuterHeight();
		}

		private int GetCurrentScrollY()
		{
			return GetTBody().GetScrollTop();
		}

		private DayField GetDayField(int id)
		{
			return _dayFields.FirstOrDefault(d => d.Id == id);
		}

		private DateTime GetFirstEnabledDay()
		{
			var firstEnabledRange = _enabledRanges.OrderBy(r => r.Start).FirstOrDefault();
			if (firstEnabledRange == null)
				return new DateTime(1940,1,1);
			return firstEnabledRange.Start;
		}

		private DateTime GetFirstSelectedDay(InputElement inputElement)
		{
			var selectedRanges = GetSelectedRangesFromInputElement(inputElement);
			var firstSelectedRange = selectedRanges.OrderBy(r => r.Start).FirstOrDefault();
			if (firstSelectedRange == null)
				return DateTime.Now;
			return firstSelectedRange.Start;
		}

		private string GetHtmlOfTable(InputElement inputDomElement)
		{
			_currentEnabledRangesAsString = inputDomElement.GetAttribute("enabledRanges");
			_enabledRanges = GetDateRangesFromString(_currentEnabledRangesAsString);
			var firstSelectedDay = GetFirstSelectedDay(inputDomElement);
			_firstDayOfActiveMonth = new DateTime(firstSelectedDay.Year, firstSelectedDay.Month, 1);
			var html = new StringBuilder();
			WriteTemplateOfPicker(html, inputDomElement);
			var htmlTxt = html.ToString();
			return htmlTxt;
		}

		private DateTime GetLastEnabledDay()
		{
			var lastEnabledRange = _enabledRanges.OrderByDescending(r => r.End).FirstOrDefault();
			if (lastEnabledRange == null)
				return  new DateTime(2100,1,1);
			return lastEnabledRange.End;
		}

		private AnchorElement GetNextMonthLink()
		{
			return (AnchorElement)jQuery.Select("a.nextMonth", CalendarRootElement).GetElement(0);
		}

		private AnchorElement GetPrevMonthLink()
		{
			return (AnchorElement)jQuery.Select("a.previousMonth", CalendarRootElement).GetElement(0);
		}

		private int GetRowHeight()
		{
			if (_rowHeight == 0)
				_rowHeight = jQuery.Select("td", CalendarRootElement).First().GetOuterHeight();

			return _rowHeight;
		}

		private int GetSelectionIdxFromInputField()
		{
			var selectionIdxTxt = InputElement.GetAttribute("selectionIdx");
			int selectionIdx;
			int.TryParse(selectionIdxTxt, out selectionIdx);
			return selectionIdx;
		}

		/// <summary>
		/// </summary>
		/// <param name="dateofDay"></param>
		/// <param name="selectedRanges"></param>
		/// <returns></returns>
		private int GetSelectionIdxOfDay(DateTime dateofDay, List<Range> selectedRanges)
		{
			var date = dateofDay.Date;
			var firstFoundRange = selectedRanges.FirstOrDefault(r => date >= r.Start && date <= r.End);
			if (firstFoundRange == null)
				return 0;
			return firstFoundRange.SelectionIdx;
		}

		private List<Range> GetSelectedRangesFromInputElement(InputElement inputElement)
		{
			_currentValueOfInputElement = inputElement.Value;
			return GetDateRangesFromString(inputElement.Value);
		}

		private jQueryObject GetTBody()
		{
			return _tBody;
		}

		private string GetWeekDay(int weekDay)
		{
			return _weekdayNames[weekDay];
		}

		private int GetViewportHeightOfBody()
		{
			var calendarJq = jQuery.FromElement(CalendarRootElement);
			var title = jQuery.Select(".title", CalendarRootElement);
			var head = jQuery.Select("thead", CalendarRootElement);
			return calendarJq.GetInnerHeight() - title.GetOuterHeight() - head.GetOuterHeight();
		}

		private void ModifyHtml(InputElement inputDomElement)
		{
			var parentElement = inputDomElement.ParentElement as DivElement;
			if ( parentElement == null )
				throw new Exception("input element must have a <div> element as parent !");
			var parentElementJq = jQuery.FromElement(parentElement);
			parentElementJq.AddClass("multiSelectionCalendar");
			parentElementJq.Attribute("calendarId", CalendarId.ToString());
			var inputElementJq = jQuery.FromElement(inputDomElement);
			inputElementJq.RemoveClass("multiSelectionCalendar");
			inputElementJq.AddClass("hidden");

			var htmlTxt = GetHtmlOfTable(inputDomElement);
			parentElementJq.Append(htmlTxt);
		}

		private delegate void OnDayFieldFunc(DayField dayField, string currentlySetClass, string newClass, bool isInsideSelection);

		private void OnDragStart(jQueryEvent e)
		{
			e.PreventDefault();
		}

		private void OnInputValueChanged(string newValue)
		{
			if (_currentValueOfInputElement == newValue)
				return;
			RegenerateTable();
		}

		private void OnMonthNavigateClicked(
			// ReSharper disable once UnusedParameter.Local
			jQueryEvent e, 
			bool wantsNextMonth)
		{
			var html = new StringBuilder();
			var picker = (DivElement) jQuery.Select(".picker", CalendarRootElement).GetElement(0);
			_firstDayOfActiveMonth = _firstDayOfActiveMonth.AddMonths(wantsNextMonth ? 1 : -1);
			WriteTemplateOfPicker(html,InputElement);
			var pickerJq = jQuery.Select(picker);
			pickerJq.ReplaceWith(html.ToString());
			_eventsBoundAfterMonthNavigation = false;
			UpdateEnableStatusOfMonthNavigation();
			UpdateDayFieldsMap();
			BindEvents(true);
		}


		private void OnMouseDownInField(jQueryEvent e, DayField dayField)
		{
			if (e.Button == 0)
			{
				_isSelectionModeOn = true;
				_startSelectionField = dayField;
				_endSelectionField = dayField;
				UpdateSelection();
			}
		}

		private void OnMouseEnterIntoCalendar(jQueryEvent e)
		{
			_isMouseInsideCalendar = true;
			StopScroll();
		}

		private void OnMouseMove(jQueryEvent e)
		{
			var x = e.PageX;
			var y = e.PageY;
			_mousePosY = y;
			
			var tBody = GetTBody();
			var offset = tBody.GetOffset();
			var pos = new Position(offset.Left,offset.Top);
			var visiblePortRect = new Rectangle(pos.Y,pos.X+tBody.GetWidth(),pos.Y+tBody.GetHeight(),pos.X);
			if (visiblePortRect.Width == 0)
				return;
			var scrollPos = GetCurrentScrollY();
			var weekNb = (x - visiblePortRect.Left) * 7 / visiblePortRect.Width;
			if (weekNb < 0)
				weekNb = 0;
			else if (weekNb > 6)
				weekNb = 6;

			if (y > visiblePortRect.Bottom - 10)
				y = visiblePortRect.Bottom - 10;
			else if (y < visiblePortRect.Top + 10)
				y = visiblePortRect.Top + 10;

			var rowNb = (y - visiblePortRect.Top + scrollPos)/GetRowHeight();
			if (rowNb < 0)
				rowNb = 0;
			else if (rowNb > _dayFields.Count/7)
				rowNb = _dayFields.Count/7;

			var dayField = _dayFields[rowNb*7 + weekNb];
			if (_lastEnteredDayField != dayField)
			{
				_lastEnteredDayField = dayField;
				OnSelectionEnd(dayField);
			}
		}

		private void OnMouseLeaveFromCalendar(jQueryEvent e)
		{
			_isMouseInsideCalendar = false;
			if (_isSelectionModeOn)
				StartScroll();
		}

		private void OnMouseUp(jQueryEvent e)
		{
			StopScroll();
			FinalizeSelection();
			StopScroll();
		}

		private void OnMouseWheel(jQueryEvent e)
		{
			if ( _scrollerIsRunning)
				return;
			var ev = Utils.UnsafeSafeCast<jQueryEventMouseWheel>(e);
			var deltaY = ev.DeltaY;
			ev.StopImmediatePropagation();
			ev.PreventDefault();
			ev.StopPropagation();
			ScrollImediately(deltaY);
		}

		private void OnSelectionEnd(DayField dayField)
		{
			if (_isSelectionModeOn)
			{
				if (!_weekSelectionModeActive.HasValue)
				{
					if (dayField.XIdx == _startSelectionField.XIdx)
					{
						if (dayField.YIdx != _startSelectionField.YIdx)
							_weekSelectionModeActive = true;
					}
					else
					{
						_weekSelectionModeActive = false;
					}
				}

				_endSelectionField = dayField;
				UpdateSelection();
			}
		}

		private void PrependAdditionalRowsToBody()
		{
			var firstGeneratedDayField = _dayFields.First();
			var startDate = firstGeneratedDayField.Date.AddDaysSafe(- VisibleCountOfRows * 7);
			var startId = firstGeneratedDayField.Id - VisibleCountOfRows * 7;
			var html = new StringBuilder();
			WriteTDs(html, startDate, GetSelectedRangesFromInputElement(InputElement), startId);
			var tbody = GetTBody();
			tbody.Prepend(html.ToString());
			tbody.ScrollTop(tbody.GetScrollTop() + GetRowHeight()*VisibleCountOfRows);
			UpdateDayFieldsMap();
			BindEvents(false);
		}

		private void RegenerateTable()
		{
			var htmlTxt = GetHtmlOfTable(InputElement);
			jQuery.Select(".picker", CalendarRootElement).ReplaceWith(htmlTxt);
			_eventsBoundAfterMonthNavigation = false;
			UpdateEnableStatusOfMonthNavigation();
			UpdateDayFieldsMap();
			BindEvents(true);
		}

		private void SaveNewSelectedRangeStringInHiddenInput()
		{
			var selectedRanges = new List<Range>();
			AddOldSelectedDateRanges(selectedRanges);


			DayField startDayField = null;
			DayField currentDayField = null;
			var currentSelectionIdx = 0;

			foreach (var dayField in _dayFields)
			{
				currentDayField = dayField;
				var selIdx = dayField.SelectionIdx;
				if (selIdx != currentSelectionIdx)
				{
					if (currentSelectionIdx != 0)
					{
						// ReSharper disable once PossibleNullReferenceException
						var newRange = new Range(startDayField.Date, dayField.Date.AddDaysSafe(-1), currentSelectionIdx);
						selectedRanges.Add(newRange);
					}
					currentSelectionIdx = selIdx;
					startDayField = dayField;
				}
			}

			if (currentSelectionIdx != 0)
			{
				if (currentDayField != null && startDayField != null)
				{
					var newRange = new Range(startDayField.Date, currentDayField.Date, currentSelectionIdx);
					selectedRanges.Add(newRange);
				}
			}

			var selectedRangesTxt = GetStringFromDateRanges(selectedRanges);
			_currentValueOfInputElement = selectedRangesTxt;
 			InputElement.Value = selectedRangesTxt;
			InputElement.SetAttribute("value",selectedRangesTxt);
			jQuery.FromElement(InputElement).Trigger("change");
		}

		private async void ScrollImediately(int scrollHeight)
		{
			if (_scrollerIsRunning)
				return;
			try
			{
				_scrollerIsRunning = true;
				await StartNextScroll(scrollHeight < 0, true);
			}
			finally
			{
				_scrollerIsRunning = false;
			}
		}

		private async Task StartNextScroll(bool down, bool scrollFast)
		{
			const int scrollAmountPx = 50;
			int currentHeightOfBody = GetBodyHeight();
			int currentScrollPos = GetCurrentScrollY();
			int viewPortHeight = GetViewportHeightOfBody();
			int targetScrollPos;

			if (down)
			{
				int maxScrollPos = currentHeightOfBody - viewPortHeight;
				if (maxScrollPos < currentScrollPos + scrollAmountPx)
					AppendAdditionalRowsToBody();
				targetScrollPos = currentScrollPos + scrollAmountPx;
			}
			else
			{
				const int minScrollPos = 0;
				if (minScrollPos > currentScrollPos - scrollAmountPx)
					PrependAdditionalRowsToBody();
				targetScrollPos = GetCurrentScrollY() - scrollAmountPx;
			}

			if (scrollFast)
			{
				GetTBody().ScrollTop(targetScrollPos);
			}
			else
			{
				var time = CalcScrollAnimationTime(scrollAmountPx, down);
				var cssProperties = new JsDictionary();
				cssProperties.Add("scrollTop", targetScrollPos + "px");
				var waitTask = Task.Delay(time + 100);
				var animateTask = GetTBody().AnimateTask(cssProperties, time, EffectEasing.Linear);
				await Task.WhenAny(waitTask, animateTask);
			}
		}

		private async void StartScroll()
		{
			if ( _scrollerIsRunning )
				return;
			_scrollerIsRunning = true;

			try
			{
				const int tolerance = 10;
				while (_isSelectionModeOn && !_isMouseInsideCalendar && _scrollerIsRunning)
				{
					bool downScroll = GetBottomBorderOfCalendar() < _mousePosY + tolerance;
					bool upScroll = GetCalendarTop() > _mousePosY + tolerance;
					if (downScroll || upScroll)
						await StartNextScroll(downScroll,false);
					else
						await Task.Delay(500);
				}
			}
			finally
			{
				_scrollerIsRunning = false;
			}
		}


		private void StopScroll()
		{
			GetTBody().Stop(true);
		}

		private void UpdateDayFieldsMap()
		{
			var tds = jQuery
				.Select("td", CalendarRootElement)
				.GetItems()
				.Cast<Element>()
				.ToList();

			int i = 0;
			foreach (var td in tds)
			{
				var id = int.Parse(td.Id);
				var rowNb = i/7;
				var dayField = GetDayField(id);
				dayField.YIdx = rowNb;
				if (dayField.TdElement == null)
				{
					dayField.TdElement = jQuery.FromElement(td);
					dayField.DivElement = jQuery.Select("div", td).First();
				}
				i++;
			}
		}


		private void UpdateEnableStatusOfMonthNavigation()
		{
			var previousMonthLinkJq = jQuery.FromElement(GetPrevMonthLink());
			var previousMonth = _firstDayOfActiveMonth.AddDaysSafe(-1);
			if (previousMonth < GetFirstEnabledDay())
			{
				previousMonthLinkJq.RemoveClass("enabled");
				previousMonthLinkJq.AddClass("disabled");
			}
			else
			{
				previousMonthLinkJq.RemoveClass("disabled");
				previousMonthLinkJq.AddClass("enabled");
			}

			var nextMonthLinkJq = jQuery.FromElement(GetNextMonthLink());
			var nextMonth = _firstDayOfActiveMonth.AddMonths(1);
			if (nextMonth > GetLastEnabledDay())
			{
				nextMonthLinkJq.RemoveClass("enabled");
				nextMonthLinkJq.AddClass("disabled");
			}
			else
			{
				nextMonthLinkJq.RemoveClass("disabled");
				nextMonthLinkJq.AddClass("enabled");
			}

		}

		private void UpdateSelection()
		{
			if (!_isSelectionModeOn)
				return;
			DoForEachDayField((dayField, currentClass, newClass, isInSelection) =>
			{
				if (currentClass != newClass)
					dayField.DivElement.Attribute("class", newClass);
			});
		}


		private void WriteTDs(StringBuilder html, DateTime startDate, List<Range> selectedRanges, int startId)
		{
			var currentDate = startDate;
			for (int row = 0; row < VisibleCountOfRows; row++)
			{
				html.AppendLine("				<tr>");
				for (int weekDay = 0; weekDay < 7; weekDay++)
				{
					var isActiveMonth = currentDate.Month == _firstDayOfActiveMonth.Month && currentDate.Year == _firstDayOfActiveMonth.Year;
					var currentClass = new DayFieldClassAttribute(
						isActiveMonth, 
						IsInRanges(_enabledRanges, currentDate),
						GetSelectionIdxOfDay(currentDate, selectedRanges));

					var dayField = new DayField(startId, weekDay, row, currentDate, currentClass);

					if (_dayFields.Count > 0)
					{
						var id = dayField.Id;
						if (_dayFields.Last().Id < id)
						{
							_dayFields.Add(dayField);
						}
						else
						{
							for (int i = 0; i < _dayFields.Count; i++)
							{
								if (_dayFields[i].Id > id)
								{
									_dayFields.Insert(i, dayField);
									break;
								}
							}
						}
					}
					else
					{
						_dayFields.Add(dayField);
					}

					AppendLin(html, "				<td class=\"{3}\" id=\"{2}\"><div class='{1}'>{0}</div></td>",
						currentDate.Day,
						currentClass,
						startId,
						isActiveMonth ? "cm" : "om");
					currentDate = currentDate.AddDaysSafe(1);
					startId++;
				}
				html.AppendLine("				</tr>");
			}
		}

		private void WriteTemplateOfPicker(StringBuilder html, InputElement inputElement)
		{
			var selectedRanges = GetSelectedRangesFromInputElement(inputElement);
			_dayFields.Clear();
			int id = 10000*CalendarId + 777;
			var firstDayOfMonth = _firstDayOfActiveMonth;
			var firstWeekDayOfMonth = firstDayOfMonth.DayOfWeek;
			var currentDate = firstDayOfMonth;
			if (firstWeekDayOfMonth != DayOfWeek.Monday)
			{
				if (firstWeekDayOfMonth == DayOfWeek.Sunday)
					currentDate = currentDate.AddDaysSafe(-6);
				else
					currentDate = currentDate.AddDaysSafe(- (int)firstWeekDayOfMonth + 1);
			}

			html.AppendLine("	<div class='picker'>");
			html.AppendLine("		<div class='title text-center wrapper clearfix'>");
			AppendLin(html,"			<div class='pull-left'><a class='label text-center previousMonth' title='{0}' href='#'><span class='glyphicon glyphicon-backward iconPreviousMonth'></a></div>",
				MultiSelectionCalendarResource.HintPreviousMonth);
			AppendLin(html, "			{0} <b>{1}</b>", GetNameOfMonth(_firstDayOfActiveMonth.Month), _firstDayOfActiveMonth.Year);
			AppendLin(html,"			<div class='pull-right'><a class='label text-center nextMonth' title='{0}' href='#'><span class='glyphicon glyphicon-forward iconPreviousMonth'></a></div>",
				MultiSelectionCalendarResource.HintNextMonth);
			html.AppendLine("		</div>");
			html.AppendLine("		<table class='table'>");
			html.AppendLine("			<thead>");
			html.AppendLine("				<tr>");
			for (int weekDay = 0; weekDay < 7; weekDay++)
				AppendLin(html, "					<th><div>{0}</div></th>", GetWeekDay(weekDay));
			html.AppendLine("				</tr>");
			html.AppendLine("			</thead>");
			html.AppendLine("			<tbody>");
			WriteTDs(html, currentDate, selectedRanges, id);
			html.AppendLine("			</tbody>");
			html.AppendLine("		</table>");
			html.AppendLine("	</div>");
		}

		#endregion

		#endregion
	}
}
