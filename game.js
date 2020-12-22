/** Start */
const start = document.querySelector('.start')

/* Game */
function thread(){
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    /** Options */
    const FPS = 10;
    let win = false;

    /** Figures */
    const ball = {
        x : canvas.width/2 + 20,
        y : canvas.height-30,
        r : 13,
        dx : 3,
        dy : 3,
        dirX:0,
        dirY:0,
    }

    const square = {
        x : canvas.width/2 -50,
        y : 470,
        width : 100,
        height : 20,
        dx : 2,
        dy : -2,
        buttons: {
            rightPressed : false,
            leftPressed : false,
        }
    }

    function Brick (o, x, y) {
        this.order = o
        this.x = x 
        this.y = y 
        this.width = (canvas.width/5) - 20 
        this.height = 20
    }


    /** Draw Figures */
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();
    }

    function drawSquare() {
        ctx.beginPath();
        ctx.rect(square.x, square.y, square.width, square.height);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.closePath();
    }

    const bricks = []
    const bricksRemoved = []
    const brickOrigin = new Brick(0, 10, 10)
    function drawBrick() {
        let n = 0
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < parseInt(canvas.width/brickOrigin.width); j++){
                n++
                if(!bricksRemoved.includes(n)){
                    x = 30+(10+brickOrigin.width)*(j)
                    y = (10+brickOrigin.height)*(i+1)
                    const brick = new Brick(n, x, y)
                    ctx.beginPath();
                    ctx.rect(brick.x, brick.y, brick.width, brick.height);
                    ctx.fillStyle = "#135622";
                    ctx.fill();
                    ctx.closePath();
                    bricks.push({
                        order:n,
                        x:x,
                        y:y
                    })
                }
                
            }
        }
        if(bricksRemoved.length === n){
            win = true
            gameOver()
        }
    }

    function logicBall () {
        if(ball.x >= canvas.width){
            ball.dirX = -1
        }else if(ball.x <= 0){
            ball.dirX = 1
        }

        if(ball.y >= canvas.height){
            gameOver()
        }else if(ball.y >= canvas.height-(square.height+10)){
            if(ball.x >= square.x && ball.x <= square.x+square.width){
                ball.dirY = 1
            }
        }else if(ball.y <= 0){
            ball.dirY = -1
        }

        if(ball.dirX > 0){
            ball.x += ball.dx;
        }else{
            ball.x -= ball.dx;
        }

        if(ball.dirY < 0){
            ball.y += ball.dy;
        }else{
            ball.y -= ball.dy;
        }
    }

    function logicSquare(){
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

        function keyDownHandler(e) {
            if(e.keyCode == 39) {
                square.buttons.rightPressed = true;
            }
            else if(e.keyCode == 37) {
                square.buttons.leftPressed = true;
            }
        }
        function keyUpHandler(e) {
            if(e.keyCode == 39) {
                square.buttons.rightPressed = false;
            }
            else if(e.keyCode == 37) {
                square.buttons.leftPressed = false;
            }
        }
        
        if(square.buttons.rightPressed && square.x < canvas.width-square.width) {
            square.x += 7;
        }
        else if(square.buttons.leftPressed && square.x > 0) {
            square.x -= 7;
        }
    }

    function logicBrick(){
        bricks.forEach( brick => {
            let check = false
            if(ball.x >= brick.x  && ball.x <= brick.x + brickOrigin.width){
                if(ball.y <= brick.y + brickOrigin.height){
                    //Collision Bricks
                    ball.dirY = -1
                    check = true
                }
            }
            if((ball.x >= brick.x && ball.x <= brick.x+10)  || (ball.x >= brick.x + brickOrigin.width-5 && ball.x <= brick.x + brickOrigin.width) ){
                if(ball.y <= brick.y + brickOrigin.height && ball.y >= brick.y){
                    ball.dirX = 1
                    check = true
                }
            }
            if(check){
                bricksRemoved.push(brick.order)
            }
        })
    }

    function gameOver(){
        start.style.visibility = 'visible'
        start.style.transform = 'scale(1)'
        if(win){
            start.innerHTML = `
                <p>Congratulations!!</p>
                <p>Puntuacion: ${bricksRemoved.length * 10}</p>
                <p class="button">Start</p>
            `
        }else{
            start.innerHTML = `
                <p>Game Over</p>
                <p>Puntuacion: ${bricksRemoved.length * 10}</p>
                <p class="button">Start</p>
            `
        }
        clearInterval(game)
    }

    function logic(){
        logicBall()
        logicSquare()
        logicBrick()
    }

    function draw(){
        drawSquare()
        drawBall()
        drawBrick()
    }

    function principal() {
        bricks.splice(0, bricks.length)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw()
        logic()
    }
    const game = setInterval(principal, FPS);
}

start.addEventListener('click', e => {
    if(e.target.classList.contains('button')){
        start.style.visibility = 'hidden'
        start.style.transform = 'scale(0)'
        thread()
    }
})

