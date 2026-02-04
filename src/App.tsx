//src\App.tsx
import { useState, useEffect, useMemo } from "react";
import {
  database,
  ref,
  set,
  onValue,
  isFirebaseConnected,
  firebaseError,
} from "./firebase";

interface LightState {
  [key: string]: boolean;
}

type ConnectionStatus = "loading" | "connected" | "disconnected" | "error";

// กำหนด initial status ก่อน component render
const getInitialStatus = (): ConnectionStatus => {
  if (firebaseError) return "error";
  if (isFirebaseConnected && database) return "loading";
  return "disconnected";
};

const getInitialError = (): string | null => {
  if (firebaseError) return firebaseError;
  if (!isFirebaseConnected || !database) return "Firebase not configured";
  return null;
};

function App() {
  const [lights, setLights] = useState<LightState>({
    living_room: false,
    bedroom: false,
    kitchen: false,
  });
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>(getInitialStatus);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    getInitialError,
  );

  useEffect(() => {
    // ถ้าไม่มี Firebase connection ไม่ต้อง subscribe
    if (!isFirebaseConnected || !database) {
      return;
    }

    const lightsRef = ref(database, "lights");

    const unsubscribe = onValue(
      lightsRef,
      (snapshot) => {
        setConnectionStatus("connected");
        setErrorMessage(null);
        if (snapshot.exists()) {
          setLights(snapshot.val());
        }
      },
      (error) => {
        console.error("Firebase read error:", error);
        setConnectionStatus("error");
        setErrorMessage(error.message || "Connection failed");
      },
    );

    return () => unsubscribe();
  }, []);

  const isConnected = connectionStatus === "connected";
  const isLoading = connectionStatus === "loading";

  const toggleLight = (room: string) => {
    if (!isConnected || !database) return;

    try {
      const newState = !lights[room];
      set(ref(database, `lights/${room}`), newState);
    } catch (error) {
      console.error("Firebase write error:", error);
    }
  };

  const roomNames: { [key: string]: string } = {
    living_room: "🛋️ ห้องนั่งเล่น",
    bedroom: "🛏️ ห้องนอน",
    kitchen: "🍳 ห้องครัว",
  };

  const statusConfig = useMemo(
    () => ({
      loading: { bg: "#fbbf24", text: "⏳ กำลังเชื่อมต่อ..." },
      connected: { bg: "#22c55e", text: "✅ เชื่อมต่อ Firebase แล้ว" },
      disconnected: { bg: "#6b7280", text: "⚠️ Firebase ไม่ได้ตั้งค่า" },
      error: {
        bg: "#ef4444",
        text: `❌ Firebase Error: ${errorMessage || "Unknown"}`,
      },
    }),
    [errorMessage],
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h1
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          🏠 Smart Light Control
        </h1>

        {/* Connection Status */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "10px",
            background: statusConfig[connectionStatus].bg,
            color: "white",
            fontSize: "14px",
          }}
        >
          {statusConfig[connectionStatus].text}
        </div>

        {/* Error Details - แสดงเมื่อมี error */}
        {(connectionStatus === "error" ||
          connectionStatus === "disconnected") && (
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fca5a5",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          >
            <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
              🔧 Debug Info:
            </p>
            <p style={{ margin: "2px 0" }}>• Error: {errorMessage || "None"}</p>
            <p style={{ margin: "2px 0" }}>
              • Firebase Connected: {String(isFirebaseConnected)}
            </p>
            <p style={{ margin: "2px 0" }}>
              • Database Ready: {String(!!database)}
            </p>
            <p style={{ margin: "10px 0 0 0", color: "#93c5fd" }}>
              💡 ตรวจสอบ GitHub Secrets ว่าใส่ครบและถูกต้อง
            </p>
          </div>
        )}

        {/* Light Controls */}
        {Object.entries(lights).map(([room, isOn]) => (
          <div
            key={room}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "15px",
              background: isOn
                ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                : "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
              boxShadow: isOn
                ? "0 0 20px rgba(251, 191, 36, 0.4)"
                : "0 4px 6px rgba(0, 0, 0, 0.3)",
              transition: "all 0.3s ease",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: isOn ? "#1f2937" : "#e5e7eb",
              }}
            >
              {roomNames[room] || room}
            </span>

            <button
              onClick={() => toggleLight(room)}
              disabled={!isConnected || isLoading}
              style={{
                padding: "12px 24px",
                borderRadius: "25px",
                border: "none",
                background: !isConnected
                  ? "#6b7280"
                  : isOn
                    ? "#22c55e"
                    : "#ef4444",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: isConnected ? "pointer" : "not-allowed",
                opacity: isConnected ? 1 : 0.6,
                transition: "all 0.2s ease",
                boxShadow: isConnected
                  ? "0 4px 6px rgba(0, 0, 0, 0.2)"
                  : "none",
              }}
            >
              {isOn ? "💡 ON" : "⚫ OFF"}
            </button>
          </div>
        ))}

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "12px",
            marginTop: "30px",
          }}
        >
          Smart Light System v1.0
        </p>
      </div>
    </div>
  );
}

export default App;
