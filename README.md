# MultiSelectionCalendar
`MultiSelectionCalendar` is a JavaScript calendar control for marking several date ranges and associate them to different selection groups.

![Calendar](Documentation/Calendar1.jpg)

## Demo
See [demo](http://gerlach-it.de/uploads/demos/calendar/MultiSelectionCalendarTestPage.html) here.

## History
see [history](Documentation/history.md)

## Programming

### How To Install
[Download](https://github.com/Tommmi/MultiSelectionCalendar/archive/master.zip) the latest version of MultiSelectionCalendar from Github repository and copy the following JavaScript files and style sheets to your web project:
-   [{repository}\lib\Scripts\jquery.mousewheel.min.js](lib/Scripts/jquery.mousewheel.min.js) (third party [library](https://github.com/jquery/jquery-mousewheel))
-   [{repository}\lib\Scripts\mscorlib.min.js](lib/Scripts/mscorlib.min.js) (third party [library](https://github.com/Saltarelle/SaltarelleCompiler))
-   [{repository}\lib\Scripts\linq.min.js](lib/Scripts/linq.min.js) (third party [library](https://github.com/Saltarelle/SaltarelleLinq))
-   [{repository}\lib\Scripts\multiselectioncalendarresource.js](lib/Scripts/multiselectioncalendarresource.js)
-   optional: [{repository}\lib\Scripts\multiselectioncalendarresource.en.js](lib/Scripts/multiselectioncalendarresource.en.js)
-   optional: [{repository}\lib\Scripts\multiselectioncalendarresource.es.js](lib/Scripts/multiselectioncalendarresource.es.js)
-   [{repository}\lib\Scripts\multiselectioncalendar.min.js](lib/Scripts/multiselectioncalendar.min.js)
-   [{repository}\lib\Styles\multiselectioncalendar.less](lib/Styles/multiselectioncalendar.less)
-   optional: [{repository}\lib\Styles\multiselectioncalendar.css](lib/Styles/multiselectioncalendar.css)

### Simple Example
Insert an input tag of type text into your webpage and assign the CSS class "multiSelectionCalendar":
```html
<!DOCTYPE html>
<html>
<head>
    <link href="styles/bootstrap.css" rel="stylesheet" />
    <link href="styles/multiselectioncalendar.css" rel="stylesheet" />
</head>
<body>
    <input 
        type="text" 
        class="multiSelectionCalendar"         
        selectionIdx="2" />

    <script src="scripts/jquery-1.10.2.js"></script>
    <script src="scripts/bootstrap.js"></script>
    <script src="scripts/mscorlib.min.js"></script>
    <script src="scripts/linq.js"></script>
    <script src="scripts/saltarelle.utils.js"></script>
    <script src="scripts/multiselectioncalendarresource.js"></script>
    <script src="scripts/jquery.mousewheel.min.js"></script>
    <script src="scripts/multiselectioncalendar.js"></script>
</body>
</html>
```
You'll get a calendar showing the current month. No date ranges are preselected since attribute `value` wasn't set.
Now you can select single dates and date ranges with ethe mouse. The selected dates will be assigned to selection index 2.
If you do so, the value of the input field will change automatically to some value like this:
```html
    <input 
        type="text" 
        class="hidden ng-untouched ng-valid ng-dirty ng-valid-parse" 
        selectionidx="2" 
        value="2:12.06.2016-20.06.2016;2:25.06.2016-25.06.2016" />
```
To change the selection color please change the attribute `selectionidx` to a natural number `"0" < x < "10"`. `selectionidx="0"` will erase marked dates. Use this feature to let the user remove selections.

### Programming Reference
#### `<input type="text" class="multiSelectionCalendar">`
```html
    <input type="text" class="multiSelectionCalendar" [selectionidx] [value] [enabledRanges] [language]/>
```
* `selectionidx`:  
    All dates, the user will select from now on, will be assigned to the given selection index.  
    `selectionidx="0"` will erase marked dates, when they are being selected now ! Use this feature to let the user
    remove selections.
    possible values: "0", "1", .., "9"   
    Default: "0"  
* `value`:  
    The date ranges which should be edited by the user. `value` will be updated automatically, when user selects dates.  
    example: "2:12.06.2016-20.06.2016;4:25.06.2016-25.06.2016"  
    Default: ""  
    Format: {selection index}:{start date}-{end date};{selection index}:{start date}-{end date};...
* `enabledRanges`:  
    The date ranges which may be markable by the user.   
    example: "12.06.2016-20.06.2016;25.06.2016-25.06.2016"  
    Default: ""  (means all dates are enabled)  
    Format: {start date}-{end date};{start date}-{end date};...
* `language`:  
    ISO code of the active language. Note ! The language dependent strings are coded in the files
    `multiselectioncalendarresource...js`. Feel free to add new languages.  
    example: "en"  
    Default: ""  :means default language (it's currently german)  
    Format: "en","de","es", "default",""

#### Using MultiSelectionCalendar with Saltarelle

[Saltarelle](https://github.com/Saltarelle/SaltarelleCompiler) is a transpiler to generate JavaScript code from C#.
MultiSelectionCalendar brings some extra support for using MultiSelectionCalendar in a JavaScript program. 
There is an assembly [Saltarelle.MultiSelectionCalendar.dll](lib/Saltarelle.MultiSelectionCalendar) which provides some useful C# functions in a Saltarelle project:

```CSharp
namespace Saltarelle.MultiSelectionCalendar
{
	public class MultiSelectionCalendar
	{
		public static void Init()
		{ ...
		}

		public static List<Range> GetDateRangesFromString(string timeRanges)
		{ ...
		}

		public static string GetStringFromDateRanges(List<Range> ranges)
		{ ...
		}
	}
}
```
Use the static function `Init()` to reparse the HTML-DOM, when having inserted new calendar controls.
Use the static function `GetDateRangesFromString()` to parse a date range list from a string.
Use the static function `GetStringFromDateRanges()` to encode a list of date ranges to a string.

    
  





