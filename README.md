# side-steps

反復横跳びチャレンジ

体育の反復横跳びのミニゲームです。

## セットアップ

```bash
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

`http://localhost:3000` を開いてください。

## 本番ビルド

```bash
npm run build
npm run preview
```

## 静的サイトとして書き出す場合

```bash
npm run generate
```

## 構成

```
app/
  app.vue                     … ルート。useSideStepGame() を provide し画面を切り替える
  composables/
    useSideStepGame.ts        … スコア・タイマー・両足の座標などゲームロジック本体
  components/
    GameStart.vue             … タイトル/ルール説明画面
    GameCountdown.vue         … 開始前のカウントダウン
    GamePlay.vue               … コート・スコアボード・操作ボタン
    GameResult.vue             … 結果画面(ランク表示)
  assets/css/main.css         … 全体の見た目(CSS変数でテーマカラー管理)
nuxt.config.ts
package.json
```

## 操作

- 右足: `←` `→` キー、またはコート下部の「右足」ボタン
- 左足: `A` `D` キー、またはコート下部の「左足」ボタン
- 両足を目標のラインに移動するとスコア加算
