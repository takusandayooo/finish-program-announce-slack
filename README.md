# プログラム終了時にSlackに通知するGASプロジェクト

## 概要
プログラムの途中経過や終了時、エラー時にSlackへ通知を送るGAS（Google Apps Script）プロジェクトです。

## 使い方

### 通知先の設定
1. GASプロジェクトのプロパティに以下のキーを設定します。
   - `SLACK_ACCESS_TOKEN`：Slackのアクセストークン
   - `SLACK_CHANNEL_TO_POST`：通知先のチャンネル名
2. 通知先のチャンネルにSlack Appを追加します。
3. プロジェクトをデプロイしてAPIのURLを取得します。
4. 自分のプログラムに組み込む際は、[`demo.py`](./demo.py)を参考にしてください。

## APIのスキーマ
APIに送信するデータの形式は以下の通りです。

```json
{
  "slackId": string,           // SlackのユーザーID（オプション）
  "PCId": number,              // パソコンを識別するためのID
  "flag": "OK" | "NG",         // プログラムの状態（OK: 正常、NG: 異常）
  "programStart": boolean,     // プログラム開始時のフラグ（オプション）
  "programEnd": boolean,       // プログラム終了時のフラグ（オプション）
  "message": string,           // メッセージ（オプション）
  "replayTs": string           // 開始時のタイムスタンプ（途中経過や終了時に使用）
}
```

## APIの使い方
> **注記:**
> 1. プログラムの途中経過ではメンションは飛びません。
> 2. プログラム開始時は通常メッセージ、それ以外はスレッド形式で通知されます（終了時はチャンネルにもメッセージが送信されます）。
> 3. メッセージはオプショナルなので、必要に応じて設定してください。

### 1. プログラム開始時

**必ず必要な要素:**
- `PCId`
- `programStart: true`
- `flag: OK`

**返される値:**
- `replayTs`（開始時のタイムスタンプ）

### 2. プログラム途中経過
**必ず必要な要素:**
- `PCId`
- `flag: OK`
- `replayTs`（開始時のタイムスタンプ）

### 3. プログラム正常終了時
**必ず必要な要素:**
- `PCId`
- `flag: OK`
- `programEnd: true`
- `replayTs`（開始時のタイムスタンプ）

### 4. プログラム異常終了時
**必ず必要な要素:**
- `PCId`
- `flag: NG`
- `replayTs`（開始時のタイムスタンプ）


<br>
<br>
---

# 以下GASのプロジェクトの開発環境について

## Getting Started

### Clone Repository

1. RepositoryのURLをコピーする
1. VSCodeのコマンドパレットで `Clone Repository in Container` と入力し、`Dev Containers: Clone Repository in Container Volume…` を選択
1. コピーしたGitHubのURLをペーストして Enter



### 初期設定

```
pnpm install
pnpm clasp login
```


### 新規GASプロジェクトを作成する場合

1. 以下のコマンドを実行（ `{projectName}` は別の値に置き換える）

```
pnpm clasp create --title={projectName}
mv build/.clasp.json .clasp.prod.json
```

2. build/appsscript.jsonをプロジェクトにあわせて修正する
  - 特に `oauthScopes`

3. 必要に応じてdev環境を用意する


### GoogleDrive上にある既存のGASプロジェクトを利用する場合

1. プロジェクトのrootDirに.clasp.prod.json（必要に応じて.clasp.dev.json）を手動で作成する  
    ※ .clasp.prod.jsonの内容は以下の通り
    ```
    {
      "scriptId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "rootDir": "build"
    }
    ```
1. build/appsscript.jsonをプロジェクトにあわせて修正する


