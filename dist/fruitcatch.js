var a = Object.defineProperty;
var h = (s, i, t) => i in s ? a(s, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[i] = t;
var e = (s, i, t) => h(s, typeof i != "symbol" ? i + "" : i, t);
class c {
  // 消滅する地面の高さ
  constructor(i) {
    e(this, "fruits", []);
    e(this, "spawnTimer", 0);
    e(this, "score", 0);
    // 設定値
    e(this, "SPAWN_INTERVAL", 1);
    // 1秒ごとに生成
    e(this, "GRAVITY", -2.5);
    // 落下速度
    e(this, "GROUND_Y", 0);
    this.objectManager = i, console.log("🍎 FruitCatch Game Initialized. Start catching fruits!");
  }
  /**
   * エンジンのメインループから毎フレーム呼ばれる
   * @param dt 前フレームからの経過時間 (秒)
   */
  update(i) {
    this.spawnTimer += i, this.spawnTimer >= this.SPAWN_INTERVAL && (this.spawnFruit(), this.spawnTimer = 0);
    for (let t = this.fruits.length - 1; t >= 0; t--) {
      const o = this.fruits[t], r = o.getComponent("Transform");
      r && (r.position.y += this.GRAVITY * i, r.position.y < this.GROUND_Y && this.removeFruit(o, t));
    }
  }
  spawnFruit() {
    const i = `fruit_${Date.now()}_${Math.floor(Math.random() * 1e3)}`, t = this.objectManager.createGameObject(i), o = t.getComponent;
    o && o.position.set(
      (Math.random() - 0.5) * 4,
      // -2 ~ 2 の範囲
      5,
      // 上空から
      (Math.random() - 0.5) * 4
      // -2 ~ 2 の範囲
    );
    const r = t.getComponent;
    r && (r.onGrab = () => {
      this.score++, console.log(`✨ Caught! Score: ${this.score}`);
      const n = this.fruits.indexOf(t);
      n !== -1 && this.removeFruit(t, n);
    }), this.fruits.push(t);
  }
  removeFruit(i, t) {
    this.objectManager.removeObject(i.id), this.fruits.splice(t, 1);
  }
}
const u = (s) => new c(s);
export {
  c as FruitCatchGame,
  u as initGame
};
