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

def insert_song(conn):
    insert_statement = insert(Songs).values()
    result = conn.execute(insert_statement)
    conn.commit()
    return f"Song with ID:{result.inserted_primary_key[0]} inserted"

def insert_user(conn, username, password):
    insert_statement = insert(Users).values(
        username=username,
        password=password
    )
    result = conn.execute(insert_statement)
    conn.commit()
    return f"User with ID: {result.inserted_primary_key[0]} inserted"

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


