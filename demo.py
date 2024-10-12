import requests
import json
import time


#APIのdataスキーマ
# {
#     "slackId":string:options → 開始時と終了時にSlackにメンションを飛ばすためのID
#     "PCId":number → パソコンを識別するためのID
#     "flag":string → OKの場合は正常、NGの場合は異常
#     "programStart":boolean:options  → プログラムの開始を通知するためのフラグ
#     "programEnd":boolean:options → プログラムの終了を通知するためのフラグ
#     "message":string:options　→ メッセージを送る場合に使用
#     "replayTs":string:options(開始時以外) → 開始時のタイムスタンプ
# }


#プログラム例

url = 'ここにAPIのURLを入れる'
headers = {
    'Content-Type': 'application/json'
}
# 始まりを通知
data={
    "PCId":34,
    "flag":"OK",
    "programStart":True,
}
response = requests.post(url, data=json.dumps(data), headers=headers)
print(response.text)
json_data = json.loads(response.text)
replyTs = json_data["timeStamp"]

# 途中経過を通知
data={
    "PCId":34,
    "flag":"OK",
    "replayTs":replyTs
}
response = requests.post(url, data=json.dumps(data), headers=headers)
print(response.text)

time.sleep(5)
# 異常を通知
data={
    "PCId":34,
    "flag":"NG",
    "replayTs":replyTs
}
response = requests.post(url, data=json.dumps(data), headers=headers)
print(response.text)

# 終了を通知
data={
    "PCId":34,
    "flag":"OK",
    "programEnd":True,
    "replayTs":replyTs
}
response = requests.post(url, data=json.dumps(data), headers=headers)
print(response.text)
