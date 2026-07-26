export class Claim {

    #ttl;
    #name;
    #token;

    constructor(name, ttl = 30) {
        this.#ttl = ttl;
        this.#name = name;
    }

    static acquire(name, opts = { ttl: 30 }) {
        return new Claim(name, opts);
    }

    extend() {
        console.log("heartbeat extend:" + this.name)
        return true;
    }

    release() {
        console.log("release claim:" + this.name)
        return true;
    }

    using(callback) {

        try {
            callback(this);
        } catch (error) {
            // 捕获异常处理
        } finally {
            this.release();
        }
        
        return this;
    }


    get name() {
        return this.#name;
    }
}