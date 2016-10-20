::

:: %1: project dir
:: %2: debug release
:: %3: MultiSelectionCalendar.Shared.dll

::**********************************************************
:: copy output to ..\..\lib\MultiSelectionCalendar.Shared
::**********************************************************
md "%1..\..\lib\MultiSelectionCalendar.Shared"
del "%1..\..\lib\MultiSelectionCalendar.Shared\*.*" /f /q /s
copy "%1bin\%2\%3" "%1..\..\lib\MultiSelectionCalendar.Shared\%3"


