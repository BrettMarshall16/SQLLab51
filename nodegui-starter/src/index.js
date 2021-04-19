import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QPlainTextEdit, QListWidget, QListWidgetItem, QLineEdit, QGridLayout, Component } from '@nodegui/nodegui';
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

// Setup
const win = new QMainWindow();
win.setWindowTitle("Super Heroes");

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new QGridLayout();
rootLayout.setObjectName("rootlayout");
centralWidget.setLayout(rootLayout, 25, 1);
const space = new QLabel();



// Welcome label
const welcomeLbl = new QLabel();
welcomeLbl.setObjectName("welcomeLbl");
welcomeLbl.setText("Welcome to the list of Super Heroes");



// Add super hero
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


const addSuperHerobutton = new QPushButton();
addSuperHerobutton.setText("Add Super Hero");
addSuperHerobutton.setObjectName("addSuperHerobutton")
addSuperHerobutton.addEventListener('clicked', ()=>{
  let theHeroName = heroName.text();
  let theHeroAlias = heroAlias.text();
  let theHeroEmail = heroEmail.text();
  heroName.clear();
  heroAlias.clear();
  heroEmail.clear();
    database.query("INSERT INTO `heroes`(`name`,`alias`,`email`) values (?,?,?);",[theHeroName,theHeroAlias,theHeroEmail],function(err, result){
        if(err) throw err;
        console.log("Hero Added");
    })
})
 
// Edit super hero
const editHeroLbl = new QLabel();
editHeroLbl.setObjectName("editHeroLbl");
editHeroLbl.setText("Enter the heros index you wish to edit:");
const editHero = new QLineEdit();
editHero.setObjectName("editHero");
const editHeroAliasLabel = new QLabel();
editHeroAliasLabel.setObjectName("editHeroAliasLabel");
editHeroAliasLabel.setText("Enter the new Alias");
const editHeroAlias = new QLineEdit();
editHeroAlias.setObjectName("editHeroAlias");
const editSuperHeroButton = new QPushButton();
editSuperHeroButton.setText("Edit Super Hero");
editSuperHeroButton.setObjectName("editSuperHeroButton")
editSuperHeroButton.addEventListener('clicked', ()=>{
  let theEditedHero = editHero.text();
  let theNewAlias = editHeroAlias.text();
  editHero.clear();
  editHeroAlias.clear();
    database.query("UPDATE heroes SET alias = ? WHERE idx =?;",[theNewAlias,theEditedHero],function(err, result){
        if(err) throw err;
        console.log("Hero Edited");
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
        let insert = "Index: " + result.idx + "  Name: " + result.name + "  Alias: " + result.alias + "  Email: " + result.email;
        let tempListItem = new QListWidgetItem();
        tempListItem.setText(insert);
        heroList.addItem(tempListItem);
      }
    });
});


