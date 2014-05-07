import numpy as np
import time, sys, argparse, random
from collections import Counter
import _mysql


# build a dictionary of vectors and classes
def build_vectors():
	db = _mysql.connect(host='127.0.0.1', user='root', passwd='root', db='shorts')
	print db
	db.query("SELECT * FROM learning")
	res = db.store_result()

	i = []
	for line in res.fetch_row(maxrows=0):
		line = list(line)
		i.append({'values': np.array(map(float,line[2:-2])), 'class': 'class'+line[-1].strip()})
	print "Instances Loaded: " + str(len(i));
	random.shuffle(i)	# shuffle the results 
	print i
	return i
	
# given two attribute lists, find the euclidean distance, wraps numPy function
# a,b => vector containing instance values
def euclidean_dist (a, b):
	return np.linalg.norm(a-b)
	
# given the classes, return the most common class
# classes => a list of the classes of the nearest k neighbours
def most_common(classes):
	lst = Counter(classes).most_common()
	highest_count = max([i[1] for i in lst])
	return [i[0] for i in lst if i[1] == highest_count][0]

# given a list of the nearest neighbours, classify the example
# k_nn => the k nearest instances
def classify(k_nn):
	classes = []
	for inst in k_nn:
		classes.append(inst[1]['class'])
	return most_common(classes);

# the nearest neighbour algorithm	
# k => the number of nearest neighbours
# ktest => the testing set
# ktrain => the training set
def NN(k, ktest, ktrain):
	pred_classes = []			# the predicted classes for each of the test instances
	for inst in ktest:
		distances = []
		ki = inst['values'] 		# a vector containing the data
		
		for d in ktrain: 		# calculate and store all the distances to every other point
			di = d['values']
			distances.append((euclidean_dist(ki, di), d))
			
		k_nn = sorted(distances)[:k]	# sort the distances and get the k closest neighbours
		pred_classes.append(classify(k_nn))	# get the class that occurs most frequently and append it
	
	return pred_classes


# http://www.danielsoper.com/statcalc3/calc.aspx?id=54
# u = mean
# o = std dev
# x is the value to calculate for
def normal_pdf (u, o, x):
	return (1 / np.sqrt(2*np.pi*o)) * pow(np.e, -(((x - u)**2)/(2*o)))


# the naive bayes
# ktest => the testing set
# ktrain => the training set
def NB(ktest, ktrain):
	# get all the classes
	classes = []
	for i in ktrain:
		classes.append(i['class'])

	out_vector = {}
	for c in list(set(classes)):
		out_vector[c] = {}
		out_vector[c]['count'] = 0
		for i in ktrain:
			if i['class'] == c:
				out_vector[c]['count'] += 1
		out_vector[c]['p'] = float(out_vector[c]['count'])/len(ktrain)

		out_vector[c]['data'] = []
		for i in range(len(ktrain[0]['values'])):
			out_vector[c]['data'].append([])

	for i in ktrain:
		x = 0
		for j in i['values']:
			out_vector[i['class']]['data'][x].append(j)
			x += 1

	for c in list(set(classes)):
		for i in range(len(out_vector[c]['data'])):
			out_vector[c][str(i)+'_avg'] = np.mean(out_vector[c]['data'][i])
			out_vector[c][str(i)+'_var'] = np.var(out_vector[c]['data'][i])

	# print out_vector

	predicted = []
	# for each of the possible classes - see which is more probable
	for curr in ktest:
		# print curr
		cl = ''
		pr = 0
		for c in list(set(classes)):
			p = out_vector[c]['p']
			for i in range(len(out_vector[c]['data'])):
				p *= normal_pdf(out_vector[c][str(i)+'_avg'], out_vector[c][str(i)+'_var'], curr['values'][i])
			# print p, pr
			if p > pr:
				pr = p
				cl = c
		predicted.append(cl)

	return predicted

# prints to command line and log
def out(f, msg):
	print(msg)
	f.write(msg + "\n")
				
def main():
	parser = argparse.ArgumentParser(description='K Nearest Neighbour Algorithm - Reads a pima.csv file and attempts to classify a number of instances specified.')
	parser.add_argument("--folds", "-f", help="number of instances you want to test, the remaining instances will be used as a training set.", type=int, default=10)
	parser.add_argument("--neighbours", "-k", help="number of nearest neighbours", type=int, default=3)
	parser.add_argument("--algorithm", "-a", help="the algorithm to run (KNN/NB)", default="NB")
	args = parser.parse_args()
		
	num_test = args.folds 
	num_nn = args.neighbours
	algorithm = args.algorithm
	
	start_time = time.time()
	f = open("classifier.log", "a")

	if algorithm == "KNN":
		algorithm_text = "Nearest Neighbour"
		out(f, "Running Nearest Neighbour with [" + str(num_nn) + "] nearest neighbours...");
	elif algorithm == "NB":
		algorithm_text = "Naive Bayas"
		out(f, "Running Naive Bayas...");
	else:
		out(f, "Error, please specify an algorithm")
		exit()

	# read in the file and build a data structure to store values and classes

	instances = build_vectors()
	
	if (num_test > len(instances)):		# make sure we don't have to many test instances
		out(f, "Not enough data to fill folds, exiting...")
		exit()
		
	out(f,"---------")

	# split all of the instances into the 2 classes
	classes = []
	for i in instances:
		classes.append(i['class'])
	classes = sorted(classes)

	chunks = []
	for i in range(num_test):
		chunks.append([])

	for i in range(len(classes)):
		# pop an instance with the correct class
		for j in range(len(instances)):
			if instances[j]['class'] == classes[i]:
				chunks[i%num_test].append(instances.pop(j))
				break

	correct_percentages = [];


	for i in range(len(chunks)):
		#shift to the next fold
		chunks.append(chunks.pop(0))

		#test on the first fold
		k_test = chunks[0]

		#train on all the rest of the folds
		k_train = []
		for j in chunks[1:]:
			for k in j:
				k_train.append(k)

		if algorithm == "KNN":
			res = NN(num_nn, k_test, k_train)
		elif algorithm == "NB":
			res = NB(k_test, k_train)

		correct = 0
		for c in range(len(res)):		# count the number of correct classifications
			if k_test[c]['class'] == res[c]:
				correct += 1

		out(f, "\nStarting Fold: " + str(i+1))
		out(f, "Number of training instances: " + str(len(k_train)))
		out(f, "Number of test instances: " + str(len(k_test)))
		out(f, "Correctly classified instances: " + str(correct) + "\t[" + str(int(float(correct)/float(len(k_test)) * 100)) + "%]")
		correct_percentages.append(float(correct)/float(len(k_test) * 100));
		out(f, "Incorrectly classified instances: " + str(len(k_test)-correct) + "\t[" + str(int((float(len(k_test)-correct)/float(len(k_test))) * 100)) + "%]")
		f.write("\n");	# new lines for output

	out(f, "\nTotal percentage correctly classified: " + str(sum(correct_percentages)/len(correct_percentages) * 100))
		
	out(f, "\nCompleted in " + "%0.2f" % (time.time() - start_time) + " seconds\n");
	
	f.close()

if __name__ == '__main__':
	main()
