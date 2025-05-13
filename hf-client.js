const fetch = require('node-fetch');
require('dotenv').config();

class HuggingFaceClient {
  constructor() {
    this.apiToken = process.env.HF_API_TOKEN;
    this.baseUrl = 'https://api-inference.huggingface.co/models/';
  }

  async query(model, payload) {
    const response = await fetch(`${this.baseUrl}${model}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
  }
}

module.exports = new HuggingFaceClient();