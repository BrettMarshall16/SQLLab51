import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QPlainTextEdit, QListWidget, QListWidgetItem, QLineEdit } from '@nodegui/nodegui';
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
win.setWindowTitle("Super Heroes");

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const welcomeLbl = new QLabel();
welcomeLbl.setObjectName("welcomeLbl");
welcomeLbl.setText("Welcome to the list of Super Heroes");



// Add super hero
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
  let addHero = "INSERT INTO `heroes`(`name`,`alias`,`email`) values ('"+ theHeroName + "'" + "," + "'" + theHeroAlias + "'" + "," + "'" + theHeroEmail + "');";
  console.log(addHero);
    database.query(addHero,function(err, result){
        if(err) throw err;
        console.log("Hero Added");
    })
})
  

// List super heroes
const heroList = new QListWidget();
heroList.setObjectName("heroList");
const listSuperHeros = new QPushButton();
listSuperHeros.setText("List Super Heros");
listSuperHeros.addEventListener("clicked", () => {
  heroList.clear();
  let listHeroTable = 'SELECT * FROM heroes';
    database.query(listHeroTable ,function(err, results){
      if(err) throw err;
      for (let result of results){
        console.log(result);
        let string = JSON.stringify(result);
        let parse = JSON.parse(string);
        console.log(parse);
        let insert = parse.idx + " " + parse.name + " " + parse.alias + " " + parse.email;
        let tempListItem = new QListWidgetItem();
        tempListItem.setText(insert);
        heroList.addItem(tempListItem);
      }
    });
});


const removeHeroBtn = new QPushButton();
removeHeroBtn.setText("Delete hero (index)");
const deleteHero = new QLineEdit();
deleteHero.setObjectName("deleteHero");
removeHeroBtn.addEventListener("clicked", () => {


  let listHeroesQuery = 'SELECT idx FROM heroes';
  let heroIdx = deleteHero.text();

  

  database.query(listHeroesQuery ,function(err, results){
    for (let result of results){
      let string = JSON.stringify(result);
      let parse = JSON.parse(string);
      if (heroIdx == parse.idx) {

        let deleteQuery = 'DELETE FROM heroes WHERE idx=' + heroIdx; 
        database.query(deleteQuery ,function(err, results){})

        console.log("Hero " + heroIdx + " " + "deleted.");
      }
    }

  })

}); 






// Add a skill
const addASkill = new QPushButton();
addASkill.setText("Add A Skill");
const theSkill = new QLineEdit();
theSkill.setObjectName("theSkill");

addASkill.addEventListener('clicked', ()=>{

  let theSkillToAdd = theSkill.text();
  let listSkillsTable = 'SELECT * FROM skills ORDER BY SKILL_INDEX';

  database.query(listSkillsTable ,function(err, results){
    
    // Checks if added skill already exists
    let dupNameChk = true;
    for (let result of results){
      let string = JSON.stringify(result);
      let parse = JSON.parse(string);

      if (theSkillToAdd == parse.skill_name) {
        console.log("Name already exists");
        dupNameChk = false;
      }
    }

    // Adds skill if name doesn't exist
    if (dupNameChk) {
      let addSkill = "INSERT INTO `skills`(`skill_name`) values ('" + theSkillToAdd + "');";
      console.log(addSkill);
      database.query(addSkill,function(err, result){
        if(err) throw err;
        console.log("Skill Added");
      });
    }

  })

});




// List skills
const skillList = new QListWidget();
const listTheSkills = new QPushButton();
listTheSkills.setText("List The Skills");
listTheSkills.addEventListener("clicked", () => {
  skillList.clear();
  let listSkillsTable = 'SELECT * FROM skills ORDER BY SKILL_INDEX';
    database.query(listSkillsTable ,function(err, results){
      if(err) throw err;
      for (let result of results){
        let string = JSON.stringify(result);
        let parse = JSON.parse(string);
        let insert = parse.skill_index + " " + parse.skill_name;
        let tempListItem = new QListWidgetItem();
        tempListItem.setText(insert);
        skillList.addItem(tempListItem);
      }
    });
});







//LAYOUT!@#!@#!@#!@#!@#

rootLayout.addWidget(welcomeLbl);

rootLayout.addWidget(addSuperHerobutton);
rootLayout.addWidget(heroNameLbl);
rootLayout.addWidget(heroName);
rootLayout.addWidget(heroAliasLbl);
rootLayout.addWidget(heroAlias);
rootLayout.addWidget(heroEmailLbl);
rootLayout.addWidget(heroEmail);

rootLayout.addWidget(listSuperHeros);
rootLayout.addWidget(heroList);

rootLayout.addWidget(removeHeroBtn);
rootLayout.addWidget(deleteHero);

rootLayout.addWidget(addASkill);
rootLayout.addWidget(theSkill);

rootLayout.addWidget(listTheSkills);
rootLayout.addWidget(skillList);



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
      width: 200px;
    }
    #heroList{
      width: 500px;
    }
  `
);
win.show();
global.win = win; // To prevent win from being garbage collected.