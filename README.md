Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  
===

Due: September 4th, by 1:59 PM.

## Todo List

Link: https://a2-owenmatthews.onrender.com/

A two-tiered todo list web app built with Node.js and JavaScript.
Users can add tasks with a priority level (low, medium, high), and the server automatically calculates a deadline based on that priority and the task's creation date.
The entire dataset lives in server memory and updates live in the browser with no page reloads.
CSS layout uses flexbox for the entry form.

### How to use
1. Enter a task and choose a priority level, then click "Add Task."
2. The table updates immediately, showing the task's creation date and calculated deadline.
3. Click "Edit" on any row to change its task or priority inline, then "Save" or "Cancel."
4. Click "Delete" to remove a task.

## Technical Achievements
- **Tech Achievement 1 (Single-page app with live updates)**:
The app never reloads the page. Every add, edit, and delete sends a "fetch" POST request to the server. 
The server responds with the entire updated dataset, and the client re-renders the table from that response.
This was challenging because the client had to wait for the server to send back the full updated list and reset the table from that.

- **Tech Achievement 2 (Editable data)**:
In addition to add and delete, users can edit an existing task's name and priority in place.
The challenging part was keeping track of which row was being edited versus shown normally.
Also making sure the server recalculates the deadline when a task is edited and not just when it's first created.
