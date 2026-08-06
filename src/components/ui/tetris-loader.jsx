import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TETRIS_PIECES = [
  { shape: [[1, 1, 1, 1]], color: "bg-cyan-100" },
  { shape: [[1, 1], [1, 1]], color: "bg-white" },
  { shape: [[0, 1, 0], [1, 1, 1]], color: "bg-cyan-200" },
  { shape: [[1, 0], [1, 0], [1, 1]], color: "bg-purple-300" },
  { shape: [[0, 1, 1], [1, 1, 0]], color: "bg-emerald-300" },
  { shape: [[1, 1, 0], [0, 1, 1]], color: "bg-orange-300" },
  { shape: [[0, 1], [0, 1], [1, 1]], color: "bg-pink-300" },
];

const SIZE_CONFIG = {
  sm: { cellSize: "h-2 w-2", gridWidth: 8, gridHeight: 16, padding: "p-0.5" },
  md: { cellSize: "h-3 w-3", gridWidth: 10, gridHeight: 20, padding: "p-1" },
  lg: { cellSize: "h-4 w-4", gridWidth: 10, gridHeight: 20, padding: "p-1.5" },
};

const SPEED_CONFIG = {
  slow: 150,
  normal: 80,
  fast: 40,
};

const createEmptyGrid = (height, width) =>
  Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ filled: false, color: "" }))
  );

