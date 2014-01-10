profile
=======

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
To start the existing code in the repo:
```
> npm install
> grunt dbseed
> node app/gc.js
```
I haven't integrated your full grunt work yet... I plan on pulling parts of it over at least!

Summary
-------
There are now 3 types of users: 'owner', 'student', 'teacher'.  This feature is simply a 
profile page where a user can submit/edit information about their account, including: 
1. First and last name (all users; required)
2. Username (note, this field will be phased out and is not important)
3. Email (all users, required, must be unique)
4. Password (not visible, required)
5. Address (all users, optional)
6. Photo upload (all users, optional)
7. Credit card information (only visible if user.teacher or user.owner == true; editable by popup dialog)
8. Students list (only visible if user.owner == true)
9. Owner field (only visible if user.student == true; not editable)

Requirements
------------
###Pages
There should be only 1 page, but it will be different depending on the user type:
1. Owner: should also include a credit card edit button; which upon selection would trigger 
   a popup dialog where credit card information is stored; should also include a listing of 
   invited students (if an invited student has not registered, a button should appear beside 
   their listed email address to resend an invitation email; if the invited student has 
   registered, the student's full name should appear instead of the email address)
2. Student: should also include an owner field, which displays the name of owner user who
   invited the student to register -- this field should not be editable
3. Teacher: should include credit card information like that described for the owner user above

###Actions
1. Owner: should be able to edit all the information as described above as well as invite students 
   to register for the site under the owner's account; this is performed by selecting 'Invite student'
   button and entering an email address (for the student), which will trigger an email sent to that 
   address with a link back to the site -- doesn't matter what the URL is right now; it's arbitrary.
   Should also be able to resend that invitation email if a student has not registered yet. 
2. Student: should be able to edit all the information as described above and additionally see the 
   owner's name who invited them to register
3. Teacher: should be able to edit all the information as described above

###Models (incomplete suggestions)
1. UserModel: {... owner: true, students: [user_id0, user_id1], creditCards: [{ name: String, type: String, number: String, address: String}, {...}]}
2. UserModel: {... student: true, owner: user_id}
3. UserModel: {... teacher: true, creditCards: [{ name: String, type: String, number: String, address: String}, {...}]}
