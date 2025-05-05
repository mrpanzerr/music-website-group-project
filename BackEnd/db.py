"""
 Author: Ryan Ferrel
 Date: 4.1.25
 Filename: db.py
 
 Purpose: This script handles database operations for the PlayBack platform.
          It defines tables and provides functions to insert data into the database.
 
 Where it fits: This file connects to the database and manages user, post, song, and comment data.
 
 Written: 4.1.25
 Revised: 5.4.25
 
 Why it exists: The file provides essential functions for inserting and managing data in the PlayBack database.
 
 How it uses data structures and algorithms: Uses SQLAlchemy to define tables and insert data.
 
 Expected input: Data such as song information, user details, post content, and comments.
 
 Expected output: Success messages indicating the successful insertion of data into the database.
 
 Expected extensions/revisions: The code may be extended to handle more complex queries or additional table operations.
"""

from sqlalchemy import create_engine, ForeignKey, Column, String, Integer, MetaData, Table, DateTime, insert, select, func, update, and_, update
from dotenv import load_dotenv
from datetime import datetime


import os
#Database credentials to be used in the engine
load_dotenv()
db_password = os.getenv("DB_PASSWORD")
db_user = 'root'
db_host = '127.0.0.1'
db_port = '3306'
db_name = 'play_back_db'

# Create a connection to the MySQL database using SQLAlchemy
engine = create_engine(f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}", echo = True)
#Metadata object to hold table definitions, used by SQLAlchemy to manage the database schema
meta = MetaData()

# Creates the table that stores tag information
Tags = Table(
    "Tags",
    meta,
    Column('tag', String(100)),
    Column('songID', String(200), ForeignKey('Songs.songID'), primary_key=True),
    Column('userID', Integer, ForeignKey('Users.userID'), primary_key=True)
)

# Creates the table that stores song information
Songs = Table(
    "Songs",
    meta,
    Column('songID', String(200), primary_key=True),
    Column('name', String(100), default="NoName"),
    Column('image', String(200)),
    Column('type', String(50))
)

# Creates the table that stores user information
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

# Creates the table that stores comments on songs
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
    Author: Ryan 
    Written on: 4.8.25
    Revised on: 5.4.25
    Called when: This method is called when a new song is being inserted into the database.
    Where it fits: It is part of the database operations, handling the insertion of song data.
    Data Structures/Algorithms: Uses SQLAlchemy's insert statement to insert a new song record.
    Expected input: Connection object to the database.
    Expected output: A success message indicating the ID of the inserted song.
    Expected extensions/revisions: As of 5.4.25, there are no expected extensions or revisions to this method.
"""
def insert_song(conn, song_id, name, type, image="images/no_result.png"):
    try:
        # Insert structure with sqlalchemy
        insert_statement = insert(Songs).values(
            songID = song_id,
            name = name,
            image = image,
            type = type
        )
        # Execute the insert statement
        result = conn.execute(insert_statement)
        # Commit the transaction to save changes
        conn.commit()
        # Return a success message with the inserted song ID
        return f"Song with ID:{result.inserted_primary_key[0]} inserted"
    
    except Exception:

        return f"Song with ID: {song_id} already exists"

"""
    Method Comment Block: insert_user
    Purpose: Inserts a new user into the Users table.
    Author: Ryan
    Written on: 4.8.25
    Revised on: 5.4.25
    Called when: This method is called when a new user is being inserted into the database.
    Where it fits: It is part of the database operations, handling the insertion of user data.
    Data Structures/Algorithms: Uses SQLAlchemy's insert statement to insert a new user record.
    Expected input: Connection object to the database, username, password.
    Expected output: A success message indicating the ID of the inserted user.
    Expected extensions/revisions: As of 5.4.25, there are no expected extensions or revisions to this method.
