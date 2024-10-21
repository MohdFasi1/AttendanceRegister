
# Employee Attendance Register

Employee Attendance Register is a full-stack web application designed to simplify the management and tracking of employee attendance. It allows administrators to easily add employees, monitor attendance records, and ensure the security of employee data.


## Features

- Attendance Tracking
- Employee Management
- Secure Passwords
- Real-time Updates


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in client

`VITE_API_URL`

And server

`MONGODB_CONNECT_URI`

`CLIENT_URL`

`PORT`


## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/employee-attendance-register.git

```

Navigate to the project directory:

```bash
cd employee-attendance-register

```

Install dependencies for both the client and the server:

```bash
cd client && npm install
cd ../server && npm install

```

Create a .env file in the server directory and add your MongoDB connection string and other environment variables:

```bash
MONGO_URI=your-mongodb-uri
PORT=your-port
```

Create a .env file in the client directory and add your url string to server:

```bash
VITE_API_URL = url-to-server

```

Run the server(Backend):

```bash
node index.js

```

Run the client(Frontend):

```bash
cd ../client
npm run dev

```
## Technologies Used

**Frontend:** React, Vite, TailwindCSS

**Backend:** Node.js, Express

**Database:** MongoDB

**Authentication:** bcrypt for secure password storage



