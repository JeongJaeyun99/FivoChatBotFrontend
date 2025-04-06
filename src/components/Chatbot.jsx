import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const typeEffect = (text, callback) => {
    let index = 0;
    setTyping('');
    const interval = setInterval(() => {
      if (index < text.length) {
        setTyping((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        callback();
      }
    }, 25);
  };

  const handleSubmit = async (customMessage = null) => {
    const content = customMessage ?? message;
    if (!content.trim()) return;
    const userMessage = { sender: 'user', text: content };
    setMessages((prev) => [...prev, userMessage]);
    setTyping('🤖');
    setLoading(true);
    setMessage('');
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const res = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
        credentials: 'include',
      });
      const data = await res.json();
      typeEffect(data.response, () => {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
        setTyping('');
      });
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: '서버 오류가 발생했어요.' }]);
      setTyping('');
    } finally {
      setLoading(false);
    }
  };

  const handleUsageClick = () => {
    setMessage('이 사이트 어떻게 써요?');
    handleSubmit('이 사이트 어떻게 써요?');
  };

  const handleClearChat = async () => {
    setMessages([]);
    setTyping('');
    localStorage.removeItem('chatMessages');
    try {
      await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: '초기화' }),
        credentials: 'include',
      });
    } catch (e) {
      console.error("세션 초기화 실패:", e);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <Card className="mb-4">
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">📋 메뉴</h2>
          <div className="flex flex-col gap-2">
            <Button onClick={handleUsageClick} className="bg-white border border-gray-300 text-black">
                Fivo의 사용법
            </Button>
            <Button disabled className="bg-white border border-gray-300 text-black">
                오늘의 유망 종목 & 기피 종목(준비 중)
            </Button>
            <Button onClick={handleClearChat} className="bg-red-100 border border-red-300 text-red-600">
              💬 대화 초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="h-96 overflow-y-auto mb-4 bg-gray-50">
        <CardContent className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs break-words whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-xl max-w-xs break-words whitespace-pre-line bg-gray-200 text-black animate-pulse">
                {typing}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Input
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button onClick={() => handleSubmit()} disabled={loading} className="bg-blue-600 text-white">
          {loading ? '^' : '^'}
        </Button>
      </div>
    </div>
  );
}
