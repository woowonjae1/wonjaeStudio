export default function GamesPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>游戏列表</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {[
          { id: 1, title: "Counter-Strike 2", category: "FPS" },
          { id: 2, title: "无畏契约", category: "FPS" },
          { id: 3, title: "英雄联盟", category: "MOBA" },
          { id: 4, title: "绝地求生", category: "Battle Royale" }
        ].map(game => (
          <div key={game.id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '16px',
            backgroundColor: 'white'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{game.title}</h2>
            <p style={{ color: '#666' }}>{game.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 