
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface MathLabProps {
  experimentId: string;
}

const MathLab: React.FC<MathLabProps> = ({ experimentId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Graphing tool state
  const [equation, setEquation] = useState('x^2');
  const [scale, setScale] = useState([20]);
  const [functions, setFunctions] = useState<string[]>(['x^2']);

  // Geometry explorer state
  const [selectedShape, setSelectedShape] = useState('circle');
  const [shapeSize, setShapeSize] = useState([50]);
  const [rotation, setRotation] = useState([0]);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    if (experimentId === 'graphing-tool') {
      drawGraph();
    } else if (experimentId === 'geometry-explorer') {
      drawGeometry();
    }
  }, [equation, scale, functions, selectedShape, shapeSize, rotation, showGrid]);

  const evaluateFunction = (expr: string, x: number): number => {
    try {
      // Simple expression evaluator for basic math functions
      let result = expr
        .replace(/x/g, x.toString())
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt');

      // Use Function constructor instead of eval for security
      return new Function('x', `return ${result}`)(x);
    } catch {
      return NaN;
    }
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const gridSize = scale[0];

    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    for (let i = -10; i <= 10; i++) {
      if (i !== 0) {
        const x = centerX + i * gridSize;
        const y = centerY + i * gridSize;

        if (x > 0 && x < canvas.width) {
          ctx.fillText(i.toString(), x - 5, centerY + 15);
        }
        if (y > 0 && y < canvas.height) {
          ctx.fillText((-i).toString(), centerX + 5, y + 5);
        }
      }
    }

    // Draw functions
    const colors = ['#4A90E2', '#50C878', '#FF6B6B', '#FFD93D'];
    functions.forEach((func, index) => {
      ctx.strokeStyle = colors[index % colors.length];
      ctx.lineWidth = 3;
      ctx.beginPath();

      let firstPoint = true;
      for (let pixelX = 0; pixelX < canvas.width; pixelX += 2) {
        const mathX = (pixelX - centerX) / gridSize;
        const mathY = evaluateFunction(func, mathX);

        if (!isNaN(mathY) && isFinite(mathY)) {
          const pixelY = centerY - mathY * gridSize;

          if (pixelY >= 0 && pixelY <= canvas.height) {
            if (firstPoint) {
              ctx.moveTo(pixelX, pixelY);
              firstPoint = false;
            } else {
              ctx.lineTo(pixelX, pixelY);
            }
          }
        }
      }
      ctx.stroke();
    });
  };

  const drawGeometry = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Apply rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation[0] * Math.PI) / 180);

    // Draw shape
    ctx.strokeStyle = '#4A90E2';
    ctx.fillStyle = 'rgba(74, 144, 226, 0.2)';
    ctx.lineWidth = 3;

    if (selectedShape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, shapeSize[0], 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (selectedShape === 'square') {
      ctx.fillRect(-shapeSize[0] / 2, -shapeSize[0] / 2, shapeSize[0], shapeSize[0]);
      ctx.strokeRect(-shapeSize[0] / 2, -shapeSize[0] / 2, shapeSize[0], shapeSize[0]);
    } else if (selectedShape === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(0, -shapeSize[0] / 2);
      ctx.lineTo(-shapeSize[0] / 2, shapeSize[0] / 2);
      ctx.lineTo(shapeSize[0] / 2, shapeSize[0] / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (selectedShape === 'hexagon') {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = shapeSize[0] * Math.cos(angle);
        const y = shapeSize[0] * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();

    // Draw measurements
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    if (selectedShape === 'circle') {
      ctx.fillText(`Radius: ${shapeSize[0]}px`, 10, 20);
      ctx.fillText(`Area: ${(Math.PI * shapeSize[0] * shapeSize[0]).toFixed(2)}px²`, 10, 35);
      ctx.fillText(`Circumference: ${(2 * Math.PI * shapeSize[0]).toFixed(2)}px`, 10, 50);
    } else if (selectedShape === 'square') {
      ctx.fillText(`Side: ${shapeSize[0]}px`, 10, 20);
      ctx.fillText(`Area: ${(shapeSize[0] * shapeSize[0]).toFixed(2)}px²`, 10, 35);
      ctx.fillText(`Perimeter: ${(4 * shapeSize[0]).toFixed(2)}px`, 10, 50);
    }
  };

  const addFunction = () => {
    if (equation && !functions.includes(equation)) {
      setFunctions([...functions, equation]);
    }
  };

  if (experimentId === 'graphing-tool') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Function Graphing Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter function (e.g., x^2, sin(x))"
                    value={equation}
                    onChange={(e) => setEquation(e.target.value)}
                  />
                  <Button onClick={addFunction}>Add</Button>
                </div>

                <div>
                  <label className="text-sm font-medium">Scale</label>
                  <Slider
                    value={scale}
                    onValueChange={setScale}
                    max={50}
                    min={10}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {scale[0]}px per unit
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Active Functions</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {functions.map((func, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <Badge variant="outline">f(x) = {func}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setFunctions(functions.filter((_, i) => i !== index))}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <h4 className="font-medium">Supported Functions</h4>
                  <div className="text-xs text-muted-foreground">
                    <div>• Basic: x^2, x^3, 2*x+1</div>
                    <div>• Trig: sin(x), cos(x), tan(x)</div>
                    <div>• Other: sqrt(x), log(x)</div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="border bg-white rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (experimentId === 'geometry-explorer') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Geometry Explorer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Shape</label>
                  <Select value={selectedShape} onValueChange={setSelectedShape}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="triangle">Triangle</SelectItem>
                      <SelectItem value="hexagon">Hexagon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Size</label>
                  <Slider
                    value={shapeSize}
                    onValueChange={setShapeSize}
                    max={100}
                    min={20}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {shapeSize[0]}px
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Rotation</label>
                  <Slider
                    value={rotation}
                    onValueChange={setRotation}
                    max={360}
                    min={0}
                    step={15}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {rotation[0]}°
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                  />
                  <label className="text-sm font-medium">Show Grid</label>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Shape Properties</h4>
                  <div className="text-sm space-y-1">
                    <div>Size: {shapeSize[0]}px</div>
                    <div>Rotation: {rotation[0]}°</div>
                    <div>Type: {selectedShape}</div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="border bg-white rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <div>Experiment not found</div>;
};

export default MathLab;
