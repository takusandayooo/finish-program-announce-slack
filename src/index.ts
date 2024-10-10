import { main } from "./app";

/**
 * @file GASエディタから実行できる関数を定義する
 */



// biome-ignore lint/suspicious/noExplicitAny: <explanation>
declare  const global: any;
global.main = main;