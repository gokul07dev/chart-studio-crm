import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  Filter, 
  Users, 
  ChevronDown,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity,
  X,
  Download,
  RefreshCw,
  Search,
  BarChart2,
  TrendingUp,
  Target,
  Layers,
  Zap
} from 'lucide-react';
import { 
  PieChart, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  Pie,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  FunnelChart,
  Funnel,
  LabelList,
  Treemap,
  ComposedChart
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ChartSettings {
  chartType: 'pie' | 'donut' | 'bar' | 'horizontalBar' | 'stackedBar' | 'line' | 'area' | 'scatter' | 'radar' | 'funnel' | 'treemap' | 'composed';
  title: string;
  showLegend: boolean;
  showLabels: boolean;
  showValues: boolean;
  animated: boolean;
  colorScheme: string;
  customColors: string[];
  size: number;
  borderRadius: number;
  showGrid: boolean;
  showTooltip: boolean;
  innerRadius?: number;
}

interface ChartWidgetProps {
  data: ChartData[];
  onSettingsChange?: (settings: ChartSettings) => void;
}

const defaultData: ChartData[] = [
  { name: 'Won', value: 80, color: 'hsl(var(--chart-1))' },
  { name: 'Test', value: 20, color: 'hsl(var(--chart-2))' },
  { name: 'Pending', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Lost', value: 10, color: 'hsl(var(--chart-4))' },
];

const colorSchemes = {
  default: ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'],
  vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
  professional: ['#2C3E50', '#3498DB', '#E74C3C', '#F39C12'],
  pastel: ['#FFB6C1', '#DDA0DD', '#98FB98', '#F0E68C'],
  monochrome: ['#2D3748', '#4A5568', '#718096', '#A0AEC0'],
};

export const ChartWidget: React.FC<ChartWidgetProps> = ({ 
  data = defaultData, 
  onSettingsChange 
}) => {
  const [settings, setSettings] = useState<ChartSettings>({
    chartType: 'pie',
    title: 'Deal status distribution',
    showLegend: true,
    showLabels: true,
    showValues: true,
    animated: true,
    colorScheme: 'default',
    customColors: colorSchemes.default,
    size: 100,
    borderRadius: 8,
    showGrid: true,
    showTooltip: true,
    innerRadius: 0,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<string[]>([]);

  const updateSettings = (newSettings: Partial<ChartSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    onSettingsChange?.(updatedSettings);
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filters.length === 0 || filters.includes(item.name))
  );

  const dataWithColors = filteredData.map((item, index) => ({
    ...item,
    color: settings.customColors[index % settings.customColors.length]
  }));

  const renderChart = () => {
    const chartProps = {
      width: '100%',
      height: 300,
    };

    // Transform data for specific chart types
    const radarData = dataWithColors.map(item => ({
      subject: item.name,
      A: item.value,
      fullMark: 100
    }));

    const scatterData = dataWithColors.map((item, index) => ({
      x: index + 1,
      y: item.value,
      name: item.name
    }));

    const treemapData = dataWithColors.map(item => ({
      name: item.name,
      size: item.value,
      fill: item.color
    }));

    switch (settings.chartType) {
      case 'pie':
        return (
          <ResponsiveContainer {...chartProps}>
            <PieChart>
              <Pie
                data={dataWithColors}
                cx="50%"
                cy="50%"
                outerRadius={settings.size}
                dataKey="value"
                animationBegin={settings.animated ? 0 : undefined}
              >
                {dataWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {settings.showTooltip && <Tooltip />}
              {settings.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'donut':
        return (
          <ResponsiveContainer {...chartProps}>
            <PieChart>
              <Pie
                data={dataWithColors}
                cx="50%"
                cy="50%"
                innerRadius={settings.innerRadius || 40}
                outerRadius={settings.size}
                dataKey="value"
                animationBegin={settings.animated ? 0 : undefined}
              >
                {dataWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {settings.showTooltip && <Tooltip />}
              {settings.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer {...chartProps}>
            <BarChart data={dataWithColors}>
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {settings.showTooltip && <Tooltip />}
              {settings.showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                fill="hsl(var(--chart-1))"
                radius={[settings.borderRadius, settings.borderRadius, 0, 0]}
                animationDuration={settings.animated ? 1000 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'horizontalBar':
        return (
          <ResponsiveContainer {...chartProps}>
            <BarChart layout="horizontal" data={dataWithColors}>
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              {settings.showTooltip && <Tooltip />}
              {settings.showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                fill="hsl(var(--chart-2))"
                radius={[0, settings.borderRadius, settings.borderRadius, 0]}
                animationDuration={settings.animated ? 1000 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'stackedBar':
        return (
          <ResponsiveContainer {...chartProps}>
            <BarChart data={dataWithColors}>
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {settings.showTooltip && <Tooltip />}
              {settings.showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                stackId="a"
                fill="hsl(var(--chart-1))"
                radius={[settings.borderRadius, settings.borderRadius, 0, 0]}
                animationDuration={settings.animated ? 1000 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer {...chartProps}>
            <LineChart data={dataWithColors}>
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {settings.showTooltip && <Tooltip />}
              {settings.showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={3}
                animationDuration={settings.animated ? 1000 : 0}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...chartProps}>
            <AreaChart data={dataWithColors}>
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {settings.showTooltip && <Tooltip />}
              {settings.showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-1))" 
                fill="hsl(var(--chart-1))"
                fillOpacity={0.6}
                animationDuration={settings.animated ? 1000 : 0}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer {...chartProps}>
            <ScatterChart data={scatterData}>
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="x" name="Index" />
              <YAxis dataKey="y" name="Value" />
              {settings.showTooltip && <Tooltip cursor={{ strokeDasharray: '3 3' }} />}
              {settings.showLegend && <Legend />}
              <Scatter 
                dataKey="y" 
                fill="hsl(var(--chart-3))"
                animationDuration={settings.animated ? 1000 : 0}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer {...chartProps}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Values"
                dataKey="A"
                stroke="hsl(var(--chart-4))"
                fill="hsl(var(--chart-4))"
                fillOpacity={0.3}
                strokeWidth={2}
                animationDuration={settings.animated ? 1000 : 0}
              />
              {settings.showTooltip && <Tooltip />}
              {settings.showLegend && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'funnel':
        return (
          <ResponsiveContainer {...chartProps}>
            <FunnelChart>
              <Funnel
                dataKey="value"
                data={dataWithColors}
                animationBegin={settings.animated ? 0 : undefined}
              >
                {dataWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                {settings.showLabels && <LabelList position="center" fill="#fff" stroke="none" />}
              </Funnel>
              {settings.showTooltip && <Tooltip />}
              {settings.showLegend && <Legend />}
            </FunnelChart>
          </ResponsiveContainer>
        );

      case 'treemap':
        return (
          <ResponsiveContainer {...chartProps}>
            <Treemap
              data={treemapData}
              dataKey="size"
              stroke="#fff"
              fill="hsl(var(--chart-5))"
            />
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer {...chartProps}>
            <ComposedChart data={dataWithColors}>
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {settings.showTooltip && <Tooltip />}
              {settings.showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                fill="hsl(var(--chart-1))"
                radius={[settings.borderRadius, settings.borderRadius, 0, 0]}
                animationDuration={settings.animated ? 1000 : 0}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={3}
                animationDuration={settings.animated ? 1000 : 0}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6 h-screen bg-background p-6">
      {/* Main Chart Area */}
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl font-bold">{settings.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-dashboard-primary/20 text-dashboard-primary">
                  <Users className="w-3 h-3 mr-1" />
                  People
                </Badge>
                <Badge variant="secondary" className="bg-dashboard-secondary/20 text-dashboard-secondary">
                  <Filter className="w-3 h-3 mr-1" />
                  Filter
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Type to filter"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1">
            <div className="h-full flex flex-col">
              {/* Chart */}
              <div className="flex-1 min-h-[400px]">
                {renderChart()}
              </div>

              {/* Legend */}
              {settings.showLegend && settings.chartType === 'pie' && (
                <div className="flex justify-center gap-6 mt-6">
                  {dataWithColors.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-foreground">
                        {item.name}: {item.value.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="w-80 h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Widget settings
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSettings(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6">
                {/* Chart Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Chart type</Label>
                  <Select 
                    value={settings.chartType} 
                    onValueChange={(value: any) => updateSettings({ chartType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pie">
                        <div className="flex items-center gap-2">
                          <PieChartIcon className="w-4 h-4" />
                          Pie Chart
                        </div>
                      </SelectItem>
                      <SelectItem value="donut">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Donut Chart
                        </div>
                      </SelectItem>
                      <SelectItem value="bar">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Bar Chart
                        </div>
                      </SelectItem>
                      <SelectItem value="horizontalBar">
                        <div className="flex items-center gap-2">
                          <BarChart2 className="w-4 h-4" />
                          Horizontal Bar
                        </div>
                      </SelectItem>
                      <SelectItem value="stackedBar">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Stacked Bar
                        </div>
                      </SelectItem>
                      <SelectItem value="line">
                        <div className="flex items-center gap-2">
                          <LineChartIcon className="w-4 h-4" />
                          Line Chart
                        </div>
                      </SelectItem>
                      <SelectItem value="area">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Area Chart
                        </div>
                      </SelectItem>
                      <SelectItem value="scatter">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Scatter Plot
                        </div>
                      </SelectItem>
                      <SelectItem value="radar">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Radar Chart
                        </div>
                      </SelectItem>
                      <SelectItem value="funnel">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Funnel Chart
                        </div>
                      </SelectItem>
                      <SelectItem value="treemap">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Treemap
                        </div>
                      </SelectItem>
                      <SelectItem value="composed">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Combined Chart
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Title */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Chart Title</Label>
                  <Input
                    value={settings.title}
                    onChange={(e) => updateSettings({ title: e.target.value })}
                    placeholder="Enter chart title"
                  />
                </div>

                <Separator />

                {/* Color Scheme */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Color Scheme</Label>
                  <Select 
                    value={settings.colorScheme} 
                    onValueChange={(value) => updateSettings({ 
                      colorScheme: value, 
                      customColors: colorSchemes[value as keyof typeof colorSchemes] 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(colorSchemes).map(scheme => (
                        <SelectItem key={scheme} value={scheme}>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {colorSchemes[scheme as keyof typeof colorSchemes].slice(0, 3).map((color, i) => (
                                <div 
                                  key={i}
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Display Options */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Display Options</Label>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="legend" className="text-sm">Show Legend</Label>
                    <Switch
                      id="legend"
                      checked={settings.showLegend}
                      onCheckedChange={(checked) => updateSettings({ showLegend: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="labels" className="text-sm">Show Labels</Label>
                    <Switch
                      id="labels"
                      checked={settings.showLabels}
                      onCheckedChange={(checked) => updateSettings({ showLabels: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="values" className="text-sm">Show Values</Label>
                    <Switch
                      id="values"
                      checked={settings.showValues}
                      onCheckedChange={(checked) => updateSettings({ showValues: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="animated" className="text-sm">Animation</Label>
                    <Switch
                      id="animated"
                      checked={settings.animated}
                      onCheckedChange={(checked) => updateSettings({ animated: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid" className="text-sm">Show Grid</Label>
                    <Switch
                      id="grid"
                      checked={settings.showGrid}
                      onCheckedChange={(checked) => updateSettings({ showGrid: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="tooltip" className="text-sm">Show Tooltip</Label>
                    <Switch
                      id="tooltip"
                      checked={settings.showTooltip}
                      onCheckedChange={(checked) => updateSettings({ showTooltip: checked })}
                    />
                  </div>
                </div>

                <Separator />

                {/* Size Controls */}
                {settings.chartType === 'pie' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Chart Size</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Size</span>
                        <span className="text-sm font-medium">{settings.size}px</span>
                      </div>
                      <Slider
                        value={[settings.size]}
                        onValueChange={([value]) => updateSettings({ size: value })}
                        max={150}
                        min={50}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Inner Radius for Donut Chart */}
                {settings.chartType === 'donut' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Inner Radius</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Inner Radius</span>
                        <span className="text-sm font-medium">{settings.innerRadius}px</span>
                      </div>
                      <Slider
                        value={[settings.innerRadius || 40]}
                        onValueChange={([value]) => updateSettings({ innerRadius: value })}
                        max={80}
                        min={20}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                <Separator />

                {/* Border Radius */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Border Radius</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Radius</span>
                      <span className="text-sm font-medium">{settings.borderRadius}px</span>
                    </div>
                    <Slider
                      value={[settings.borderRadius]}
                      onValueChange={([value]) => updateSettings({ borderRadius: value })}
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};