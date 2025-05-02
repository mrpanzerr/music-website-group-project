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

from sqlalchemy import create_engine, ForeignKey, Column, String, Integer, CHAR, MetaData, Table, DateTime, insert, select, func, update, and_
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

Tags = Table(
    "Tags",
    meta,
    Column('tag', String(100)),
    Column('songID', String(200), ForeignKey('Songs.songID'), primary_key=True),
    Column('userID', Integer, ForeignKey('Users.userID'), primary_key=True)
)

Songs = Table(
    "Songs",
    meta,
    Column('songID', String(200), primary_key=True)
)


Users = Table(
    "Users",
    meta,
    Column('userID', Integer, primary_key=True, autoincrement=True),
    Column('username', String(20), unique=True, nullable=False),
    Column('password', String(100), nullable=False),
    Column('email', String(100), nullable=False),
    Column('date_joined', DateTime, default=datetime.utcnow),
    Column('bio', String(200), default="No Bio")
)


Comments = Table(
    "Comments",
    meta,
    Column('commentID', Integer, primary_key=True, autoincrement=True),
    Column('content', String(200), nullable=False),
    Column('date_commented', DateTime, default=datetime.utcnow),
    Column('userID', Integer, ForeignKey('Users.userID'), nullable=False),
    Column('songID', String(200), ForeignKey('Songs.songID'), nullable=True),
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
def insert_song(conn, song_id):
    try:
        insert_statement = insert(Songs).values(
            songID = song_id
        )
        result = conn.execute(insert_statement)
        conn.commit()
        return f"Song with ID:{result.inserted_primary_key[0]} inserted"
    except Exception:
        return f"Song with ID: {song_id} already exists"

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
def insert_user(conn, username, password, email):

    insert_statement = insert(Users).values(
        username=username,
        password=password,
        email = email
    )
    result = conn.execute(insert_statement)
    conn.commit()
    return result.inserted_primary_key[0]




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
def insert_comment(conn, user_id, song_id, content, parent_comment_id=None):
    insert_statement = insert(Comments).values(
        userID=user_id,
        songID=song_id,
        content=content,
        parent_commentID=parent_comment_id
    )
    result = conn.execute(insert_statement)
    conn.commit()
    return f"comment with ID: {result.inserted_primary_key[0]} inserted"

def select_user(conn, email):
    statement = select(Users).where(Users.c.email == email)
    result = conn.execute(statement).fetchone()
    return result


def select_user_username(conn, user):
    try:
        id_search = conn.execute(select(Users.c.userID).where(Users.c.username == user)).fetchone()
        return id_search[0]
    except Exception as e:
        return f'User does exist, error: {e}'
                             
def select_user_id(conn, id):
    user_search = conn.execute(select(Users.c.username).where(Users.c.userID == id)).fetchone()
    if user_search != None:
        return user_search[0]
    else:
        "not found"

def get_song_posts(conn, song):
    comment_search = conn.execute(select(Comments).where(Comments.c.songID == song))
    return comment_search


    

def check_user(conn, username, email):
    user_search = conn.execute(select(Users).where(Users.c.username == username)).fetchone()
    email_search = conn.execute(select(Users).where(Users.c.email == email)).fetchone()
    if user_search and email_search:
        return "Username and Email Already Exist"
    if user_search:
        return "Username Already Exists"
    if email_search:
        return "Email Already Exists"
    else:
        return "No Matches"
    

def insert_tag(conn, value, song, id):
    if value != "":
        try:
            insert_statement = insert(Tags).values(
                tag=value,
                songID=song,
                userID=id
            )
            conn.execute(insert_statement)
            conn.commit()
            return f"created tag"
        except Exception:
            conn.execute(update(Tags).where(and_(Tags.c.userID == id,Tags.c.songID == song)).values(tag=value))
            conn.commit()
            return f"updated tag"

def check_tag(conn, song, user):
    test = conn.execute(select(Tags).where(and_(Tags.c.songID == song, Tags.c.userID == user))).fetchone()
    if test != None:
        return test[0]
    else:
        return "No Tag"
    
def select_tags_song(conn, song):
    resultdict = {}
    results = conn.execute(select(Tags.c.tag, func.count().label('occurrences')).where(Tags.c.songID == song).group_by(Tags.c.tag))
    for i in results:
        resultdict.setdefault(i[0],i[1])
    return resultdict

# with engine.connect() as conn:
#     print(check_tag(conn, "2nTjd2lNo1GVEfXM3bCnsh", 50))
#     # for i in range(10,14):
#     #     create_tag(conn, 'hate', '73cZMVThj3x9ntYUT29hwD', i)
#     test = select_tags_song(conn, '73cZMVThj3x9ntYUT29hwD')
#     for i in test:
#         print(i)

def select_user_tags(conn, user):
    results = conn.execute(select(Tags).where(Tags.c.userID == user))
    return results

def select_user_comments(conn, user):
    results = conn.execute(select(Comments).where(Comments.c.userID == user))
    return results

# with engine.connect() as conn:
#     print(user_activity())
