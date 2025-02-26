import Lab1_client from "./page_client";
import { Theme } from "@mui/material";

async function Lab1_server() {
  const data = await fetch('https://api.thingspeak.com/channels/2606541/feeds.json?results=10')
  const device = await data.json()

  return device
}

export default async function Lab1() {
  const device = await Lab1_server();

  return (
    <Lab1_client device={device} />
  );
}