import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QIcon, QSize, QPlainTextEdit, QLineEdit, QMenu, QTextEdit   } from '@nodegui/nodegui';
import logo from '../assets/logox200.png';

const mysql = require('mysql');
const database = mysql.createConnection({
  host    :'localhost',
  user    :'nodejs',
  password:'nodejspassword',
  database:'superheroes'
});
database.connect(function(err){
  if (err) throw err;
  console.log("Connected!");
  let heroesTable = "CREATE TABLE IF NOT EXISTS `heroes` (`idx` int NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `alias` varchar(50) NOT NULL, `email` varchar(50) NOT NULL, PRIMARY KEY (`idx`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"
  let skillsTable = "CREATE TABLE IF NOT EXISTS `skills` (`skill_index` int NOT NULL AUTO_INCREMENT, `skill_name` varchar(50) UNIQUE NOT NULL, PRIMARY KEY (`skill_index`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"
  let joinedTable = "CREATE TABLE IF NOT EXISTS `has_skills` (`hereos_idx` int NOT NULL, `skill_idx` int NOT NULL, PRIMARY KEY (`hereos_idx`,`skill_idx`), KEY `skill_idx` (`skill_idx`), CONSTRAINT `has_skills_ibfk_1` FOREIGN KEY (`hereos_idx`) REFERENCES `heroes` (`idx`), CONSTRAINT `has_skills_ibfk_2` FOREIGN KEY (`skill_idx`) REFERENCES `skills` (`skill_index`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"
  database.query(heroesTable,function(err, result){
      if(err) throw err;
      console.log("Table Heroes Created!");
  })
  database.query(skillsTable,function(err, result){
      if(err) throw err;
      console.log("Table Skills Created!");
  })
  database.query(joinedTable,function(err, result){
      if(err) throw err;
      console.log("Table HeroSkills Created!");
  })
  
})


const win = new QMainWindow();
win.setWindowTitle("Hello World Test");


const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const welcomeLbl = new QLabel();
welcomeLbl.setObjectName("welcomeLbl");
welcomeLbl.setText("Welcome to the list of Super Heroes");


// Adds hero to the database with contents of 3 QLineEdit fields
const addSuperHerobutton = new QPushButton();
addSuperHerobutton.setText("Add Super Hero");

const heroNameLbl = new QLabel();
heroNameLbl.setObjectName("heroNameLbl");
heroNameLbl.setText("Enter Hero Name:");
const heroName = new QLineEdit();
heroName.setObjectName("heroName");

const heroAliasLbl = new QLabel();
heroAliasLbl.setObjectName("heroAliasLbl");
heroAliasLbl.setText("Enter Hero Alias:");
const heroAlias = new QLineEdit();
heroAlias.setObjectName("heroAlias");

const heroEmailLbl = new QLabel();
heroEmailLbl.setObjectName("heroEmailLbl");
heroEmailLbl.setText("Enter Hero Email:");
const heroEmail = new QLineEdit();
heroEmail.setObjectName("heroEmail");
addSuperHerobutton.addEventListener('clicked', ()=>{

    let theHeroName = heroName.text();
    let theHeroAlias = heroAlias.text();
    let theHeroEmail = heroEmail.text();
    //let addHero = "INSERT INTO `heroes`(`name`,`alias`,`email`) values (" + theHeroName + "," + theHeroAlias + "," + theHeroEmail + ");"
    let addHero = "INSERT INTO `heroes`(`name`,`alias`,`email`) values ('" + theHeroName + "','" + theHeroAlias + "','" + theHeroEmail + "');"
    console.log(addHero);

    database.query(addHero,function(err, result){
       if(err) throw err;
       console.log("Hero Added!");
   })
    
})
  


const menu = new QMenu();

const herolist = [];

const listSuperHeros = new QPushButton();
listSuperHeros.setText("List Super Heros");
listSuperHeros.addEventListener("clicked", () => {
  let listHeroTable = 'SELECT * FROM heroes';
    database.query(listHeroTable ,function(err, results){
      if(err) throw err;
      for (let result of results){
        herolist.push(result);
      }
    });
listSuperHeros.addEventListener('clicked', () => {
  for(let i = 0; i < herolist.length; i++)
  showSuperHeros.setText(herolist[i].name + " " + herolist[i].alias);
})
});

const showSuperHeros = new QLabel();



const removeSuperHeros = new QPushButton();
removeSuperHeros.setText("Add Super Hero");


rootLayout.addWidget(welcomeLbl);

rootLayout.addWidget(addSuperHerobutton);
rootLayout.addWidget(heroNameLbl);
rootLayout.addWidget(heroName);
rootLayout.addWidget(heroAliasLbl);
rootLayout.addWidget(heroAlias);
rootLayout.addWidget(heroEmailLbl);
rootLayout.addWidget(heroEmail);

rootLayout.addWidget(listSuperHeros);
rootLayout.addWidget(showSuperHeros);
rootLayout.addWidget(removeSuperHeros);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #009688;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
    }
    #heroName, #heroEmail, #heroAlias{
      height: 20px;
      width: 100px;
    }
  `
);
win.show();
global.win = win; // To prevent win from being garbage collected.