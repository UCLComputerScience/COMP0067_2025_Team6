import React from "react";
import Lab1_client from "./page_client";

// async function Lab1_server() {
//   const data = await fetch('https://api.thingspeak.com/channels/2606541/feeds.json')
//   const device = await data.json()

//   return device
// }

export default async function Lab1() {
  // const device = await Lab1_server();

  return (
    // <Lab1_client device={device} />
    <>
    <Lab1_client />
    </>  
  );
}