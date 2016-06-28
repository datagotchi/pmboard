PMBoard is a dashboard for product managers and startup founders to link user research, product features/plans, 
and evaluation results.

It is a Node.js application with a Javascript frontend that utilizes jQuery, Underscore, X-Editable, and other libraries.*

To run, you need to have a MongoDB instance on the default port with a database named **pmboard** 
containing collections named **products** and **users**, with at least one user document in it matching 
the Mongoose schema (https://github.com/bobness/pmboard/blob/master/schema/User.js) and an email address 
matching a GMail or Google Apps account. 

Then, clone the repo, do <code>npm install</code> and <code>bower install</code>, and finally run <code>npm start</code> 
and go to <code>http://localhost:3000</code>, authenticating in the OAuth popup with your Google account.

\* Currently porting to Angular.js to better organize the frontend codebase
