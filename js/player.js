class Player {
    constructor(game) {
        this.game = game;
        this.x = 20;
        this.y = 0;
        this.spriteWidth = 192;
        this.spriteHeight = 192;    
        this.width;
        this.height;    
        this.speedY;
        this.flapSpeed;
        this.collisionX;
        this.collisionY;
        this.collisionRadius;
        this.collided;
        this.energy = 30;
        this.maxEnergy = this.energy * 2;
        this.minEnergy = 15;
        this.charging;
        this.barSize;
        this.imageIdle = document.getElementById('player-idle');
        this.imageBoost = document.getElementById('player-boost');
        this.frameX;
        this.state;
    }

    draw() {
        if(this.state) {
            this.game.ctx.drawImage(this.imageBoost, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
        else {
            this.game.ctx.drawImage(this.imageIdle, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }

        ++this.frameX;
        
        if(this.game.debug) {
            this.game.ctx.beginPath();
            this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            this.game.ctx.stroke();       
        }
    }

    update() {
        if(this.state) {
            this.frameX = this.frameX % 5;
        }
        else {
            this.frameX = this.frameX % 6;
        }

        this.handleEnergy();
   
        if(this.speedY >= 0)    {
            this.wingsUp();
        }
    
        this.y += this.speedY;

        if(!this.isTouchingBottom() && !this.charging)    {
            this.speedY += this.game.gravity; 
        }
        else    {
            this.speedY = 0;
        }

        if(this.isTouchingBottom())    {
            this.y = this.game.height - this.height;
            this.wingsIdle();
        }

        this.collisionY = this.y + this.height * 0.5;
    }

    resize() {
        this.width = (this.spriteWidth * this.game.ratio) * 0.4;
        this.height = (this.spriteHeight * this.game.ratio) * 0.6;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.speedY = -8 * this.game.ratio;
        this.flapSpeed = 5  * this.game.ratio;
        this.collisionX = this.x + this.width * 0.5;
        this.collisionRadius = 30 * this.game.ratio;
        this.collided = false;
        this.barSize = Math.floor(5 * this.game.ratio);
        this.frameX = 0;
        this.state = 0;
        this.charging = false;
        this.energy = 30;
    }

    isTouchingBottom()  {
        return this.y >= this.game.height - this.height;
    }

    isTouchingTop() {
        return this.y <= 0;
    }

    flap()  {
        this.stopCharge();

        if(!this.isTouchingTop())    {
            this.speedY = -this.flapSpeed;
            this.wingsDown();
        }
    }

    handleEnergy()  {
        if(this.game.eventUpdate)   {
            if(this.energy < this.maxEnergy)    {
                this.energy += 1;
            }

            if(this.charging)    {
                this.energy -= 6;

                if(this.energy <= 0)    {
                    this.energy = 0;
                    this.stopCharge();
                }
            }
        }
    }

    startCharge()   {
        this.game.sound.play(this.game.sound.charge);
        this.charging = true;
        this.game.speed = this.game.maxSpeed;
        this.wingsCharge();
    }

    stopCharge()    {
        this.charging = false;
        this.game.speed = this.game.minSpeed;
        this.wingsIdle();
    }

    wingsIdle() {
        this.state = 0;
    }

    wingsDown() { //Player Spritesheet
        if(!this.charging)    {
           //this.frameX = 1; //Player Spritesheet
        }
    } //Player Spritesheet

    wingsUp() { //Player Spritesheet
        if(!this.charging)    {
            //this.frameX = 2; //Player Spritesheet
         }
    } //Player Spritesheet

    wingsCharge() {
        this.state = 1;
    }
}