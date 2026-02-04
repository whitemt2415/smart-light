// src/App.tsx
import { useState, useEffect } from "react";
import { database, ref, set, onValue } from "./firebase";

interface LightState {
  [key: string]: boolean;
}

function App() {
  const [lights, setLights] = useState<LightState>({
    living_room: false,
    bedroom: false,
    kitchen: false,
  });

  // ดึงข้อมูลจาก Firebase แบบ realtime
  useEffect(() => {
    const lightsRef = ref(database, "lights");
    const unsubscribe = onValue(lightsRef, (snapshot) => {
      if (snapshot.exists()) {
        setLights(snapshot.val());
      }
    });
    return () => unsubscribe();
  }, []);

  // อัพเดทสถานะไฟ
  const toggleLight = (room: string) => {
    const newState = !lights[room];
    set(ref(database, `lights/${room}`), newState);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>🏠 ระบบควบคุมไฟ</h1>

      {Object.entries(lights).map(([room, isOn]) => (
        <div
          key={room}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px",
            margin: "10px 0",
            borderRadius: "10px",
            background: isOn ? "#fef3c7" : "#f3f4f6",
          }}
        >
          <span>{room.replace("_", " ").toUpperCase()}</span>
          <button
            onClick={() => toggleLight(room)}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border: "none",
              background: isOn ? "#22c55e" : "#ef4444",
              color: "white",
              cursor: "pointer",
            }}
          >
            {isOn ? "💡 ON" : "⚫ OFF"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
