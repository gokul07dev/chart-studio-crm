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
  Zap,
  Sparkles
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
  modern: ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'],
  vibrant: ['#8B5CF6', '#06D6A0', '#FFD60A', '#F72585'],
  ocean: ['#4F46E5', '#06B6D4', '#10B981', '#3B82F6'],
  sunset: ['#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'],
  nature: ['#10B981', '#059669', '#16A34A', '#65A30D'],
  professional: ['#475569', '#64748B', '#94A3B8', '#CBD5E1'],
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
    colorScheme: 'modern',
    customColors: colorSchemes.modern,
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
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              {settings.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />}
              {settings.showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                fill="url(#barGradient)"
                radius={[settings.borderRadius, settings.borderRadius, 0, 0]}
                animationDuration={settings.animated ? 1000 : 0}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'horizontalBar':
        return (
          <ResponsiveContainer {...chartProps}>
            <BarChart layout="horizontal" data={dataWithColors}>
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
              <XAxis type="number" stroke="#64748b" />
              <YAxis type="category" dataKey="name" stroke="#64748b" />
              {settings.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />}
              {settings.showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                fill="url(#barGradient)"
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
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              {settings.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />}
              {settings.showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                stackId="a"
                fill="url(#barGradient)"
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
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              {settings.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />}
              {settings.showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: 'hsl(var(--chart-1))', strokeWidth: 2, fill: 'white' }}
                animationDuration={settings.animated ? 1000 : 0}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...chartProps}>
            <AreaChart data={dataWithColors}>
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              {settings.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />}
              {settings.showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-1))" 
                fill="url(#areaGradient)"
                strokeWidth={3}
                animationDuration={settings.animated ? 1000 : 0}
              />
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer {...chartProps}>
            <ScatterChart data={scatterData}>
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
              <XAxis dataKey="x" stroke="#64748b" />
              <YAxis dataKey="y" stroke="#64748b" />
              {settings.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />}
              {settings.showLegend && <Legend />}
              <Scatter 
                dataKey="y" 
                fill="hsl(var(--chart-1))"
                animationDuration={settings.animated ? 1000 : 0}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer {...chartProps}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" stroke="#64748b" />
              <PolarRadiusAxis stroke="#64748b" />
              {settings.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />}
              <Radar
                name="Value"
                dataKey="A"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.3}
                strokeWidth={2}
                animationDuration={settings.animated ? 1000 : 0}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'treemap':
        return (
          <ResponsiveContainer {...chartProps}>
            <Treemap
              data={treemapData}
              dataKey="size"
              stroke="#fff"
            />
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer {...chartProps}>
            <ComposedChart data={dataWithColors}>
              {settings.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              {settings.showTooltip && <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />}
              {settings.showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                fill="url(#barGradient)"
                radius={[settings.borderRadius, settings.borderRadius, 0, 0]}
                animationDuration={settings.animated ? 1000 : 0}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 6 }}
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
    <div className="flex gap-6 h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      {/* Main Chart Area */}
      <div className="flex-1 animate-fade-in">
        <Card className="h-full border-0 shadow-elegant bg-white/70 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/50 bg-white/50">
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl font-display font-semibold bg-gradient-to-r from-dashboard-primary to-dashboard-secondary bg-clip-text text-transparent">
                {settings.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-dashboard-primary/10 to-dashboard-secondary/10 text-dashboard-primary border-dashboard-primary/20 hover:shadow-glow transition-all duration-300"
                >
                  <Users className="w-3 h-3 mr-1" />
                  People
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-dashboard-accent/10 to-dashboard-info/10 text-dashboard-accent border-dashboard-accent/20"
                >
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
                  className="pl-9 w-48 border-slate-200 bg-white/50 backdrop-blur-sm focus:ring-dashboard-primary/20 focus:border-dashboard-primary transition-all duration-300"
                />
              </div>
              <Button variant="outline" size="icon" className="hover:bg-dashboard-primary/5 hover:border-dashboard-primary/30 transition-all duration-300">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-dashboard-accent/5 hover:border-dashboard-accent/30 transition-all duration-300">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className={`transition-all duration-300 ${showSettings ? 'bg-dashboard-primary text-white shadow-glow' : 'hover:bg-dashboard-primary/5 hover:border-dashboard-primary/30'}`}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-6">
            <div className="h-full flex flex-col">
              {/* Chart */}
              <div className="flex-1 min-h-[400px] animate-scale-in">
                {renderChart()}
              </div>

              {/* Modern Legend */}
              {settings.showLegend && settings.chartType === 'pie' && (
                <div className="flex justify-center gap-6 mt-6 animate-slide-up">
                  {dataWithColors.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 group hover:scale-105 transition-transform duration-200">
                      <div 
                        className="w-4 h-4 rounded-lg shadow-sm ring-2 ring-white"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-foreground group-hover:text-dashboard-primary transition-colors">
                        {item.name}: <span className="font-semibold">{item.value.toFixed(1)}%</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Settings Panel */}
      {showSettings && (
        <Card className="w-80 h-full border-0 shadow-elegant bg-white/70 backdrop-blur-sm animate-slide-in-right">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/50 bg-white/50">
            <CardTitle className="flex items-center gap-2 font-display">
              <Settings className="w-5 h-5 text-dashboard-primary" />
              <span className="bg-gradient-to-r from-dashboard-primary to-dashboard-secondary bg-clip-text text-transparent">
                Widget settings
              </span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSettings(false)}
              className="hover:bg-red-50 hover:text-red-500 transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-200px)] p-6">
              <div className="space-y-6">
                {/* Chart Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-dashboard-primary" />
                    Chart type
                  </Label>
                  <Select 
                    value={settings.chartType} 
                    onValueChange={(value: any) => updateSettings({ chartType: value })}
                  >
                    <SelectTrigger className="border-slate-200 bg-white/50 backdrop-blur-sm focus:ring-dashboard-primary/20 focus:border-dashboard-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200">
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

                <Separator className="bg-slate-100" />

                {/* Title */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Chart Title</Label>
                  <Input
                    value={settings.title}
                    onChange={(e) => updateSettings({ title: e.target.value })}
                    placeholder="Enter chart title"
                    className="border-slate-200 bg-white/50 backdrop-blur-sm focus:ring-dashboard-primary/20 focus:border-dashboard-primary"
                  />
                </div>

                <Separator className="bg-slate-100" />

                {/* Color Scheme */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Color Scheme</Label>
                  <Select 
                    value={settings.colorScheme} 
                    onValueChange={(value) => updateSettings({ 
                      colorScheme: value, 
                      customColors: colorSchemes[value as keyof typeof colorSchemes] 
                    })}
                  >
                    <SelectTrigger className="border-slate-200 bg-white/50 backdrop-blur-sm focus:ring-dashboard-primary/20 focus:border-dashboard-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200">
                      {Object.keys(colorSchemes).map(scheme => (
                        <SelectItem key={scheme} value={scheme}>
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              {colorSchemes[scheme as keyof typeof colorSchemes].slice(0, 3).map((color, i) => (
                                <div 
                                  key={i}
                                  className="w-3 h-3 rounded-full ring-1 ring-white shadow-sm"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <span className="font-medium capitalize">{scheme}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-slate-100" />

                {/* Display Options */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">Display Options</Label>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-legend" className="text-sm">Show Legend</Label>
                    <Switch
                      id="show-legend"
                      checked={settings.showLegend}
                      onCheckedChange={(checked) => updateSettings({ showLegend: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-labels" className="text-sm">Show Labels</Label>
                    <Switch
                      id="show-labels"
                      checked={settings.showLabels}
                      onCheckedChange={(checked) => updateSettings({ showLabels: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-values" className="text-sm">Show Values</Label>
                    <Switch
                      id="show-values"
                      checked={settings.showValues}
                      onCheckedChange={(checked) => updateSettings({ showValues: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="animated" className="text-sm">Animated</Label>
                    <Switch
                      id="animated"
                      checked={settings.animated}
                      onCheckedChange={(checked) => updateSettings({ animated: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-grid" className="text-sm">Show Grid</Label>
                    <Switch
                      id="show-grid"
                      checked={settings.showGrid}
                      onCheckedChange={(checked) => updateSettings({ showGrid: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-tooltip" className="text-sm">Show Tooltip</Label>
                    <Switch
                      id="show-tooltip"
                      checked={settings.showTooltip}
                      onCheckedChange={(checked) => updateSettings({ showTooltip: checked })}
                    />
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                {/* Size Controls */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">Size & Style</Label>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Chart Size: {settings.size}px</Label>
                    <Slider
                      value={[settings.size]}
                      onValueChange={(value) => updateSettings({ size: value[0] })}
                      max={200}
                      min={50}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Border Radius: {settings.borderRadius}px</Label>
                    <Slider
                      value={[settings.borderRadius]}
                      onValueChange={(value) => updateSettings({ borderRadius: value[0] })}
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {(settings.chartType === 'donut') && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Inner Radius: {settings.innerRadius || 0}px</Label>
                      <Slider
                        value={[settings.innerRadius || 0]}
                        onValueChange={(value) => updateSettings({ innerRadius: value[0] })}
                        max={settings.size - 20}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
