//src\ErrorBoundary.tsx
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App Error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            padding: "20px",
            fontFamily: "sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              padding: "30px",
              background: "rgba(239, 68, 68, 0.2)",
              borderRadius: "15px",
              border: "2px solid #ef4444",
            }}
          >
            <h1
              style={{
                color: "#ef4444",
                textAlign: "center",
                margin: "0 0 20px 0",
              }}
            >
              ⚠️ เกิดข้อผิดพลาด
            </h1>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  color: "#fca5a5",
                  margin: "0 0 10px 0",
                  fontWeight: "bold",
                }}
              >
                Error Message:
              </p>
              <code
                style={{
                  color: "#fef2f2",
                  fontSize: "12px",
                  wordBreak: "break-word",
                  display: "block",
                }}
              >
                {this.state.error?.message || "Unknown error"}
              </code>
            </div>

            <div style={{ color: "#93c5fd", fontSize: "14px" }}>
              <p style={{ margin: "0 0 10px 0" }}>🔧 วิธีแก้ไข:</p>
              <ol style={{ margin: 0, paddingLeft: "20px" }}>
                <li>ตรวจสอบ Firebase Secrets ใน GitHub</li>
                <li>ตรวจสอบ Firebase Database Rules</li>
                <li>ตรวจสอบ Authorized Domains</li>
              </ol>
            </div>

            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              🔄 รีเฟรชหน้า
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
