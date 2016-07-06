using System;
using System.Threading.Tasks;
using AngularJS;
using jQueryApi;
using MultiSelectionCalendar.Test.Script;

namespace MultiSelectionCalendar1.Test.Script
{
	class Program
	{
		static void Main()
		{
			jQuery.Select(".test").Change(OnInputChanged);
			var module = new Module("multiSelectorCalendarTest");
			module.Controller<MyController>();
		}

		private static void OnInputChanged(jQueryEvent queryEvent)
		{
			
		}
	}
}
