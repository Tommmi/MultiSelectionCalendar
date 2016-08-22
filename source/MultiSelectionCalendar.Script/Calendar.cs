using System;
using System.Collections.Generic;
using System.Text;

namespace MultiSelectionCalendar
{
	public static partial class Calendar
    {
		public static List<Range> GetDateRangesFromString(this string timeRanges)
		{
			var ranges = new List<Range>();
			if (timeRanges == null)
			{
				ranges.Add(new Range(new DateTime(1940, 1, 1), new DateTime(2100, 1, 1), 0));
				return ranges;
			}
			foreach (var part in timeRanges.Split(';'))
			{
				var rangeText = part;
				int selectionIdx = 0;
				if (rangeText.Length > 1)
				{
					if (rangeText[1] == ':')
					{
						int.TryParse(rangeText[0].ToString(), out selectionIdx);
						rangeText = rangeText.Substring(2);
					}
				}
				var dates = rangeText.Split('-');
				if (dates.Length == 2)
				{
					var start = ParseExact(dates[0], "dd.MM.yyyy");
					var end = ParseExact(dates[1], "dd.MM.yyyy");
					if (start.HasValue && end.HasValue)
						ranges.Add(new Range(start.Value, end.Value, selectionIdx));
				}
			}
			return ranges;
		}

		public static string GetStringFromDateRanges(List<Range> ranges)
		{
			var buf = new StringBuilder();
			bool firstTime = true;
			foreach (var range in ranges)
			{
				if (firstTime)
					firstTime = false;
				else
					buf.Append(";");

				buf.Append(range.SelectionIdx);
				buf.Append(":");
				buf.Append(DateToString(range.Start, "dd.MM.yyyy"));
				buf.Append("-");
				buf.Append(DateToString(range.End, "dd.MM.yyyy"));
			}
			return buf.ToString();
		}
	}
}
