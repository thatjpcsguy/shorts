import json
import _mysql

db = _mysql.connect(host='127.0.0.1', user='root', passwd='root', db='shorts')

for line in open('saved-predictions.txt'):
	if line.strip():
		line = json.loads(line.strip())
		print
		try:
			db.query("INSERT INTO learning (class, events, city, cloud_cover, mean_wind, max_temp, min_temp, precipitation) VALUES ('"+line['pred_class']+"', '"+line['events']+"', '"+str(line['city'])+"', '"+line['cloud_cover']+"', '"+line['mean_wind']+"', '"+line['max_temp']+"', '"+line['min_temp']+"', '"+line['precipitation']+"')")
		except:
			print 

