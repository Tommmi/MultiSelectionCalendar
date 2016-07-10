using System;

namespace MultiSelectionCalendar
{
	public class Range
	{
		public DateTime Start { get; private set; }
		public DateTime End { get; private set; }
		public int SelectionIdx { get; private set; }

		public Range(DateTime start, DateTime end, int selectionIdx)
		{
			Start = start.Date;
			End = end.Date;
			SelectionIdx = selectionIdx;
		}
	}
}