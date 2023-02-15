import React from 'react';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

import icon from '../images/emoji.svg';
import styles from '../styles/Chat.module.css';
import Messages from './Messages';
import { useRef } from 'react';

const socket = io.connect('http://localhost:5000');

const Chat = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ room: '', user: '' });
  const [state, setState] = useState([]);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState(0);
  const inputEl = useRef(null);

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit('join', searchParams);
  }, [search]);

  useEffect(() => {
    socket.on('message', ({ data }) => {
      setState(_state => [..._state, data]);
    });
  }, []);

  useEffect(() => {
    socket.on('room', ({ data: { users } }) => {
      setUsers(users.length);
    });
  }, []);

  const leftRoom = () => {
    socket.emit('leftRoom', { message, params });
    navigate('/');
  };

  const handleChange = ({ target: { value } }) => {
    setMessage(value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!message) return;

    socket.emit('sendMessage', { message, params });

    setMessage('');
  };

  const onEmojiClick = ({ emoji }) => {
    setMessage(`${message} ${emoji}`);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>{params.room}</div>
        <div className={styles.user}>{users} users in this room</div>
        <button className={styles.left} onClick={leftRoom}>
          Left room
        </button>
      </div>

      <div className={styles.messages}>
        <Messages messages={state} name={params.name} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            ref={inputEl}
            type="text"
            name="message"
            placeholder="Start typing here..."
            value={message}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.emoji}>
          <img src={icon} alt="emoji" onClick={() => setIsOpen(!isOpen)} />
          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        <div className={styles.button}>
          <input type="submit" onSubmit={handleSubmit} value="Send message" />
        </div>
      </form>
    </div>
  );
};

export default Chat;
