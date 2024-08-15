# TestUppgift
Testuppgift för att testa weather.com.

Endast test 1 är helt end to end pga tidsbrist, men alla är (oftast) funktionella. De är inte helt robusta, och jag hade gärna suttit längre och pillat för att dels bygga ut test 2 och 3 men också göra test 1 mer pålitligt.

Det dök dock upp problem när testen skulle fungera i CI på github, framförallt chromium. Jag lyckades inte komma underfund helt med vad problemet var, men mycket av det löstes genom att lägga till en paus på 4 sekunder (slowmo) mellan varje del i testen. Jag hade gärna satt in mig mer i vad problemet är men inser att jag inte kan lägga för mycket tid på det här just nu.
