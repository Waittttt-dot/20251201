let stopSprite;
let walkSprite;
let jumpSprite;
let pushSprite;
let toolSprite;
let spriteSheet;
let totalFrames = 8;
let currentFrame = 0;
let frameWidth;
let frameHeight;
let playerX;
let playerY;
let isFlipped = false;
let isJumping = false;
let jumpStartY;
let isPushing = false;
let projectiles = [];

function preload() {
  spriteSheet = loadImage('1/stop/stop_1.png');
  stopSprite = loadImage('1/stop/stop_1.png');
  walkSprite = loadImage('1/walk/walk_1.png');
  jumpSprite = loadImage('1/jump/jump_1.png');
  pushSprite = loadImage('1/push/push_1.png');
  toolSprite = loadImage('1/tool/tool_1.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 根據說明，檔案寬高為 699*190，內有 8 張圖片
  // 計算單張圖片的寬度
  frameWidth = 699 / totalFrames;
  frameHeight = 190;
  playerX = width / 2;
  playerY = height / 2;
}

function draw() {
  background('#eef4ed');

  // 處理投射物 (新的角色)
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let p = projectiles[i];
    p.x += p.speed * p.dir;

    // 投射物動畫
    if (frameCount % 5 === 0) {
      p.frame = (p.frame + 1) % 4;
    }

    let toolW = 331 / 4;
    let toolH = 75;
    let sx = p.frame * toolW;

    push();
    translate(p.x, p.y);
    if (p.dir === -1) {
      scale(-1, 1);
    }
    image(toolSprite, -toolW / 2, -toolH / 2, toolW, toolH, sx, 0, toolW, toolH);
    pop();

    // 移除超出畫面的投射物
    if (p.x < -width || p.x > width * 2) {
      projectiles.splice(i, 1);
    }
  }

  // 處理移動與動作狀態
  if (isPushing) {
    spriteSheet = pushSprite;
    frameWidth = 5101 / 23; // 圖片精靈檔案，內有23張圖片，寬高為5101*191
    frameHeight = 191;
  } else if (isJumping) {
    // 跳躍狀態下鎖定圖片與寬高
    spriteSheet = jumpSprite;
    frameWidth = 3054 / 19; // 圖片精靈檔案，內有19張圖片，寬高為3054*214
    frameHeight = 214;
  } else if (keyIsDown(UP_ARROW)) {
    isJumping = true;
    jumpStartY = playerY;
    currentFrame = 0;
    spriteSheet = jumpSprite;
  } else if (keyIsDown(32)) { // 空白鍵
    isPushing = true;
    currentFrame = 0;
    spriteSheet = pushSprite;
    frameWidth = 5101 / 23;
    frameHeight = 191;
  } else if (keyIsDown(RIGHT_ARROW)) {
    playerX += 5;
    spriteSheet = walkSprite;
    frameWidth = 1019 / totalFrames;
    frameHeight = 195;
    isFlipped = false;
  } else if (keyIsDown(LEFT_ARROW)) {
    playerX -= 5;
    spriteSheet = walkSprite;
    frameWidth = 1019 / totalFrames;
    frameHeight = 195;
    isFlipped = true;
  } else {
    spriteSheet = stopSprite;
    frameWidth = 699 / totalFrames;
    frameHeight = 190;
  }

  // 設定動畫速度 (每 5 個 frame 更新一次動作)
  if (frameCount % 5 === 0) {
    if (isPushing) {
      currentFrame++;
      // 當23圖片播放完畢後
      if (currentFrame >= 23) {
        isPushing = false;
        currentFrame = 0;
        // 產生一個新的角色 (投射物)
        projectiles.push({
          x: playerX,
          y: playerY,
          dir: isFlipped ? -1 : 1,
          speed: 10,
          frame: 0
        });
      }
    } else if (isJumping) {
      currentFrame++;
      // 跳躍位移邏輯：前 8 格往上，之後往下 (回到原點)
      if (currentFrame <= 8) {
        playerY -= 20;
      } else if (currentFrame <= 16) {
        playerY += 20;
      }

      // 動畫播放完畢 (19張)
      if (currentFrame >= 19) {
        isJumping = false;
        playerY = jumpStartY; // 強制回到地面
        currentFrame = 0;
      }
    } else {
      currentFrame = (currentFrame + 1) % totalFrames;
    }
  }

  // 計算精靈圖的來源 X 座標與畫布上的中心位置
  let sx = currentFrame * frameWidth;
  let x = (width - frameWidth) / 2;
  let y = (height - frameHeight) / 2;

  push();
  translate(playerX, playerY);
  if (isFlipped) {
    scale(-1, 1);
  }
  // 由於使用了 translate，這裡的座標設為圖片中心點的負偏移量
  image(spriteSheet, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight, sx, 0, frameWidth, frameHeight);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
