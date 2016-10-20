::

:: %1: project dir
:: %2: debug release
:: %3: Saltarelle.MultiSelectionCalendar.dll

::**********************************************************
:: copy output to ..\..\lib\Saltarelle.MultiSelectionCalendar
::**********************************************************
echo md "%1..\..\lib\Saltarelle.MultiSelectionCalendar"
md "%1..\..\lib\Saltarelle.MultiSelectionCalendar"
echo del "%1..\..\lib\Saltarelle.MultiSelectionCalendar\*.*" /f /q /s
del "%1..\..\lib\Saltarelle.MultiSelectionCalendar\*.*" /f /q /s
echo copy "%1bin\%2\%3" "%1..\..\lib\Saltarelle.MultiSelectionCalendar\%3"
copy "%1bin\%2\%3" "%1..\..\lib\Saltarelle.MultiSelectionCalendar\%3"