"""
def insert_user(conn, username, password, email):
    try:
        insert_statement = insert(Users).values(
            username=username,
            password=password,
            email = email
        )
        # Execute the insert statement
        result = conn.execute(insert_statement)
        # Commit the transaction to save changes
        conn.commit()
        # Return a success message with the inserted user ID
        return result.inserted_primary_key[0]
    
    except Exception:

        return f"User with username: {username} already exists or email is already in use"





"""
    Method Comment Block: insert_comment
    Purpose: Inserts a new comment into the Comments table.
    Author: Ryan 
    Written on: 4.8.25
    Revised on: 5.4.25
    Called when: This method is called when a new comment is being inserted into the database.
    Where it fits: It is part of the database operations, handling the insertion of comment data.
    Data Structures/Algorithms: Uses SQLAlchemy's insert statement to insert a new comment record.
    Expected input: Connection object to the database, user ID, post ID, comment content, and optionally a parent comment ID.
    Expected output: A success message indicating the ID of the inserted comment.
    Expected extensions/revisions: Extend to handle comment upvoting/downvoting or additional features.
"""
def insert_comment(conn, user_id, song_id, content, parent_comment_id=None):
    try:
        insert_statement = insert(Comments).values(
            userID=user_id,
            songID=song_id,
            content=content,
            parent_commentID=parent_comment_id
        )
        result = conn.execute(insert_statement)
        conn.commit()
        # Return a success message with the inserted comment ID
        return f"comment with ID: {result.inserted_primary_key[0]} inserted"
    
    except Exception as e:

        return f"Error inserting comment: {e}"


# Purpose: "deletes" a comment by updating its content to "[DELETED]".
# Author: Ryan
# Date Written: 5.4.25
# Last Revised: 5.4.25
# Called By: The comment component comment_form.jsx when a user deletes their comment.
# System Context: Allows a user to delete their comment on a song post, user ID and comment ID must match for security reasons.
# Data Structures: N/A
# Algorithms Used: N/A
# Inputs: A comment ID, user ID, and a connection to the database.
# Outputs: A ressponse indicating the success or failure of the deletion operation.
# Future Changes: As of 5.4.25, there are no expected changes to this method.
def delete_comment(conn, comment_id, user_id):
    try:
        statement = update(Comments).where(and_(Comments.c.commentID == comment_id, Comments.c.userID == user_id)).values({"content": "[DELETED]"})
        conn.execute(statement)
        conn.commit()

        return f"Deleted comment with ID: {comment_id}"
    
    except Exception as e:

        return f"Error deleting comment with ID: {comment_id}, error: {e}"


# Purpose: Selects all of a users information from the Users table based on their email.
# Author: Ryan
# Date Written: 4.10.25
# Last Revised: 5.4.25
# Called By: app.py when a user logs in to verify their entered password against their hashed password.
# System Context: Used to retrieve user information for login purposes.
# Data Structures: Returns a single row from the Users table, stored in a tuple.
# Algorithms Used: N/A
# Inputs: A connection to the database and the user's email.
# Outputs: None if entry doesnt exist, the entry if it does.
# Future Changes: As of 5.4.25, there are no expected changes to this method.
def select_user(conn, email):
    try:
        statement = select(Users).where(Users.c.email == email)
        #fetchone() will return a single row or None if no match is found
        result = conn.execute(statement).fetchone()

        return result
    
    except Exception as e:

        return f"Error selecting user with email: {email}, error: {e}"


# Purpose: To select a user's ID based on their username.
# Author: Ryan
# Date Written: 4.20.25
# Last Revised: 5.4.25
# Called By: Used to retrieve a user's ID for various operations, finding a users tags, comments, etc.
# System Context: Used by the user activity end point to retrieve comments and tags for a user.
# Data Structures: A tuple representing the user's ID if it exists, or None if it does not.
# Algorithms Used: N/A
# Inputs: A connection to the database and the user's username.
# Outputs: The user's ID if it exists, or None if it does not.
# Future Changes: As of 5.4.25, there are no expected changes to this method.
def select_user_username(conn, user):
    try:
        id_search = conn.execute(select(Users.c.userID).where(Users.c.username == user)).fetchone()
        #The first item in the tuple is the userID, if it exists
        return id_search[0]
    
    except Exception as e:

        return f'User does exist, error: {e}'

           
# Purpose: Gets the username of a user based on their userID.
# Author: Ryan
# Date Written: 5.4.25
# Last Revised: 5.4.25
# Called By: The get_posts Flask endpoint.
# System Context: Used in situations where the username is needed for display purposes, such as in comments or posts.
# Data Structures: A tuple with entry data is indexed.
# Algorithms Used: N/A
# Inputs: A database connection and a user ID.
# Outputs: A users username if it exists, or a placeholder string if it does not.
# Future Changes: As of 5.4.25, there are no expected changes to this method.                            
def select_user_id(conn, id):
    try:
        user_search = conn.execute(select(Users.c.username).where(Users.c.userID == id)).fetchone()
        if user_search != None:
            # If the user exists, return their username
            return user_search[0]
        
        else:
            # If the user does not exist, return a placeholder string
            return "[DELETED]"
    except Exception as e:  
        
        return f"Error selecting user with ID: {id}, error: {e}"


# Purpose: Returns an interable object of all posts connected to a song.
# Author: Ryan
# Date Written: 4.20.25
# Last Revised: 5.4.25
# Called By: The get_posts Flask endpoint.
# System Context: Gets all comments associated with a song, used to display comments on the song's page.
# Data Structures: The object is an iterable containing all comments with comment information stored in a tuple.
# Algorithms Used: N/A
# Inputs: A songs ID and a connection to the database.
# Outputs: An iterable object containing all comments associated with the song.
# Future Changes: As of 5.4.25, there are no expected changes to this method.
def get_song_posts(conn, song):
    try:
        comment_search = conn.execute(select(Comments).where(Comments.c.songID == song))
        return comment_search
    except Exception as e:
        return f"Error getting posts for song with ID: {song}, error: {e}"


# Purpose: Used to check if a username or email already exists in the Users table.
# Author: Ryan
# Date Written: 4.20.25
# Last Revised: 5.4.25
# Called By: The signup Flask endpoint.
# System Context: Returns a message indicating whether the username or email already exists in the database. Shows the user what they need to
# change to successfully create an account.
# Data Structures: Two tuples containing the results of the search for the username and email.
# Algorithms Used: N/A
# Inputs: username and email strings, and a connection to the database.
# Outputs: A message indicating whether the username or email already exists in the database, or if there are no matches.
# Future Changes: As of 5.4.25, there are no expected changes to this method.
def check_user(conn, username, email):
    try:
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
    except Exception as e:
        return f"Error checking user: {e}"
    

# Purpose: Inserts a tag into the database, or updates an existing one.
# Author: Ryan
# Date Written: 4.25.25
# Last Revised: 5.4.25
# Called By: the create_tag Flask endpoint.
# System Context: Used to add a tag to the database for permanent storage or update the tag value.
# Data Structures: Database entry tuple.
# Algorithms Used: N/A
# Inputs: A database connection, a tag value, a song ID, and a user ID.
# Outputs: A message indicating whether the tag was created or updated, or an error message if something goes wrong.
# Future Changes: 
def insert_tag(conn, value, song, id):
    try:
        #Tag must have a value 
        if value != "":
            try:
                #sqlalchemy insert statement to add a new tag
                insert_statement = insert(Tags).values(
                    tag=value,
                    songID=song,
                    userID=id
                )
                conn.execute(insert_statement)
                conn.commit()

                return f"created tag"
            #If the tag already exists, update the existing tag
            except Exception:
                conn.execute(update(Tags).where(and_(Tags.c.userID == id,Tags.c.songID == song)).values(tag=value))
                conn.commit()

                return f"updated tag"
            
    except Exception as e:

        return f"Error inserting tag: {e}"


# Purpose: Used to see if a user has a tag on a specific song already
# Author: Ryan
# Date Written: 5.1.25
# Last Revised: 5.4.25
# Called By: The get_tags Flask endpoint.
# System Context: Will display what the users current tag is on a song, or if they have no tag.
# Data Structures: A database entry tuple.
# Algorithms Used: N/A
# Inputs: A connection to the database, a song ID, and a user ID.
# Outputs: A string indicating the user's tag on the song, or "No Tag" if they have no tag.
# Future Changes: As of 5.4.25, there are no expected changes to this method.
def check_tag(conn, song, user):
    try:
        test = conn.execute(select(Tags).where(and_(Tags.c.songID == song, Tags.c.userID == user))).fetchone()
        if test != None:
            #The first value in the entry tuple is the tags value
            return test[0]
        else:

            return "No Tag"
        
    except Exception as e:

        return f"Error checking tag: {e}"

# Purpose: Selects all tags associated with a song and counts their occurrences.
# Author: Ryan
# Date Written: 5.1.25
# Last Revised: 5.4.25
# Called By: get_tags Flask endpoint.
# System Context: Shows all tags associated with a song and how many times each tag has been used.
# Data Structures: An intermediary dictionary to store tag occurrences.
# Algorithms Used: A list of database entries is iterated through and the relevant data is stored in a dictionary.
# Inputs: A database connection and a song ID.
# Outputs: A dictionary where the keys are tag names and the values are the number of occurrences of each tag.
# Future Changes: As of 5.4.25, there are no expected changes to this method.
def select_tags_song(conn, song):
    try:
        resultdict = {}
        results = conn.execute(select(Tags.c.tag, func.count().label('occurrences')).where(Tags.c.songID == song).group_by(Tags.c.tag))
        #Iterate through the results and store them in a dictionary
        for i in results:
            #Sets a key value pair in the dictionary, where the key is the tag and the value is the number of occurrences
            resultdict.setdefault(i[0],i[1])

        return resultdict
    
    except Exception as e:

        return f"Error selecting tags for song with ID: {song}, error: {e}"


# Purpose: Returns all database information on a song.
# Author: Ryan
# Date Written: 5.1.25
# Last Revised: 5.4.25
# Called By: Called by user activity endpoint to retrieve song information.
# System Context: When only a songs ID is available, this method retrieves all information on the song in the database.
# Data Structures: A iterable object containing tuples with song information is returned.
# Algorithms Used: N/A
# Inputs: A database connection and a song ID.
# Outputs: A iterable containing entries in tuple form.
# Future Changes: As of 5.4.25, there are no expected changes to this method.
def select_song_info(conn, song):
    try:
        results = conn.execute(select(Songs).where(Songs.c.songID == song)).fetchone()

        return results
    
    except Exception as e:

        return f"Error selecting song with ID: {song}, error: {e}"
    

# Purpose: Gets all of a users tags
# Author: Ryan
# Date Written: 5.1.25
# Last Revised: 5.4.25
# Called By: The user activity endpoint to retrieve a users tags.
# System Context: Gets all tags associated with a user, used to display their tags on the user activity page.
# Data Structures: An iterable object containing tuples with tag information.
# Algorithms Used: N/A
# Inputs: A database connection and a user ID.
# Outputs: A iterable object containing all tags associated with the user.
# Future Changes: As of 5.4.25, there are no expected changes to this method.
def select_user_tags(conn, user):
    try:
        results = conn.execute(select(Tags).where(Tags.c.userID == user))

        return results
    
    except Exception as e:

        return f"Error selecting tags for user with ID: {user}, error: {e}"


# Purpose: Selects all of a users comments.
# Author: Ryan
# Date Written: 5.1.25
# Last Revised: 5.4.25
# Called By: The user activity endpoint to retrieve a users comments.
# System Context: Gets all the comment data associated with a user, used to display their comments on the user activity page.
# Data Structures: An iterable object containing tuples with comment information.
# Algorithms Used: N/A
# Inputs: a database connection and a user ID.
# Outputs: An iterable object containing all comments associated with the user.
# Future Changes: As of 5.4.25, there are no expected changes to this method.
def select_user_comments(conn, user):
    try:
        results = conn.execute(select(Comments).where(Comments.c.userID == user))
        
        return results
    
    except Exception as e:

        return f"Error selecting comments for user with ID: {user}, error: {e}"




# with engine.connect() as conn:
#     print([i for i in (select_user_comments(conn, 1))])

