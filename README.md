# GameLogged

This is a video game backlog tracker for all your games that you've hoarded but haven't played!
The point is to be able to keep track of games you want to play, have played, have beaten, have completed 100%, or keep track of games you may want eventually!
You can also keep track of specific moments in your video game entries with the memory card feature!
Coming Soon : Video Game Cover Image Upload

Live Link: https://gamelogged-q690.onrender.com/


#Technologies and Frameworks Used : React / Redux | Flask / SQLAlchemy 

## Feature List

### Entries
- Keep track of your video games 
- Keep track of the rating of the video game (can be empty so you can wait to complete it!)
- Keep track of your progress

### Memory Cards
- Keep track or specific moments within your video games
- Pick an already existing entry to make a memory of what you wish for the game

### Comments
- Write down your thoughts on whatever, be it gaming or just having a day!
- Think of it like a small journal you can keep track of

### Coming Soon
- Video Game Cover Image Upload
- Memory Card Images Uplaod
- Themes
- Badges/Achievements
- Social Forum

![image](https://github.com/Jojovial/GameLogged/assets/114697414/7ac756df-2bf9-452a-a351-527ddd82df61)
![image](https://github.com/Jojovial/GameLogged/assets/114697414/c7747241-6c84-4db9-bd7f-175e2e5bf596)

Contact:
https://www.linkedin.com/in/joey-enright/

##Endpoints

| Feature                  | Endpoint           | Purpose                                           |
|--------------------------|--------------------|---------------------------------------------------|
| Account Management       |                    |                                                   |
| Signup                   | /signup            | Users can create a new account                   |
| Login                    | /login             | Users can access their account                   |
| Logout                   | /logout            | Users can log out to secure their data            |
| Video Game Backlog Entries |                   |                                                   |
| Create                   | /entries/create    | Users can post video game entries                |
| Read                     | /entries           | Users can view their created entries             |
| Update                   | /entries/{id}      | Users can make changes to their entries          |
| Delete                   | /entries/{id}      | Users can delete any entries they’ve created     |
| Memory Card              |                    |                                                   |
| Create                   | /memory/create     | Users can post log info about their entries      |
| Read                     | /memory            | Users can view their log info                    |
| Update                   | /memory/{id}       | Users can make changes to their log info         |
| Delete                   | /memory/{id}       | Users can remove their log info                  |
| Dialogue Box             |                    |                                                   |
| Create                   | /comments/create   | Users can create their own comments on their page|
| Read                     | /comments          | Users can view their comments                    |
| Update                   | /comments/{id}     | Users can update their comments                 |
| Delete                   | /comments/{id}     | Users can delete their comments                 |


