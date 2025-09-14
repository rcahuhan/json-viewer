import React, { useState, useEffect, type JSX } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface JsonTreeProps {
  data: any;
  resetToggle?: boolean;
}

// Enhanced color palette with more distinct colors
const depthColors = [
  "#90caf9", // light blue
  "#f48fb1", // pink
  "#81c784", // light green
  "#ffb74d", // orange
  "#ba68c8", // purple
  "#4fc3f7", // cyan
  "#fff176", // yellow
  "#ff8a65", // deep orange
  "#4db6ac", // teal
  "#9575cd", // deep purple
];

// Get both key and value colors based on depth
const getDepthColors = (depth: number) => {
  const keyColor = depthColors[depth % depthColors.length];
  const valueColor = depthColors[(depth + 1) % depthColors.length];
  return { keyColor, valueColor };
};

const JsonTree: React.FC<JsonTreeProps> = ({ data, resetToggle }) => {
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (resetToggle) {
      setCollapsedNodes(new Set());
    }
  }, [resetToggle]);

  const handleToggleCollapse = (nodePath: string) => {
    setCollapsedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodePath)) {
        newSet.delete(nodePath);
      } else {
        newSet.add(nodePath);
      }
      return newSet;
    });
  };

  const renderTree = (
    value: any,
    path: string = "root",
    depth: number = 0
  ): JSX.Element => {
    if (typeof value === "object" && value !== null) {
      const isArray = Array.isArray(value);
      const { keyColor, valueColor } = getDepthColors(depth);

      return (
        <Box 
          component="ul" 
          sx={{ 
            listStyle: "none", 
            paddingLeft: "1rem", 
            m: 0,
            borderLeft: `1px solid ${keyColor}20` // Add subtle depth indicator
          }}
        >
          {Object.entries(value).map(([key, child]) => {
            const newPath = `${path}.${key}`;
            const isChildObject = typeof child === "object" && child !== null;
            const isChildCollapsed = collapsedNodes.has(newPath);
            const childIsArray = Array.isArray(child);
            const childSymbol = childIsArray ? "[]" : "{}";

            return (
              <Box
                component="li"
                key={newPath}
                sx={{ 
                  display: "flex", 
                  flexDirection: "column",
                  "&:hover": {
                    backgroundColor: `${keyColor}10` // Subtle hover effect
                  }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {isChildObject ? (
                    <IconButton
                      size="small"
                      onClick={() => handleToggleCollapse(newPath)}
                      sx={{ 
                        p: 0, 
                        color: keyColor,
                        transition: 'transform 0.2s',
                        transform: isChildCollapsed ? 'rotate(0deg)' : 'rotate(90deg)'
                      }}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  ) : (
                    <Box sx={{ width: "24px" }} />
                  )}
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ 
                      color: keyColor, 
                      fontWeight: 500,
                      textShadow: `0 0 10px ${keyColor}30`
                    }}
                  >
                    {isArray ? `[${key}]` : key}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ 
                      color: isChildObject ? valueColor : "#e0e0e0",
                      ml: 0.5,
                      fontStyle: isChildObject ? "italic" : "normal",
                      opacity: isChildObject ? 0.8 : 1
                    }}
                  >
                    {isChildObject
                      ? `: ${childSymbol}`
                      : ": " + JSON.stringify(child)}
                  </Typography>
                </Box>
                {isChildObject && !isChildCollapsed && (
                  <Box sx={{ ml: 3 }}>
                    {renderTree(child, newPath, depth + 1)}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      );
    }

    const { valueColor } = getDepthColors(depth);
    return (
      <Typography 
        variant="body2" 
        sx={{ 
          color: valueColor,
          textShadow: `0 0 10px ${valueColor}30`
        }}
      >
        {JSON.stringify(value)}
      </Typography>
    );
  };

  return (
    <Box sx={{ 
      overflowY: "auto", 
      maxHeight: "100%",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#666",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#333",
      }
    }}>
      {renderTree(data)}
    </Box>
  );
};

export default JsonTree;