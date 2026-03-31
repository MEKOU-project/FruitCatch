import { 
    IObjectManager, 
    IGameObject,
    Transform,
    Mesh
} from '@mekou/engine-api';

export const initGame = (objectManager: IObjectManager) => {
    console.log("🚀 [initGame] START v0.1.1");
    console.log("📦 Received objectManager:", objectManager);
    
    try {
        const game = new FruitCatchGame(objectManager);
        console.log("✅ [initGame] Instance created:", game);
        return game;
    } catch (e) {
        console.error("❌ [initGame] CRASH during construction:", e);
        throw e;
    }
};

export class FruitCatchGame {
    private fruits: IGameObject[] = [];
    private spawnTimer: number = 0;
    private score: number = 0;
    private objectManager: IObjectManager;

    // 設定値
    private readonly SPAWN_INTERVAL = 1.0; // 1秒ごとに生成
    private readonly GRAVITY = -2.5;       // 落下速度
    private readonly GROUND_Y = 0;         // 消滅する地面の高さ

    constructor(objectManager: IObjectManager) {
        this.objectManager = objectManager;
        console.log("🍎 [Constructor] Check this.objectManager:", this.objectManager);
        // メソッドが存在するか、型が正しいかまでチェック
        console.log("🛠 [Constructor] has createGameObject?:", !!(this.objectManager && this.objectManager.createGameObject));
    }

    /**
     * エンジンのメインループから毎フレーム呼ばれる
     * @param dt 前フレームからの経過時間 (秒)
     */
    public update = (dt: number): void => {

        try {
            // 生成処理
            this.spawnTimer += dt;
            if (this.spawnTimer >= this.SPAWN_INTERVAL) {
                this.spawnFruit();
                this.spawnTimer = 0;
            }

            // 落下処理 ＆ 消す処理
            for (let i = this.fruits.length - 1; i >= 0; i--) {
                const fruit = this.fruits[i];
                
                const transform = fruit.getComponent<Transform>("Transform");

                if (transform) {
                    // 1. 座標の更新 (簡易重力)
                    const pos = transform.position;
                    const nextY = pos.y + (this.GRAVITY * dt);
                    transform.setPosition(pos.x, nextY, pos.z);

                    // 2. 地面判定による削除
                    if (nextY <= this.GROUND_Y) {
                        console.log(`♻️ [GC] Removing fruit at ground: ${fruit}`);
                        this.removeFruit(fruit, i);
                    }
                }
            }
        } catch (e) {
            console.error("🚨 [Update Loop] CRASH:", e);
            console.error("Current this:", this);
        }
    }

    private spawnFruit = (): void => {
        console.log("🍉 [spawnFruit] Attempting to create fruit...");
        
        if (!this.objectManager) {
            console.error("💀 [spawnFruit] this.objectManager is NULL or UNDEFINED!");
            return;
        }

        try {
            const id = `fruit_${Date.now()}`;
            const fruit = this.objectManager.createGameObject(id);

            console.log("✅ [spawnFruit] Success! Fruit ID:", id);

            // Transformの処理
            let transform = fruit.getComponent<Transform>("Transform");
            if (!transform) {
                transform = fruit.addComponent<Transform>("Transform");
            }
            
            const startX = (Math.random() - 0.5) * 10;
            transform.setPosition(startX, 10, 0);

            // Meshの処理 (const ではなく let を使用)
            let mesh = fruit.getComponent<Mesh>("Mesh");
            if (!mesh) {
                mesh = fruit.addComponent<Mesh>("Mesh");
                console.log("📦 Mesh added for:", id);
            }

            
            const scriptUrl = import.meta.url;
            const baseUrl = scriptUrl.substring(0, scriptUrl.lastIndexOf('/'));

            // モデルの設定
            const random = Math.floor(Math.random() * 3);
            if (random === 1) {
                mesh.setModel(`${baseUrl}/grapes.glb`);
            } else if (random === 2) {
                mesh.setModel(`${baseUrl}/apple.glb`);
            } else {
                mesh.setBoxGeometry(0.5, 0.5, 0.5);
            }
            
            this.fruits.push(fruit);
        } catch (e) {
            console.error("❌ [spawnFruit] FAILED to create or push fruit:", e);
        }
    }

    private removeFruit(fruit: IGameObject, index: number): void {
        this.objectManager.removeObject(fruit);
        this.fruits.splice(index, 1);
    }
}