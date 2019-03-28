
const DIRECTION = {
    UP: 1,
    DOWN: 2,
    RIGHT: 3,
    LEFT: 4,
    IDLE: 0
}


// lydefekter
const Sounds = {
    bounce: new Audio('tennisserve.wav '),
    start: new Audio('Trumpet-intro.mp3'),
    kamplyd: new Audio('Audience_Applause-Matthiew11-1206899159.wav'),
    endRound: new Audio('Cheering 3-soundBible.com-1680253418.wav')
}

// Ball, øker hastigheten
let Ball = {
    new: function (økFart) {
        return {
            size: 10,
            x: (this.canvas.width / 2 - 5),
            y: (this.canvas.height / 2 - 5),
            xMove: DIRECTION.IDLE,
            yMove: DIRECTION.IDLE,
            speed: økFart || 4
        }
    }
};


//Spiller funksjon
let Paddle = {
    new: function (side) {
        return {
            height: 100,
            width: 20,
            x: side === 'left' ? 70 : 910,
            y: 200,
            score: 0,
            move: 0,
            speed: 10
        }
    }
}


//Hoved variabler

let Main = {
    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 1000;
        this.canvas.height = 500;

        this.canvas.style.width = 150 + 'vh';
        this.canvas.style.height = 75 + 'vh';

        this.Spiller = Paddle.new.call(this, 'left');
        this.Data = Paddle.new.call(this, 'right');
        this.ball = Ball.new.call(this);

        this.running = this.over = false;
        this.round = 0;

        PongGame.lobby();
        PongGame.listeners();
    },

    //Samling av funksjonene
    lobby: function () {
        //Tegner spillet
        PongGame.draw();

        //TEXT FUNKSJONER
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this.ctx.font = '30px solid sanserif';


        //Bakgrunn for velkommen-tekst
        this.ctx.fillStyle = "White";
        this.ctx.fillRect(
            this.canvas.width / 480,
            this.canvas.height - this.canvas.height,
            2000,
            2000
        );

        //Velkommen-tekst
        this.ctx.fillStyle = "Black";
        this.ctx.fillText('TRYKK PÅ SPACEBAR FOR Å STARTE',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );
    },

    //MAIN METHOD - UPDATE VARIABLES AND GIVE IT TO LOOP METHOD.
    update: function () {
        if (!this.over) {
            if(this.ball.yMove === DIRECTION.IDLE) {
                PongGame._newRound.call(this, this.Spiller);
            }

            //
            if (this.ball.x - this.ball.size <= 0) PongGame._newRound.call(this, this.Data, this.Spiller);

            //Spiller beveger seg opp/ned, dette gjøres utifra hvilken retning du ønsker
            if (this.Spiller.move === DIRECTION.UP) this.Spiller.y -= this.Spiller.speed;
            else if (this.Spiller.move === DIRECTION.DOWN) this.Spiller.y += this.Spiller.speed;

            //Spiller og data kontakt med veggene
            if (this.Spiller.y <= 0) this.Spiller.y = 0;
            else if (this.Spiller.y >= (this.canvas.height - this.Spiller.height)) this.Spiller.y = (this.canvas.height - this.Spiller.height);
            if (this.Data.y >= this.canvas.height - this.Data.height) this.Data.y = this.canvas.height - this.Data.height;
            else if (this.Data.y <= 0) this.Data.y = 0;

            //Bevegelse i Y - BALL
            if(this.ball.y <= 0) {this.ball.yMove = DIRECTION.DOWN; Sounds.kamplyd.play();} //Lydefekt spilles av når ballen treffer veggene nede
            else if (this.ball.y >= this.canvas.height - this.ball.size) { this.ball.yMove = DIRECTION.UP; Sounds.kamplyd.play();}//Lydefekt spilles av når ballen treffer veggene opp
            if(this.ball.yMove === DIRECTION.DOWN) this.ball.y += this.ball.speed/2;
            else if(this.ball.yMove === DIRECTION.UP) this.ball.y -= this.ball.speed/2;

                //Bevgelse i X - BALL
                if(this.ball.x <= 0) {
                    PongGame._newRound.call(this, this.Data);
                }
                else if (this.ball.x >= this.canvas.width + this.ball.size){
                    PongGame._newRound.call(this, this.Spiller);
                }
                if(this.ball.xMove === DIRECTION.RIGHT) this.ball.x += this.ball.speed;
                else if(this.ball.xMove === DIRECTION.LEFT) this.ball.x -= this.ball.speed;


            //Møte med ball og spiller
            //1. sjekker ball x posisjon med spiller x posisjon med ball y posisjon med spiller y posisjon
            if (this.ball.x <= this.Spiller.x + this.Spiller.width && this.Spiller.y <= this.ball.y + this.ball.size) {

                //2. om sant sjekk om ball ikke har  x mindre posisjon enn spiller.
                if (this.ball.x - this.ball.size >= this.Spiller.x) {

                    //3. om sant sjekk om ball er i spillers paddel område.
                    if(this.Spiller.y + this.Spiller.height >= this.ball.y - this.ball.size){

                        //4. Om sant, sjekk om det er øvre del av peddelen.
                        if(this.ball.y <= this.Spiller.y + this.Spiller.height / 2){
                            this.ball.xMove = DIRECTION.RIGHT;
                            this.ball.yMove = DIRECTION.UP;
                            this.ball.speed += Math.random() * (1 - 0.2) + 0.2;
                            Sounds.bounce.play();//lyd spilles av

                            //5. om feil, sjekk om den traff nedre del av peddelen.
                        }else if(this.ball.y >= this.Spiller.y + this.Spiller.height / 2){
                            this.ball.xMove = DIRECTION.RIGHT;
                            this.ball.yMove = DIRECTION.DOWN;
                            this.ball.speed += Math.random() * (1 - 0.2) + 0.2;
                            Sounds.bounce.play();// lyd spilles av
                        }
                    }
                }
            }

            //Møte med ball og data
            //1. Sjekker ball x posisjon med spiller x posisjon til ball y posisjon med spiller y posisjon
            if (this.ball.x >= this.Data.x - this.Data.width && this.Data.y <= this.ball.y + this.ball.size) {

                //2. om sant sjekk om ball ikke har x mindre posisjon enn data.
                if (this.ball.x + this.ball.size <= this.Data.x) {

                    //3. om sant sjekk om ball er i data paddel område.
                    if(this.Data.y + this.Data.height >= this.ball.y - this.ball.size){

                        //4. Om sant, sjekk om det er øvre del av peddelen.
                        if(this.ball.y <= this.Data.y + this.Data.height / 2){
                            this.ball.xMove = DIRECTION.LEFT;
                            this.ball.yMove = DIRECTION.UP;
                            this.ball.speed += .2;
                            Sounds.bounce.play();// lyd spilles av

                            //5. om feil, sjekk om den traff nedre del av peddelen.
                        }else if(this.ball.y >= this.Data.y + this.Data.height / 2){
                            this.ball.xMove = DIRECTION.LEFT;
                            this.ball.yMove = DIRECTION.DOWN;
                            this.ball.speed += .2;
                            Sounds.bounce.play();// lyd spilles av
                        }
                    }
                }
            }

            //Data
            if (this.Data.y > this.ball.y - (this.Data.height / 2)) {
                if (this.ball.x > this.canvas.width /2) this.Data.y -= 5
                else this.Data.y -= 3;
            }
            if (this.Data.y < this.ball.y - (this.Data.height / 2)) {
                if (this.ball.x > this.canvas.width /2) this.Data.y += 5
                else this.Data.y += 3;
            }

            //Vinner
            if(this.Data.score === 5 || this.Spiller.score === 5) {
                if(this.Data.score === 5) { //Om data får 5 poeng først vinner den
                    this.over = true
                    setTimeout(function () { PongGame._endGame('DATA'); }, 1000);
                }
                else if(this.Spiller.score === 5) { //om spiller får 5 poeng først vinner spiller
                    this.over = true
                    setTimeout(function () { PongGame._endGame('SPILLER'); }, 1000);
                }
            }

        }
    },

    // Tegning
    draw: function () {

        // Canvas.
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


        //Tegn venstre spiller
        this.ctx.fillStyle = "White";
        this.ctx.fillRect(
            this.Spiller.x,
            this.Spiller.y,
            this.Spiller.width,
            this.Spiller.height
        );

        //Tegn høyre spiller (data)
        this.ctx.fillStyle = "Withe";
        this.ctx.fillRect(
            this.Data.x,
            this.Data.y,
            this.Data.width,
            this.Data.height
        );


        // tegn spiller score (venstre)
        this.ctx.fillText(
            this.Spiller.score.toString(),
            (this.canvas.width / 2) - 100,
            50
        );

        // Tegn data score (høyre)
        this.ctx.fillText(
            this.Data.score.toString(),
            (this.canvas.width / 2) + 100,
            50
        );

        //Tegn ball
        this.ctx.fillStyle = "Yellow";
        this.ctx.fillRect(
            this.ball.x,
            this.ball.y,
            this.ball.size,
            this.ball.size
        );
    },

    loop: function () {
        //Loop function, oppdaterer alle elementer, og tegner dem igjen.
        PongGame.update();
        PongGame.draw();

        if (!PongGame.over) requestAnimationFrame(PongGame.loop);
    },

    listeners: function () {
        //Bruk av spacebar starter spiller ( tastatur koden 32 === spacebar) dette fornyes etter et game gjennom requestAnimationFrame og PongGame.loop
        document.addEventListener('keydown', function (key) {
            if (PongGame.running === false && key.keyCode === 32) {
                PongGame.running = true;
                window.requestAnimationFrame(PongGame.loop);
                Sounds.start.play();//start musikk
            }

            // Bruk av piltast opp eller w key
            if (key.keyCode === 38 || key.keyCode === 87) PongGame.Spiller.move = DIRECTION.UP;

            // Bruk av piltast ned eller s key
            if (key.keyCode === 40 || key.keyCode === 83) PongGame.Spiller.move = DIRECTION.DOWN;
        });

        // Gjør at ikke spilleren rører på seg hvis ikke noen av tastene er trykket inn
        document.addEventListener('keyup', function (key) { PongGame.Spiller.move = DIRECTION.IDLE; });
    },

    // Ny runde
    _newRound: function (winner) {
        this.ball = Ball.new.call(this);
        this.ball.xMove = DIRECTION.RIGHT;
        this.ball.yMove = DIRECTION.UP;

        //Ny runde - nye poeng.
        if(this.round === 0) {
            winner.score = 0;
            this.round += 1;
        }
        else {
            //den som scorer får poeng
            winner.score += 1;
            this.round += 1;
            Sounds.endRound.play();//lyd spilles av
        }
    },

    _endGame: function (text) {
        //Grønn bakgrunn for slutt-text
        this.ctx.fillStyle = "White";
        this.ctx.fillRect(
            this.canvas.width / 480,
            this.canvas.height - this.canvas.height,
            2000,
            2000
        );

        //Vis slutt-tekst
        this.ctx.fillStyle = "Black";
        this.ctx.fillText(text + " VANT!",
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );

        setTimeout(function () {
            PongGame = Object.assign({}, Main);
            PongGame.initialize();
        }, 3000);
    },
}

let PongGame = Object.assign({}, Main);
PongGame.initialize();