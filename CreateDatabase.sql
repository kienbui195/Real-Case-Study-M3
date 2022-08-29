CREATE DATABASE IF NOT EXISTS  CaseM3;
USE CaseM3;

CREATE TABLE IF NOT EXISTS Customer (
    cus_id INT(3) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25),
    email VARCHAR(25),
    password VARCHAR(25)
);

CREATE TABLE IF NOT EXISTS Product (
    pro_id INT(3) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25),
    price INT(20),
    quantityInStock INT(10),
    description VARCHAR(25)
);

CREATE TABLE IF NOT EXISTS Orders (
    or_id INT(3) PRIMARY KEY AUTO_INCREMENT,
    cus_id INT(3),
    totalMoney INT(25),
    FOREIGN KEY (cus_id) REFERENCES customer(cus_id)
);

CREATE TABLE IF NOT EXISTS OrderDetails (
    or_id INT(3),
    pro_id INT(3),
    quantity INT(3),
    FOREIGN KEY (or_id) REFERENCES Orders(or_id),
    FOREIGN KEY (pro_id) REFERENCES Product(pro_id)
);

insert into product(name, price,quantityInStock,description)
values ('Laptop Acer', 1000, 100, 'Laptop Acer siêu đỉnh cao'),
       ('Laptop HP', 1200, 200, 'Laptop HP siêu đẳng cấp'),
       ('Macbook', 1500, 150, 'Macbook Pro M2 2022'),
       ('PC Gaming Trung cấp', 800, 50, 'Máy tính tầm trung'),
       ('PC Gaming Cao cấp', 2000, 50, 'Máy tính cao cấp'),
       ('PC Gaming Siêu Cao cấp', 500, 50, 'Máy tínhsiêu cao cấp')

