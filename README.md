Iterations on previous tasks
============================

Information
-----------
* Please host all code in the following public github account using the code structure that already exists there: https://github.com/cradbold/grades
* Please communicate with me either by google hangout/chat or email: cradbold@gmail.com
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
This contract includes improvements made across the previous features located here:
* [GRADES task](GRADES.md)
* [PROFILE task](PROFILE.md)

Note, I have made a commit to your existing code here so make it easier to integrate with my codebase:
https://github.com/cradbold/grades/commit/d2889d748750c73c598ef52fb0d35f7a1b6d7979

One of the new features I would like is invitation functionality where account owners invite students (accounts owners are parents; students are their children) to join the site.

The second is a calendar feature that allows tutors and students to plan tutoring sessions in the future.

Requirements
------------
1) On the "Profile" page, if the user of of type 'owner', include an empty email textfield and an "Invite" button beside it.  By adding an email and clicking the "Invite" button, these actions occur:
    a) An email is sent to the provided email address that includes a link to the 'index' page.
    b) The email includes a username (=email address) and a random generated password.
    c) The provided email address is added to an array of the 'owner' user, which should be called "students" (much like the existing "tutorStudents")
    d) Use the nodemailer node.js library
2) Add a new page called "Calendar".  It should contain a visual monthly calendar using the library of your choice.  The following functionality should exist there:
    a) A user of type 'tutor' should see a calendar on their calendar page of the current month.  Each cell in the calendar has two states: available (green) or unavailable (red).  By default each cell is in the state 'unavailable' by default and it should be visualized with color.
    b) By clicking a day calendar cell, you can switch the state of each day from unavailable to available, back and forth
    c) Only the current month and the next 2 months are available to navigate.  Buttons should be available to navigate between the months.
    d) The states of the day calendar cells should persist per tutor user.
    e) A user of type 'owner' or 'student' sees the calendar as empty, not like 'tutors'.  Each cell can be clicked on.  When a student or owner clicks on the day calendar cell, a popup displays a list of all tutors that have marked themselves available for that day.
