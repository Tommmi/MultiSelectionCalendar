::
:: %1: solution dir
:: %2: project dir
:: %3: debug release


:: copy multiselectioncalendar.script.js
if exist %2TestWebsite\scripts\multiselectioncalendar.script.js attrib -r %2TestWebsite\scripts\multiselectioncalendar.script.js
copy %2..\MultiSelectionCalendar.Script\bin\%3\*.js %2TestWebsite\scripts\*.js

:: copy multiselectioncalendar.test.script.js
if exist %2TestWebsite\scripts\multiselectioncalendar.test.script.js attrib -r %2TestWebsite\scripts\multiselectioncalendar.test.script.js
copy %2..\MultiSelectionCalendar.Test.Script\bin\%3\multiselectioncalendar.test.script.js %2TestWebsite\scripts\multiselectioncalendar.test.script.js

:: copy saltarelle.utils.js
if exist %2TestWebsite\scripts\saltarelle.utils.js attrib -r %2TestWebsite\scripts\saltarelle.utils.js
copy %2..\external\saltarelle.utils\*.js %2TestWebsite\scripts\*.js

:: copy styles
copy %2..\MultiselectionCalendar.Script\*.css %2TestWebsite\styles\*.css

