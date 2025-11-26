import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, RefreshCw, Layers, Shield, Zap, Crown, PlayCircle } from 'lucide-react';
import InputSection from './components/InputSection';
import PlanCard from './components/PlanCard';
import ComparisonChart from './components/ComparisonChart';
import ComparisonTable from './components/ComparisonTable';
import { INITIAL_STATE, SCENARIOS } from './constants';
import { calculateAllPlans } from './utils/calculations';
import { CalculatorState, PlanType } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = calculateAllPlans(state);
  // Find the result corresponding to the selected plan
  const selectedResult = results.find(r => r.type === state.selectedPlan) || results[0];

  const handleStateChange = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const loadScenario = (scenario: CalculatorState) => {
    setState(scenario);
  };

  const handleExport = async () => {
    if (resultsRef.current) {
      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: '#112322',
        scale: 2
      });
      const link = document.createElement('a');
      link.download = `nummus-wallet-fee-${state.selectedPlan.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const plans = [
    { id: PlanType.VIRTUAL, label: 'Virtual', icon: Zap },
    { id: PlanType.PRO, label: 'Pro', icon: Shield },
    { id: PlanType.PREMIUM, label: 'Premium', icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-navy-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a2e2c] via-navy-900 to-navy-900 text-white font-sans p-4 md:p-8">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             {/* Logo Representation - Gold Accent */}
             <div className="w-14 h-14 rounded-full border-2 border-brand-accent flex items-center justify-center relative shadow-[0_0_15px_rgba(240,197,86,0.2)]">
               <span className="font-display font-bold text-3xl text-brand-accent tracking-tighter">N</span>
             </div>
             <div>
               <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight leading-none">
                 NUMMUS
               </h1>
               <p className="text-sm md:text-base text-brand-secondary tracking-[0.1em] uppercase font-medium mt-1">Wallet Fee Calculator</p>
             </div>
          </div>
          
          <div className="flex gap-3">
             <button 
               onClick={() => setState(INITIAL_STATE)}
               className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium text-text-muted hover:text-white font-display"
             >
               <RefreshCw className="w-4 h-4" /> Reset
             </button>
             <button 
               onClick={handleExport}
               className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-secondary text-white shadow-lg shadow-brand-primary/20 transition-all text-sm font-semibold font-display"
             >
               <Download className="w-4 h-4" /> Export Report
             </button>
          </div>
        </header>

        {/* Quick Scenarios */}
        <div className="space-y-3">
           <div className="flex items-center gap-2 text-text-muted">
             <PlayCircle className="w-4 h-4 text-brand-accent" />
             <span className="text-xs md:text-sm font-semibold uppercase tracking-wider font-display text-brand-secondary">Quick Examples:</span>
           </div>
           <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
             {Object.entries(SCENARIOS).map(([key, scenario]) => (
               <button
                 key={key}
                 onClick={() => loadScenario(scenario)}
                 className="whitespace-nowrap px-4 py-2 rounded-lg bg-navy-800 border border-white/5 hover:border-brand-primary/50 text-xs font-medium text-text-muted hover:text-white transition-all group shadow-sm hover:shadow-md hover:shadow-brand-primary/10 font-display"
               >
                 <span className="text-brand-primary font-bold opacity-80 group-hover:opacity-100 mr-1.5">Load</span> {key.replace(/_/g, ' ')}
               </button>
             ))}
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6" ref={resultsRef}>
          
          {/* 1. Plan Selector Tabs */}
          <div className="bg-navy-800 p-1.5 rounded-xl border border-white/5 flex flex-col sm:flex-row gap-1 shadow-xl">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = state.selectedPlan === plan.id;
              
              // Dynamic active style based on plan type for brand alignment
              // Premium = Gold, Pro = Turquoise (Primary), Virtual = Silver (Secondary)
              let activeClass = '';
              let iconColor = '';
              
              if (plan.id === PlanType.PREMIUM) {
                activeClass = 'bg-brand-accent text-navy-900 shadow-brand-accent/20';
                iconColor = isSelected ? 'text-navy-900' : 'text-brand-accent';
              } else if (plan.id === PlanType.PRO) {
                activeClass = 'bg-brand-primary text-white shadow-brand-primary/20';
                iconColor = isSelected ? 'text-white' : 'text-brand-primary';
              } else {
                activeClass = 'bg-brand-secondary text-white shadow-brand-secondary/20';
                iconColor = isSelected ? 'text-white' : 'text-brand-secondary';
              }

              return (
                <button
                  key={plan.id}
                  onClick={() => handleStateChange({ selectedPlan: plan.id })}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg transition-all duration-300 ${
                    isSelected
                      ? `${activeClass} shadow-lg font-bold`
                      : 'text-text-muted hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                  <span className="font-display tracking-wide">{plan.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Inputs */}
            <div className="lg:col-span-5 space-y-8">
              <InputSection state={state} onChange={handleStateChange} />
              
              {/* Mini Comparison Chart embedded below inputs for context */}
               <div className="hidden lg:block">
                 <ComparisonChart results={results} />
               </div>
            </div>

            {/* Right Column: Selected Plan Details */}
            <div className="lg:col-span-7 space-y-6">
               <PlanCard result={selectedResult} />
               
               {/* Mobile Chart Visibility */}
               <div className="lg:hidden">
                 <ComparisonChart results={results} />
               </div>
            </div>
          </div>

          {/* Bottom Full Comparison Table */}
          <div className="mt-4">
            <ComparisonTable results={results} />
          </div>

        </div>

        {/* Footer info */}
        <footer className="text-center text-text-muted text-xs pt-12 pb-6 border-t border-white/5">
          <p>Fees are estimates based on user input. Interest calculated on average approximate balance. Terms and conditions apply.</p>
          <p className="mt-2 font-display">NUMMUS © {new Date().getFullYear()}</p>
        </footer>

      </div>
    </div>
  );
};

export default App;