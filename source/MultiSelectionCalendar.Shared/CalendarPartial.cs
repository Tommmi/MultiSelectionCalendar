using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MultiSelectionCalendar
{
	public static partial class Calendar
	{
		private static DateTime? ParseExact(string date, string format)
		{
			return DateTime.ParseExact(date, format, CultureInfo.InvariantCulture);
		}

		private static string DateToString(DateTime date, string format)
		{
			return date.ToString(format, CultureInfo.InvariantCulture);
		}
	}
}
