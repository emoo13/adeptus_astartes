# Database Implementation
For this project, we decided to utilize MongoDB, Node.js, and MongoDB Atlas/Compass. This ReadMe is to highlight the process of this implementation for the beginning stags and proof of concept.

## MongoDB and Node.js
To connect the web application to MongoDB services, the best way we found was through utilizing Node.js drivers.

##### Process for setting up Node.js 
<ol>
  <li>Install Node.js: https://nodejs.org/en/download/package-manager</li>
  <li>Open a Command Prompt as administrator</li>
  <li>Navigate to nodejs directory in Program Files</li>
  <li>Run the following command in nodejs/node_modules</li>

```
npm install mongodb
```

<ol>
      <li>If this doesn't work (which it didn't on our end), mongodb can be installed globally and linked instead.</li>

```
npm install -g mongodb
cd /path/to/my/webapp/folder
npm link mongodb
```

</ol>
  <li>Create a connection.js</li>
</ol>

##### Process for setting up MongoDB Atlas
<ol>
    <li>Create an account with MongoDB Atlas </li>
    <ol>
        <li>https://www.mongodb.com/lp/cloud/atlas/try4-reg?utm_source=google&utm_campaign=search_gs_pl_evergreen_atlas_core_retarget-brand_gic-null_amers-us-ca_ps-all_desktop_eng_lead&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=14291004479&adgroup=128837427307&cq_cmp=14291004479&gad_source=1&gclid=Cj0KCQjwm5e5BhCWARIsANwm06h3HQrBUpon1glrj60Kf0NSvkULYzSjRSyF-f0Cx3ZB1o_K7zODR1saAh7sEALw_wcB</li>
    </ol>
    <li>Create a Cluster</li>
    <li>Connect to Cluster via the "Connect" Button</li>
    <ol>
        <li>Select "Drivers"</li>
        <li>Driver-> Node.js, Version->5.5 or later</li>
        <li>Copy the mongodb+srv line</li>
    </ol>
    <li>Create a database user with a username, password, and permissions</li>
</ol>

##### Process for conecting Atlas and Node.js
<ol>
    <li>In the connection.js, create a MongoDB client</li>

```
const { MongoClient, ServerApiVersion } = require('mongodb');
var uri = `mongodb+srv://<what was copied from the Atlas Drivers connection>`;
```

<li>Set up username and password to be included in the uri for the connection</li>
<li>Connect</li>

```
const client = new MongoClient(uri);
```

<li>Utilize Client to talk with the database</li>
</ol>

## MongoDB Compass
MongoDB Compass was utilized as an easy way to connect to Atlas and upload data directly, which can be linked between profiles of users on the service. Through Compass, databases can be made directly through the GUI, and documents (such as BSON and JSON) can be uploaded directly to these databases for reference. In the case for our project, we had to connect Atlas to Compass.

##### How to Set Up Compass
<ol>
<li>Download/Install MongoDB Compass: https://www.mongodb.com/try/download/compass</li>
<li>Select "Add a New Connection" or the "Plus" sign</li>
<li>In MongoDB Atlas:</li>
<ol>
    <li>Click "Connect" button on the cluster</li>
    <li>Select "Compass"</li>
    <li>Select "I have MongoDB Compass Installed"</li>
    <li>Version-> 1.38 or Later</li>
    <li>Copy the connection string</li>
</ol>
<li>In the New Connection window on MongoDB Compass, pase the connection String, set preferred color, and name it something intuitive</li>
<li>Click "Save & Connect"</li>
</ol>

## Proof of Concept
Now that MongoDB is set up to communicate with our application, we wanted to create a couple of basic queries to ensure the connection and data is legitimate. We made a couple of sample JSON's for data our website may contain, uploaded it through Compass, and created three queries.

The first query was to grab all available databases in the client. In this case, we have an admin, config, local, sample, and user_data database. We created user_data as our proof of concept.

The second query was to retrieve users from the database. The users are a collection under the user_data database, which can be accessed via the *retrieveUsers()* function.

The third query was to retrieve posts based on a user's ID. For the purposes of testing, the script simply calls the function *findUserPosts()* to prove it only pulls posts posted by the user with the ID of "3".