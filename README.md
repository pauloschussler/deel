# Deel
 
### This backend exercise involves building a Node.js/Express.js app that will serve a REST API.

code is available in the following GitHub repository: https://github.com/pauloschussler/deel.

#### Setting Up

The exercise requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the LTS version.

1. Start by creating a local repository for this folder.

2. In the repo root directory, run `npm install` to gather all dependencies.

3. Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.

4. Then run `npm start` which should start both the server and the React client.

#### Project

I have made some modifications to the project by implementing the use of routes and controllers. This helps improve code organization and maintainability. By separating the logic into different controllers and defining routes for each functionality, the code becomes more modular and easier to understand.
I have also made some modifications to the getProfile middleware without changing its logic.

Besides that, I have also made a small change to the GET and POST methods. The GET method now returns a JSON object with three parameters: 'success', 'total', and 'data'. This change is illustrated in the following return: 

```
{
    "success": true,
    "total": 1,
    "data": [
        {
            "profession": "Programmer",
            "amountPaid": 3086
        }
    ]
}
```

And The POST method now returns a JSON object with three parametesr: 'success', 'message' and 'error'. This change is illustrated in the following returns`:

```
{
    "success": false,
    "message": "Job is already paid"
}

{
    "success": false,
    "message": "Deposit amount is required"
}

{
    "success": true,
    "message": "Deposit successful"
}
```

#### API's

Here are some details about the API's implementations:

* _POST_ /jobs/:job_id/pay -> The payment will only be executed if the job is unpaid.
* _POST_ /balances/deposit/:userId -> Is required the 'deposit_amount' parameter in the request header.
* _GET_ /admin/best-profession?start=<date>&end=<date> -> If the start and end query parameters are not passed or are invalid dates, the API will return results without applying any date filter.
* _GET_ /admin/best-clients?start=<date>&end=<date>&limit=<integer> -> If the start and end query parameters are not passed or are invalid dates, the API will return results without applying any date filter.


