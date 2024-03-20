
## Blog Application

This is a Node.js web application for a blog platform where users can create, read, update, and delete blog posts. The application is built using the following technologies:

-   Node.js
-   MySQL
-   Express.js
-   EJS (Embedded JavaScript)
-   HTML
-   Bootstrap

### Features

1.  **User Authentication**:
    
    -   Users can register for an account or log in with existing credentials.
    -   Authentication is handled securely with password hashing and session management.
2.  **Role-Based Access Control**:
    
    -   The application has two main roles: Admin and User.
    -   Admin Privileges:
        -   Edit users (e.g., update user details, change roles)
        -   Add categories for blog posts
        -   Create new users
    -   User Privileges:
        -   Create, read, update, and delete their own blog posts
        -   Comment on posts
3.  **Blog Post Management**:
    
    -   Users can create new blog posts with a title, content, and optional category.
    -   Users can view their own posts and posts from other users.
    -   Users can edit or delete their own posts.
4.  **Category Management**:
    
    -   Admins can add, edit, or delete categories for organizing blog posts.
5.  **Commenting System**:
    
    -   Users (including guests) can comment on blog posts.
    -   Writers have the right to approve or reject comments.

### Setup

1.  **Clone the Repository**:
    
    bashCopy code
    
    `git clone <repository-url>
    cd <project-folder>` 
    
2.  **Install Dependencies**:
    
    bashCopy code
    
    `npm install` 
    
3.  **Database Setup**:
    
    -   Create a MySQL database and configure the connection details in `config/database.js`.
    -   Run the SQL scripts provided in the `database` folder to set up the database schema.
4.  **Environment Variables**:
    
    -   Create a `.env` file at the root of the project and configure the following variables:
        
        makefileCopy code
        
        `PORT=3000
        SESSION_SECRET=your_session_secret
        DB_HOST=your_mysql_host
        DB_USER=your_mysql_username
        DB_PASSWORD=your_mysql_password
        DB_DATABASE=your_mysql_database_name` 
        
5.  **Start the Server**:
    
    bashCopy code
    
    `npm start` 
    
6.  **Access the Application**: Open your web browser and navigate to `http://localhost:3000` to access the blog application.
    

### Usage

1.  **User Registration/Login**:
    
    -   Users can register for a new account or log in with existing credentials.
2.  **Admin Functions**:
    
    -   Admins can manage users, categories, and comments from the admin dashboard.
3.  **User Functions**:
    
    -   Users can create, edit, and delete their own blog posts.
    -   Users can comment on blog posts.

### Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, feel free to open an issue or submit a pull request.


### Acknowledgements

Special thanks to the creators and maintainers of the libraries and frameworks used in this project.
