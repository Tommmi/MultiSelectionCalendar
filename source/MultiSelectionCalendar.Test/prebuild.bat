::
:: %1: solution dir
:: %2: project dir
:: %3: debug release


:: copy multiselectioncalendar.script.js
if exist attrib %2TestWebsite\scripts\multiselectioncalendar.script.js -r %2TestWebsite\scripts\multiselectioncalendar.script.js
copy %2..\packages\MultiSelectionCalendar\*.js %2TestWebsite\scripts\*.js

:: copy multiselectioncalendar.test.script.js
if exist attrib %2TestWebsite\scripts\multiselectioncalendar.test.script.js -r %2TestWebsite\scripts\multiselectioncalendar.test.script.js
copy %2..\MultiSelectionCalendar.Test.Script\bin\%3\multiselectioncalendar.test.script.js %2TestWebsite\scripts\multiselectioncalendar.test.script.js

:: copy saltarelle.utils.js
if exist attrib %2TestWebsite\scripts\saltarelle.utils.js -r %2TestWebsite\scripts\saltarelle.utils.js
copy %2..\packages\saltarelle.utils\*.js %2TestWebsite\scripts\*.js

:: copy styles
copy %2..\packages\MultiselectionCalendar\*.css %2TestWebsite\styles\*.css

