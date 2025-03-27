from sqlalchemy import create_engine, ForeignKey, Column, String, Integer, CHAR, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
db_password = os.getenv("DB_PASSWORD")
db_user = 'root'
db_host = '127.0.0.1'
db_port = '3306'
db_name = 'play_back_db'

engine = create_engine(f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}")

#with engine.connect() as conn:
    #conn.execute(text("CREATE TABLE Comments (commentID INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    #                                       content VARCHAR(280) NOT NULL,
    #                                       datecommented DATETIME NOT NULL,
    #                                       postID INT,
    #                                       parentcommentID INT,
    #                                       userID INT,
    #                                       FOREIGN KEY (postID) REFERENCES POSTS(postID),
    #                                       FOREIGN KEY (parentcommentID) REFERENCES Comments(commentID),
    #                                       FOREIGN KEY (userID) REFERENCES Users(userID),
    #                                       CHECK (postID IS NOT NULL OR parentcommentID IS NOT NULL))"))
    #conn.execute(text("CREATE TABLE Posts (postID INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    #                                       header VARCHAR(100)
    #                                       content VARCHAR(280) NOT NULL,
    #                                       dateposted DATETIME NOT NULL,userID INT,
    #                                       songID INT,
    #                                       FOREIGN KEY (userID) REFERENCES Users(userID),
    #                                       FOREIGN KEY (songID) REFERENCES Songs(songID))"))
    #conn.execute(text("CREATE TABLE Users (userID INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    #                                       username VARCHAR(20) NOT NULL UNIQUE,
    #                                       password VARCHAR(50) NOT NULL,
    #                                       datejoined DATETIME NOT NULL,
    #                                       bio VARCHAR(300) DEFAULT 'No bio.',
    #                                       profilepicturepath VARCHAR(300) DEFAULT 'none.jpg')"))
    #conn.execute(text("CREATE TABLE Song (songID INT NOT NULL UNIQUE PRIMARY KEY)"))


