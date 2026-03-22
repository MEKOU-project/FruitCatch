//#region src/index.ts
var e = (e) => {
	console.log("🚀 [initGame] START v0.1.1"), console.log("📦 Received objectManager:", e);
	try {
		let n = new t(e);
		return console.log("✅ [initGame] Instance created:", n), n;
	} catch (e) {
		throw console.error("❌ [initGame] CRASH during construction:", e), e;
	}
}, t = class {
	fruits = [];
	spawnTimer = 0;
	score = 0;
	objectManager;
	SPAWN_INTERVAL = 1;
	GRAVITY = -2.5;
	GROUND_Y = 0;
	constructor(e) {
		this.objectManager = e, console.log("🍎 [Constructor] Check this.objectManager:", this.objectManager), console.log("🛠 [Constructor] has createGameObject?:", !!(this.objectManager && this.objectManager.createGameObject));
	}
	update = (e) => {
		try {
			this.spawnTimer += e, this.spawnTimer >= this.SPAWN_INTERVAL && (this.spawnFruit(), this.spawnTimer = 0);
			for (let t = this.fruits.length - 1; t >= 0; t--) {
				let n = this.fruits[t], r = n.getComponent("Transform");
				if (r) {
					let i = r.position, a = i.y + this.GRAVITY * e;
					r.setPosition(i.x, a, i.z), a <= this.GROUND_Y && (console.log(`♻️ [GC] Removing fruit at ground: ${n}`), this.removeFruit(n, t));
				}
			}
		} catch (e) {
			console.error("🚨 [Update Loop] CRASH:", e), console.error("Current this:", this);
		}
	};
	spawnFruit = () => {
		if (console.log("🍉 [spawnFruit] Attempting to create fruit..."), !this.objectManager) {
			console.error("💀 [spawnFruit] this.objectManager is NULL or UNDEFINED!");
			return;
		}
		try {
			let e = `fruit_${Date.now()}`, t = this.objectManager.createGameObject(e);
			console.log("✅ [spawnFruit] Success! Fruit ID:", e);
			let n = t.getComponent("Transform");
			if (n) {
				let e = (Math.random() - .5) * 10;
				n.setPosition(e, 10, 0), console.log("objectPos:", JSON.stringify(n.position));
			} else t.addComponent("Transform");
			let r = t.getComponent("Mesh");
			r ? (r.setBoxGeometry(.5, .5, .5), console.log("📦 Mesh initialized for:", e)) : t.addComponent("Mesh"), this.fruits.push(t);
		} catch (e) {
			console.error("❌ [spawnFruit] FAILED to create or push fruit:", e);
		}
	};
	removeFruit(e, t) {
		this.objectManager.removeObject(e), this.fruits.splice(t, 1);
	}
};
//#endregion
export { t as FruitCatchGame, e as initGame };
