# PlayBack

**PlayBack** is a web application designed to offer users a personalized and introspective music experience. It allows users to track their listening habits, rate music privately, and share concise thoughts on albums or tracks. With a focus on self-reflection and music discovery, PlayBack removes external pressures, offering a safe space for personal music journaling.

## Features

- **User Authentication:** Secure sign-up and login system, allowing users to create personal accounts.
- **Music Tracking:** Users can track their listening habits and privately rate music.
- **Spotify Integration:** Integrates with the Spotify API to pull user data and provide seamless music playback.
- **Custom Tagging System ("Vibes"):** A user-generated tagging system that helps categorize and discover new music based on personal feelings and vibes.
- **Concise Thoughts:** Users can share short, tweet-length thoughts on albums or tracks without numeric ratings or external feedback.
- **Personalized Music Journey:** Track your music preferences over time and see how your tastes evolve.

## Technologies Used

- **Frontend:** React
- **Backend:** Node.js with Express
- **Database:** MySQL (via SQLAlchemy ORM)
- **Authentication:** Custom user authentication system
- **Spotify API:** To sync user data and enable music playback
- **Styling:** CSS (React-based design)

## Installation

To run PlayBack locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/playback.git
   cd playback
   ```
2. **Install Dependencies:**
   For Frontend (React):
   ```bash
    cd client
    npm install
   ```
   For Backend (Node.js):
   ```bash
   cd backend
   npm install
   ```
3. **Set Up the Database:**
   -Make sure MySQL is installed and running on your local machine.
   - Create a database for PlayBack in MySQL.
   - Configure your database connection in the backend's .env file with the correct credentials.
4.  **Run the Application:**
    Start the backend serve:
    ```bash
    cd backend
    python app.py
    ```
    Start the frontend server:
    ```bash
    cd client
    npm run dev
    ```
5. **Visit the App**

## Contributing

Feel free to fork this project, submit pull requests, and suggest improvements. The development of PlayBack is ongoing, and contributions are always welcome.

To contribute:
1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make changes and commit them (git commit -am 'Add new feature').
4. Push to your branch (git push origin feature-branch).
5. Create a new Pull Request.
