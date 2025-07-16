This project involves building a Node.js/Express.js app that will serve a REST API.

## Data Models

> **All models are defined in `src/model.js`**

### Profile

A profile can be either a `client` or a `contractor`.  
Clients create contracts with contractors, while contractors perform jobs for clients and get paid.  
Each profile has a balance property.

### Contract

A contract exists between a client and a contractor.  
Contracts have 3 statuses: `new`, `in_progress`, and `terminated`.  
Contracts are considered active only when in the `in_progress` status.  
Contracts group jobs within them.

### Job

Contractors get paid for jobs performed under a certain contract by clients.

## Getting Set Up

The exercise requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the LTS version.

1. Start by creating a local repository for this folder.
2. In the repo's root directory, run `npm install` to install all dependencies.
3. Next, run `npm run seed` to seed the local SQLite database. **Warning: This will drop the database if it exists**. The database will be stored in a local file named `database.sqlite3`.
4. Then run `npm start` to start both the server and the React client.

## Technical Notes

- The server is running with [nodemon](https://nodemon.io/), which will automatically restart whenever you modify and save a file.
- The database provider is SQLite, which will store data in a file local to your repository called `database.sqlite3`. The ORM [Sequelize](http://docs.sequelizejs.com/) is used on top of it. You should interact with Sequelize. **Please spend some time reading the Sequelize documentation before starting the exercise.**
- To authenticate users, use the `getProfile` middleware located under `src/middleware/getProfile.js`. Users are authenticated by passing `profile_id` in the request header. Once authenticated, the user's profile will be available under `req.profile`. Ensure that only users associated with a contract can access their respective contracts.
- The server is running on port 3001.
