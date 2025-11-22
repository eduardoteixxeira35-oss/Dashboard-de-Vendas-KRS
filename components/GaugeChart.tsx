import React from 'react';
import { FinancialPremises, SliceColor } from '../types';

interface GaugeChartProps {
  premises: FinancialPremises;
  currentRevenue: number;
  logoUrl: string | null;
}

const RADIAN = Math.PI / 180;

const GaugeChart: React.FC<GaugeChartProps> = ({ premises, currentRevenue, logoUrl }) => {
  const {
    fixedCostPct,
    variableCostPct,
    proLaborePct,
    monthlyRevenueGoal,
  } = premises;

  // Calculate logic
  const totalGaugeMaxPct = 125; // The gauge goes up to 125% of the goal
  const totalGaugeValue = (monthlyRevenueGoal * totalGaugeMaxPct) / 100;

  const fixedCostValue = (monthlyRevenueGoal * fixedCostPct) / 100;
  const variableCostValue = (monthlyRevenueGoal * variableCostPct) / 100;
  const proLaboreValue = (monthlyRevenueGoal * proLaborePct) / 100;
  
  const breakEvenValue = fixedCostValue + variableCostValue + proLaboreValue;
  const goalValue = monthlyRevenueGoal;
  
  // Slices data calculation
  const fixedAngle = (fixedCostValue / totalGaugeValue) * 180;
  const varAngle = (variableCostValue / totalGaugeValue) * 180;
  const proLaboreAngle = (proLaboreValue / totalGaugeValue) * 180;
  
  // Coordinate calculation context matching viewBox 0 0 600 350
  const cx = 300;
  const cy = 260; // Center Y positioned to allow space for the semi-circle
  const iR = 120; // Inner Radius
  const oR = 220; // Outer Radius

  // Helper to create arc path
  const createArc = (start: number, end: number, inner: number, outer: number) => {
    const startRad = start * RADIAN;
    const endRad = end * RADIAN;
    
    const x1 = cx + outer * Math.cos(-startRad);
    const y1 = cy + outer * Math.sin(-startRad);
    const x2 = cx + outer * Math.cos(-endRad);
    const y2 = cy + outer * Math.sin(-endRad);
    
    const x3 = cx + inner * Math.cos(-endRad);
    const y3 = cy + inner * Math.sin(-endRad);
    const x4 = cx + inner * Math.cos(-startRad);
    const y4 = cy + inner * Math.sin(-startRad);

    const largeArc = start - end > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outer} ${outer} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };
  
  // Paths
  const path1 = createArc(180, 180 - fixedAngle, iR, oR);
  const path2 = createArc(180 - fixedAngle, 180 - fixedAngle - varAngle, iR, oR);
  const path3 = createArc(180 - fixedAngle - varAngle, 180 - fixedAngle - varAngle - proLaboreAngle, iR, oR);
  const path4 = createArc(180 - fixedAngle - varAngle - proLaboreAngle, 0, iR, oR);

  // Label positions
  const getSliceLabelPos = (start: number, end: number) => {
      const mid = (start + end) / 2;
      const rad = mid * RADIAN;
      const x = cx + ((iR + oR) / 2) * Math.cos(-rad);
      const y = cy + ((iR + oR) / 2) * Math.sin(-rad);
      return { x, y };
  }

  const label1 = getSliceLabelPos(180, 180 - fixedAngle);
  const label2 = getSliceLabelPos(180 - fixedAngle, 180 - fixedAngle - varAngle);
  const label3 = getSliceLabelPos(180 - fixedAngle - varAngle, 180 - fixedAngle - varAngle - proLaboreAngle);
  const label4 = getSliceLabelPos(180 - fixedAngle - varAngle - proLaboreAngle, 0);


  // Needle Logic
  const clampedRevenue = Math.min(currentRevenue, totalGaugeValue);
  const needlePercentage = clampedRevenue / totalGaugeValue;
  // Angle: 0% = 180deg (Left), 100% = 0deg (Right)
  const needleAngle = 180 - (needlePercentage * 180);
  
  // Needle dimensions - customized as requested
  const needleLength = iR + 20; // Slightly overlapping the color, shorter than outer radius
  const needleBaseRadius = 15; // Wider base

  const needleTipX = cx + needleLength * Math.cos(-needleAngle * RADIAN);
  const needleTipY = cy + needleLength * Math.sin(-needleAngle * RADIAN);

  // Markers (Break Even & Goal)
  const bePct = breakEvenValue / totalGaugeValue;
  const beAngle = 180 - (bePct * 180);
  
  const goalPct = goalValue / totalGaugeValue;
  const goalAngle = 180 - (goalPct * 180);

  return (
    <div className="w-full h-[400px] relative flex flex-col items-center justify-center">
       {/* 1. Logo Layer - Placed first in DOM to ensure it is behind the needle, but we use z-index to manage layering properly.
           Positioned via CSS to match SVG cy=260 (approx 74.3% of 350 viewbox height).
       */}
       {logoUrl ? (
        <div className="absolute top-[74.3%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center z-0 pointer-events-none">
            <img src={logoUrl} alt="Logo Empresa" className="max-w-full max-h-full object-contain opacity-90" />
        </div>
      ) : (
        <div className="absolute top-[74.3%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-0 pointer-events-none">
           <span className="text-gray-300 text-[10px] uppercase tracking-widest">Logotipo</span>
        </div>
      )}

      {/* 2. SVG Chart Layer (Slices) */}
      <div className="absolute inset-0 z-0">
        <svg width="100%" height="100%" viewBox="0 0 600 350" preserveAspectRatio="xMidYMid meet">
             <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="black" floodOpacity="0.2"/>
                </filter>
             </defs>

            <path d={path1} fill={SliceColor.ESSENCIAL} stroke="white" strokeWidth="2" filter="url(#shadow)" />
            <path d={path2} fill={SliceColor.NECESSARIO} stroke="white" strokeWidth="2" filter="url(#shadow)" />
            <path d={path3} fill={SliceColor.BOM} stroke="white" strokeWidth="2" filter="url(#shadow)" />
            <path d={path4} fill={SliceColor.OTIMO} stroke="white" strokeWidth="2" filter="url(#shadow)" />

            <text x={label1.x} y={label1.y} textAnchor="middle" dominantBaseline="middle" className="fill-white font-bold text-xs drop-shadow-md">ESSENCIAL</text>
            <text x={label2.x} y={label2.y} textAnchor="middle" dominantBaseline="middle" className="fill-white font-bold text-xs drop-shadow-md">NECESSÁRIO</text>
            <text x={label3.x} y={label3.y} textAnchor="middle" dominantBaseline="middle" className="fill-white font-bold text-xs drop-shadow-md">BOM</text>
            <text x={label4.x} y={label4.y} textAnchor="middle" dominantBaseline="middle" className="fill-white font-bold text-xs drop-shadow-md">ÓTIMO</text>
        </svg>
      </div>

      {/* 3. Needle & Markers Layer - Top Z-Index */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <svg width="100%" height="100%" viewBox="0 0 600 350" preserveAspectRatio="xMidYMid meet">
          {/* Break Even Marker */}
           <line
            x1={cx + (oR) * Math.cos(-beAngle * RADIAN)}
            y1={cy + (oR) * Math.sin(-beAngle * RADIAN)}
            x2={cx + (oR + 15) * Math.cos(-beAngle * RADIAN)}
            y2={cy + (oR + 15) * Math.sin(-beAngle * RADIAN)}
            stroke="#333"
            strokeWidth="2"
          />
          <text
            x={cx + (oR + 25) * Math.cos(-beAngle * RADIAN)}
            y={cy + (oR + 25) * Math.sin(-beAngle * RADIAN)}
            textAnchor={beAngle > 90 ? "end" : "start"}
            dominantBaseline="middle"
            className="text-[12px] fill-gray-700 font-bold uppercase"
          >
            Ponto de Equilíbrio
          </text>

          {/* Goal Marker */}
          <line
            x1={cx + (oR) * Math.cos(-goalAngle * RADIAN)}
            y1={cy + (oR) * Math.sin(-goalAngle * RADIAN)}
            x2={cx + (oR + 15) * Math.cos(-goalAngle * RADIAN)}
            y2={cy + (oR + 15) * Math.sin(-goalAngle * RADIAN)}
            stroke="#22c55e"
            strokeWidth="3"
          />
          <text
            x={cx + (oR + 25) * Math.cos(-goalAngle * RADIAN)}
            y={cy + (oR + 25) * Math.sin(-goalAngle * RADIAN)}
            textAnchor={goalAngle > 90 ? "end" : "start"}
            dominantBaseline="middle"
            className="text-[12px] fill-green-700 font-black uppercase"
          >
            Meta
          </text>

          {/* Needle - with 50% opacity as requested */}
          <g className="opacity-50">
            <circle cx={cx} cy={cy} r={needleBaseRadius} fill="#1e293b" />
            <path
                d={`
                    M ${cx + needleBaseRadius * Math.cos((-needleAngle + 90) * RADIAN)} ${cy + needleBaseRadius * Math.sin((-needleAngle + 90) * RADIAN)}
                    L ${needleTipX} ${needleTipY}
                    L ${cx + needleBaseRadius * Math.cos((-needleAngle - 90) * RADIAN)} ${cy + needleBaseRadius * Math.sin((-needleAngle - 90) * RADIAN)}
                    Z
                `}
                fill="#1e293b"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default GaugeChart;