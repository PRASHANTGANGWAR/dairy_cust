#Project Setup instructions:

##Bitbucket account details:
	account: rtailwal@enbake.com
	psw: testing123
	Repo name: Delivery App
	latest branch: Combined


	1. clone Project: https://rtailwal@bitbucket.org/rtailwal/delivery-app.git
	2. npm install
	3. npm run build
	4. npm install -g ionic@3.0.0
	5. npm install -g cordova
	6. ionic serve (for running on browser)

	For Android build
	1. cordova platform add android
	2. import android folder in android studio created inside platform
	3. build apk

NOTE:
For just Delivery app go to src/app/app.template.html and comment code between "<!-- For Combined app -->" and uncomment code between "<!-- For Delivery app -->"
For Combined app to to src/app/app.template.html and comment code between "<!-- For Delivery app -->" and uncomment code between "<!-- For Combined app -->"


>> To change Base url go to src/providers/user-data.ts and change the url on line number 15

>> Project paths in the system: "Home/MyProjects/DeliverApp"

>> For previous android builds go to "Home/MyProjects/Delivery app builds"


##App functionalities details:

###Delivery App

Login:
	-Login
	-Getting device_deliveries
	-Adding device deliveries data to local db

Pending:
	-Getting all deliveries from local db
	-Adding delivered/canceled to local db
	-Update all(all the deliveries submited as delivered or canceled are updated to our server and deleted from local db)
	-Refresh: all the data from local db is deleted and fetched from server and then is saved again in local db


Delivered:
	-all the deliveries that have been delivered and uploaded to server

Candeled:
	-all the deliveries that have been canceled and uploaded to server


Logout:
	-logout from the app but local db data exists


###Combined App:

All the functionalities maintioned above and:

Collections:
	-all the unpaid collections are shown
	-Payment of the collections
	-Last deliveries of that user
	-Last payemtns history of that user

Urgent Collections:
	-all the unpaid urgent collections are shown
	-Payment of the collections
	-Last deliveries of that user
	-Last payemtns history of that user

Box:
	-all the deliveries requested to box


