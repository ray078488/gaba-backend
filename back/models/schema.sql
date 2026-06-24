-- GABA E-Commerce Database Schema

CREATE DATABASE IF NOT EXISTS gaba_db;
USE gaba_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('user', 'admin') DEFAULT 'user',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS Products (
    Product_ID VARCHAR(50) PRIMARY KEY,
    Brand_Name VARCHAR(50) DEFAULT 'GABA',
    Product_Name VARCHAR(255) NOT NULL,
    Category ENUM('Men', 'Women', 'Unisex') NOT NULL,
    Fabric_Quality VARCHAR(100) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Size_Available VARCHAR(255) NOT NULL, -- Stored as comma-separated values (e.g. "S,M,L,XL,XXL")
    Stock_Quantity INT NOT NULL,
    Description TEXT,
    Image_URL VARCHAR(500),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Cart Table
CREATE TABLE IF NOT EXISTS Cart (
    Cart_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Product_ID VARCHAR(50) NOT NULL,
    Size VARCHAR(10) NOT NULL,
    Quantity INT DEFAULT 1,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Products(Product_ID) ON DELETE CASCADE
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS Orders (
    Order_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Total_Amount DECIMAL(10, 2) NOT NULL,
    Status ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- 5. Order Items Table (with Return & Exchange status tracking)
CREATE TABLE IF NOT EXISTS Order_Items (
    OrderItem_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Product_ID VARCHAR(50),
    Size VARCHAR(10) NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Return_Exchange_Status ENUM('None', 'Return_Requested', 'Return_Approved', 'Return_Rejected', 'Exchange_Requested', 'Exchange_Approved', 'Exchange_Rejected') DEFAULT 'None',
    Return_Exchange_Reason VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Products(Product_ID) ON DELETE SET NULL
);
