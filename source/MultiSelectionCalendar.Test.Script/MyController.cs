using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using AngularJS;
using Saltarelle.Utils;

// ReSharper disable InconsistentNaming
// ReSharper disable NotAccessedField.Global

namespace MultiSelectionCalendar.Test.Script
{
	public enum SelectionOptionEnum
	{
		delete,
		red,
		green,
		blue,
	}

	[Reflectable, Inject("$scope")]
	public class MyController
	{
		private readonly MyScope _scope;

		public class MyScope : Scope
		{
			public int activeColorIdx;
			/// <summary>
			/// automatically updated by rangesAsString
			/// </summary>
			public List<Saltarelle.MultiSelectionCalendar.MultiSelectionCalendar.Range> ranges;
			/// <summary>
			/// automatically updated by ranges
			/// </summary>
			public string rangesAsString;
			/// <summary>
			/// automatically updated by ranges
			/// </summary>
			public Array rangesAsFormattedDisplayTexts;
		}

		public MyController(Scope _scope)
		{
			this._scope = Utils.Enhance<MyScope, Scope>(_scope); // siehe TUtils

			this._scope.WatchProperty(s => s.ranges, OnRangesChanged);
			this._scope.WatchProperty(s => s.rangesAsString, OnRangesAsStringChanged);

			this._scope.activeColorIdx = (int)SelectionOptionEnum.red;
			this._scope.ranges = new List<Saltarelle.MultiSelectionCalendar.MultiSelectionCalendar.Range>()
			{
				new Saltarelle.MultiSelectionCalendar.MultiSelectionCalendar.Range(
					new DateTime(2015, 10, 1),
					new DateTime(2015, 10, 5),
					(int) SelectionOptionEnum.red),
				new Saltarelle.MultiSelectionCalendar.MultiSelectionCalendar.Range(
					new DateTime(2015,11,5),
					new DateTime(2015,11,5),
					(int)SelectionOptionEnum.blue)
			};
		}

		private void OnRangesChanged(List<Saltarelle.MultiSelectionCalendar.MultiSelectionCalendar.Range> newValue, List<Saltarelle.MultiSelectionCalendar.MultiSelectionCalendar.Range> oldValue)
		{
			UpdateRanges();
		}

		private void OnRangesAsStringChanged(string newvalue, string oldvalue)
		{
			if ( newvalue == oldvalue)
				return;
			_scope.ranges = Saltarelle.MultiSelectionCalendar.MultiSelectionCalendar.GetDateRangesFromString(newvalue);
			UpdateRanges();
		}

		private void UpdateRanges()
		{
			_scope.rangesAsString = Saltarelle.MultiSelectionCalendar.MultiSelectionCalendar.GetStringFromDateRanges(_scope.ranges.ToList());
			_scope.rangesAsFormattedDisplayTexts = _scope.ranges
				.Select(r => string.Format(
					"{0}: {1:yy.MM.dd} - {2:yy.MM.dd}",
					((SelectionOptionEnum) r.SelectionIdx).ToString(),
					r.Start,
					r.End))
				.ToArray();
		}


	}
}
