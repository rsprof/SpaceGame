class Enemy  {
    constructor(game, x)   {
        this.game = game;
        this.spriteWidth = 192;
        this.spriteHeight = 192;
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.x = x;
        this.y = Math.random() * (this.game.height - this.scaledHeight);
        this.speedY = Math.random() < 0.5 ? -1 * this.game.ratio : 1 * this.game.ratio;
        this.markedForDeletion = false;
        this.collisionX;
        this.collisionY;
        this.collisionRadius = this.scaledWidth * 0.2;
        this.image = document.getElementById('enemy-idle');
        this.frameX = 0;
        this.numberFrames = 6;
    }

    update()    { 
        this.frameX = this.frameX % this.numberFrames;

        this.x -= this.game.speed;
        this.y += this.speedY;

        if(!this.game.gameOver)  {
            if(this.y <= 0 || this.y >= this.game.height - this.scaledHeight)   {
                this.speedY *= -1;
            }
        } else  {
            this.speedY += 0.1;
        }

        if(this.isOffScreen())  {
            this.markedForDeletion = true;
            this.game.enemys = this.game.enemys.filter(enemy => !enemy.markedForDeletion);
            this.game.score++;
            if(this.game.enemys.length <= 0) this.game.gameOver = true;
        }

        this.collisionX = this.x + this.scaledWidth * 0.5;
        this.collisionY= this.y + this.scaledHeight * 0.5;

        if(this.game.checkCollision(this, this.game.player))    {
            this.game.gameOver = true;
            this.game.player.collided = true;
            this.game.player.stopCharge();
        }
    }

    draw()  {
        this.game.ctx.save();
        this.game.ctx.scale(-1, 1);
        this.game.ctx.drawImage(this.image, this.frameX * this.spriteHeight, 0, this.spriteWidth, this.spriteHeight, -this.x - this.scaledWidth, this.y, this.scaledWidth, this.scaledHeight);
        this.game.ctx.restore();

        ++this.frameX;
        
        if(this.game.debug) {
            this.game.ctx.beginPath();
            this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            this.game.ctx.stroke();
        }
    }

    resize()    {
        this.scaledWidth = (this.spriteWidth * this.game.ratio) * 0.7;
        this.scaledHeight =(this.spriteHeight * this.game.ratio) * 0.9;
    }

    isOffScreen()   {
        return this.x < -this.scaledWidth || this.y > this.game.height;
    }
}