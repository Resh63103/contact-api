Google SheetsとSlackを連携するNode.js製API

##概要
contact-apiは、Google SheetsとSlackを連携し、問い合わせ内容の管理や通知を自動化するAPI。
例えば、Webフォームからの問い合わせをGoogleスプレッドシートに記録し、同時にSlackへ通知する、といった用途に利用。

##主な機能
Google Sheetsへのデータ書き込み
Slackへの通知送信
シンプルなREST APIエンドポイント

##技術スタック
Node.js
Google Sheets API
Slack API

## 使い方
APIエンドポイントの詳細は`src/index.js`などを参照してください。  
（例: `/contact`エンドポイントにPOSTリクエストで問い合わせ内容を送信）
