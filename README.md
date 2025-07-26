# 📐 Structured Product Builder

A visual, browser-based web application for creating and simulating structured financial products using modular, drag-and-drop bricks. Build complex instruments like Autocalls, Snowballs, Reverse Convertibles, Accumulators, and more with an intuitive visual interface.

![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)

## ✨ Features

### 🧱 **Comprehensive Brick System**
- **25+ Brick Types** across 5 categories:
  - **Asset Bricks**: UnderlyingAsset, Bond
  - **Option Bricks**: Vanilla, Digital, Barrier, Lookback, Range Options
  - **Logic Bricks**: Triggers, Memory, Trackers, Observations
  - **Flow Bricks**: Coupons, Schedules, Payouts, Handlers
  - **Math Bricks**: Sum, Multiplier, Compare, Selector, Timer

### 🎨 **Visual Builder**
- **Drag-and-drop interface** with react-flow
- **Real-time property editing** with dynamic forms
- **Visual connections** between bricks
- **Collapsible panels** for optimal workspace

### 📊 **Advanced Simulation**
- **Multiple market scenarios**: Bull, Bear, Sideways, Volatile markets
- **Custom scenario builder** with configurable parameters
- **Real-time payoff visualization** with Plotly.js charts
- **Statistical analysis**: Max gain, drawdown, win probability

### 📋 **Product Templates**
Ready-to-use templates for popular structured products:
- **Snowball Note** (Autocall + Memory Coupon)
- **Reverse Convertible** (High Yield + Downside Exposure)
- **Twin Win Note** (Symmetric Payoff)
- **Accumulator** (Range Accrual + Leverage)

### 💾 **Persistence & Sharing**
- **Automatic localStorage** saves your work
- **Import/Export** functionality
- **Template system** for quick product creation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd structured_product_playground

# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎯 How to Use

### 1. **Start with Templates**
- Click the 📋 button in the Brick Palette
- Select a pre-built product template
- Explore how different bricks connect

### 2. **Build Custom Products**
- Drag bricks from the palette to the canvas
- Connect bricks by dragging between input/output handles
- Configure properties in the Inspector Panel

### 3. **Run Simulations**
- Choose or customize market scenarios
- Click "▶️ Run Simulation" 
- Analyze results in the payoff chart

### 4. **Iterate and Refine**
- Modify brick properties
- Test different scenarios
- Save your work automatically

## 🏗 Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **Visualization**: react-flow + Plotly.js
- **Styling**: CSS3 with custom design system
- **Build**: Create React App

### Project Structure
```
src/
├── components/           # React components
│   ├── BrickCanvas/     # Main drag-drop interface
│   ├── InspectorPanel/  # Property editor
│   ├── SimulationPanel/ # Scenario builder
│   └── PayoffChart/     # Visualization
├── bricks/              # Brick definitions & templates
├── simulation/          # Simulation engine
├── store/               # Zustand state management
└── types/               # TypeScript definitions
```

## 🧪 Available Scripts

### Development
```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
```

### Deployment
```bash
npm run build      # Create optimized build
npm install -g serve
serve -s build     # Serve production build
```

## 🎨 Customization

### Adding New Brick Types
1. Define the brick interface in `src/types/bricks.ts`
2. Create a template in `src/bricks/brickTemplates.ts`
3. Add simulation logic in `src/simulation/simulationEngine.ts`

### Creating Product Templates
1. Define the template in `src/bricks/productTemplates.ts`
2. Specify brick configurations and connections
3. Template appears automatically in the palette

## 🐛 Troubleshooting

### Common Issues
- **Build errors**: Ensure all TypeScript dependencies are installed
- **Performance**: Large brick networks may impact rendering
- **Browser compatibility**: Modern browsers required for full functionality

### Getting Help
- Check the [Issues](https://github.com/your-repo/issues) for known problems
- Review `CLAUDE.md` for development guidance
- Consult the blueprint document for architecture details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built following the Structured Product Builder Blueprint
- Inspired by visual programming paradigms
- Designed for financial product innovation

---

**Ready to build your next structured product? Start exploring! 🚀**
