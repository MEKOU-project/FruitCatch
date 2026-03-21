var h = Object.defineProperty;
var u = (r, t, o) => t in r ? h(r, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : r[t] = o;
var e = (r, t, o) => u(r, typeof t != "symbol" ? t + "" : t, o);
import { Transform as a } from "@mekou/engine-api";
const p = (r) => {
  console.log("🚀 [initGame] START"), console.log("📦 Received objectManager:", r);
  try {
    const t = new g(r);
    return console.log("✅ [initGame] Instance created:", t), t;
  } catch (t) {
    throw console.error("❌ [initGame] CRASH during construction:", t), t;
  }
};
class g {
  // 消滅する地面の高さ
  constructor(t) {
    e(this, "fruits", []);
    e(this, "spawnTimer", 0);
    e(this, "score", 0);
    e(this, "objectManager");
    // 設定値
    e(this, "SPAWN_INTERVAL", 1);
    // 1秒ごとに生成
    e(this, "GRAVITY", -2.5);
    // 落下速度
    e(this, "GROUND_Y", 0);
    /**
     * エンジンのメインループから毎フレーム呼ばれる
     * @param dt 前フレームからの経過時間 (秒)
     */
    e(this, "update", (t) => {
      try {
        this.spawnTimer += t, this.spawnTimer >= this.SPAWN_INTERVAL && (this.spawnFruit(), this.spawnTimer = 0);
        for (let o = this.fruits.length - 1; o >= 0; o--) {
          const s = this.fruits[o], i = s.getComponent(a);
          if (i) {
            const n = i.position, c = n.y + this.GRAVITY * t;
            i.setPosition(n.x, c, n.z), c <= this.GROUND_Y && (console.log(`♻️ [GC] Removing fruit at ground: ${s}`), this.removeFruit(s, o));
          }
        }
      } catch (o) {
        console.error("🚨 [Update Loop] CRASH:", o), console.error("Current this:", this);
      }
    });
    e(this, "spawnFruit", () => {
      if (console.log("🍉 [spawnFruit] Attempting to create fruit..."), !this.objectManager) {
        console.error("💀 [spawnFruit] this.objectManager is NULL or UNDEFINED!");
        return;
      }
      try {
        const t = `fruit_${Date.now()}`, o = this.objectManager.createGameObject(t);
        console.log("✅ [spawnFruit] Success! Fruit ID:", t);
        const s = o.getComponent(a);
        if (s) {
          const i = (Math.random() - 0.5) * 10;
          s.setPosition(i, 10, 0), console.log(s.position);
        }
        this.fruits.push(o);
      } catch (t) {
        console.error("❌ [spawnFruit] FAILED to create or push fruit:", t);
      }
    });
    this.objectManager = t, console.log("🍎 [Constructor] Check this.objectManager:", this.objectManager), console.log("🛠 [Constructor] has createGameObject?:", !!(this.objectManager && this.objectManager.createGameObject));
  }
  removeFruit(t, o) {
    this.objectManager.removeObject(t), this.fruits.splice(o, 1);
  }
}
export {
  g as FruitCatchGame,
  p as initGame
};
