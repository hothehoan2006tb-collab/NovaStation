CREATE DATABASE IF NOT EXISTS novastation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE novastation;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    avatar VARCHAR(255),
    role ENUM('customer','admin') DEFAULT 'customer',
    is_active TINYINT(1) DEFAULT 1,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), slug VARCHAR(100) UNIQUE);

CREATE TABLE games(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(180) UNIQUE,
    description TEXT,
    short_description TEXT,
    price DECIMAL(12,2) NOT NULL,
    original_price DECIMAL(12,2),
    discount_percent INT DEFAULT 0,
    image_main VARCHAR(255),
    platform VARCHAR(50) DEFAULT 'PS5',
    genre VARCHAR(100),
    developer VARCHAR(150),
    publisher VARCHAR(150),
    release_date DATE,
    category_id INT,
    stock_quantity INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    is_new TINYINT(1) DEFAULT 0,
    is_hot TINYINT(1) DEFAULT 0,
    is_featured TINYINT(1) DEFAULT 0,
    badge VARCHAR(50),
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE TABLE orders(
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    customer_name VARCHAR(100), customer_phone VARCHAR(20), customer_email VARCHAR(150),
    shipping_address TEXT, shipping_city VARCHAR(100), shipping_district VARCHAR(100),
    subtotal DECIMAL(12,2), shipping_fee DECIMAL(12,2) DEFAULT 0, discount_amount DECIMAL(12,2) DEFAULT 0, total_amount DECIMAL(12,2),
    payment_method VARCHAR(50), coupon_code VARCHAR(50), note TEXT,
    order_status ENUM('pending','confirmed','processing','shipping','delivered','cancelled') DEFAULT 'pending',
    cancel_reason TEXT, cancelled_at DATETIME, delivered_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE order_items(id INT AUTO_INCREMENT PRIMARY KEY,order_id INT,game_id INT,game_title VARCHAR(180),game_image VARCHAR(255),platform VARCHAR(50),quantity INT,unit_price DECIMAL(12,2),total_price DECIMAL(12,2),FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,FOREIGN KEY(game_id) REFERENCES games(id));
CREATE TABLE wishlists(user_id INT,game_id INT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(user_id, game_id),FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE);
CREATE TABLE cart_items(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT,game_id INT,quantity INT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE);