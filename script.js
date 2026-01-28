//asign initial values
let health = 100;
let xp = 0;
let gold = 40; 
let currentWeaponIndex = 0;
let monsterHP;
let inventory = ["stick"];
let fighting;
let isCriticalHit = false;
let hasDodge = true;
let expectations = 0; 

//assigning ID to reference variables
const playerXP = document.querySelector("#playerXP");
const playerHealth = document.querySelector("#playerHealth");
const playerGold = document.querySelector("#playerGold");
const option1 = document.querySelector("#option1");
const option2 = document.querySelector("#option2");
const option3 = document.querySelector("#option3");
const option4 = document.querySelector("#option4");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealth = document.querySelector("#monsterHealth");
let textBox = document.querySelector("#textBox");

monsterStats.style.display = "none";
option3.style.display = "none";
option4.style.display = "none";

//button functions
    option1.onclick = goStore; 
    option2.onclick = goCave;
    option3.onclick = fightDragon;

//object classes and arrays
const weapons = [ 
    {name: "stick", power: 5},
    {name: "dagger", power: 15},
    {name: "sword", power: 40},
    {name: "claymore", power: 90},
    {name: "excalibur", power: 130},
]
const monsters = [
    {name: "Goblin", level: 5, health: 20, power: 5},
    {name: "Orc", level: 15, health: 80, power: 20},
    {name: "Gargoyle", level: 25, health: 150, power: 30},
    {name: "Red-eyed Dragon", level: 40, health: 500, power: 45}
]

let locations = [ 
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight Boss"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", `Buy a weapon (${(currentWeaponIndex + 1) * 30} Gold)`, "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: 'You see a sign that says "Store".'
    },
    { 
        name: "cave",
        "button text": ["Fight Goblin", "Fight Orc", "Fight Gargoyle", "Go to town square"],
        "button functions": [fightGoblin, fightOrc, fightGargoyle, goTown],
        text: "Monsters are blocking the cave exits. You sharpen your stance for battle.",
    },
    { 
        name: "fighting",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You enter combat."
    },
    {
        name: "win fight",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose game",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [replay, replay, replay], 
        text: "You died. &#x1F480 Try again?"
    },
    { 
        name: "win game",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [replay, replay, replay],
        text: "You have beat the FINAL BOSS &#128079; REPLAY?"
    },
    {
        name: "easter egg",
        "button text": ["Pick 2", "Pick 8", "Go to town square"],
        "button functions": [pick2, pick8, goTown],
        text: "You find yourself in a hidden room. A box with a sign tells you to pick a number that will appear in a randomly generated number array. If you guess correctly you gain 20 gold, but if you guess incorrectly you lose 10 health. Do you want to play?"
    }
]
let villageTalk = [ 
    {   
        name: "Start of game",
        text: " People heed you no attention and you hear news about monsters attacking borders of the capital.",
    },
    {
        name: "Beat goblin",
        text: " A fellow town knight greets you 'Good Morning! Do your best!' on their way to duty."
    },
    {
        name: "Beat orc",
        text: " The town knight greets you 'Good Morning! Do your best!' on their way to duty. People are glancing at your muscles as they walk by."
    },
    { 
        name: "Beat gargoyle",
        text: " You greet people as you pass by and some of them offer you food and gifts on the way. You politely decline the gesture and make your way to your destination."
    }
]
//location functions
function update(location) { 
    option1.innerText = location["button text"][0];
    option2.innerHTML = location["button text"][1];
    option3.innerText = location["button text"][2];
    option4.innerText = location["button text"][3];
    option1.onclick = location["button functions"][0];
    option2.onclick = location["button functions"][1];
    option3.onclick = location["button functions"][2];
    option4.onclick = location["button functions"][3];
    textBox.innerHTML = location.text;
    if (location === 0) { 
    textBox.innerHTML += villageTalk[expectations];
    }
}
function goTown() { 
    update(locations[0]);
    textBox.innerHTML += villageTalk[expectations].text;
    option3.style.display = "none";
    if (expectations === 3) { 
        option3.style.display = "inline";
    }
    option4.style.display = "none";
    monsterStats.style.display = "none";

}
function goStore() { 
    update(locations[1]);
    option2.innerText = `Buy Weapon (${(currentWeaponIndex + 1) * 30} Gold)`
    option3.style.display = "inline";
    if (currentWeaponIndex === weapons.length - 1) { 
        option2.innerText = `Sell Weapon (+15 gold)`;
    }
}

