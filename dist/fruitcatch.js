var s = Object.defineProperty;
var c = (o, t, e) => t in o ? s(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var r = (o, t, e) => c(o, typeof t != "symbol" ? t + "" : t, e);
const n = (o) => {
  console.log("🚀 [initGame] START"), console.log("📦 Received objectManager:", o);
  try {
    const t = new a(o);
    return console.log("✅ [initGame] Instance created:", t), t;
  } catch (t) {
    throw console.error("❌ [initGame] CRASH during construction:", t), t;
  }
};
class a {
  // 消滅する地面の高さ
  constructor(t) {
    r(this, "fruits", []);
    r(this, "spawnTimer", 0);
    r(this, "score", 0);
    r(this, "objectManager");
    // 設定値
    r(this, "SPAWN_INTERVAL", 1);
    // 1秒ごとに生成
    r(this, "GRAVITY", -2.5);
    // 落下速度
    r(this, "GROUND_Y", 0);
    /**
     * エンジンのメインループから毎フレーム呼ばれる
     * @param dt 前フレームからの経過時間 (秒)
     */
    r(this, "update", (t) => {
      try {
        this.spawnTimer += t, this.spawnTimer >= this.SPAWN_INTERVAL && (this.spawnFruit(), this.spawnTimer = 0);
      } catch (e) {
        console.error("🚨 [Update Loop] CRASH:", e), console.error("Current this:", this);
      }
    });
    r(this, "spawnFruit", () => {
      if (console.log("🍉 [spawnFruit] Attempting to create fruit..."), !this.objectManager) {
        console.error("💀 [spawnFruit] this.objectManager is NULL or UNDEFINED!");
        return;
      }
      try {
        const t = `fruit_${Date.now()}`, e = this.objectManager.createGameObject(t);
        console.log("✅ [spawnFruit] Success! Fruit ID:", t), this.fruits.push(e);
      } catch (t) {
        console.error("❌ [spawnFruit] FAILED to create or push fruit:", t);
      }
    });
    this.objectManager = t, console.log("🍎 [Constructor] Check this.objectManager:", this.objectManager), console.log("🛠 [Constructor] has createGameObject?:", !!(this.objectManager && this.objectManager.createGameObject));
  }
  removeFruit(t, e) {
    this.objectManager.removeObject(t), this.fruits.splice(e, 1);
  }
}
export {
  a as FruitCatchGame,
  n as initGame
};
