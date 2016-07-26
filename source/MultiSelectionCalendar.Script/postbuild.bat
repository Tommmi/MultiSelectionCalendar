::

:: %1: project dir
:: %2: debug release

::**********************************************************
:: generate stylesheet from LESS
::**********************************************************
set return=1
set lessfilename=multiselectioncalendar
goto lesscompile
:r1


::**********************************************************
:: minify generated JavaScript-files
::**********************************************************

"%1..\packages\Microsoft Ajax Minifier\ajaxmin.exe" "%1bin\%2\multiselectioncalendar.js" -out "%1bin\%2\multiselectioncalendar.min.js" -clobber
"%1..\packages\Microsoft Ajax Minifier\ajaxmin.exe" "%1Translations\multiselectioncalendarresource.js" -out "%1Translations\multiselectioncalendarresource.min.js" -clobber
"%1..\packages\Microsoft Ajax Minifier\ajaxmin.exe" "%1Translations\multiselectioncalendarresource.es.js" -out "%1Translations\multiselectioncalendarresource.es.min.js" -clobber
"%1..\packages\Microsoft Ajax Minifier\ajaxmin.exe" "%1Translations\multiselectioncalendarresource.en.js" -out "%1Translations\multiselectioncalendarresource.en.min.js" -clobber

::**********************************************************
:: copy output to ..\packages\MultiSelectionCalendar
::**********************************************************
del "%1..\external\MultiSelectionCalendar\*.*" /f /q /s

copy "%1bin\%2\*.js" "%1..\external\MultiSelectionCalendar\*.js"
copy "%1Translations\*.js" "%1..\external\MultiSelectionCalendar\*.js"
copy "%1multiselectioncalendar.less" "%1..\external\MultiSelectionCalendar\multiselectioncalendar.less"
copy "%1multiselectioncalendar.css" "%1..\external\MultiSelectionCalendar\multiselectioncalendar.css"

::**********************************************************
:: copy output to ..\..\lib
::**********************************************************
del "%1..\..\lib\*.*" /f /q /s
md "%1..\..\lib\Scripts"
md "%1..\..\lib\Styles"
copy "%1bin\%2\*.js" "%1..\..\lib\scripts\*.js"
copy "%1Translations\*.js" "%1..\..\lib\scripts\*.js"
copy "%1multiselectioncalendar.less" "%1..\..\lib\Styles\multiselectioncalendar.less"
copy "%1multiselectioncalendar.css" "%1..\..\lib\Styles\multiselectioncalendar.css"


::**********************************************************
:: copy referenced libraries to ..\..\lib
::**********************************************************
copy "%1..\external\jquery-mousewheel\jquery.mousewheel.js" "%1..\..\lib\Scripts\jquery.mousewheel.js"
copy "%1..\external\jquery-mousewheel\jquery.mousewheel.min.js" "%1..\..\lib\Scripts\jquery.mousewheel.min.js"
copy "%1..\external\Saltarelle.Utils\*.js" "%1..\..\lib\Scripts\*.js"
copy "%1..\packages\Saltarelle.Linq.2.4.0\*.js" "%1..\..\lib\Scripts\*.js"
copy "%1..\packages\Saltarelle.Runtime.2.7.0\*.js" "%1..\..\lib\Scripts\*.js"


:: *********************************
:: lesscompile
:: parameters: lessfilename
:: *********************************
goto end

:lesscompile
del %1%lessfilename%.css /f /q 
%1..\packages\dotless.1.5.2\tool\dotless.compiler.exe -m %1%lessfilename%.less %1%lessfilename%.css
goto r%return%

:: *********************************
:: end
:: *********************************
:end