function goCave() { 
    update(locations[2]);
    if (expectations >= 2) { 
        option3.style.display = "inline";
    }
    option4.style.display = "inline";
}

//Store functions
function buyHealth() { 
    if (gold >= 10) { 
        gold -= 10;
        playerGold.innerText = gold;
        health += 10;
        playerHealth.innerText = health;
    }
    else { 
        textBox.innerText = "You need " + (10 - gold) + " more gold.";
    } 
}
function buyWeapon() { 
    //update the gold cost of a weapon based on currentWeaponIndex, and update the gold display on the button text
    let weaponCost = 30 * (currentWeaponIndex + 1);
    if (currentWeaponIndex < weapons.length - 1) { 
        if (gold >= (weaponCost)) {
            currentWeaponIndex++;
            gold -= (currentWeaponIndex * 30);
            playerGold.innerText = gold;
            inventory.push(weapons[currentWeaponIndex].name);
            textBox.innerText = "You bought a " + weapons[currentWeaponIndex].name + ".";
            textBox.innerText += " You now have " + inventory + ".";
            option2.innerText = `Buy Weapon (${(1+currentWeaponIndex) * 30} Gold)`;
        }
        else { 
            textBox.innerText = "You need " + (weaponCost - gold) + " more gold.";
        }
    }
    else { 
        option2.onclick = sellWeapon;
        option2.innerText = "Sell your weapon (+15 gold)";
        textBox.innerText = "You already have the most powerful weapon!";
    }
}
function sellWeapon() { 
    if (inventory.length > 1) { 
        let soldWeapon = inventory.shift();
        gold += 15;
        playerGold.innerText = gold; 
        textBox.innerText = "You sold your " + soldWeapon + ".";
        textBox.innerText = "You now have " + inventory + ".";
    }
    else { 
        textBox.innerText = "Don't sell your only weapon!";
    }
}
//Combat functions
function numberGenerator(min, max) { 
    let floatNumber = Math.random(); 

    let diff = max - min; 

    return Math.round(floatNumber * diff) + min;
}

function attack() { 
    hasDodge = true;
    let damageReduction = Math.floor(xp / 2);
    if (damageReduction >= monsters[fighting].level + monsters[fighting].power/2) {
        damageReduction = monsters[fighting].level;
    }
    health -= Math.floor((monsters[fighting].level + (monsters[fighting].power/2)) - (damageReduction));
    playerHealth.innerText = health;
    if (!isCriticalHit) { 
        if (health <= 0) {
            monsterStats.style.display = "none";
            lose();
        }
        else if (Math.random() < .1) { 
            miss();
        }
        else { 
            monsterHP -= Math.floor((weapons[currentWeaponIndex].power + (xp / 2))/2) ;
            monsterHealth.innerText = monsterHP;
            textBox.innerText = "Your attack struck your opponent!"
            if (monsterHP <= 0) { 
                gold += Math.floor(monsters[fighting].level * 6);
                playerGold.innerText = gold;
                xp += Math.floor(monsters[fighting].level * numberGenerator(0.3, 0.6))
                playerXP.innerText = xp;
                monsterStats.style.display = "none";
                if (fighting === 3) {
                    winGame();
                }
                else { 
                    winFight();
                } 
            } 
        }
    }
    else if (isCriticalHit || Math.random() < 0.05) {
        
        isCriticalHit = false;
        health -= Math.floor((monsters[fighting].level + (monsters[fighting].power/2)) - (damageReduction));
        playerHealth.innerText = health;

        if (health <= 0) {
            monsterStats.style.display = "none";
            lose();
        }
        else if (Math.random() < .1) { 
            miss();
        }
        else { 
            monsterHP -= Math.floor((weapons[currentWeaponIndex].power + (xp / 2)));
            monsterHealth.innerText = monsterHP;
            textBox.innerText = "You landed a hit on a vital spot!"
            if (monsterHP <= 0) { 
                gold += Math.floor(monsters[fighting].level * 6);
                playerGold.innerText = gold;
                xp += Math.floor(monsters[fighting].level * numberGenerator(0.3, 0.6));
                playerXP.innerText = xp;
                monsterStats.style.display = "none";
                if (fighting === 3) { 
                    winGame();
                }
                else { 
                    winFight();
                }
            } 
        }
    }
}

