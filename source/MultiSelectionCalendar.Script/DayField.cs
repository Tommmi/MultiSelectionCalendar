using System;
using jQueryApi;

namespace MultiSelectionCalendar
{
	/// <summary>
	/// Represents a rectangular day field in a calendar.
	/// Note ! The day field is associated with a concrete existing HTML-element in the DOM,
	/// but may be not visible, since it could be scrolled outside the viewport.
	/// </summary>
	internal class DayField
	{
		/// <summary>
		/// This id is unique on webpage
		/// </summary>
		public int Id { get; set; }
		/// <summary>
		/// column index of the day field. 0: first left column.
		/// </summary>
		public int XIdx { get; set; }
		/// <summary>
		/// row index of the day field. 0: first top row.
		/// </summary>
		public int YIdx { get; set; }
		/// <summary>
		/// the date of the day
		/// </summary>
		public DateTime Date { get; set; }
		/// <summary>
		/// the td-element of the table
		/// </summary>
		public jQueryObject TdElement { get; set; }
		/// <summary>
		/// the CSS class of the day field
		/// </summary>
		public DayFieldClassAttribute DayFieldClass;
		/// <summary>
		/// the CSS class of the day field
		/// see DayFieldClassAttribute for further information
		/// </summary>
		public string CurrentClass
		{
			get
			{
				return DayFieldClass.ToString();
			}

			set
			{
				DayFieldClass = new DayFieldClassAttribute(value);
			}
		}

		/// <summary>
		/// the div-element surrounding the inner day display
		/// <code><![CDATA[
		/// <td class="cm" id="6523">
		///		<div class='cmes1'>13</div>
		/// </td>
		/// ]]></code>
		/// </summary>
		public jQueryObject DivElement { get; set; }

		/// <summary>
		/// true, if the day field may be selected
		/// </summary>
		public bool IsEnabled {  get { return DayFieldClass.IsEnabledDay; } }
		/// <summary>
		/// true, if all events have been bound to the associated HTML-element allready
		/// </summary>
		public bool IsMouseEventBound { get; set; }

		/// <summary>
		/// To which selection group belongs the day field ?
		/// 0: The day field isn't been marked at all
		/// 1: The day field belongs to selection 1 (e.g.: is marked red)
		/// 2: The day field belongs to selection 2 
		/// ...
		/// </summary>
		public int SelectionIdx
		{
			get { return DayFieldClass.SelectionIdx; }
		}

		/// <summary>
		/// constructor
		/// </summary>
		/// <param name="id">
		/// This id is unique on webpage
		/// </param>
		/// <param name="xIdx">
		/// column index of the day field. 0: first left column.
		/// </param>
		/// <param name="yIdx">
		/// row index of the day field. 0: first top row.
		/// </param>
		/// <param name="date">
		/// the date of the day
		/// </param>
		/// <param name="currentClass">
		/// the CSS class of the day field
		/// see DayFieldClassAttribute for further information
		/// </param>
		public DayField(
			int id,
			int xIdx,
			int yIdx,
			DateTime date,
			string currentClass)
		{
			Id = id;
			XIdx = xIdx;
			YIdx = yIdx;
			Date = date;
			DayFieldClass = new DayFieldClassAttribute(currentClass);
		}

		/// <summary>
		/// constructor
		/// </summary>
		/// <param name="id">
		/// This id is unique on webpage
		/// </param>
		/// <param name="xIdx">
		/// column index of the day field. 0: first left column.
		/// </param>
		/// <param name="yIdx">
		/// row index of the day field. 0: first top row.
		/// </param>
		/// <param name="date">
		/// the date of the day
		/// </param>
		/// <param name="currentClass">
		/// the CSS class of the day field
		/// </param>
		public DayField(
			int id,
			int xIdx,
			int yIdx,
			DateTime date,
			DayFieldClassAttribute currentClass)
		{
			Id = id;
			XIdx = xIdx;
			YIdx = yIdx;
			Date = date;
			DayFieldClass = currentClass;
		}
	}
}
