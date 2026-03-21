var u = Object.defineProperty;
var l = (r, t, e) => t in r ? u(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var o = (r, t, e) => l(r, typeof t != "symbol" ? t + "" : t, e);
import { Transform as a, Mesh as h } from "@mekou/engine-api";
const f = (r) => {
  console.log("🚀 [initGame] START"), console.log("📦 Received objectManager:", r);
  try {
    const t = new m(r);
    return console.log("✅ [initGame] Instance created:", t), t;
  } catch (t) {
    throw console.error("❌ [initGame] CRASH during construction:", t), t;
  }
};
class m {
  // 消滅する地面の高さ
  constructor(t) {
    o(this, "fruits", []);
    o(this, "spawnTimer", 0);
    o(this, "score", 0);
    o(this, "objectManager");
    // 設定値
    o(this, "SPAWN_INTERVAL", 1);
    // 1秒ごとに生成
    o(this, "GRAVITY", -2.5);
    // 落下速度
    o(this, "GROUND_Y", 0);
    /**
     * エンジンのメインループから毎フレーム呼ばれる
     * @param dt 前フレームからの経過時間 (秒)
     */
    o(this, "update", (t) => {
      try {
        this.spawnTimer += t, this.spawnTimer >= this.SPAWN_INTERVAL && (this.spawnFruit(), this.spawnTimer = 0);
        for (let e = this.fruits.length - 1; e >= 0; e--) {
          const s = this.fruits[e], n = s.getComponent(a);
          if (n) {
            const i = n.position, c = i.y + this.GRAVITY * t;
            n.setPosition(i.x, c, i.z), c <= this.GROUND_Y && (console.log(`♻️ [GC] Removing fruit at ground: ${s}`), this.removeFruit(s, e));
          }
        }
      } catch (e) {
        console.error("🚨 [Update Loop] CRASH:", e), console.error("Current this:", this);
      }
    });
    o(this, "spawnFruit", () => {
      if (console.log("🍉 [spawnFruit] Attempting to create fruit..."), !this.objectManager) {
        console.error("💀 [spawnFruit] this.objectManager is NULL or UNDEFINED!");
        return;
      }
      try {
        const t = `fruit_${Date.now()}`, e = this.objectManager.createGameObject(t);
        console.log("✅ [spawnFruit] Success! Fruit ID:", t);
        const s = e.getComponent(a);
        if (s) {
          const i = (Math.random() - 0.5) * 10;
          s.setPosition(i, 10, 0), console.log(s.position);
        }
        const n = e.getComponent(h);
        n ? (n.setBoxGeometry(0.5, 0.5, 0.5), console.log("📦 Mesh initialized for:", t)) : e.addComponent(h), this.fruits.push(e);
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
  m as FruitCatchGame,
  f as initGame
};
