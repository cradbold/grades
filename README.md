grades
======

Information
-----------
* Please host all code in the following public github account using the code structure that already exists there: https://github.com/cradbold/grades
* Please communicate with me either by google hangout/chat or email: cradbold@gmail.com
* Please spend 4 hours on this feature as described below.  If you finish under 4 hours, increase the quality of code for the remaining time.
* Please use Node, Backbone, Express (router), JQuery, Socket.io, MongoDB -- all Javascript
* Please do not use Backbone router, a view manager, or anything that further complicates the existing directory structure -- that would help greatly.
* Please use CDN URLs for CSS and JS resources whenever possible; examples already exist in main.js

Quick start
-----------
To start the existing code in the grades repo:
```
> npm install
> grunt dbseed
> node app/gc.js& (I haven't integrated your full grunt work yet... I plan on pulling parts of it over at least!)
```

Summary
-------
This feature is analogous to a grading system that a teacher would use to track students.  On a webpage, a teacher is able to choose from a list of students.  Once a student is selected, the teacher is able to view two things:
1. ... a list of grades for that student, and...
2. a button to add new grades.

Selecting to add a new grade will allow the teacher to select different fields to categorize the grade.  Buttons/icons for each listed grade should allow the teacher to edit or delete an existing grade upon confirmation. 

Requirements
------------
###Pages
There should be only 1 page, but there should be three sections/subfeatures:
1. Student selection (<div> section): a teacher should be able to select from a listing of students visible to that teacher; selecting a student would bring up that student's grades for editing/addition
2. Grade listing (<div> section): a listing of student grades should be present; the teacher should have the ability to edit an existing grade or delete an existing grade upon confirmation
3. Grade addition (dialog): a button should be present that allows the teacher to enter a grade via a dialog

###Actions
1. Student: no actions
2. Teacher: should be able to select a student visible to that teacher (see model suggestions below); should be able to edit an existing grade from a list; should be able to select an existing grade for deletion and confirm that deletion; should be able to select a new grade, configure that new grade, and save that new grade to the student

###Models (incomplete suggestions)
1. UserModel: {... student: true, grades: [grade_id0, grade_id1]} <== the dialog described here will add these grades
2. UserModel: {... teacher: true, students: [user_id0, user_id1]} <== this will be added manually at this point via grunt/database
3. GradeModel: {
	_id: ID
	date: Date,
    type: "diagnostic" or "homework" or "session" or "test",
	continent: "north america", "south america", "asia", "europe", "africa", "oceania"
	country: see "GradeModel form values" detail below, 
	state: see "GradeModel form values" detail below, 
	city: see "GradeModel form values" detail below, 
   }
   
###GradeModel form values
Initially the value selectors for country, state, and city should be blank.  Upon selecting the continent, the teacher should then be able to select the country value from a list of values applicable *only* to the selected continent.  The teacher should then be able to select the state from a list of values applicable *only* to the selected country.  The teacher should then be able to select the city from a list of values applicable *only* to the selected state.

*Note, this is just a placeholder so the continents, countries, states, and cities are meaningless -- the only important thing is that cascading dependency should exist.  This means that if I select ContinentA, I should only see the country values of ContACountry1, ContACountry2, ContACountry3.  And if I select ContACountry1, I should only see the state values of ContACount1State$, ContACount1State%, and ContACount1State^, etc.  3 or 4 fake arbitrary/fake values per level should work fine!
  
