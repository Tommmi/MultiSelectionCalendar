::
:: %1: solution dir
:: %2: project dir
:: %3: debug release


:: copy MultiSelectionCalendar.Script.js
if exist attrib %2TestWebsite\Scripts\MultiSelectionCalendar.Script.js -r %2TestWebsite\Scripts\MultiSelectionCalendar.Script.js
copy %2..\packages\MultiSelectionCalendar\*.js %2TestWebsite\Scripts\*.js

:: copy MultiSelectionCalendar.Test.Script.js
if exist attrib %2TestWebsite\Scripts\MultiSelectionCalendar.Test.Script.js -r %2TestWebsite\Scripts\MultiSelectionCalendar.Test.Script.js
copy %2..\MultiSelectionCalendar.Test.Script\bin\%3\MultiSelectionCalendar.Test.Script.js %2TestWebsite\Scripts\MultiSelectionCalendar.Test.Script.js

:: copy Saltarelle.Utils.js
if exist attrib %2TestWebsite\Scripts\Saltarelle.Utils.js -r %2TestWebsite\Scripts\Saltarelle.Utils.js
copy %2..\packages\Saltarelle.Utils\*.js %2TestWebsite\Scripts\*.js

:: copy styles
copy %2..\packages\MultiselectionCalendar\*.css %2TestWebsite\Styles\*.css

