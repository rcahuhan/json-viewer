// src/App.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  Typography,
  TextField,
  Divider,
  IconButton,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type Mode = "text" | "tree";

interface JsonTreeProps {
  data: any;
  path?: string;
  collapsedNodes?: Set<string>;
  toggleNode?: (path: string) => void;
  resetToggle?: boolean;
}

const JsonTree: React.FC<JsonTreeProps> = ({
  data,
  path = "root",
  collapsedNodes,
  toggleNode,
  resetToggle,
}) => {
  const isObject = typeof data === "object" && data !== null;
  const isArray = Array.isArray(data);

  if (!isObject) {
    return (
      <Typography variant="body2" component="span" sx={{ color: "#e0e0e0" }}>
        {JSON.stringify(data)}
      </Typography>
    );
  }

  const keys = Object.keys(data);

  return (
    <Box
      component="ul"
      sx={{ listStyle: "none", paddingLeft: "1rem", m: 0 }}
    >
      {keys.map((key) => {
        const newPath = `${path}.${key}`;
        const isChildObject = typeof data[key] === "object" && data[key] !== null;
        const isCollapsed = collapsedNodes?.has(newPath) ?? true;

        return (
          <Box
            component="li"
            key={newPath}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isChildObject ? (
                <IconButton
                  size="small"
                  onClick={() => toggleNode && toggleNode(newPath)}
                  sx={{ p: 0, color: "#90caf9" }}
                >
                  {isCollapsed ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              ) : (
                <Box sx={{ width: "24px" }} /> // spacer
              )}
              <Typography variant="body2" component="span" sx={{ color: "#90caf9" }}>
                {isArray ? `[${key}]` : key}
              </Typography>
              <Typography
                variant="body2"
                component="span"
                sx={{ color: "#e0e0e0", ml: 0.5 }}
              >
                {isChildObject ? ":" : ": " + JSON.stringify(data[key])}
              </Typography>
            </Box>
            {isChildObject && !isCollapsed && (
              <Box sx={{ ml: 3 }}>
                <JsonTree
                  data={data[key]}
                  path={newPath}
                  collapsedNodes={collapsedNodes}
                  toggleNode={toggleNode}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [mode, setMode] = useState<Mode>("text");
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>("");

  const clearError = () => setError("");

  const handleFormat = () => {
    clearError();
    try {
      const parsed = JSON.parse(text);
      setText(JSON.stringify(parsed, null, 2));
      setMode("text");
    } catch {
      setError("❌ Not valid JSON");
    }
  };

  const handleMinify = () => {
    clearError();
    try {
      const parsed = JSON.parse(text);
      setText(JSON.stringify(parsed));
      setMode("text");
    } catch {
      setError("❌ Not valid JSON");
    }
  };

  const handleTreeMode = () => {
    clearError();
    try {
      JSON.parse(text);
      setMode("tree");
      // Collapse all nodes initially
      const allKeys = new Set<string>();
      const traverse = (obj: any, path: string) => {
        if (typeof obj === "object" && obj !== null) {
          Object.keys(obj).forEach((key) => {
            const newPath = `${path}.${key}`;
            allKeys.add(newPath);
            traverse(obj[key], newPath);
          });
        }
      };
      traverse(JSON.parse(text), "root");
      setCollapsedNodes(allKeys);
    } catch {
      setError("❌ Not valid JSON");
    }
  };

  const handleTextMode = () => {
    clearError();
    setMode("text");
  };

  const toggleNode = (path: string) => {
    setCollapsedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) newSet.delete(path);
      else newSet.add(path);
      return newSet;
    });
  };

  return (
    <Box display="flex" height="100vh" bgcolor="#121212">
      {/* Sidebar */}
      <Box
        sx={{
          flexShrink: 0,
          flexBasis: 220,
          bgcolor: "#1f1f1f",
          color: "white",
          p: 2,
          boxShadow: 2,
        }}
        display="flex"
        flexDirection="column"
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          ⚡ JSON Tools
        </Typography>
        <Divider sx={{ borderColor: "#333", mb: 2 }} />
        <List>
          <ListItem>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#42a5f5", "&:hover": { bgcolor: "#1e88e5" } }}
              onClick={handleFormat}
            >
              ✨ Format
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#66bb6a", "&:hover": { bgcolor: "#43a047" } }}
              onClick={handleMinify}
            >
              📦 Minify
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#ab47bc", "&:hover": { bgcolor: "#8e24aa" } }}
              onClick={handleTreeMode}
            >
              🌳 Tree Mode
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#ef5350", "&:hover": { bgcolor: "#d32f2f" } }}
              onClick={handleTextMode}
            >
              📝 Text Mode
            </Button>
          </ListItem>
        </List>
      </Box>

      {/* Content Area */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        p={2}
        // CRITICAL FIX: The height must be explicitly set on this container
        height="100vh" // This line is the key. It sets a fixed height for the content area.
      >
        {error && (
          <Box
            sx={{
              bgcolor: "#d32f2f",
              color: "white",
              p: 1,
              mb: 2,
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        {mode === "text" ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              position: "relative",
              bgcolor: "#1e1e1e",
              borderRadius: 2,
              overflow: "hidden" // Add this to contain the TextField
            }}
          >
            <TextField
              multiline
              fullWidth
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                clearError();
              }}
              placeholder="Paste or type your JSON here..."
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                "& .MuiInputBase-root": {
                  height: "100%",
                  padding: 2,
                  color: "#e0e0e0",
                },
                "& .MuiInputBase-input": {
                  height: "100% !important",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  color: "#e0e0e0",
                  overflowY: "auto !important",
                },
                // Scrollbar styling
                "& .MuiInputBase-input::-webkit-scrollbar": {
                  width: "8px",
                },
                "& .MuiInputBase-input::-webkit-scrollbar-thumb": {
                  backgroundColor: "#666",
                  borderRadius: "4px",
                },
                "& .MuiInputBase-input::-webkit-scrollbar-track": {
                  backgroundColor: "#333",
                },
              }}
            />
          </Box>
        ) : (
          <Box
            flex={1}
            // Add height property here as well for consistency
            height="100%"
            sx={{
              overflowY: "auto",
              bgcolor: "#1e1e1e",
              color: "#e0e0e0",
              p: 2,
              borderRadius: 2,
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            {text && (
              <JsonTree
                data={JSON.parse(text)}
                collapsedNodes={collapsedNodes}
                toggleNode={toggleNode}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default App;