namespace MultiSelectionCalendar
{
	/// <summary>
	/// Represents the class attribute value of a day field.
	/// The class value encodes following states of the day field:
	/// - is the date inside the currently selected month ?
	/// - may the date be selected anyhow ?
	/// - Is the date marked by a selection and if yes what selection index is it ?
	/// There are folowing possible class values:
	/// cme: currently selected month, enabled, not marked
	/// cmd: currently selected month, disabled, not marked
	/// ome: currently not selected month, enabled, not marked
	/// omd: currently not selected month, disabled, not marked
	/// cmes1: currently selected month, enabled, marked with index 1
	/// cmes2: currently selected month, enabled, marked with index 2
	/// ...
	/// omes1: currently not selected month, enabled, marked with index 1
	/// omes2: currently not selected month, enabled, marked with index 2
	/// ...
	/// 
	/// </summary>
	internal class DayFieldClassAttribute
	{
		/// <summary>
		/// is the date inside the currently selected month ?
		/// </summary>
		public bool IsSelectedMonth { get; set; }
		/// <summary>
		/// may the date be selected anyhow ?
		/// </summary>
		public bool IsEnabledDay { get; set; }
		/// <summary>
		/// Is the date marked by a selection and if yes what selection index is it ?
		/// 0: not selected
		/// </summary>
		public int SelectionIdx { get; set; }

		/// <summary>
		/// constructor
		/// </summary>
		/// <param name="isSelectedMonth">
		/// is the date inside the currently selected month ?
		/// </param>
		/// <param name="isEnabledDay">
		/// may the date be selected anyhow ?
		/// </param>
		/// <param name="selectionIdx">
		/// Is the date marked by a selection and if yes what selection index is it ?
		/// 0: not selected
		/// </param>
		public DayFieldClassAttribute(
			bool isSelectedMonth,
			bool isEnabledDay,
			int selectionIdx)
		{
			IsSelectedMonth = isSelectedMonth;
			IsEnabledDay = isEnabledDay;
			SelectionIdx = selectionIdx;
		}

		/// <summary>
		/// returns the CSS class value
		/// </summary>
		/// <returns></returns>
		public override string ToString()
		{
			return
				(IsSelectedMonth ? "cm" : "om")
				+ (IsEnabledDay ? "e" : "d")
				+ (SelectionIdx > 0 ? "s" + SelectionIdx : "");
		}

		/// <summary>
		/// constructor
		/// </summary>
		/// <param name="classValue">
		/// The class value encodes following states of the day field:
		/// - is the date inside the currently selected month ?
		/// - may the date be selected anyhow ?
		/// - Is the date marked by a selection and if yes what selection index is it ?
		/// There are folowing possible class values:
		/// cme: currently selected month, enabled, not marked
		/// cmd: currently selected month, disabled, not marked
		/// ome: currently not selected month, enabled, not marked
		/// omd: currently not selected month, disabled, not marked
		/// cmes1: currently selected month, enabled, marked with index 1
		/// cmes2: currently selected month, enabled, marked with index 2
		/// ...
		/// omes1: currently not selected month, enabled, marked with index 1
		/// omes2: currently not selected month, enabled, marked with index 2
		/// ...
		/// </param>
		public DayFieldClassAttribute(string classValue)
		{
			if (classValue == null)
				return;

			IsSelectedMonth = classValue.StartsWith("cm");
			IsEnabledDay = classValue.Contains("e");
			if (classValue.Length > 3)
			{
				if (classValue[classValue.Length - 2] == 's')
					SelectionIdx = int.Parse(classValue[classValue.Length - 1].ToString());
			}

		}
	}
}