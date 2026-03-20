import { 
    IObjectManager, 
    IGameObject,
    GrabbableComponent,
    Transform
} from '@mekou/engine-api';

export const initGame = (objectManager: IObjectManager) => {
    console.log("🚀 [initGame] START");
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
            // ここで落ちているなら this.spawnTimer か this.spawnFruit が怪しい
            this.spawnTimer += dt;
            if (this.spawnTimer >= this.SPAWN_INTERVAL) {
                this.spawnFruit();
                this.spawnTimer = 0;
            }
            // ... 以下略
        } catch (e) {
            console.error("🚨 [Update Loop] CRASH:", e);
            console.error("Current this:", this);
            // 連続でログが出過ぎるのを防ぐため、一度エラーが出たら止めるフラグを立ててもいい
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
            
            // ... 
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