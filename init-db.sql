CREATE DATABASE unque;

USE unque;

CREATE TABLE student (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(255) NOT NULL UNIQUE,   
    password VARCHAR(255) NOT NULL    
) ENGINE=InnoDB;

CREATE TABLE professor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,   
    password VARCHAR(255) NOT NULL,   
    apointment VARCHAR(24) NOT NULL DEFAULT "000000000000000000000000" 
) ENGINE=InnoDB;

CREATE TABLE appointments_made (
    id INT AUTO_INCREMENT PRIMARY KEY,
    s_username VARCHAR(255) NOT NULL, 
    prof_username VARCHAR(255) NOT NULL,
    slot_index INT NOT NULL,
    FOREIGN KEY (s_username) REFERENCES student(username) ON DELETE CASCADE, 
    FOREIGN KEY (prof_username) REFERENCES professor(username) ON DELETE CASCADE
) ENGINE=InnoDB;
