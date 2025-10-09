import { useState, useRef } from "react";
import {
  Box,
  Input,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  LinearProgress,
} from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

export function ChatInterface({ calculationData, aiResponse }) {
  const { mode } = useColorScheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick question suggestions
  const quickQuestions = [
    "Why is this wrapper beneficial for me?",
    "How much tax will I save annually?",
    "What's my actual net return?",
    "Should I choose this wrapper?",
    "What are the risks of this investment?",
    "How does this compare to unwrapped investing?",
  ];

  const sendMessage = async (questionText = null) => {
    const messageText = questionText || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage = {
      type: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Clear input if it was typed (not from quick question)
    if (!questionText) setInput("");

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        question: messageText,
        calculationData,
        aiResponse,
        conversationHistory: messages,
      });

      // Add AI response
      const aiMessage = {
        type: "ai",
        text: response.data.answer,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        type: "ai",
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        my: 3,
        maxHeight: "500px",
        display: "flex",
        flexDirection: "column",
        backgroundColor:
          mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#f8fafc",
        borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.2)" : undefined,
        borderRadius: "4px",
      }}
    >
      <CardContent
        sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 2,
            fontSize: "1.25rem",
          }}
        >
          <SmartToyIcon
            sx={{ color: mode === "dark" ? "#7db3e8" : "#2374bb" }}
          />
          <Typography
            level="h4"
            sx={{ color: mode === "dark" ? "#7db3e8" : "#2374bb" }}
          >
            SanYield
          </Typography>
        </Box>

        {/* Quick Questions */}
        {messages.length === 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              level="body-md"
              sx={{
                mb: 1,
                opacity: 0.7,
                textAlign: "center",
                color: mode === "dark" ? "#e0e0e0" : "#666",
              }}
            >
              Ask me anything about your investment calculation
            </Typography>
          </Box>
        )}

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mb: 2,
            minHeight: "200px",
            maxHeight: "300px",
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: msg.type === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              {/* Avatar */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    msg.type === "user"
                      ? mode === "dark"
                        ? "#2374bb"
                        : "#2374bb"
                      : mode === "dark"
                      ? "#444"
                      : "#e0e0e0",
                  flexShrink: 0,
                }}
              >
                {msg.type === "user" ? (
                  <PersonIcon sx={{ fontSize: 16, color: "white" }} />
                ) : (
                  <SmartToyIcon
                    sx={{
                      fontSize: 16,
                      color: mode === "dark" ? "#7db3e8" : "#666",
                    }}
                  />
                )}
              </Box>

              {/* Message */}
              <Box
                sx={{
                  maxWidth: "75%",
                  backgroundColor: msg.type === "user" ? "#0075c9" : "white",
                  p: 1.5,
                  borderRadius: "12px",
                  border: msg.type === "ai" ? "1px solid" : "none",
                  borderColor:
                    mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "#e0e0e0",
                }}
              >
                <Typography
                  level="body-md"
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.4,
                    color: msg.type === "user" ? "#e0e0e0" : "#333",
                  }}
                >
                  {msg.text}
                </Typography>
                <Typography
                  level="body-xs"
                  sx={{
                    mt: 0.5,
                    opacity: 0.7,
                    fontSize: "0.7rem",
                    color: msg.type === "user" ? "#d8d8d8ff" : "",
                  }}
                >
                  {msg.timestamp}
                </Typography>
              </Box>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <SmartToyIcon sx={{ fontSize: 16, opacity: 0.5 }} />
              <LinearProgress sx={{ flex: 1 }} />
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your investment calculation..."
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            maxRows={3}
            sx={{ flex: 1 }}
          />
          <IconButton
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            color="primary"
            variant="solid"
          >
            <SendIcon />
          </IconButton>
        </Box>

        {/* Quick Questions */}
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {quickQuestions.map((q, index) => (
              <Box
                key={index}
                onClick={() => sendMessage(q)}
                sx={{
                  padding: "8px 12px",
                  backgroundColor:
                    mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "#f0f4f8",
                  border: "1px solid",
                  borderColor:
                    mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "#e0e4e9",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor:
                      mode === "dark" ? "rgba(255, 255, 255, 0.15)" : "#e0f2fe",
                    borderColor: mode === "dark" ? "#7db3e8" : "#2374bb",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Typography
                  level="body-sm"
                  sx={{
                    fontSize: "0.7rem",
                    color: mode === "dark" ? "#e0e0e0" : "#555",
                    textAlign: "center",
                    "&:hover": {
                      color: mode === "dark" ? "#7db3e8" : "#2374bb",
                    },
                  }}
                >
                  {q}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
