const Message = require('../models/Message');
const User = require('../models/User');
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

const getLLMResponse = async (message) => {
    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                prompt: message,
                max_tokens: 50,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error getting LLM response:', error);
        return null;
    }
};

exports.sendMessage = async (req, res) => {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ msg: 'Sender or receiver not found' });
        }

        // Check if the recipient is busy
        if (receiver.status === 'BUSY') {
            let llmResponse;

            const llmPromise = getLLMResponse(message);
            
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => {
                    resolve('The user is currently unavailable.');
                }, 10000); // 10 seconds timeout
            });

            // Wait for either the LLM response or the timeout
            llmResponse = await Promise.race([llmPromise, timeoutPromise]);

            // Save the LLM response as a message
            const autoReply = new Message({
                sender: receiverId,
                receiver: senderId,
                message: llmResponse || 'The user is currently unavailable.',
                timestamp: Date.now(),
            });

            await autoReply.save();

            res.json({ msg: 'User is currently Unavailable', autoReply: llmResponse });
        } else {
            const newMessage = new Message({
                sender: senderId,
                receiver: receiverId,
                message,
                timestamp: Date.now(),
            });
        
            await newMessage.save();

            res.json({ msg: 'Message sent' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMessages = async (req, res) => {
    const userId = req.user.id;
    const { receiverId } = req.query;

    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: receiverId },
                { sender: receiverId, receiver: userId }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
