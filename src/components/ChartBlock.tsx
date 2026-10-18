'use client';

import React from 'react';
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LabelList,
} from 'recharts';

type ChartSection = {
    chartType: 'line' | 'bar' | 'grouped_bar';
    title?: string;
    content?: string;
    yLabel?: string;
    color?: string;
    data: Record<string, any>[];
    legend?: string[];
};

const COLORS = {
    ink: '#101828',
    accent: '#2E4A85',
    accentLight: '#B8C7E1',
    muted: '#5A6474',
    gridLine: '#DCE2EC',
};

function CustomTooltipLine({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
        <div className="bg-paper border border-line rounded-lg px-4 py-3 shadow-lg">
            <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted mb-1">{label}</div>
            <div className="text-lg font-serif font-semibold text-ink">{d.value}%</div>
        </div>
    );
}

function CustomTooltipBar({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-paper border border-line rounded-lg px-4 py-3 shadow-lg">
            <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted mb-1">{label}</div>
            {payload.map((entry: any, i: number) => (
                <div key={i} className="flex items-center gap-2 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.fill || entry.color }} />
                    <span className="text-[15px] text-muted">{entry.name}:</span>
                    <span className="text-[15px] font-semibold text-ink">{entry.value}%</span>
                </div>
            ))}
        </div>
    );
}

function CustomTooltipGrouped({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const before = payload.find((p: any) => p.dataKey === 'before');
    const after = payload.find((p: any) => p.dataKey === 'after');
    const change = before && after ? after.value - before.value : null;
    return (
        <div className="bg-paper border border-line rounded-lg px-4 py-3 shadow-lg">
            <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted mb-2">{label}</div>
            {payload.map((entry: any, i: number) => (
                <div key={i} className="flex items-center gap-2 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.fill || entry.color }} />
                    <span className="text-[15px] text-muted">{entry.name}:</span>
                    <span className="text-[15px] font-semibold text-ink">{entry.value}%</span>
                </div>
            ))}
            {change !== null && (
                <div className="mt-2 pt-2 border-t border-line text-[15px] font-medium" style={{ color: change >= 0 ? '#16a34a' : '#dc2626' }}>
                    {change >= 0 ? '+' : ''}{change}% change
                </div>
            )}
        </div>
    );
}

// Custom label for first and last points on line charts
function EndpointLabel({ x, y, value, index, dataLength }: any) {
    if (index !== 0 && index !== dataLength - 1) return null;
    const isFirst = index === 0;
    return (
        <text
            x={x}
            y={y - 16}
            textAnchor={isFirst ? 'start' : 'end'}
            fill={COLORS.ink}
            fontSize={14}
            fontWeight={700}
        >
            {value}%
        </text>
    );
}

export default function ChartBlock({ section }: { section: ChartSection }) {
    const height = 360;

    const commonAxisProps = {
        tick: { fontSize: 13, fill: COLORS.muted, fontWeight: 500 },
        axisLine: { stroke: COLORS.gridLine },
        tickLine: false,
    };

    const dataLength = section.data.length;

    const renderChart = () => {
        switch (section.chartType) {
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <LineChart data={section.data} margin={{ top: 28, right: 30, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridLine} />
                            <XAxis dataKey="label" {...commonAxisProps} />
                            <YAxis {...commonAxisProps} />
                            <Tooltip content={<CustomTooltipLine />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={section.color || COLORS.accent}
                                strokeWidth={4}
                                dot={{ r: 5, fill: section.color || COLORS.accent, strokeWidth: 2.5, stroke: '#fff' }}
                                activeDot={{ r: 8, strokeWidth: 3, stroke: '#fff' }}
                            >
                                <LabelList
                                    dataKey="value"
                                    content={(props: any) => (
                                        <EndpointLabel {...props} dataLength={dataLength} />
                                    )}
                                />
                            </Line>
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart data={section.data} margin={{ top: 10, right: 20, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridLine} vertical={false} />
                            <XAxis dataKey="label" {...commonAxisProps} />
                            <YAxis {...commonAxisProps} />
                            <Tooltip content={<CustomTooltipBar />} cursor={{ fill: 'rgba(46, 74, 133, 0.06)' }} />
                            <Bar
                                dataKey="value"
                                fill={section.color || COLORS.accent}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={52}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'grouped_bar':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart data={section.data} margin={{ top: 10, right: 20, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridLine} vertical={false} />
                            <XAxis dataKey="label" {...commonAxisProps} />
                            <YAxis {...commonAxisProps} />
                            <Tooltip content={<CustomTooltipGrouped />} cursor={{ fill: 'rgba(46, 74, 133, 0.06)' }} />
                            <Legend
                                wrapperStyle={{ fontSize: '13px', fontWeight: 500, paddingTop: '12px' }}
                            />
                            <Bar
                                dataKey="before"
                                name={section.legend?.[0] || 'Before'}
                                fill={COLORS.accentLight}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={52}
                            />
                            <Bar
                                dataKey="after"
                                name={section.legend?.[1] || 'After'}
                                fill={COLORS.accent}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={52}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {(section.title || section.content) && (
                <div className="space-y-1.5">
                    {section.title && (
                        <h4 className="font-serif font-semibold text-lg text-ink">{section.title}</h4>
                    )}
                    {section.content && (
                        <p className="text-[15px] text-muted leading-relaxed">{section.content}</p>
                    )}
                </div>
            )}
            {renderChart()}
            {section.yLabel && (
                <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted text-center">
                    {section.yLabel}
                </div>
            )}
        </div>
    );
}
