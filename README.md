# Student Management System CRUD Application

Welcome to the Student Management System (SMS) CRUD application – a comprehensive solution built with Express.js, Vercel for seamless deployment, PostgreSQL for data storage, and EJS for efficient Server-Side Rendering (SSR). This application simplifies the process of managing student information, offering a range of CRUD functionalities.

## Features:

- **Create:** Add new student records effortlessly, providing essential details such as name, birthdate, contact, and address.
- **Read:** Retrieve and display student information dynamically, enabling quick access to relevant data.
- **Update:** Modify existing student records with ease, ensuring accurate and up-to-date information.
- **Delete:** Remove student records securely, maintaining data integrity.

## Technologies Used:

- **Express.js:** A robust web application framework for Node.js, ensuring a smooth development experience.
- **Vercel Postgres:** A serverless SQL database designed to seamlessly integrate with Vercel Functions and frontend frameworks.
- **EJS (Embedded JavaScript):** A templating language for dynamic HTML generation on the server side, enhancing the rendering process.
- **Clerk:** To swiftly and effortlessly integrate secure authentication and user management into your JavaScript application
- **Sequelize:** An Object-Relational Mapping (ORM) tool, simplifying database interactions and enhancing data modeling.
- **Vercel Blob:** A storage solution allowing the upload and serving of files through unique and unguessable URLs.
- **Vercel:** A cloud platform for front-end developers, facilitating easy deployment and hosting.

## Libraries Used

### Frontend

- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapidly building custom designs.

### Backend

- **[body-parser](https://www.npmjs.com/package/body-parser):** Parses incoming request bodies in a middleware before your handlers, available under the `req.body` property.
- **[dotenv](https://www.npmjs.com/package/dotenv):** Loads environment variables from a `.env` file into `process.env`.
- **[ejs](https://www.npmjs.com/package/ejs):** Embedded JavaScript templates for server-side rendering.
- **[sharp](https://www.npmjs.com/package/sharp):** High-performance image processing library for resizing, cropping, and other operations.
- **[multer](https://www.npmjs.com/package/multer):** Middleware for handling `multipart/form-data`, used for uploading files.

### Database

- **[pg](https://www.npmjs.com/package/pg):** PostgreSQL client for Node.js, enables interaction with PostgreSQL databases.
- **[sequelize](https://www.npmjs.com/package/sequelize):** A promise-based Node.js ORM for PostgreSQL, MySQL, MariaDB, SQLite, and Microsoft SQL Server.
- **[@vercel/blob](https://www.npmjs.com/package/@vercel/blob):** Vercel's Blob library for file storage and serving.

### Authentication

- **[clerk-js](https://www.npmjs.com/package/@clerk/clerk-js):** Clerk JavaScript library for the frontend, handling user authentication and sign-in experiences.
- **[clerk-sdk-node](https://www.npmjs.com/package/@clerk/clerk-sdk-node):** Clerk SDK for Node.js, providing authentication and user management capabilities.

## To-Do and Future Features:

- [x] Basic CRUD functionality implemented.
- [x] Express.js server set up.
- [x] Frontend rendering using EJS.
- [x] Integration with Vercel Postgres for serverless SQL database.
- [x] Implement search and filter functionality.
- [x] Implement user authentication using CLERK.
- [x] Vercel Blob configured for image storage and serving, with thumbnail and original versions.
- [x] Audit logs feature added with a separate database.
- [x] Add pagination for improved user experience.
- [x] Show Fields feature to allow users to customize displayed fields
- [x] Sorting function in ascending and descending order for ID, first name, last name, and email columns.
- [x] Use MongoDB for the backend.
- [ ] Roles based access.

## License:

This project is licensed under the MIT License - see the LICENSE.md file for details.
