import { GasSlackClient as SlackClient } from "@hi-se/gas-slack";
import { z } from "zod";

import { getConfig } from "./config";

const APIschema = z.object({
  slackId: z.string().optional(),
  PCId: z.number(),
  flag: z.union([z.literal("OK"), z.literal("NG")]), //OK:正常,NG:異常
  programStart: z.boolean().optional(), //初回の通知かどうか
  programEnd: z.boolean().optional(), //プログラムが終了したかどうか
  message: z.string().optional(),
  replayTs: z.string().optional(), //NOTE: tsがある場合にはリプライを行う
});
type APIschema = z.infer<typeof APIschema>;

export function doPost(e: GoogleAppsScript.Events.DoPost) {
  // PostData受け取り
  const data = APIschema.parse(JSON.parse(e.postData.contents));

  const slackMessage = createSlackMessage(data);
  const slackClient = getSlackClient();
  const { SLACK_CHANNEL_TO_POST } = getConfig();
  const output = ContentService.createTextOutput();

  if (data.replayTs) {
    postReplyMessage(slackClient, SLACK_CHANNEL_TO_POST, data.replayTs, slackMessage, data.programEnd, data.flag);
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({ message: data.flag }));
  } else {
    const result = postMessageToSlackChannel(slackClient, SLACK_CHANNEL_TO_POST, slackMessage);
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({ message: data.flag, timeStamp: result.ts }));
  }
  return output;
}

const postMessageToSlackChannel = (client: SlackClient, slackChannelId: string, messageToNotify: string) => {
  return client.chat.postMessage({
    channel: slackChannelId,
    text: messageToNotify,
  });
};

const slackIdToMention = (slackId: string) => `<@${slackId}>`;

const createSlackMessage = (apiContent: APIschema): string => {
  const { slackId, PCId, flag, message, programEnd, programStart } = apiContent;
  const safeMessage = message || "";
  if (flag == "NG") {
    return slackId
      ? `${slackIdToMention(slackId)}  \n${PCId}のパソコンでのプログラムが異常終了しました。\n${safeMessage}`
      : `${PCId}のパソコンでのプログラムが異常終了しました。\n${safeMessage}`;
  }
  if (programStart) {
    return slackId
      ? `${slackIdToMention(slackId)}  \n${PCId}のパソコンでのプログラムが開始しました。`
      : `${PCId}のパソコンでのプログラムが開始しました。`;
  } else if (programEnd == true) {
    if (flag === "OK") {
      return slackId
        ? `${slackIdToMention(slackId)}  \n${PCId}のパソコンでのプログラムが正常に終了しました。`
        : `${PCId}のパソコンでのプログラムが正常に終了しました。\n${safeMessage}`;
    }
  }
  return `${PCId}のパソコンでのプログラムが実行中です。\n${safeMessage}`;
};

function getSlackClient() {
  const { SLACK_ACCESS_TOKEN } = getConfig();
  return new SlackClient(SLACK_ACCESS_TOKEN);
}

const postReplyMessage = (
  client: SlackClient,
  channel: string,
  ts: string,
  text: string,
  programFinished: boolean | undefined,
  flag: string | undefined,
) => {
  if (programFinished || (flag && flag === "NG")) {
    return client.chat.postMessage({ channel, thread_ts: ts, text, reply_broadcast: true });
  }
  return client.chat.postMessage({ channel, thread_ts: ts, text });
};
