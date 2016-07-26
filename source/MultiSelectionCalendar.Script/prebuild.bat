::
:: %1: project dir

::**********************************************************
:: generate js files from resources
::**********************************************************

del "%1Translations\*.cs" /f /q /s
del "%1Translations\*.js" /f /q /s
"%1..\external\Resx2Js\resx2js.exe" resxFilePath="%1Translations\MultiSelectionCalendarResource.resx" namespaceJs=MultiSelectionCalendar transpiler=Saltarelle




