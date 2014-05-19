import json
import _mysql

db = _mysql.connect(host='127.0.0.1', user='root', passwd='root', db='shorts')

for line in open('discarded-predictions.txt'):
	if line.strip():
		line = json.loads(line.strip())
		print
		try:
			print line['pred_class']
			pred_class = 0
			if line['pred_class'] == '0':
				pred_class = 1

			db.query("INSERT INTO learning (class, events, city, cloud_cover, mean_wind, max_temp, min_temp, precipitation) VALUES ('"+str(pred_class)+"', '"+line['events']+"', '"+str(line['city'])+"', '"+line['cloud_cover']+"', '"+line['mean_wind']+"', '"+line['max_temp']+"', '"+line['min_temp']+"', '"+line['precipitation']+"')")
		except Exception as e:
			print e

for line in open('saved-predictions.txt'):
	if line.strip():
		line = json.loads(line.strip())
		print
		try:
			db.query("INSERT INTO learning (class, events, city, cloud_cover, mean_wind, max_temp, min_temp, precipitation) VALUES ('"+str(line['pred_class'])+"', '"+line['events']+"', '"+str(line['city'])+"', '"+line['cloud_cover']+"', '"+line['mean_wind']+"', '"+line['max_temp']+"', '"+line['min_temp']+"', '"+line['precipitation']+"')")
		except Exception as e:
			print e

