import React, { useState, useEffect, type JSX } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface JsonTreeProps {
  data: any;
  resetToggle?: boolean; // when true, collapse all nodes
}

const JsonTree: React.FC<JsonTreeProps> = ({ data, resetToggle }) => {
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  // Collapse all nodes on resetToggle
  useEffect(() => {
    if (resetToggle) {
      setCollapsedNodes(new Set()); // collapse all nodes
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

  const renderTree = (value: any, path: string = "root"): JSX.Element => {
    if (typeof value === "object" && value !== null) {
      const isArray = Array.isArray(value);

      return (
        <Box component="ul" sx={{ listStyle: "none", paddingLeft: "1rem", m: 0 }}>
          {Object.entries(value).map(([key, child]) => {
            const newPath = `${path}.${key}`;
            const isChildObject = typeof child === "object" && child !== null;
            const isChildCollapsed = collapsedNodes.has(newPath);

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
                      onClick={() => handleToggleCollapse(newPath)}
                      sx={{ p: 0, color: "#e0e0e0" }}
                    >
                      {isChildCollapsed ? (
                        <KeyboardArrowRightIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  ) : (
                    <Box sx={{ width: "24px" }} />
                  )}
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ color: "#90caf9" }}
                  >
                    {isArray ? `[${key}]` : key}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ color: "#e0e0e0", ml: 0.5 }}
                  >
                    {isChildObject ? ":" : ": " + JSON.stringify(child)}
                  </Typography>
                </Box>
                {isChildObject && !isChildCollapsed && (
                  <Box sx={{ ml: 3 }}>{renderTree(child, newPath)}</Box>
                )}
              </Box>
            );
          })}
        </Box>
      );
    }

    return <Typography variant="body2">{JSON.stringify(value)}</Typography>;
  };

  return (
    <Box sx={{ overflowY: "auto", maxHeight: "100%" }}>
      {renderTree(data)}
    </Box>
  );
};

export default JsonTree;
