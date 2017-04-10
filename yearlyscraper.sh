#!/bin/bash

currentdate=2016-01-01
loopenddate=2016-12-31

airport=KOAK

if [ ! -d "weatherData" ]; then
	mkdir weatherData
	if [ ! -d "weatherData/$airport" ]; then
		mkdir "weatherData/$airport"
	fi
fi

until [ "$currentdate" == "$loopenddate" ]
do
	day=$(gdate --date "$currentdate" +%d)
	month=$(gdate --date "$currentdate" +%m)
	year=$(gdate --date "$currentdate" +%y)

	echo "Starting $currentdate"
	./tablescrape.py https://www.wunderground.com/history/airport/$airport/2016/$month/$day/DailyHistory.html 5 > "weatherData/$airport/$month-$day-$year.tsv"
	echo "Finished $currentdate"

	currentdate=$(gdate --date "$currentdate day 1" +%Y-%m-%d)
done
