"""
 Author: Ryan Ferrel
 Date: 4.1.25
 Filename: db.py
 
 Purpose: This script handles database operations for the PlayBack platform.
          It defines tables and provides functions to insert data into the database.
 
 Where it fits: This file connects to the database and manages user, post, song, and comment data.
 
 Written: 4.1.25
 Revised: 4.9.25
 
 Why it exists: The file provides essential functions for inserting and managing data in the PlayBack database.
 
 How it uses data structures and algorithms: Uses SQLAlchemy to define tables and insert data.
 
 Expected input: Data such as song information, user details, post content, and comments.
 
 Expected output: Success messages indicating the successful insertion of data into the database.
 
 Expected extensions/revisions: The code may be extended to handle more complex queries or additional table operations.
"""

from sqlalchemy import create_engine, ForeignKey, Column, String, Integer, CHAR, MetaData, Table, DateTime, insert, select
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()
db_password = os.getenv("DB_PASSWORD")
db_user = 'root'
db_host = '127.0.0.1'
db_port = '3306'
db_name = 'play_back_db'

# Create a connection to the MySQL database using SQLAlchemy
engine = create_engine(f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}", echo = True)

meta = MetaData()


Songs = Table(
    "Songs",
    meta,
    Column('songID', Integer, primary_key=True, autoincrement=True)
)

Users = Table(
    "Users",
    meta,
    Column('userID', Integer, primary_key=True, autoincrement=True),
    Column('username', String(20), unique=True, nullable=False),
    Column('password', String(50), nullable=False),
    Column('date_joined', DateTime, default=datetime.utcnow),
    Column('bio', String(200), default="No Bio")
)

Posts = Table(
    "Posts",
    meta,
    Column('postID', Integer, primary_key=True, autoincrement=True),
    Column('date_posted', DateTime, default=datetime.utcnow),
    Column('header', String(100), nullable=False),
    Column('content', String(300), nullable=False),
    Column('userID', Integer, ForeignKey('Users.userID'), nullable=False),
    Column('songID', Integer, ForeignKey('Songs.songID'), nullable=False)
)

Comments = Table(
    "Comments",
    meta,
    Column('commentID', Integer, primary_key=True, autoincrement=True),
    Column('content', String(200), nullable=False),
    Column('date_commented', DateTime, default=datetime.utcnow),
    Column('postID', Integer, ForeignKey('Posts.postID'), ),
    Column('userID', Integer, ForeignKey('Users.userID'), nullable=False),
    Column('parent_commentID', Integer, ForeignKey('Comments.commentID'))
)

"""
    Purpose: Inserts a new song into the Songs table.
    Author: Ryan Ferrel
    Written on: 4.8.25
    Revised on: N/A
    Called when: This method is called when a new song is being inserted into the database.
    Where it fits: It is part of the database operations, handling the insertion of song data.
    Data Structures/Algorithms: Uses SQLAlchemy's insert statement to insert a new song record.
    Expected input: Connection object to the database.
    Expected output: A success message indicating the ID of the inserted song.
    Expected extensions/revisions: Extend to handle more song attributes (e.g., artist, album).
"""
def insert_song(conn):
    insert_statement = insert(Songs).values()
    result = conn.execute(insert_statement)
    conn.commit()
    return f"Song with ID:{result.inserted_primary_key[0]} inserted"

"""
    Method Comment Block: insert_user
    Purpose: Inserts a new user into the Users table.
    Author: Ryan Ferrel
    Written on: 4.8.25
    Revised on: N/A
    Called when: This method is called when a new user is being inserted into the database.
    Where it fits: It is part of the database operations, handling the insertion of user data.
    Data Structures/Algorithms: Uses SQLAlchemy's insert statement to insert a new user record.
    Expected input: Connection object to the database, username, password.
    Expected output: A success message indicating the ID of the inserted user.
    Expected extensions/revisions: Extend to handle more user attributes (e.g., email, profile picture).
"""
def insert_user(conn, username, password):
    insert_statement = insert(Users).values(
        username=username,
        password=password
    )
    result = conn.execute(insert_statement)
    conn.commit()
    return f"User with ID: {result.inserted_primary_key[0]} inserted"

"""
    Method Comment Block: insert_post
    Purpose: Inserts a new post into the Posts table.
    Author: Ryan Ferrel
    Written on: 4.8.25
    Revised on: N/A
    Called when: This method is called when a new post is being inserted into the database.
    Where it fits: It is part of the database operations, handling the insertion of post data.
    Data Structures/Algorithms: Uses SQLAlchemy's insert statement to insert a new post record.
    Expected input: Connection object to the database, user ID, song ID, post header, and post content.
    Expected output: A success message indicating the ID of the inserted post.
    Expected extensions/revisions: Extend to handle more post attributes (e.g., tags, media).
"""
def insert_post(conn, user_id, song_id, header, content):
    insert_statement = insert(Posts).values(
        userID=user_id,
        songID=song_id,
        header=header,
        content=content
    )
    result = conn.execute(insert_statement)
    conn.commit()
    return f"Post with ID: {result.inserted_primary_key[0]} inserted"

"""
    Method Comment Block: insert_comment
    Purpose: Inserts a new comment into the Comments table.
    Author: Ryan Ferrel
    Written on: 4.8.25
    Revised on: N/A
    Called when: This method is called when a new comment is being inserted into the database.
    Where it fits: It is part of the database operations, handling the insertion of comment data.
    Data Structures/Algorithms: Uses SQLAlchemy's insert statement to insert a new comment record.
    Expected input: Connection object to the database, user ID, post ID, comment content, and optionally a parent comment ID.
    Expected output: A success message indicating the ID of the inserted comment.
    Expected extensions/revisions: Extend to handle comment upvoting/downvoting or additional features.
"""
def insert_comment(conn, user_id, post_id, content, parent_comment_id=None):
    insert_statement = insert(Comments).values(
        userID=user_id,
        postID=post_id,
        content=content,
        parent_comment_id=parent_comment_id
    )
    result = conn.execute(insert_statement)
    conn.commit()
    return f"comment with ID: {result.inserted_primary_key[0]} inserted"