function miss() { 
    textBox.innerText = "Your attack missed your target by a hair!";
}

function dodge() { 
    //chance to dodge an attack and supercharge a critical hit that deals 2x damage on next attack, and it fails if casted twice in a row
    if (Math.random() < .7 && hasDodge) { 
        textBox.innerText = "You dodged the monster's attack.";
        isCriticalHit = true;
        hasDodge = false;
    }
    else { 
        textBox.innerText = "The monster's attack struck you anyways.";
        health -= monsters[fighting].level;
        playerHealth.innerText = health;
        if (health <= 0) {
            monsterStats.style.display = "none";
            lose();
        }
    }
}
function fightGoblin() { 
    fighting = 0;
    monsterHP = monsters[fighting].health; //back
    monsterHealth.innerText = monsters[fighting].health; //front
    monsterName.innerText = monsters[fighting].name; //front
    monsterStats.style.display = "inline";
    option3.style.display = "inline";
    option4.style.display = "none";
    update(locations[3]);
    textBox.innerText += " A small green creature with a spiked bat walks towards you."
}
function fightOrc() { 
    fighting = 1; 
    monsterHP = monsters[fighting].health; //back
    monsterHealth.innerText = monsters[fighting].health; //front
    monsterName.innerText = monsters[fighting].name; //front
    monsterStats.style.display = "inline";
    option3.style.display = "inline";
    option4.style.display = "none";
    update(locations[3]);
    textBox.innerText += " A muscled creature wielding a thick club swings his club at the air in your direction ferociously."
}
function fightGargoyle() { 
    fighting = 2; 
    monsterHP = monsters[fighting].health; //back
    monsterHealth.innerText = monsters[fighting].health; //front
    monsterName.innerText = monsters[fighting].name; //front
    monsterStats.style.display = "inline";
    option4.style.display = "none";
    update(locations[3]);
    textBox.innerText += " A stone statue comes to life in front of you and roars an unearthly cry of battle.";
}
function fightDragon() { 
    fighting = 3; 
    monsterHP = monsters[fighting].health; //back
    monsterHealth.innerText = monsters[fighting].health; //front
    monsterName.innerText = monsters[fighting].name; //front
    monsterStats.style.display = "inline";
    option4.style.display = "none";
    option3.style.display = "none";
    update(locations[3]);
    textBox.innerText += " You immediately recognize this boss monster as the one that has destroyed many of the villages. You cannot run away."
}
function winFight() { 
    monsterStats.style.display = "none";
    if (fighting === 3) { 
        winGame();
    }
    else if (fighting >= expectations) { 
        expectations = fighting + 1;
    }
    update(locations[4]);
}
function lose() { 
    option3.style.display = "inline";
    update(locations[5]);
}
function winGame() { 
    option3.style.display = "inline";
    update(locations[6]);
}
function replay() { 
    
    health = 100;
    playerHealth.innerText = health;
    xp = 0;
    playerXP.innerText = xp
    gold = 40; 
    playerGold.innerText = gold;
    currentWeaponIndex = 0;
    expectations = 0;
    inventory = ["stick"];
    update(locations[0]);
    textBox.innerHTML += villageTalk[expectations].text;
}
function easterEgg() { 
    update(locations[7]);
}
function pick(num) { 
    let array = []
    for (let i = 0; i < 10; i++) { 
        array += Math.floor(Math.random() * 11); 
        array += "\n";
    }
    if (array.includes(num)) { 
        textBox.innerText = " You gained 20 gold because you guessed correctly.\n";
        gold += 20;
        playerGold.innerText = gold;
    }
    else { 
        textBox.innerText = " You lose 10 health because you guessed incorrectly.\n";
        health -= 10;
        playerHealth.innerText = health;
        if (health <= 0) { 
            lose();
        }
    }
    if (health > 0) { 
        textBox.innerText += "The results are: \n";
        textBox.innerText += array;
    }
}
function pick2() { 
    pick(2);
    console.log("I picked 2");
}
function pick8() { 
    pick(8);
    console.log("I picked 4");

}
