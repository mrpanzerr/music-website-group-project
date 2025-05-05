For this installation guide I will provide two paths, one for mac, and one for windows. The process will be separated into digestable catagories that should ease the process along.

-The first catagory is downloading the packages necessary to run the code in our project.
-To start, its recommended that you download the python virtual environment to ensure
-version stability.
-Ensure that python is installed, navigate to the project folder, then run the 
-following command, "python -m venv myenv".
@On mac, the activate your vitual environment, run the command "source myenv/bin/activate"
$On Windows, run the command myenv\Scripts\activate 
-Now that your virtual environment is running, you can begin to install packages.
-We already have a list of packages in a file called requirements.txt, to download the packages
-in that file run the command "pip install -r requirements.txt".

Once you have run that command you should have all the packages necessary to run the code in our project.
If you come across any error, you can always "pip install" the missing packages.


-The second step we are going to take is the installation of MySQL community edition.
-You can find the page with their installations here (https://dev.mysql.com/downloads/).
-Once you download the file run the installer.
@For mac, you want to choose all the default settings, MAKE SURE YOU REMEMBER YOUR PASSWORD
$For Windows choose the developer default option, install MySQL server, and configure your password
$YOU MUST REMEMBER YOUR PASSWORD
-On both types of machines, download mysql workbench from (https://dev.mysql.com/downloads/workbench/)
-Select the download file that applies to your computer, use the default settings. 
-Next launch the application and press the + icon next to MySQL Connections, this will bring up 
-a window that lets you create your own database.
-The default values in this window are fine, but make sure you remember the information here as you will need
-it when setting up the database connection in the project files.
-Open up the project files, at the top of the app.py, main.py, and db.py files you will find a database 
-connection string with various variable names above it. Replace the values at all three location with your
-new database's information.
-Once you have done that, type the following lines at the bottom of the db.py file.
-meta.create_all(engine)
-meta.reflect(bind=engine)
-This will use the information in the files to create the tables that will be used in the program.

With this, you should be done with the database connection.
Next we are going to go over how to get connected to the Spotify API.

-The first step in this process is visiting the website (https://developer.spotify.com)
-Once you have created an account, click on the icon in the top right and go to your dashboard.
-In your dashboards Basic Information tab you'll see two important areas, your client ID, and 
-view client secret. View your client secret then take both of these strings and copy them into the main.py -file near the top where it says client_id and client_secret.
-If you want to keep your keys secure, you can put them in a .env file and access them as we do using 
-os.getenv("VARIABLE_NAME")

After you have done that, your API access should be set up and you can start making calls to the Spotify API.
Now you can access most of the functionality of the project.
To run the frontend server, enter the command "npm run dev"
To run the backend server, run the command "python3 BackEnd/app.py"
If that does working, try "python BackEnd/app.py".
You should now be able to visit the website and interact with it.
Have fun!
