using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace Saltarelle.MultiSelectionCalendar
{
	public class MultiSelectionCalendar
	{
		public class Range
		{
			public DateTime Start
			{
				[InlineCode("{this}.get_start()")]
				get
				{
					return new DateTime();
				}
			}

			public DateTime End
			{
				[InlineCode("{this}.get_end()")]
				get
				{
					return new DateTime();
				}
			}

			public int SelectionIdx
			{
				[InlineCode("{this}.get_selectionIdx()")]
				get { return 0; }
			}

			[InlineCode("new global.MultiSelectionCalendar.Range({start}, {end}, {selectionIdx})")]
			public Range(DateTime start, DateTime end, int selectionIdx)
			{
			}
		}

		[InlineCode("global.MultiSelectionCalendar.MultiSelectionCalendar.init()")]
		public static void Init()
		{

		}

		[InlineCode("global.MultiSelectionCalendar.MultiSelectionCalendar.getDateRangesFromString({timeRanges})")]
		public static List<Range> GetDateRangesFromString(string timeRanges)
		{
			return null;
		}

		[InlineCode("global.MultiSelectionCalendar.MultiSelectionCalendar.getStringFromDateRanges({ranges})")]
		public static string GetStringFromDateRanges(List<Range> ranges)
		{
			return null;
		}
	}
}
