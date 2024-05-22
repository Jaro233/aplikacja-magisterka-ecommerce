-- Create users table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    createdAt DATETIME,
    updatedAt DATETIME
);

-- Insert dummy Users
INSERT INTO Users (username, password, email) VALUES ('john_doe', 'password1', 'john@example.com');
INSERT INTO Users (username, password, email) VALUES ('jane_doe', 'password2', 'jane@example.com');

-- Create Products table
CREATE TABLE Products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price FLOAT,
  description TEXT,
  imageUrl VARCHAR(255) NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Insert dummy Products
INSERT INTO Products (name, price, description, imageUrl) VALUES ('Sunglasses', 10.0, 'Classic black sunglasses with UV protection', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
INSERT INTO Products (name, price, description, imageUrl) VALUES ('Headphones', 20.0, 'Noise-canceling over-ear headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
INSERT INTO Products (name, price, description, imageUrl) VALUES ('Smartphone', 30.0, 'Latest model with high-resolution display', 'https://images.unsplash.com/photo-1494366222322-387658a1a976?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
INSERT INTO Products (name, price, description, imageUrl) VALUES ('Laptop', 40.0, 'Lightweight laptop with powerful performance', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
INSERT INTO Products (name, price, description, imageUrl) VALUES ('Tablet', 50.0, '10-inch tablet with crystal-clear display', 'https://images.unsplash.com/photo-1527698266440-12104e498b76?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
INSERT INTO Products (name, price, description, imageUrl) VALUES ('Camera', 60.0, 'High-definition camera with 4K video recording', 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');


-- Create the Orders table
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    items JSON NOT NULL,
    total FLOAT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);