// Remove a hero by index
const removeHeroBtn = new QPushButton();
removeHeroBtn.setText("Delete hero (index)");
const deleteHero = new QLineEdit();
deleteHero.setObjectName("deleteHero");
removeHeroBtn.addEventListener("clicked", () => {

  let listHeroesQuery = 'SELECT idx FROM heroes';
  let heroIdx = deleteHero.text();
  deleteHero.clear();

  database.query(listHeroesQuery ,function(err, results){
    if (err) throw err;
    for (let result of results){
      if (heroIdx == result.idx) {
        database.query('DELETE FROM heroes WHERE idx=?',[heroIdx],function(err, results){if (err) throw err})
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
  theSkill.clear();

  database.query(listSkillsTable ,function(err, results){
    
    // Checks if added skill already exists
    let dupNameChk = true;
    for (let result of results){
      if (theSkillToAdd == result.skill_name) {
        console.log("Name already exists");
        dupNameChk = false;
      }
    }

    // Adds skill if name doesn't exist
    if (dupNameChk) {
      database.query("INSERT INTO `skills`(`skill_name`) values (?);",[theSkillToAdd], function(err, result){
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
        let insert = "Index: " + result.skill_index + "  Skill: " + result.skill_name;
        let tempListItem = new QListWidgetItem();
        tempListItem.setText(insert);
        skillList.addItem(tempListItem);
      }
    });
});


// Remove a skill by index
const removeSkillBtn = new QPushButton();
removeSkillBtn.setText("Delete skill (index)");
const removeSkill = new QLineEdit();
removeSkill.setObjectName("removeSkill");
removeSkillBtn.addEventListener("clicked", () => {

  let listSkillsQuery = 'SELECT skill_index FROM skills';
  let skillIdx = removeSkill.text();
  removeSkill.clear();

  database.query(listSkillsQuery ,function(err, results){
    for (let result of results){
      if (skillIdx == result.skill_index) {

        database.query('DELETE FROM skills WHERE skill_index=?',[skillIdx],function(err, results){if(err) throw err})
        console.log("Skill " + skillIdx + " " + "deleted.");

      }
    }

  })

}); 



// List has_skills table
const hasSkillList = new QListWidget();
const hasSkillBtn = new QPushButton();
hasSkillBtn.setText("List Who Has What Skills");
hasSkillBtn.addEventListener("clicked", () => {
  hasSkillList.clear();
  let listHasSkillsTable = 'SELECT * FROM has_skills ORDER BY hereos_idx';
    database.query(listHasSkillsTable ,function(err, results){
      if(err) throw err;
      for (let result of results){
        let insert = "Hero Index: " + result.hereos_idx + "  Skill Index: " + result.skill_idx;
        let tempListItem = new QListWidgetItem();
        tempListItem.setText(insert);
        hasSkillList.addItem(tempListItem);
      }
    });
});


// Add skill to hero
const addSkillToHero = new QPushButton();
addSkillToHero.setText("Add Skill to Hero");
const addSkillToHeroLabel = new QLabel();
addSkillToHeroLabel.setObjectName("addSkillToHeroLabel");
addSkillToHeroLabel.setText("Enter a Skill index:");
const skillToAddIndex = new QLineEdit();
heroName.setObjectName("SkillToADd");
const addHeroToSkillLabel = new QLabel();
addHeroToSkillLabel.setObjectName("addHeroToSkillLabel");
addHeroToSkillLabel.setText("Enter Hero Index:");
const HeroToAddIndex = new QLineEdit();
heroAlias.setObjectName("HeroToAdd");
addSkillToHero.addEventListener('clicked', ()=>{
  let skillindex = skillToAddIndex.text();
  let heroindex = HeroToAddIndex.text();
  skillToAddIndex.clear();
  HeroToAddIndex.clear();
    database.query("INSERT INTO `has_skills`(`hereos_idx`,`skill_idx`) values (?,?);",[heroindex,skillindex],function(err, result){
        if(err) throw err;
        console.log("Skill added to hero!");
    })
})



// Does hero have needed skill?
const neededSkillList = new QListWidget();
const neededSkillBtn = new QPushButton();
const neededSkillIndex = new QLineEdit();
neededSkillBtn.setText("List Heroes With Skill (index)");
neededSkillBtn.addEventListener("clicked", () => {
  neededSkillList.clear();
  let neededSkill = neededSkillIndex.text();
  let listHasSkillsTable = 'SELECT * FROM has_skills ORDER BY hereos_idx';
    database.query(listHasSkillsTable ,function(err, results){
      if(err) throw err;
      for (let result of results){
        if (neededSkill == result.skill_idx) {
              let insert = "Hero Index: " + result.hereos_idx + "  Has Skill: " + result.skill_idx;
              let tempListItem = new QListWidgetItem();
              tempListItem.setText(insert);
              neededSkillList.addItem(tempListItem);

        }

      }
    });});


// Display Hero Info
const heroesSkillsList = new QListWidget();
const heroesSkillsBtn = new QPushButton();
const heroesSkillIndex = new QLineEdit();
heroesSkillsBtn.setText("List Heroes With Skill (index)");
heroesSkillsBtn.addEventListener("clicked", () => {
  heroesSkillsList.clear();
  let heroSkill = heroesSkillIndex.text();
  let heroInfoSQL = "select name,alias,email GROUP_CONCAT(DISTINCT skill_name ORDER BY skill_name DESC SEPARATOR ',') as Their_Skills from heroes join has_skills on heroes.idx = has_skills.hereos_idx join skills on has_skills.skill_idx = skills.skill_index;"
    database.query(heroInfoSQL ,function(err, results){
      if(err) throw err;
      for (let result of results) {
        let insert = "Hero name: " + result.name + "  Hero Alias: " + result.alias + "  Hero Email: " + result.email + "  Hero Skills: " + result.Their_Skills;
        let tempListItem = new QListWidgetItem();
        tempListItem.setText(insert);
        neededSkillList.addItem(tempListItem);
      }
    })
  });
            
        





//Layout
rootLayout.setHorizontalSpacing(20);
//rootLayout.setVerticalSpacing(20);
rootLayout.setColumnMinimumWidth(0, 600)
rootLayout.setColumnMinimumWidth(1, 200)

rootLayout.addWidget(welcomeLbl);

rootLayout.addWidget(heroNameLbl, 2, 0);
rootLayout.addWidget(heroName, 2, 1);
rootLayout.addWidget(heroAliasLbl, 3, 0);
rootLayout.addWidget(heroAlias, 3, 1);
rootLayout.addWidget(heroEmailLbl, 4, 0);
rootLayout.addWidget(heroEmail, 4, 1);
rootLayout.addWidget(addSuperHerobutton, 5, 0);

rootLayout.addWidget(editHeroLbl, 6, 0);
rootLayout.addWidget(editHero, 6, 1);
rootLayout.addWidget(editHeroAliasLabel, 7, 0);
rootLayout.addWidget(editHeroAlias, 7, 1);
rootLayout.addWidget(editSuperHeroButton, 8, 0);

rootLayout.addWidget(heroList, 9, 0);
rootLayout.addWidget(listSuperHeros, 9, 1);

rootLayout.addWidget(deleteHero, 10, 0);
rootLayout.addWidget(removeHeroBtn, 10, 1);

rootLayout.addWidget(theSkill, 11, 0);
rootLayout.addWidget(addASkill, 11, 1);

rootLayout.addWidget(skillList, 12, 0);
rootLayout.addWidget(listTheSkills, 12, 1);

rootLayout.addWidget(removeSkill, 13, 0);
rootLayout.addWidget(removeSkillBtn, 13, 1);

rootLayout.addWidget(addSkillToHeroLabel, 14, 0);
rootLayout.addWidget(skillToAddIndex, 15, 0);
rootLayout.addWidget(addHeroToSkillLabel, 16, 0);
rootLayout.addWidget(HeroToAddIndex, 17, 0);
rootLayout.addWidget(addSkillToHero, 17, 1);

rootLayout.addWidget(hasSkillList, 18, 0)
rootLayout.addWidget(hasSkillBtn, 18, 1)

rootLayout.addWidget(neededSkillList, 19, 0)
rootLayout.addWidget(neededSkillIndex, 19, 1)
rootLayout.addWidget(neededSkillBtn, 20, 1)

rootLayout.addWidget(heroesSkillsList, 21, 0)
rootLayout.addWidget(heroesSkillIndex, 21, 1)
rootLayout.addWidget(heroesSkillsBtn, 22, 1)

win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #0059b3;
    }
    #welcomeLbl {
      font-size: large;
    }

  `
);
win.show();