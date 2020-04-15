import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ButtonGroup, Button, IconButton, Icon } from '@material-ui/core'
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import './styles.css';
import { useSocket } from '../lib/socketHooks';

const FADE_TIME = 150; // ms
const TYPING_TIMER_LENGTH = 400; // ms
const COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

// Gets the color of a username through our hash function
function getUsernameColor(username) {
  // Compute hash code
  let hash = 7;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + (hash << 5) - hash;
  }
  // Calculate color
  const index = Math.abs(hash % COLORS.length);
  return COLORS[index];
}

export const Username = props => {
  return (
    <span className="username" style={{ color: getUsernameColor(props.username) }}>
      {props.username}:&nbsp;
    </span>
  )
};

export const MessageText = props => {
  return (
    <span className="messageBody">
      {props.text}
    </span>
  )
};

export const Message = ({ username, text, isSelfMessage = false }) => {
  return (
    <li className="message">
      <div style={{
        textAlign: isSelfMessage ? 'left' : 'right',
      }}>
        <Username username={username} />
        <MessageText text={text} />
      </div>
    </li>
  );
};

export const LogMessage = ({ text }) => {
  return (
    <li className="log">{text}</li>
  );
}

export const Chat = props => {
  const [wildAmount, setWildAmount] = useState(2);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([{
    type: 'log',
    text: 'Hello World',
  }]);
  const { socket, isConnecting, error } = useSocket();
  if (error) {
    console.log(error);
  }

  const onMessage = msg => {
    setMessages(messages => [
      ...messages,
      {
        type: 'chatMessage',
        text: msg.message,
        username: msg.username,
      }
    ]);
  };

  useEffect(() => {
    console.log('useEffect');
    if (socket) {
      socket.on('new message', onMessage);
      socket.on('my-name-is', serverName => {
        setMessages(messages => [
          ...messages,
          {
            type: 'log',
            text: 'You are connected to server ' + serverName
          }
        ]);
      });

      socket.on('blast', data => {
        setMessages(messages => [
          ...messages,
          {
            type: 'log',
            text: 'Got blast from ' + data.username
          }
        ]);
      });
      socket.on('spin', data => {
        setMessages(messages => [
          ...messages,
          {
            type: 'log',
            text: 'Got spin from ' + data.username
          }
        ]);
      });
      socket.on('wild', data => {
        setMessages(messages => [
          ...messages,
          {
            type: 'log',
            text: 'Got wild from ' + data.username
          }
        ]);
      });
    }
  }, [socket]);

  const onSpinClicked = e => {
    socket.emit('spin');
  };
  const onWildClicked = e => {
    socket.emit('wild', wildAmount);
  };
  const onBlastClicked = e => {
    socket.emit('blast');
  };
  const onTextChange = e => {
    setCurrentMessage(e.target.value);
  }

  const onTextKeyPress = e => {
    if (e.keyCode == 13) {
      console.log('value', e.target.value);
      setMessages(messages => [
        ...messages,
        {
          type: 'selfMessage',
          text: currentMessage,
          username: socket.username,
        }
      ]);
      socket.emit('new message', currentMessage);
      setCurrentMessage('');
    }
  }


  return isConnecting ? <div>Loading..</div> : (
    <div className="container">
      <div className="buttonsContainer">
        <Button 
          variant="contained"
          color="primary"
          onClick={onSpinClicked}
        >
          SPIN
        </Button>
        <IconButton color="primary" component="span" onClick={() => setWildAmount(wildAmount => wildAmount + 1)}>
          <Add />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          onClick={onWildClicked}
        >
          WILD({wildAmount})
        </Button>
        <IconButton color="primary" component="span" onClick={() => setWildAmount(wildAmount => wildAmount - 1)}>
          <Remove />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          onClick={onBlastClicked}
        >
          BLAST
        </Button>
      </div>
      <div className="chatArea">
        <ul className="messages">
          {messages &&
            messages.map((message, key) => message.type === 'log' ?
              <LogMessage key={key} text={message.text} /> :
              <Message
                key={key}
                username={message.username}
                text={message.text}
                isSelfMessage={message.type === 'selfMessage'}
              />
            )
          }
        </ul>
        <input
          className="inputMessage"
          value={currentMessage}
          placeholder="Type here..."
          onChange={onTextChange}
          onKeyDown={onTextKeyPress}
        />
      </div>
    </div>
  );
}
