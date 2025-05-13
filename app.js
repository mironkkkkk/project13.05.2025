const express = require('express');
const app = express();
const port = 3600;
const fetch = require('node-fetch');
const jsonFile = require('./public/application.json');
const mysql = require('mysql')
const fs = require('fs');
const session = require('express-session');
const path = require('path');

let connection;

require('dotenv').config();

const API_KEY = process.env.API_KEY; // Замените на реальный ключ
const API_URL = 'https://api.intelligence.io.solutions/api/v1/chat/completions';

app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.listen(port, () => console.log(`Сервер запущен по адресу http://localhost:${port}`));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

app.get('/ai-connection.js', (req, res) => {
  res.sendFile(__dirname + '/public/ai-connection.js');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/fonts', (req, res) => {
  res.sendFile(__dirname + '/public/css/fonts.scss');
});

app.get('/css/main.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/main.css');
});

app.get('/css/index.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/index.css');
});

app.get('/css/root.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/root.css');
});

app.get('/img/arrows.png', (req, res) => {
  res.sendFile(__dirname + '/public/img/arrows.png');
});

app.get('/img/logo.svg', (req, res) => {
  res.sendFile(__dirname + '/public/img/logo.svg');
});

app.get('/img/copyright.svg', (req, res) => {
  res.sendFile(__dirname + '/public/img/copyright.svg');
});

app.get('/img/dark-check.svg', (req, res) => {
  res.sendFile(__dirname + '/public/img/dark-check.svg');
});

app.get('/img/light-check.svg', (req, res) => {
  res.sendFile(__dirname + '/public/img/light-check.svg');
});

app.get('/img/send.png', (req, res) => {
  res.sendFile(__dirname + '/public/img/send.png');
});

app.get('/img/user-robot.svg', (req, res) => {
  res.sendFile(__dirname + '/public/img/user-robot.svg');
});

app.get('/img/check.svg', (req, res) => {
  res.sendFile(__dirname + '/public/img/check.svg');
});

app.get('/register.js', (req, res) => {
  res.sendFile(__dirname + '/public/register.js');
});

app.get('/ask/:text', async (req, res) => {
  const text = req.url.split('/')[2];

  let answer;

  // getDeepSeekResponse(text)

  async function handleResponse() {
  try {
    answer = await getDeepSeekResponse(text); // Ждём ответ
    console.log("Ответ DeepSeek:", answer);
    res.send(answer);
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

handleResponse();

  // console.log(getDeepSeekResponse(text));
});

async function getDeepSeekResponse(userMessage) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-R1", // Указываем модель
      messages: [
        { role: "user", content: userMessage }, // Ваш запрос
      ],
      temperature: 0.7, // Контроль случайности ответа (0-1)
      max_tokens: 1000, // Максимальная длина ответа
      reasoning_content: false
    }),
  });

  if (!response.ok) {
    throw new Error(`Ошибка API: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.split('</think>')[1]; // Получаем ответ
}

app.post('/newUser', (req, res) => {
  const clientData = req.body;
  const login = clientData.login;
  const password = clientData.password;

  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'glordoAI'
  });

  connection.connect()

  connection.query(`INSERT INTO userData (login, password) VALUES ('${login}', '${password}')`, (err, results) => {
    if (err) throw err
    console.log('Данные успешно записаны в базу данных!');
  });
  res.send("Finaly write data");

});

app.post('/login', (req, res) => {
  const { login, password } = req.body;

  // Создаем новое соединение для каждого запроса (не оптимально, но работает)
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'glordoAI'
  });

  connection.connect(err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Ошибка подключения к БД' });
    }

    connection.query(
      'SELECT * FROM userData WHERE login = ? AND password = ?', 
      [login, password],
      (err, results) => {
        connection.end(); // Закрываем соединение после запроса
        
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }

        if (results.length > 0) {
          req.session.userId = results[0].id;
          return res.json({ 
            success: true, 
            redirect: '/index.html'
          });
        } else {
          return res.json({ 
            success: false, 
            message: 'Неверный логин или пароль' 
          });
        }
      }
    );
  });
});

app.get('/login.js', (req, res) => {
  res.sendFile(__dirname + '/public/login.js');

});

app.get('/index.html', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// getDeepSeekResponse("Привет! Как дела?")
//   .then((reply) => console.log("Ответ DeepSeek:", reply))
//   .catch((err) => console.error("Ошибка:", err));
