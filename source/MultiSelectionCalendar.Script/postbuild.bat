::

:: %1: project dir
:: %2: debug release

::**********************************************************
:: generate stylesheet from LESS
::**********************************************************
set return=1
set lessfilename=MultiSelectionCalendar
goto lesscompile
:r1


::**********************************************************
:: minify generated JavaScript-files
::**********************************************************

"%1..\packages\Microsoft Ajax Minifier\ajaxmin.exe" "%1bin\%2\MultiSelectionCalendar.js" -out "%1bin\%2\MultiSelectionCalendar.min.js" -clobber
"%1..\packages\Microsoft Ajax Minifier\ajaxmin.exe" "%1Translations\MultiSelectionCalendarResource.js" -out "%1Translations\MultiSelectionCalendarResource.min.js" -clobber
"%1..\packages\Microsoft Ajax Minifier\ajaxmin.exe" "%1Translations\MultiSelectionCalendarResource.es.js" -out "%1Translations\MultiSelectionCalendarResource.es.min.js" -clobber
"%1..\packages\Microsoft Ajax Minifier\ajaxmin.exe" "%1Translations\MultiSelectionCalendarResource.en.js" -out "%1Translations\MultiSelectionCalendarResource.en.min.js" -clobber

::**********************************************************
:: copy output to ..\packages\MultiSelectionCalendar
::**********************************************************
del "%1..\packages\MultiSelectionCalendar\*.*" /f /q /s

copy "%1bin\%2\*.js" "%1..\packages\MultiSelectionCalendar\*.js"
copy "%1Translations\*.js" "%1..\packages\MultiSelectionCalendar\*.js"
copy "%1MultiSelectionCalendar.less" "%1..\packages\MultiSelectionCalendar\MultiSelectionCalendar.less"
copy "%1MultiSelectionCalendar.css" "%1..\packages\MultiSelectionCalendar\MultiSelectionCalendar.css"

::**********************************************************
:: copy output to ..\..\lib
::**********************************************************
del "%1..\..\lib\*.*" /f /q /s
md "%1..\..\lib\Scripts"
md "%1..\..\lib\Styles"
copy "%1bin\%2\*.js" "%1..\..\lib\Scripts\*.js"
copy "%1Translations\*.js" "%1..\..\lib\Scripts\*.js"
copy "%1MultiSelectionCalendar.less" "%1..\..\lib\Styles\MultiSelectionCalendar.less"
copy "%1MultiSelectionCalendar.css" "%1..\..\lib\Styles\MultiSelectionCalendar.css"


::**********************************************************
:: copy referenced libraries to ..\..\lib
::**********************************************************
copy "%1..\packages\jquery-mousewheel\jquery.mousewheel.js" "%1..\..\lib\Scripts\jquery.mousewheel.js"
copy "%1..\packages\jquery-mousewheel\jquery.mousewheel.min.js" "%1..\..\lib\Scripts\jquery.mousewheel.min.js"
copy "%1..\packages\Saltarelle.Utils\*.js" "%1..\..\lib\Scripts\*.js"
copy "%1..\packages\Saltarelle.Linq.2.4.0\*.js" "%1..\..\lib\Scripts\*.js"
copy "%1..\packages\Saltarelle.Runtime.2.7.0\*.js" "%1..\..\lib\Scripts\*.js"


:: *********************************
:: lesscompile
:: parameters: lessfilename
:: *********************************
goto end

:lesscompile
%1..\packages\dotless.1.5.2\tool\dotless.compiler.exe -m %1%lessfilename%.less %1%lessfilename%.css
goto r%return%

:: *********************************
:: end
:: *********************************
:end

