var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;
var spacebar;
var icons;
var walls;
var wasd;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'static/img/player.jpg');
    this.load.image('icon', 'path.png');
}

function create() {
    // Create the walls group
    walls = this.physics.add.staticGroup();
    
    // Define the maze structure as a 2D array
    var maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    // Draw the maze
    var tileSize = 40;
    for (var row = 0; row < maze.length; row++) {
        for (var col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                var wall = walls.create(col * tileSize, row * tileSize, null).setOrigin(0);
                wall.displayWidth = tileSize;
                wall.displayHeight = tileSize;
                wall.refreshBody();
            }
        }
    }

    var spawnX, spawnY;
    for (var row = 0; row < maze.length; row++) {
        for (var col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 0) {
                spawnX = col * tileSize + tileSize / 2;
                spawnY = row * tileSize + tileSize / 2;
                break;
            }
        }
        if (spawnX !== undefined && spawnY !== undefined) {
            break;
        }
    }

    // Create player
    player = this.physics.add.sprite(spawnX, spawnY, 'player');
    player.setScale(0.80);
    player.setCollideWorldBounds(true);
    player.body.setSize(tileSize / 2, tileSize / 2).setOffset(1, 1);

    // Add collision detection between player and walls
    this.physics.add.collider(player, walls);

    // Enable cursor keys, spacebar and wasd
    cursors = this.input.keyboard.createCursorKeys();
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // Create icons group
    icons = this.physics.add.staticGroup();

    // Define icon positions
    var iconPositions = [
        { x: 4, y: 1 },
        { x: 10, y: 10 },
        { x: 16, y: 7 }
    ];

    // Add icons to the maze
    iconPositions.forEach(function(pos) {
        var icon = icons.create(pos.x * tileSize + tileSize / 2, pos.y * tileSize + tileSize / 2, 'icon');
   });

   // Add collision detection between player and icons
   this.physics.add.overlap(player, icons, onPlayerOverlapIcon, null, this);
}



function onPlayerOverlapIcon(player, icon) {
    // Check if spacebar is pressed
    if (spacebar.isDown) {
        alert('ciao');
    }
}



function update() {
    // Movement logic for player
    player.setVelocity(0);

    // Handle cursor keys and WASD keys
    if (cursors.left.isDown || wasd.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown || wasd.right.isDown) {
        player.setVelocityX(160);
    }

    if (cursors.up.isDown || wasd.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown || wasd.down.isDown) {
        player.setVelocityY(160);
    }
}
