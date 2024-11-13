#!/bin/bash

startdate=$2-01-01
loopenddate=$2-12-31
currentdate=$startdate

airport=$1

if [ ! -d "weatherData" ]; then
	mkdir weatherData
fi
if [ ! -d "weatherData/$airport" ]; then
	mkdir "weatherData/$airport"
fi


until [ "$currentdate" == "$loopenddate" ]
do
	day=$(gdate --date "$currentdate" +%d)
	month=$(gdate --date "$currentdate" +%m)
	year=$(gdate --date "$currentdate" +%Y)

	filename="weatherData/$airport/$month-$day-$year.tsv"
	echo "Starting $currentdate"
	./tablescrape.py https://www.wunderground.com/history/airport/$airport/$year/$month/$day/DailyHistory.html 5 > "$filename"
	
	# prefix the date to the time
	sed -i -e "2,\$s/^/$currentdate /" "$filename"

	# Output all the data to one big file
	outputFile="./weatherData/$airport/${airport}-${year}-complete.tsv"
	if [ "$currentdate" == "$startdate" ]; then
		cat "$filename" >> "$outputFile"
	else
		tail -n +2 "$filename" >> "$outputFile"
	fi

	echo "Finished $currentdate"
	currentdate=$(gdate --date "$currentdate day 1" +%Y-%m-%d)
done



