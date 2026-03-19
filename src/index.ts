import { 
    IObjectManager, 
    IGameObject, 
    IGrabbableComponent, 
    GrabbableComponent,
    Transform
} from '@mekou/engine-api';

// ITransform が index.d.ts からエクスポートされていないためローカルで定義
interface ITransform {
    position: { x: number; y: number; z: number };
    setPosition(x: number, y: number, z: number): void;
}

export class FruitCatchGame {
    private fruits: IGameObject[] = [];
    private spawnTimer: number = 0;
    private score: number = 0;

    // 設定値
    private readonly SPAWN_INTERVAL = 1.0; // 1秒ごとに生成
    private readonly GRAVITY = -2.5;       // 落下速度
    private readonly GROUND_Y = 0;         // 消滅する地面の高さ

    constructor(private objectManager: IObjectManager) {
        console.log("🍎 FruitCatch Game Initialized. Start catching fruits!");
    }

    /**
     * エンジンのメインループから毎フレーム呼ばれる
     * @param dt 前フレームからの経過時間 (秒)
     */
    public update(dt: number): void {
        // 1. スポーン処理
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.SPAWN_INTERVAL) {
            this.spawnFruit();
            this.spawnTimer = 0;
        }

        // 2. 更新とクリーンアップ（逆順ループで削除安全性を確保）
        for (let i = this.fruits.length - 1; i >= 0; i--) {
            const fruit = this.fruits[i];
            const transform = fruit.getComponent(Transform);

            if (transform) {
                // 自由落下シミュレーション
                transform.position.y += this.GRAVITY * dt;

                // 地面判定
                if (transform.position.y < this.GROUND_Y) {
                    this.removeFruit(fruit, i);
                }
            }
        }
    }

    private spawnFruit(): void {
        const id = `fruit_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const fruit = this.objectManager.createGameObject(id);
        
        // 初期位置の設定（x, z はランダム、y は上空）
        const transform = fruit.getComponent(Transform as any) as ITransform | undefined;
        if (transform) {
            transform.setPosition(
                (Math.random() - 0.5) * 4, // -2 ~ 2 の範囲
                5.0,                        // 上空から
                (Math.random() - 0.5) * 4  // -2 ~ 2 の範囲
            );
        }

        // 掴めるコンポーネントの設定
        const grabbable = fruit.getComponent(GrabbableComponent);
        if (grabbable) {
            grabbable.onGrab = () => {
                this.score++;
                console.log(`✨ Caught! Score: ${this.score}`);
                
                // 掴んだら即座に消去（リストからも削除）
                const index = this.fruits.indexOf(fruit);
                if (index !== -1) {
                    this.removeFruit(fruit, index);
                }
            };
        }

        this.fruits.push(fruit);
    }

    private removeFruit(fruit: IGameObject, index: number): void {
        this.objectManager.removeObject(fruit);
        this.fruits.splice(index, 1);
    }
}

/**
 * MEKOU Engine エントリポイント
 */
export const initGame = (objectManager: IObjectManager) => {
    return new FruitCatchGame(objectManager);
};