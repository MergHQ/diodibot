require('dotenv').config();
import { Client, Message, VoiceConnection } from 'eris';
import * as axios from 'axios';
import { ReadStream } from 'fs';

const client = new Client(String(process.env.DIODIBOT_TOKEN));
const STREAM_URL = 'https://virta.radiodiodi.fi/stream.mp3';

async function run() {
  // Get the radio stream
  const radioStream = await axios.default({
    method: 'get',
    url: STREAM_URL,
    responseType: 'stream'
  });

  // Listen for messageCreate events from discord
  client.on('messageCreate', async (msg: Message) => {
    // Check if the message start with !diodi join
    if (msg.content.startsWith('!diodi join')) {
      // Check if the callee is a server member
      if (msg.member) {
        let member = msg.member;
        // Check if the user is in a voice channel
        if (member.voiceState && member.voiceState.channelID) {
          // Join the voice channel where the user is
          client.joinVoiceChannel(member.voiceState.channelID).then((connection: VoiceConnection) => {
            // Playback the stream
            connection.play(radioStream.data);
          }).catch(e => {
            console.log(e);
          });
        }
      }
    }
  });

  // Set the status
  client.editStatus('online', {
    name: 'use !diodi join',
    url: 'https://radiodiodi.fi/',
    type: 2
  });

  client.connect();
}

run();