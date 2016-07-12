::

:: %1: project dir
:: %2: debug release
:: %3: Saltarelle.MultiSelectionCalendar.dll

::**********************************************************
:: copy output to ..\packages\MultiSelectionCalendar
::**********************************************************

del "%1..\packages\Saltarelle.MultiSelectionCalendar\*.*" /f /q /s
copy "%1bin\%2\%3" "%1..\packages\Saltarelle.MultiSelectionCalendar\%3"


::**********************************************************
:: copy output to ..\..\lib
::**********************************************************
md "%1..\..\lib\Saltarelle.MultiSelectionCalendar"
del "%1..\..\lib\Saltarelle.MultiSelectionCalendar\*.*" /f /q /s
copy "%1bin\%2\%3" "%1..\..\lib\Saltarelle.MultiSelectionCalendar\%3"


