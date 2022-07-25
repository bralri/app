class BubbleClass {
    constructor(_x, _y, _r, _img) {
      this.x = _x;
      this.y = _y;
      this.r = _r*2;
      this.img = _img;
    }

    move() {
      this.x = this.x + random(-5, 5);
      this.y = this.y + random(-5, 5);
    }
  
    display() {
        image(this.img, this.x, this.y, this.r, this.r);
    }

    contains(mX, mY) {
        // let d = dist(mX, mY, this.x, this.y); //for circles
        // if (d < this.r) {
        
        if (mX > this.x && mX < this.x + this.r && mY > this.y && mY < this.y + this.r) { // for rect/sqr
            this.img = random(metaArray);
        }
    }
  }