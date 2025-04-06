import React from 'react';

export default function NewsList() {
  const handleNewsClick = (stockName, title, url) => {
    // 백엔드에 클릭 로그 전송
    fetch('http://localhost:8000/api/news_click/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        stock_name: stockName,
        title: title,
      }),
    })
    .then(res => res.json())
    .then(data => {
      console.log("✅ 클릭 로그 전송 완료:", data);
      // 뉴스 링크 새 탭으로 열기
      window.open(url, '_blank');
    })
    .catch(err => {
      console.error("❌ 클릭 로그 실패:", err);
      window.open(url, '_blank'); // 실패해도 링크는 열어줌
    });
  };

  const newsData = [
    {
      stock: "삼성전자",
      title: "AI 반도체 시대를 주도하는 삼성전자",
      url: "https://news.example.com/samsung-ai",
    },
    {
      stock: "카카오",
      title: "카카오 주가 반등… 투자 기회?",
      url: "https://news.example.com/kakao-rise",
    },
  ];

  return (
    <div className="space-y-4">
      {newsData.map((news, idx) => (
        <div
          key={idx}
          className="cursor-pointer p-4 border rounded hover:bg-gray-100"
          onClick={() => handleNewsClick(news.stock, news.title, news.url)}
        >
          <h3 className="font-semibold text-blue-600">{news.stock}</h3>
          <p className="underline">{news.title}</p>
        </div>
      ))}
    </div>
  );
}
