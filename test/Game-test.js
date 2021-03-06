const { assert } = require('chai');
const Game = require('../lib/Game.js');

describe ('Game', function () {

  it('should have properties', function() {
    const game = new Game();

    assert.deepEqual(game, {
      isGameOver: false,
      paused: false,
      player1: {
        x: 30, 
        y: 50, 
        height: 1, 
        width: 1, 
        color: 'rgb(92,247,249)', 
        dx: 1, 
        dy: 0, 
        dxv: 1, 
        direction: 'right'
      },
      player2: {
        x: 270, 
        y: 50, 
        height: 1, 
        width: 1, 
        color: 'rgb(255,33,49)', 
        dx: -1, 
        dy: 0, 
        dxv: 1, 
        direction: 'left'
      },
      player1Score: 0,
      player2Score: 0, 
      bikes: [{
        x: 30, 
        y: 50, 
        height: 1, 
        width: 1, 
        color: 'rgb(92,247,249)', 
        dx: 1,
        dy: 0, 
        dxv: 1, 
        direction: 'right'
      }, {
        x: 270, 
        y: 50, 
        height: 1, 
        width: 1, 
        color: 'rgb(255,33,49)', 
        dx: -1, 
        dy: 0, 
        dxv: 1, 
        direction: 'left'
      }],
      keyPressed: false,
      trail1: [],
      trail2: []
    });
  });

  it('should be able to draw two players and move', function() {
    const gameA = new Game();   
    
    assert.deepEqual(gameA.player1.height, 1);  
    assert.deepEqual(gameA.player2.width, 1);

    gameA.player1.move();
    gameA.player2.move();

    assert.equal(gameA.player1.x, 31);
    assert.equal(gameA.player2.x, 269);
  });

  it('each player should have a trail', function() {
    const gameB = new Game();  
      
    gameB.player1.move();
    gameB.player2.move();
    gameB.createTrail();

    assert.deepEqual(gameB.trail1[0], { x: 31, y: 50, height: 1, width: 1 });
    assert.deepEqual(gameB.trail2[0], { x: 269, y: 50, height: 1, width: 1 });
  
    gameB.player1.move();
    gameB.player2.move();
    gameB.createTrail();

    assert.deepEqual(gameB.trail1[0], { x: 32, y: 50, height: 1, width: 1 });
    assert.deepEqual(gameB.trail2[0], { x: 268, y: 50, height: 1, width: 1 });

    gameB.player1.move();
    gameB.player2.move();
    gameB.createTrail();

    assert.deepEqual(gameB.trail1[1], { x: 32, y: 50, height: 1, width: 1 });
    assert.deepEqual(gameB.trail2[1], { x: 268, y: 50, height: 1, width: 1 });
  });

  it('should stop game when player1 collides player2 trail', function() {
    const game = new Game();
    
    game.player1.x = 68;
    game.player1.y = 50;
    game.player2.x = 70;
    game.player2.y = 50;
    
    assert.equal(game.paused, false);
    
    game.player2.move();
    game.createTrail();

    assert.equal(game.paused, false);

    game.player2.move();
    game.createTrail();
    game.detectTrailCollision();

    assert.equal(game.paused, true);

  });

  it('should increment score of player1 when player2 collides', function() {
    const game = new Game();
    
    game.player1.x = 68;
    game.player1.y = 50;
    game.player2.x = 71;
    game.player2.y = 50;
    
    assert.equal(game.player1Score, 0);
    
    game.player2.move();
    game.createTrail();

    assert.equal(game.player1Score, 0);

    game.player2.move();
    game.createTrail();
    game.detectTrailCollision();

    assert.equal(game.player1Score, 1);

  });

  it('should increment score of player2 when player1 collides', function() {
    const game = new Game();
    
    game.player1.x = 68;
    game.player1.y = 50;
    game.player2.x = 71;
    game.player2.y = 50;
    
    assert.equal(game.player2Score, 0);
    
    game.player1.move();
    game.createTrail();

    assert.equal(game.player1Score, 0);

    game.player1.move();
    game.createTrail();
    game.detectTrailCollision();

    assert.equal(game.player2Score, 1);
    
  });

   
  it('should stop game when player1 collides with own trail', function() {
    const game = new Game();
    
    game.player1.x = 50;
    game.player1.y = 50;
    game.player1.dx = 1;
    
    game.player1.move();
    game.createTrail();
    game.detectTrailCollision();

    assert.equal(game.paused, false);

    game.player1.dy = -1;
    game.player1.move();
    game.createTrail();

    game.player1.dx = -1;
    game.player1.move();
    game.createTrail();

    game.player1.dy = 5;
    game.player1.move();
    game.createTrail();

    game.player1.move();
    game.createTrail();
    game.detectTrailCollision();

    assert.equal(game.paused, true);
  });
   
  it('should stop game when player2 collides with own trail', function() {
    const game = new Game();
    
    game.player2.x = 50;
    game.player2.y = 50;
    game.player2.dx = -1;
    
    game.player1.move();
    game.createTrail();
    
    game.player1.dy = -1;
    game.player1.move();
    game.createTrail();

    game.player1.dx = 1;
    game.player1.move();
    game.createTrail();

    game.player1.dy = 5;
    game.player1.move();
    game.createTrail();

    game.player1.move();
    game.createTrail();
    game.detectTrailCollision();

    assert.equal(game.paused, true);

  });
  
  it('should be gameover when player score equals 3', function() {
    const game = new Game();
    
    game.player1.x = 68;
    game.player1.y = 50;
    game.player2.x = 70;
    game.player2.y = 50;
    
    assert.equal(game.player2Score, 0);
    
    game.player1.move();
    game.createTrail();

    game.player1.move();
    game.createTrail();

    game.player1.move();
    game.createTrail();
    game.detectTrailCollision();

    assert.equal(game.player2Score, 3);
    assert.equal(game.isGameOver, true);
  });
});