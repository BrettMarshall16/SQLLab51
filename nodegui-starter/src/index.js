import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QPlainTextEdit, QListWidget, QListWidgetItem } from '@nodegui/nodegui';
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
    let herosTable = "CREATE TABLE IF NOT EXISTS `heroes` (`idx` int NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `alias` varchar(50) NOT NULL, `email` varchar(50) NOT NULL, PRIMARY KEY (`idx`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"
    let skillsTable = "CREATE TABLE IF NOT EXISTS `skills` (`skill_index` int NOT NULL AUTO_INCREMENT, `skill_name` varchar(50) UNIQUE NOT NULL, PRIMARY KEY (`skill_index`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"
    let joinedTable = "CREATE TABLE IF NOT EXISTS `has_skills` (`hereos_idx` int NOT NULL, `skill_idx` int NOT NULL, PRIMARY KEY (`hereos_idx`,`skill_idx`), KEY `skill_idx` (`skill_idx`), CONSTRAINT `has_skills_ibfk_1` FOREIGN KEY (`hereos_idx`) REFERENCES `heroes` (`idx`), CONSTRAINT `has_skills_ibfk_2` FOREIGN KEY (`skill_idx`) REFERENCES `skills` (`skill_index`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"
    database.query(herosTable,function(err, result){
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
  let theHeroName = heroName.toPlainText();
  let theHeroAlias = heroAlias.toPlainText();
  let theHeroEmail = heroEmail.toPlainText();
  let addHero = "INSERT INTO `heroes`(`name`,`alias`,`email`) values ('"+ theHeroName + "'" + "," + "'" + theHeroAlias + "'" + "," + "'" + theHeroEmail + "');";
  console.log(addHero);
    database.query(addHero,function(err, result){
        if(err) throw err;
        console.log("Hero Added");
    })
})
  


const heroList = new QListWidget();
const listSuperHeros = new QPushButton();
listSuperHeros.setText("List Super Heros");
listSuperHeros.addEventListener("clicked", () => {
  let listHeroTable = 'SELECT * FROM heroes';
    database.query(listHeroTable ,function(err, results){
      if(err) throw err;
      for (let result of results){
        let string = JSON.stringify(result);
        let parse = JSON.parse(string);
        let insert = parse.name + " " + parse.alias + " " + parse.email;
        let tempListItem = new QListWidgetItem();
        tempListItem.setText(insert);
        heroList.addItem(tempListItem);
      }
    });
});
const addASkill = new QPushButton();
addASkill.setText("Add A Skill");
const theSkill = new QPlainTextEdit();
theSkill.setObjectName("theSkill");
addASkill.addEventListener('clicked', ()=>{
  let theSkillToAdd = theSkill.toPlainText();
  let addSkill = "INSERT INTO `skills`(`skill_name`) values ('" + theSkillToAdd + "');";
  console.log(addSkill);
  database.query(addSkill,function(err, result){
    if(err) throw err;
    console.log("Skill Added");
  })
})

const skillList = new QListWidget();
const listTheSkills = new QPushButton();
listTheSkills.setText("List The Skills");
listTheSkills.addEventListener("clicked", () => {
  let listSkillsTable = 'SELECT * FROM skills';
    database.query(listSkillsTable ,function(err, results){
      if(err) throw err;
      for (let result of results){
        let string = JSON.stringify(result);
        let parse = JSON.parse(string);
        let insert = parse.skill_name;
        let tempListItem = new QListWidgetItem();
        tempListItem.setText(insert);
        skillList.addItem(tempListItem);
      }
    });
});



const removeSuperHeros = new QPushButton();
removeSuperHeros.setText("Add Super Hero");




//LAYOUT!@#!@#!@#!@#!@#

rootLayout.addWidget(label);
rootLayout.addWidget(addSuperHerobutton);
rootLayout.addWidget(heroNameLbl);
rootLayout.addWidget(heroName);
rootLayout.addWidget(heroAliasLbl);
rootLayout.addWidget(heroAlias);
rootLayout.addWidget(heroEmailLbl);
rootLayout.addWidget(heroEmail);

rootLayout.addWidget(listSuperHeros);
rootLayout.addWidget(heroList);
rootLayout.addWidget(addASkill);
rootLayout.addWidget(theSkill);
rootLayout.addWidget(listTheSkills);
rootLayout.addWidget(skillList);
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