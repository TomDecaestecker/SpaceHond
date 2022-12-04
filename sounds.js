
export class CollisionSound {
    static play() {
        this.sound = document.getElementById('collisionsound');
        if (this.sound.paused) {
            this.sound.play();
        } else {
            this.sound.currentTime = 0;
        }
    }
}

export class RollerSound {
    static play() {
        this.sound = document.getElementById('rollersound');
        if (this.sound.paused) {
            this.sound.play();
        } else {
            //this.sound.currentTime = 0;
        }
    }
}

export class DizzySound {
    static play() {
        this.sound = document.getElementById('dizzysound');
        if (this.sound.paused) {
            this.sound.volume = 0.2;
            this.sound.play();
        } else {
            //this.sound.currentTime = 0;
        }
    }
}