export default function TetrisLoading({
  size = "md",
  speed = "normal",
  showLoadingText = true,
  loadingText = "Loading...",
  className = "",
}) {
  const config = useMemo(() => SIZE_CONFIG[size] || SIZE_CONFIG.md, [size]);
  const fallSpeed = SPEED_CONFIG[speed] || SPEED_CONFIG.normal;
  const [grid, setGrid] = useState(() => createEmptyGrid(config.gridHeight, config.gridWidth));
  const [fallingPiece, setFallingPiece] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const frameRef = useRef(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    setGrid(createEmptyGrid(config.gridHeight, config.gridWidth));
    setFallingPiece(null);
  }, [config.gridHeight, config.gridWidth]);

  const rotateShape = useCallback((shape) => {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = Array.from({ length: cols }, () => Array.from({ length: rows }, () => 0));

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        rotated[col][rows - 1 - row] = shape[row][col];
      }
    }

    return rotated;
  }, []);

  const createNewPiece = useCallback(() => {
    const pieceData = TETRIS_PIECES[Math.floor(Math.random() * TETRIS_PIECES.length)];
    let shape = pieceData.shape;
    const rotations = Math.floor(Math.random() * 4);

    for (let index = 0; index < rotations; index += 1) {
      shape = rotateShape(shape);
    }

    const maxX = config.gridWidth - shape[0].length;
    const x = Math.floor(Math.random() * (maxX + 1));

    return {
      shape,
      color: pieceData.color,
      x,
      y: -shape.length,
      id: Math.random().toString(36).slice(2, 11),
    };
  }, [config.gridWidth, rotateShape]);

  const canPlacePiece = useCallback(
    (piece, nextX, nextY) => {
      for (let row = 0; row < piece.shape.length; row += 1) {
        for (let col = 0; col < piece.shape[row].length; col += 1) {
          if (!piece.shape[row][col]) continue;

          const gridX = nextX + col;
          const gridY = nextY + row;

          if (gridX < 0 || gridX >= config.gridWidth || gridY >= config.gridHeight) return false;
          if (gridY >= 0 && grid[gridY][gridX].filled) return false;
        }
      }

      return true;
    },
    [config.gridHeight, config.gridWidth, grid]
  );

  const placePiece = useCallback(
    (piece) => {
      setGrid((currentGrid) => {
        const nextGrid = currentGrid.map((row) => row.map((cell) => ({ ...cell })));

        for (let row = 0; row < piece.shape.length; row += 1) {
          for (let col = 0; col < piece.shape[row].length; col += 1) {
            if (!piece.shape[row][col]) continue;

            const gridX = piece.x + col;
            const gridY = piece.y + row;

            if (gridY >= 0 && gridY < config.gridHeight && gridX >= 0 && gridX < config.gridWidth) {
              nextGrid[gridY][gridX] = { filled: true, color: piece.color };
            }
          }
        }

        return nextGrid;
      });
    },
    [config.gridHeight, config.gridWidth]
  );

  const clearFullLines = useCallback(() => {
    setGrid((currentGrid) => {
      const linesToClear = [];

      currentGrid.forEach((row, index) => {
        if (row.every((cell) => cell.filled)) linesToClear.push(index);
      });

      if (!linesToClear.length) return currentGrid;

      setIsClearing(true);
      const markedGrid = currentGrid.map((row, rowIndex) => {
        if (!linesToClear.includes(rowIndex)) return row;
        return row.map((cell) => ({ ...cell, color: "animate-pulse bg-white opacity-60" }));
      });

      window.setTimeout(() => {
        setGrid((latestGrid) => {
          const filteredGrid = latestGrid.filter((_, index) => !linesToClear.includes(index));
          const emptyRows = createEmptyGrid(linesToClear.length, config.gridWidth);
          setIsClearing(false);
          return [...emptyRows, ...filteredGrid];
        });
      }, 200);

      return markedGrid;
    });
  }, [config.gridWidth]);

  const checkAndReset = useCallback(() => {
    const topRows = grid.slice(0, 4);
    const needsReset = topRows.some((row) => row.filter((cell) => cell.filled).length > config.gridWidth * 0.7);

    if (!needsReset) return false;

    setIsClearing(true);
    window.setTimeout(() => {
      setGrid(createEmptyGrid(config.gridHeight, config.gridWidth));
      setFallingPiece(null);
      setIsClearing(false);
    }, 500);

    return true;
  }, [config.gridHeight, config.gridWidth, grid]);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) return undefined;

    const gameLoop = (timestamp) => {
      if (timestamp - lastUpdateRef.current >= fallSpeed) {
        lastUpdateRef.current = timestamp;

        if (!isClearing && !checkAndReset()) {
          setFallingPiece((currentPiece) => {
            if (!currentPiece) return createNewPiece();

            const nextY = currentPiece.y + 1;

            if (canPlacePiece(currentPiece, currentPiece.x, nextY)) {
              return { ...currentPiece, y: nextY };
            }

            placePiece(currentPiece);
            window.setTimeout(clearFullLines, 50);
            return createNewPiece();
          });
        }
      }

      frameRef.current = window.requestAnimationFrame(gameLoop);
    };

    frameRef.current = window.requestAnimationFrame(gameLoop);

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [canPlacePiece, checkAndReset, clearFullLines, createNewPiece, fallSpeed, isClearing, placePiece]);

  const displayGrid = useMemo(() => {
    const nextGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    if (fallingPiece && !isClearing) {
      for (let row = 0; row < fallingPiece.shape.length; row += 1) {
        for (let col = 0; col < fallingPiece.shape[row].length; col += 1) {
          if (!fallingPiece.shape[row][col]) continue;

          const gridX = fallingPiece.x + col;
          const gridY = fallingPiece.y + row;

          if (gridY >= 0 && gridY < config.gridHeight && gridX >= 0 && gridX < config.gridWidth) {
            nextGrid[gridY][gridX] = { filled: true, color: fallingPiece.color };
          }
        }
      }
    }

    return nextGrid;
  }, [config.gridHeight, config.gridWidth, fallingPiece, grid, isClearing]);

  return (
    <div className={className} aria-live="polite" aria-busy="true">
      <div className="mb-5 flex justify-center">
        <div className={`border-2 border-cyan-100/70 bg-[#090806] ${config.padding} shadow-[0_18px_45px_rgba(0,0,0,0.35)]`}>
          {displayGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${config.cellSize} border border-white/10 transition-all duration-100 ${
                    cell.filled ? `${cell.color} scale-100` : "scale-95 bg-[#16120d]"
                  } ${isClearing && rowIndex < 4 ? "animate-pulse" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {showLoadingText && (
        <p className="text-center font-mono text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/78">
          {loadingText}
        </p>
      )}
    </div>
  );
}
